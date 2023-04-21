import { Request, Response, NextFunction } from "express";
import { ObjectDatabase } from "../models/index";

const ROLES = ObjectDatabase.role;
const USER = ObjectDatabase.user;

const checkDuplicateUsernameOrEmail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // User
  USER.findOne({
    username: req.body.username,
  })
    .then((user) => {
      console.log("User--verifySignUp", user);
      if (user) {
        res
          .status(400)
          .send({ message: "Failed! Username is already in use!" });
        return;
      }
    })
    .catch((error) => {
      console.log(error);
      next();
    });

  // Email
  USER.findOne({
    email: req.body.email,
  })
    .then((email) => {
      console.log("email--verifySignUp", email);
      if (email) {
        res.status(400).send({ message: "Failed! Email  is already in use!" });
        return;
      }
    })
    .catch((error) => {
      console.log(error);
      next();
    });
};

const checkRolesExisted = (req: Request, res: Response, next: NextFunction) => {
  const RqRoles = req.body.roles;
  if (RqRoles) {
    for (let i = 0; i < RqRoles.length; i++) {
      if (!ROLES.name.includes(RqRoles[i])) {
        res.status(400).send({
          message: `Failed! Role ${RqRoles[i]} does not exist!`,
        });
        return;
      }
    }
  }
  next();
};

export const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
