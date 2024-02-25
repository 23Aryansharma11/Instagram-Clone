import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { register, login } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
    upload.single("avatar"),  // multer middleware for handling the uploaded file (image)
    register            // controller function to handle user registration request
);
router.route("/login").post(login)

export default router;