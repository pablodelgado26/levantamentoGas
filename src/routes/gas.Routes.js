import express from "express";
import gasController from "../controllers/gasController.js";

const gasRouter = express.Router();

// Rotas de Coleções
// GET /colecoes - Listar todas as Coleções
gasRouter.get("/", gasController.findAll);

// GET /colecoes/:id - Obter uma Coleção pelo ID
gasRouter.get("/:id", gasController.findById);

// POST /colecoes - Criar uma nova Cards
gasRouter.post("/", gasController.create);

// DELETE /colecoes/:id - Remover um Cards
gasRouter.delete("/:id", gasController.delete);

export default gasRouter;
