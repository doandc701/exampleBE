import { NextFunction, Request, Response } from "express";
import { ObjectCategories } from "../models/Categories";
import { multipleMongooseToObject, mongooseToObject } from "../utils/mongoose";

const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = req.query.p || 0;
  const showLimitBooks: number = 3;
  ObjectCategories.find({})
    .then((categories) =>
      res.render("categories/index", {
        categories: multipleMongooseToObject(categories),
      })
    )
    .catch(next);
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  res.render("categories/add");
  //   res.send("post");
};

const postCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categories = new ObjectCategories(req.body);
  categories
    .save()
    .then((categories) => res.redirect("/categories")) //res.redirect("/categories"))
    .catch((e) => console.log(e));
};

// [GET] categories/edit
const getEditCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  ObjectCategories.findById(req.params.id)
    .then(
      (categories) =>
        res.render("categories/edit", {
          categories: mongooseToObject(categories),
        })
      //   res.json(categories)
    )
    .catch(next);
};

const patchCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  ObjectCategories.updateOne({ _id: req.params.id }, req.body)
    .then((categories) => {
      res.redirect("/categories");
      //   res.status(200).json(categories);
    })
    .catch(next);
};

const deleted = async (req: Request, res: Response, next: NextFunction) => {
  ObjectCategories.findByIdAndDelete(req.params.id)
    .then(
      () => res.redirect("/categories")
      //   res.status(200).json("Delete Success")
    )
    .catch(next);
};

export {
  getCategories,
  create,
  postCategories,
  getEditCategories,
  patchCategories,
  deleted,
};
