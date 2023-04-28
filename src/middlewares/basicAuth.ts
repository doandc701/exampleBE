import { Request, Response, NextFunction } from "express";
import { ObjectUsers } from "../models/auth/user.model";

const authPage = (permission: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    // console.log("username", username);
    const result = await ObjectUsers.findOne({ username });
    if (!result) {
      next();
      return;
    }
    // console.log("result", result);
    // console.log(result?.roles.toString());
    if (!permission.includes(result!.roles.toString())) {
      return res.status(401).send({ message: "You dont have permission!" });
    }
    next();
  };
};

export default authPage;
