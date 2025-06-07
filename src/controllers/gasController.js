import gasModel from '../models/gasModel.js';
import { buscarDadosGas } from '../services/gasService.js';
import { gerarPlanilhaExcel } from '../utils/excelGenerator.js';
import { fileURLToPath } from 'url';

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

async findById(req, res) {
  try {
    const { id } = req.params;
    const parsedId = Number(id);

    if (!id || isNaN(parsedId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const gas = await gasModel.findById(parsedId);

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

      if (!gasTipo) {
        return res.status(400).json({ message: 'O tipo de gás é obrigatório' });
      }
      if (!userName) {
        return res.status(400).json({ message: 'O nome do usuário é obrigatório' });
      }

      const novaGas = await gasModel.create(gasPrecisa, gasTipo, userName);
      return res.status(201).json(novaGas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Resetar gasPrecisa para false em todos os registros
  async resetGasPrecisa(req, res) {
    try {
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

  // Gerar planilha com os dados do gás
async gerarPlanilha(req, res) {
  try {
    // Busca dados direto do banco
    const dados_para_planilha = await buscarDadosGas();

    const wb = await gerarPlanilhaExcel(dados_para_planilha);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Levantamento_Gas_${dataAtual}.xlsx`
    );

    await wb.write('levantamento de gás rota 02.xlsx');
    return res.download('levantamento de gás rota 02.xlsx');
  } catch (error) {
    console.error("Erro ao gerar planilha:", error);
    return res.status(500).json({ error: error.message });
  }
}

}

export default new GasController();
