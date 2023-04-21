import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { ObjectDatabase } from "../models";
import { TOKEN_SECRET } from "../config/auth";
const ROLES = ObjectDatabase.role;
const USER = ObjectDatabase.user;

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

const SignIn = (req: Request, res: Response) => {
  USER.findOne({ username: req.body.username })
    .populate("roles", "-__v")
    .then((user) => {
      console.log("user---", user);
      if (!user) {
        return res
          .status(404)
          .send({ message: "Username or Password not correct." });
      }
      if (typeof user.password === "string") {
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }
      }
      const token = jwt.sign({ id: user.id }, TOKEN_SECRET, {
        expiresIn: 86400, // 24 hours
      });
      let authorities = [];

      //   for (let i = 0; i < user.roles.length; i++) {
      //     console.log("user.roles[i]++++", user.roles[i]);
      //     // authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      //     const _idRole = user.roles[i]._id;
      //     ROLES.find({ _id: _idRole }).then((data) => {
      //       console.log("data", data[0].name);
      //       //   authorities.push(data[0].name);
      //       res.status(200).send({
      //         id: user._id,
      //         username: user.username,
      //         email: user.email,
      //         roles: data[0].name,
      //         accessToken: token,
      //       });
      //     });
      //   }
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i]);
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      return;
    });
};

export { SignIn, SignUp };
