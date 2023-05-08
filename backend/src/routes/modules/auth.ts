import express from "express";
import {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
} from "../../controllers/Authorization/UserController";

import { verifyToken, isAdmin, isModerator } from "../../middlewares/authJwt";
import uploads from "../../middlewares/upload";
import authPage from "../../middlewares/basicAuth";

import {
  getIndex,
  viewSignIn,
  viewSignUp,
  logOut,
  SignUp,
  SignIn,
} from "../../controllers/Authentication/AuthController";

import {
  getRoles,
  postRoles,
} from "../../controllers/Authentication/RolesController";
import {
  HomeController,
  TableController,
} from "../../controllers/HomeController";

import { loginAccountLimiter } from "../../services/rateLimit.service";

const router = express.Router();

router.get("/tables", TableController);
router.get("/home", HomeController);

router.post(
  "/signin",
  authPage(["644116f719d977e49dc75c3d", "644116f219d977e49dc75c3b"]),
  SignIn,
  loginAccountLimiter
);
router.post("/signup", uploads.single("avatar"), SignUp);
router.get("/logout", logOut);
router.get("/register", viewSignUp);
router.get("/login", viewSignIn);
router.get("/", getIndex);
// router.post("/signup", uploads.single("avatar[]"), SignUp);

// Authorization:
// GET /api/test/all
// GET /api/test/user
// GET /api/test/mod
// GET /api/test/admin
// router.get("/api/test/all", allAccess);
// router.get("/api/test/user", verifyToken, userBoard);
// router.get("/api/test/mod", [verifyToken, isModerator], moderatorBoard);
// router.get("/api/test/admin", [verifyToken, isAdmin], adminBoard);

// // roles
// // roles
router.get("/role", getRoles);
router.post("/role", postRoles);
export default router;
