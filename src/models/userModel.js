import prisma from '../../prisma/prisma.js';

class UserModel {
    // Obter todos os usuários
    async findAll() {
    try {
      const users = await prisma.user.findMany({
        include: {
          gas: {
            select: {
              gasTipo: true,
              gasPrecisa: true,
            },
          }
        },
      });

      // Serializa BigInt (cellPhone) para string
      const serializedUsers = JSON.parse(JSON.stringify(users, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));

      return serializedUsers;
    } catch (error) {
      console.error('Erro ao buscar todos os usuários:', error.message, error.stack);
      throw error;
    }
  }

    async findById(id) {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });

        return user;
    }

    // Obter um usuário pelo email
    async findByUserName(userName) {
        const user = await prisma.user.findUnique({
            where: {
                userName,
            },
        });

        return user;
    }

    // Criar um novo usuário
    async create(data) {
        const user = await prisma.user.create({
            data,
        });

        return user;
    }


    // Excluir um usuário
    async delete(id) {
        await prisma.user.delete({
            where: {
                id: Number(id)
            }
        });

        return true;
    }
}

export default new UserModel();