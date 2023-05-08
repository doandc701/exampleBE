import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize"; // ngan chan injection
import ip from "ip";
import { client } from "../../services/redis.service";
import { ObjectDatabase } from "../../models/auth";
import { TOKEN_SECRET } from "../../config/auth";
import { getRedis, setRedis } from "../../utils/redis";
import {
  checkLoginAttempts,
  setLoginAttempts,
} from "../../middlewares/loginAccountLimiter";

const ROLES = ObjectDatabase.role;
const USER = ObjectDatabase.user;

const getIndex = (req: any, res: Response) => {
  if (req.session.login) {
    res.redirect("/home");
  } else {
    req.session.back = "/";
    // res.render("home/index");
    res.redirect("/login");
    console.log(req.cookies);
    // res.render("index");
  }
};

const viewSignIn = (req: Request, res: Response) => {
  res.render("users/sign-in", { layout: false });
};
const viewSignUp = (req: Request, res: Response) => {
  res.render("users/sign-up", { layout: false });
};

const SignUp = async (req: Request, res: Response) => {
  const checkUserName = await USER.findOne({ username: req.body.username });
  if (checkUserName)
    return res.status(422).send("Failed! Username is already in use");
  const checkMailExits = await USER.findOne({ email: req.body.email });
  if (checkMailExits)
    return res.status(422).send("Failed! Email  is already in use!");

  const user = new USER({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  // upload 1 ảnh
  if (req.file) {
    // console.log(req.file.filename);
    user.avatar = req.file.filename;
  }

  /* up load nhieu anh
   if (req.files) {
    let path = "";
    req.files.forEach(function (files, index, arr) {
      path = path + files.path + ",";
    });
    path = path.substring(0, path.lastIndexOf(","));
    user.avatar = path;
  }
  */
  user
    .save()
    .then((user) => {
      console.log("user", user);
      const RqRoles = req.body.roles;
      if (RqRoles) {
        ROLES.find({ name: { $in: RqRoles } })
          .then((roles) => {
            console.log("roles", roles);
            user.roles = roles.map((role) => role._id);
            user
              .save()
              .then(() => {
                res.send({ message: "User was registered successfully!" });
              })
              .catch((err) => {
                res.status(500).send({ message: err });
                return;
              });
          })
          .catch((err) => {
            res.status(500).send({ message: err });
            return;
          });
      } else {
        ROLES.findOne({ name: "user" })
          .then((role1) => {
            // Error, role1._id may be null or undefined
            console.log("ObjectId+++++++", role1);
            user.roles = [role1!._id];
            user
              .save()
              .then(() => {
                res.send({ message: "User was registered successfully!" });
              })
              .catch((err) => {
                res.status(500).send({ message: err });
                return;
              });
          })
          .catch((err) => {
            res.status(500).send({ message: err });
            return;
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      return;
    });
};

const SignIn = async (req: any, res: Response) => {
  let checkRedis = await checkLoginAttempts(ip.address());
  // console.log("checkRedis1111111111111111", checkRedis);
  if (checkRedis?.pass) {
    USER.findOne({ username: sanitize(req.body.username) })
      .populate("roles", "-__v")
      .then(async (user: any) => {
        if (!user) {
          return res
            .status(404)
            .send({ message: "Username or Password not correct." });
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          checkRedis = await setLoginAttempts(ip.address());
          // console.log("checkRedis2222222222", checkRedis);
          const remaining = 3 - parseInt(checkRedis.data.count);
          return res.status(404).send({
            message: `${
              remaining
                ? `Bạn còn ${remaining} lần nhập`
                : "Username or Password not correct."
            }`,
          });
        }
        await client.expire(`ll:${ip.address()}`, 0);
        const token = jwt.sign({ id: user.id }, TOKEN_SECRET, {
          expiresIn: 86400, // 24 hours
        });
        let authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });

        // req.session.regenerate(function (err: string) {
        //   if (err) return err;
        //   req.session.name = req.body.username;
        //   req.session.login = true;
        //   if (req.session.back) {
        //     // console.log("session back");
        //     res.redirect(req.session.back);
        //   }
        //   req.session.save(function (err: string) {
        //     if (err) return err;
        //     res.redirect("/home");
        //     console.log(req.session);
        //   });
        // });
        // const session = req.session;
        // session.login = true;
        // session.user =req.body.username;
        // // res.redirect("/admin/index");
        // console.log(session)
        // if (session.back) {
        //   // console.log("session back");
        //   res.redirect(session.back);
        // }
      })
      .catch((err) => {
        res.status(500).send({ message: err });
        return;
      });
  }
  if (!checkRedis?.pass) {
    if (checkRedis?.data) {
      const wait1 = checkRedis.wait;
      // console.log(wait1);
      const remaining = 3 - parseInt(checkRedis.data.count);
      if (remaining <= 0) {
        return res.status(404).send({
          message: `Tài khoản của bạn đã bị khóa, vui lòng thử lại sau ${wait1} giây.`,
        });
      } else {
        return res.status(404).send({
          message: `Bạn còn ${remaining} lần nhập`,
        });
      }
    }
  }
};

const logOut = (req: any, res: Response) => {
  console.log(req.session);
  req.session.destroy();
  res.redirect("/");
};
export { getIndex, viewSignIn, viewSignUp, logOut, SignIn, SignUp };
