import { Request, Response } from "express";

const HomeController = (req: any, res: Response) => {
  // [GET] /tables
  res.render("home/index");
  // res.render("admin/pages/tables", { layout: "admin.hbs" });
};

const TableController = (req: any, res: Response) => {
  // [GET] /tables
  res.render("home/table");
  // res.render("admin/pages/tables", { layout: "admin.hbs" });
};
export { HomeController, TableController };
