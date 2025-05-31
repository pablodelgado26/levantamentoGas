import express from "express";
import cardController from "../controllers/cardController.js";

const cardRouter = express.Router();

// Rotas de Coleções
// GET /colecoes - Listar todas as Coleções
cardRouter.get("/", cardController.getAllCards);

// POST /colecoes - Criar uma nova Cards
cardRouter.post("/", cardController.createCard);

// DELETE /colecoes/:id - Remover um Cards
cardRouter.delete("/:id", cardController.deleteCard);

export default cardRouter;
