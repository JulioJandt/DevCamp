import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { JWT_SEGREDO } from '../config/jwt.js';

// POST: Login
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
    }

    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND senha = $2',
      [email, senha]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email },
      JWT_SEGREDO,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login realizado com sucesso!', token });
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao realizar login' });
  }
};
