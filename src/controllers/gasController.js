import gasModel from '../models/gasModel.js';

class GasController {
  // Listar todos os registros de gás
  async findAll(req, res) {
    try {
      const gases = await gasModel.findAll();
      return res.status(200).json(gases);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Obter um registro de gás pelo ID
  async findById(req, res) {
    try {
      const { id } = req.params;
      
      const gas = await gasModel.findById(id);
      
      if (!gas) {
        return res.status(404).json({ message: 'Registro de gás não encontrado' });
      }
      
      return res.status(200).json(gas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Criar um novo registro de gás
  async create(req, res) {
    try {
      const { gasTipo, gasPrecisa = false, userName } = req.body;

      // Validação básica
      if (!gasTipo) {
        return res.status(400).json({ message: 'O tipo de gás é obrigatório' });
      }
      if (!userName) {
        return res.status(400).json({ message: 'O nome do usuário é obrigatório' });
      }

      // Permite criar com gasPrecisa true ou false e userName
      const novaGas = await gasModel.create(gasPrecisa, gasTipo, userName);

      return res.status(201).json(novaGas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Resetar gasPrecisa para false em todos os registros (só após expiração do token)
  async resetGasPrecisa(req, res) {
    try {
      // Supondo que req.tokenExpired seja definido por algum middleware de autenticação
      if (!req.tokenExpired) {
        return res.status(403).json({ message: 'Reset só permitido após expiração do token' });
      }

      await gasModel.resetGasPrecisa();
      
      return res.status(200).json({ 
        message: 'Status de gasPrecisa resetado para todos os registros' 
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Remover um registro de gás
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const result = await gasModel.delete(id);
      
      if (!result) {
        return res.status(404).json({ message: 'Registro de gás não encontrado' });
      }
      
      return res.status(200).json({ message: 'Registro de gás excluído com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new GasController();