import { Router } from "express";
import { login, signup, verifyUser } from "../controllers/auth.js";
import { verifyLogin } from "../controllers/utils.js";

const authRouter = Router();

authRouter.post('/login', login)
authRouter.post('/signup', signup)
authRouter.get('/', verifyLogin, verifyUser)

export default authRouter;