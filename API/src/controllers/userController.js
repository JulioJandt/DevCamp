import { pool } from '../config/db.js';

// Remove a senha antes de enviar o usuário nas respostas
const removerSenha = (user) => {
  const { senha, ...resto } = user;
  return resto;
};

// GET: Buscar todos
export const lerUsuarios = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
    res.json(rows.map(removerSenha));
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};

// GET: Buscar por ID
export const lerUsuarioPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(removerSenha(rows[0]));
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

// POST: Criar
export const addUsuario = async (req, res) => {
  try {
    const { nome, nick, email, senha } = req.body;

    if (!nome || !nick || !email || !senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    // validação de e-mail único
    const emailJaExiste = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (emailJaExiste.rows.length > 0) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado no sistema!' });
    }

    const { rows } = await pool.query(
      'INSERT INTO users (nome, nick, email, senha) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, nick, email, senha]
    );

    res.status(201).json(removerSenha(rows[0]));
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

// PUT: Atualizar
export const attUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, nick, email, senha, tipo } = req.body;

    const atual = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (atual.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const usuarioAtual = atual.rows[0];

    // mantem os dados antigos caso não sejam fornecidos novos valores
    const { rows } = await pool.query(
      'UPDATE users SET nome = $1, nick = $2, email = $3, senha = $4, tipo = $5 WHERE id = $6 RETURNING *',
      [
        nome || usuarioAtual.nome,
        nick || usuarioAtual.nick,
        email || usuarioAtual.email,
        senha || usuarioAtual.senha,
        tipo || usuarioAtual.tipo,
        id
      ]
    );

    res.json(removerSenha(rows[0]));
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

// DELETE: Deletar
export const delUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(204).send();
  } catch (erro) {
    if (erro.code === '23503') {
      return res.status(400).json({ message: 'Não é possível remover: usuário vinculado a um time (capitão ou jogador)' });
    }
    res.status(500).json({ message: 'Erro ao remover usuário' });
  }
};
