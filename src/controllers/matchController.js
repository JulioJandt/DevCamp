import { pool } from '../config/db.js';
import { atualizarPontos } from './teamController.js';

const SELECT_PARTIDA = `SELECT id, torneio_id AS "torneioId", time1_id AS "time1Id", time2_id AS "time2Id",
  placar_time1 AS "placarTime1", placar_time2 AS "placarTime2", status FROM matches`;

// GET: Listar partidas (chaves de jogos)
// Suporta filtro opcional por torneio: /matches?torneioId=1
export const lerPartidas = async (req, res) => {
  try {
    const { torneioId } = req.query;

    if (torneioId) {
      const { rows } = await pool.query(`${SELECT_PARTIDA} WHERE torneio_id = $1 ORDER BY id`, [parseInt(torneioId)]);
      return res.json(rows);
    }

    const { rows } = await pool.query(`${SELECT_PARTIDA} ORDER BY id`);
    res.json(rows);
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao buscar partidas' });
  }
};

// GET: Buscar partida por ID
export const lerPartidaPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rows } = await pool.query(`${SELECT_PARTIDA} WHERE id = $1`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Partida não encontrada' });
    }
    res.json(rows[0]);
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao buscar partida' });
  }
};

// POST: Gerar confronto (vincula torneioId aos IDs dos dois times)
export const addPartida = async (req, res) => {
  try {
    const { torneioId, time1Id, time2Id } = req.body;

    if (!torneioId || !time1Id || !time2Id) {
      return res.status(400).json({ message: 'ID do torneio e IDs dos dois times são obrigatórios!' });
    }

    if (time1Id === time2Id) {
      return res.status(400).json({ message: 'Um time não pode enfrentar ele mesmo!' });
    }

    const { rows } = await pool.query(
      `INSERT INTO matches (torneio_id, time1_id, time2_id, status) VALUES ($1, $2, $3, 'pendente')
       RETURNING id, torneio_id AS "torneioId", time1_id AS "time1Id", time2_id AS "time2Id",
         placar_time1 AS "placarTime1", placar_time2 AS "placarTime2", status`,
      [torneioId, time1Id, time2Id]
    );

    res.status(201).json(rows[0]);
  } catch (erro) {
    if (erro.code === '23503') {
      return res.status(400).json({ message: 'Torneio ou time informado não existe' });
    }
    res.status(500).json({ message: 'Erro ao gerar confronto' });
  }
};

// PUT: Atualizar placar e concluir a partida
export const attPlacar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { placarTime1, placarTime2 } = req.body;

    const atual = await pool.query(`${SELECT_PARTIDA} WHERE id = $1`, [id]);

    if (atual.rows.length === 0) {
      return res.status(404).json({ message: 'Partida não encontrada' });
    }

    const partida = atual.rows[0];

    if (placarTime1 === undefined || placarTime2 === undefined) {
      return res.status(400).json({ message: 'Placar de ambos os times é obrigatório!' });
    }

    if (partida.status === 'concluída') {
      return res.status(400).json({ message: 'Esta partida já foi concluída!' });
    }

    const { rows } = await pool.query(
      `UPDATE matches SET placar_time1 = $1, placar_time2 = $2, status = 'concluída' WHERE id = $3
       RETURNING id, torneio_id AS "torneioId", time1_id AS "time1Id", time2_id AS "time2Id",
         placar_time1 AS "placarTime1", placar_time2 AS "placarTime2", status`,
      [placarTime1, placarTime2, id]
    );

    // Atualiza o ranking dos times com base no resultado
    if (placarTime1 > placarTime2) {
      await atualizarPontos(partida.time1Id, 3);
    } else if (placarTime2 > placarTime1) {
      await atualizarPontos(partida.time2Id, 3);
    } else {
      await atualizarPontos(partida.time1Id, 1);
      await atualizarPontos(partida.time2Id, 1);
    }

    res.json(rows[0]);
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao atualizar placar' });
  }
};

// DELETE: Cancelar/desfazer um confronto
export const delPartida = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rowCount } = await pool.query('DELETE FROM matches WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Partida não encontrada' });
    }
    res.status(204).send();
  } catch (erro) {
    res.status(500).json({ message: 'Erro ao remover partida' });
  }
};
