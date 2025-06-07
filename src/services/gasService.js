import prisma from '../../prisma/prisma.js';

export async function buscarDadosGas() {
  return await prisma.gas.findMany({
    include: {
      user: true
    }
  });
}
