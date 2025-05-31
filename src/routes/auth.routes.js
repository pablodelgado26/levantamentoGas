import express from 'express';
import AuthController from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.get("/", AuthController.getAllUsers);
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login)
authRouter.delete("/:id", AuthController.deleteUser);

export default authRouter;