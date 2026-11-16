import { pool } from '../config/db.js';

const SELECT_TIME = 'SELECT id, nome, capitao_id AS "capitaoId", pontos FROM teams';

const buscarJogadores = async (teamId) => {
  const { rows } = await pool.query(
    'SELECT jogador_id FROM team_players WHERE team_id = $1 ORDER BY jogador_id',
    [teamId]
  );
  return rows.map(r => r.jogador_id);
};

const montarTime = async (team) => ({
  ...team,
  jogadores: await buscarJogadores(team.id)
});

// GET: Listar times (ranking por pontos)
export const lerTimes = async (req, res) => {
  try {
    const { rows } = await pool.query(`${SELECT_TIME} ORDER BY pontos DESC`);
    const times = await Promise.all(rows.map(montarTime));
    res.json(times);
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao buscar times' });
  }
};

// GET: Buscar time por ID
export const lerTimePorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rows } = await pool.query(`${SELECT_TIME} WHERE id = $1`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Time não encontrado' });
    }
    res.json(await montarTime(rows[0]));
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao buscar time' });
  }
};

// POST: Fundar time
export const addTime = async (req, res) => {
  try {
    const { nome, capitaoId } = req.body;

    if (!nome || !capitaoId) {
      return res.status(400).json({ message: 'Nome do time e ID do capitão são obrigatórios!' });
    }

    const nomeJaExiste = await pool.query('SELECT id FROM teams WHERE nome = $1', [nome]);

    if (nomeJaExiste.rows.length > 0) {
      return res.status(400).json({ message: 'Já existe um time cadastrado com este nome!' });
    }

    const { rows } = await pool.query(
      `INSERT INTO teams (nome, capitao_id, pontos) VALUES ($1, $2, 0)
       RETURNING id, nome, capitao_id AS "capitaoId", pontos`,
      [nome, capitaoId]
    );

    res.status(201).json(await montarTime(rows[0]));
  } catch (erro) {
    if (erro.code === '23503') {
      return res.status(400).json({ message: 'ID do capitão não corresponde a um usuário existente' });
    }
    res.status(500).json({ message: 'Erro ao fundar time' });
  }
};

// PUT: Atualizar time (nome/capitão)
export const attTime = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, capitaoId } = req.body;

    const atual = await pool.query(`${SELECT_TIME} WHERE id = $1`, [id]);

    if (atual.rows.length === 0) {
      return res.status(404).json({ message: 'Time não encontrado' });
    }

    const timeAtual = atual.rows[0];

    const { rows } = await pool.query(
      `UPDATE teams SET nome = $1, capitao_id = $2 WHERE id = $3
       RETURNING id, nome, capitao_id AS "capitaoId", pontos`,
      [nome || timeAtual.nome, capitaoId || timeAtual.capitaoId, id]
    );

    res.json(await montarTime(rows[0]));
  } catch (erro) {
    if (erro.code === '23503') {
      return res.status(400).json({ message: 'ID do capitão não corresponde a um usuário existente' });
    }
    res.status(500).json({ message: 'Erro ao atualizar time' });
  }
};

// DELETE: Desfazer time
export const delTime = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rowCount } = await pool.query('DELETE FROM teams WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Time não encontrado' });
    }
    res.status(204).send();
  } catch (erro) {
    if (erro.code === '23503') {
      return res.status(400).json({ message: 'Não é possível remover: este time está vinculado a partidas ou torneios existentes' });
    }
    res.status(500).json({ message: 'Erro ao remover time' });
  }
};

// POST: Adicionar jogador na line-up
export const addJogador = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { jogadorId } = req.body;

    const time = await pool.query('SELECT id FROM teams WHERE id = $1', [id]);
    if (time.rows.length === 0) {
      return res.status(404).json({ message: 'Time não encontrado' });
    }

    if (!jogadorId) {
      return res.status(400).json({ message: 'ID do jogador é obrigatório!' });
    }

    const jaNaLineup = await pool.query(
      'SELECT 1 FROM team_players WHERE team_id = $1 AND jogador_id = $2',
      [id, jogadorId]
    );
    if (jaNaLineup.rows.length > 0) {
      return res.status(400).json({ message: 'Jogador já está na line-up deste time!' });
    }

    await pool.query('INSERT INTO team_players (team_id, jogador_id) VALUES ($1, $2)', [id, jogadorId]);

    const { rows } = await pool.query(`${SELECT_TIME} WHERE id = $1`, [id]);
    res.status(201).json(await montarTime(rows[0]));
  } catch (erro) {
    if (erro.code === '23503') {
      return res.status(400).json({ message: 'ID do jogador não corresponde a um usuário existente' });
    }
    res.status(500).json({ message: 'Erro ao adicionar jogador' });
  }
};

// DELETE: Remover jogador da line-up
export const removeJogador = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const jogadorId = parseInt(req.params.jogadorId);

    const time = await pool.query('SELECT id FROM teams WHERE id = $1', [id]);
    if (time.rows.length === 0) {
      return res.status(404).json({ message: 'Time não encontrado' });
    }

    const { rowCount } = await pool.query(
      'DELETE FROM team_players WHERE team_id = $1 AND jogador_id = $2',
      [id, jogadorId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Jogador não está na line-up deste time' });
    }

    const { rows } = await pool.query(`${SELECT_TIME} WHERE id = $1`, [id]);
    res.json(await montarTime(rows[0]));
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao remover jogador' });
  }
};

// Atualizar pontos após partida
export const atualizarPontos = async (timeId, pontosGanhos) => {
  await pool.query('UPDATE teams SET pontos = pontos + $1 WHERE id = $2', [pontosGanhos, timeId]);
};
