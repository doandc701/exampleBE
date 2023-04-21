import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../index";
import { verifyToken, isAdmin, isModerator } from "../middlewares/authJwt";
import {
  getTransactions,
  postTransaction,
  patchTransactions,
  deleteTransaction,
} from "../controllers/TransactionsHandle";
import { SignUp, SignIn } from "../controllers/AuthController";
import { getUsers, postUsers } from "../controllers/UserController";
import { getRoles, postRoles } from "../controllers/RolesController";

import {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
} from "../controllers/Authorization/UserController";

export const routes = (app: any) => {
  // routes
  app.get("/", (req: Request, res: Response) => {
    res.json("Wellcome to api");
  });

  // transaction;
  app.get("/transaction", getTransactions);
  app.post("/transaction", postTransaction);
  app.patch("/transaction/:id", patchTransactions);
  app.delete("/transaction/:id", deleteTransaction);

  //
  app.get("/auth", getUsers);
  // app.post("/auth/signup", postUsers);
  app.post("/auth/signup", SignUp);
  app.post("/auth/signin", SignIn);

  // roles
  app.get("/role", getRoles);
  app.post("/role", postRoles);

  // Authorization:
  // GET /api/test/all
  // GET /api/test/user
  // GET /api/test/mod
  // GET /api/test/admin
  app.get("/auth/api/test/all", allAccess);
  app.get("/auth/api/test/user", verifyToken, userBoard);
  app.get("/auth/api/test/mod", [verifyToken, isModerator], moderatorBoard);
  app.get("/auth/api/test/admin", [verifyToken, isAdmin], adminBoard);
};
