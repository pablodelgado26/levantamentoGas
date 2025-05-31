import express from "express"

// Importar todas as rotas
import authRouter from "./auth.routes.js"
import cardRouter from "./gas.Routes.js"

import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

//Rotas públicas
router.use("/auth", authRouter);

//Rotas protegidas
router.use(authMiddleware)
router.use("/gas", cardRouter);


export default router