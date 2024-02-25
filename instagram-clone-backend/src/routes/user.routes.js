import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { register, login, logout, refreshAccessToken } from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.single("avatar"),  // multer middleware for handling the uploaded file (image)
    register            // controller function to handle user registration request
);
router.route("/login").post(login);
router.route( "/logout" ).post(verifyJwt, logout);
router.route("/refresh").post(refreshAccessToken);

export default router;