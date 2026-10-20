import { pool } from '../config/db.js';

// GET: Listar todos os jogos disponíveis na plataforma
export const lerJogos = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM games ORDER BY id');
    res.json(rows);
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao buscar jogos' });
  }
};

// GET: Buscar jogo por ID
export const lerJogoPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rows } = await pool.query('SELECT * FROM games WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Jogo não encontrado no catálogo' });
    }
    res.json(rows[0]);
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao buscar jogo' });
  }
};

// POST: Adicionar um novo jogo ao catálogo (Uso exclusivo de administradores)
export const addJogo = async (req, res) => {
  try {
    const { nome, genero, publicadora } = req.body;

    if (!nome) {
      return res.status(400).json({ message: 'O nome do jogo é obrigatório!' });
    }

    const { rows } = await pool.query(
      'INSERT INTO games (nome, genero, publicadora) VALUES ($1, $2, $3) RETURNING *',
      [nome, genero || 'Não especificado', publicadora || 'Não especificada']
    );

    res.status(201).json(rows[0]);
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao adicionar jogo' });
  }
};

// DELETE: Remover jogo do catálogo
export const delJogo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rowCount } = await pool.query('DELETE FROM games WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }
    res.status(204).send();
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao remover jogo' });
  }
};
