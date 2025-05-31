import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthController {

    // Listar todos os usuários
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.findAll();
            res.json(users);
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            res.status(500).json({ error: "Erro ao listar usuários" });
        }
    }

    //Registrar um novo usuário
    async register(req, res) {
        try {
            const { userName, password } = req.body;

            // Validação básica
            if ( !userName || !password) {
                return res.status(400).json({ error: "Nome da escola ou senha são obrigatórios" });
            }

            //Verificar se o usuário ja existe 
            const userExists = await UserModel.findByUserName(userName)

            if (userExists) {
                return res.status(400).json({ error: "Escreveu o nome da escola errada, tente novamente" })
            }

            //hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);

            //Criar o objeto do usuário
            const data = {
                userName,
                password: hashedPassword,
            };

            //Criar usuário 
            const user = await UserModel.create(data);

            return res.status(201).json({
                message: "Usuário criado com sucesso!",
                user,
            });
        } catch (error) {
            console.error("Erro ao criar novo usuario: ", error)
            res.status(500).json({ error: "Erro ao criar novo usuário" })
        }
    }

    async login(req, res) {
        try {
            const { userName, password } = req.body

            // Validação básica
            if (!userName || !password) {
                return res.status(400).json({ error: "Os campos nome da escola e senha são obrigatórios" });
            }

            //Verificar se o usuário existe 
            const userExists = await UserModel.findByUserName(userName)
            if (!userExists) {
                return res.status(401).json({ error: "Credenciais inválidas!" })
            }

            //Verificar senha 
            const isPasswordValid = await bcrypt.compare(password, userExists.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Credenciais inválidas!" })
            }

            //Gerar Token JWT
            const token = jwt.sign(
                {
                    id: userExists.id,
                    userName: userExists.userName,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                }
            );

            return res.json({
                message: "Login realizado com sucesso!",
                token,
                userExists,
            });
        } catch (error) {
            console.error("Erro ao fazer login: ", error)
            res.status(500).json({message: "Erro ao fazer login!"})
        }
    }

}

export default new AuthController();