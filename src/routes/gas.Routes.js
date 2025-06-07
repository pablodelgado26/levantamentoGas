import express from "express";
import gasController from "../controllers/gasController.js";

const gasRouter = express.Router();
gasRouter.get("/planilha", gasController.gerarPlanilha);

// Rotas de Gas
// GET /gas - Listar todos os registros de gás
gasRouter.get("/", gasController.findAll);


// GET /gas/:id - Obter um registro de gás pelo ID
gasRouter.get("/:id", gasController.findById);

// POST /gas - Criar um novo registro de gás
gasRouter.post("/", gasController.create);

// PUT /gas/reset - Resetar gasPrecisa para false em todos os registros
gasRouter.put("/reset", gasController.resetGasPrecisa);

// DELETE /gas/:id - Remover um registro de gás
gasRouter.delete("/:id", gasController.delete);

// ✅ GET /gas/planilha - Gerar e baixar planilha de levantamento de gás

export default gasRouter;
