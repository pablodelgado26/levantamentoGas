import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Token não fornecido!",
        });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
        return res.status(401).json({ error: "Token mal formatado" });
    }

    const [schema, token] = parts;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                // 🔥 Token expirado, seta um indicador para as rotas
                req.tokenExpired = true;
                return next();
            }
            return res.status(401).json({ error: "Token inválido!" });
        }

        req.userId = decoded.id;
        req.tokenExpired = false;
        return next();
    });
};

export default authMiddleware;
