import { NextFunction, Request, Response } from "express";
import authRouter from "./modules/auth";
import categoriesRouter from "./modules/categories";
import { HomeController } from "../controllers/HomeController";

export const routes = (app: any) => {
  // routes
  // app.get("/", (req: Request, res: Response) => {
  //   res.json("Wellcome to api");
  // });
  // app.use("/home", HomeController);
  // app.get("/", HomeController);
  // app.use("/auth", authRouter);
  app.use("/categories", categoriesRouter);

  app.use("/", authRouter);
};
