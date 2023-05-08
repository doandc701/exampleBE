import express from "express";
import {
  getCategories,
  create,
  postCategories,
  getEditCategories,
  patchCategories,
  deleted,
} from "../../controllers/CategoriesController";

const router = express.Router();

router.route("/create").get(create);
router.route("/").get(getCategories);
router.route("/:id/edit").get(getEditCategories);
router.route("/store").post(postCategories);
router.route("/:id").put(patchCategories);
router.route("/:id").delete(deleted);

export default router;
