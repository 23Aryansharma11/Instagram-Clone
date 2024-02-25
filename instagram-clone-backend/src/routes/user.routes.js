import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
    upload.single("avatar"),  // multer middleware for handling the uploaded file (image)
    registerUser            // controller function to handle user registration request
);


export default router;