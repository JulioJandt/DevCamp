import jwt from 'jsonwebtoken';
import { users } from './userController.js';
import { JWT_SEGREDO } from '../config/jwt.js';

// POST: Login
export const login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
  }

  const user = users.find(u => u.email === email && u.senha === senha);

  if (!user) {
    return res.status(401).json({ message: 'Email ou senha inválidos' });
  }

  const token = jwt.sign(
    { id: user.id, nome: user.nome, email: user.email },
    JWT_SEGREDO,
    { expiresIn: '2h' }
  );

  res.json({ message: 'Login realizado com sucesso!', token });
};
