import jwt from 'jsonwebtoken';
import { JWT_SEGREDO } from '../config/jwt.js';

// Valida o token JWT enviado no header Authorization: Bearer <token>
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ message: 'Token malformado' });
  }

  jwt.verify(token, JWT_SEGREDO, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }

    req.usuario = decoded;
    next();
  });
};
