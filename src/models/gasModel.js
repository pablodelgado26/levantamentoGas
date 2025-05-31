import prisma from "../../prisma/prisma.js";

class GasModel {
  // Obter todas as gas
  async findAll() {
    const gas = await prisma.gas.findMany({
    });
    return gas;
  }

    // Obter uma gas pelo ID
  async findById(id) {
    const gas = await prisma.gas.findUnique({
      where: {
        id: Number(id),
      },
    });

    return gas;
  }

  // Criar uma nova gas
async create(gasPrecisa, gasTipo, userName) {
  // Busca o usuário pelo userName
  const user = await prisma.user.findUnique({
    where: { userName },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Cria o registro de Gas associado ao userId encontrado
  const novaGas = await prisma.gas.create({
    data: {
      gasPrecisa,
      gasTipo,
      user: {
        connect: { id: user.id } // Faz a conexão pela relação
      }
    },
  });

  return novaGas;
}
  // Método para resetar gasPrecisa para false em todos os registros (ex: quando o token acabar)
  async resetGasPrecisa() {
    await prisma.gas.updateMany({
      data: {
        gasPrecisa: false,
      },
    });
  }


  // Remover uma gas
  async delete(id) {
    const gas = await this.findById(id);

    if (!gas) {
      return null;
    }

    await prisma.gas.delete({
      where: {
        id: Number(id),
      },
    });

    return true;
  }
}

export default new GasModel();