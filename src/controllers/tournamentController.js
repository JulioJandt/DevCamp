import { pool } from '../config/db.js';

const buscarParticipantes = async (tournamentId) => {
  const { rows } = await pool.query(
    'SELECT team_id FROM tournament_participants WHERE tournament_id = $1 ORDER BY team_id',
    [tournamentId]
  );
  return rows.map(r => r.team_id);
};

const montarTorneio = async (torneio) => ({
  ...torneio,
  participantes: await buscarParticipantes(torneio.id)
});

export const addTorneio = async (req, res) => {
  try {
    const { nome, jogo, status } = req.body;

    if (!nome || !jogo) {
      return res.status(400).json({ erro: 'Nome e jogo são campos obrigatórios.' });
    }

    const { rows } = await pool.query(
      'INSERT INTO tournaments (nome, jogo, status) VALUES ($1, $2, $3) RETURNING *',
      [nome, jogo, status || 'Aberto']
    );

    return res.status(201).json(await montarTorneio(rows[0]));
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro interno ao criar torneio.' });
  }
};

export const lerTorneios = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tournaments ORDER BY id');
    const torneios = await Promise.all(rows.map(montarTorneio));
    return res.status(200).json(torneios);
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao buscar torneios.' });
  }
};

export const lerTorneioPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rows } = await pool.query('SELECT * FROM tournaments WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Torneio não encontrado.' });
    }

    return res.status(200).json(await montarTorneio(rows[0]));
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao buscar torneio.' });
  }
};

export const inscreverEquipe = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { idEquipe } = req.body;

    if (!idEquipe) {
      return res.status(400).json({ erro: 'O ID da equipe é obrigatório.' });
    }

    const torneio = await pool.query('SELECT id FROM tournaments WHERE id = $1', [id]);

    if (torneio.rows.length === 0) {
      return res.status(404).json({ erro: 'Torneio não encontrado.' });
    }

    const jaInscrita = await pool.query(
      'SELECT 1 FROM tournament_participants WHERE tournament_id = $1 AND team_id = $2',
      [id, idEquipe]
    );

    if (jaInscrita.rows.length > 0) {
      return res.status(400).json({ erro: 'Esta equipe já está inscrita no torneio.' });
    }

    await pool.query(
      'INSERT INTO tournament_participants (tournament_id, team_id) VALUES ($1, $2)',
      [id, idEquipe]
    );

    const { rows } = await pool.query('SELECT * FROM tournaments WHERE id = $1', [id]);
    return res.status(200).json(await montarTorneio(rows[0]));
  } catch (erro) {
    if (erro.code === '23503') {
      return res.status(400).json({ erro: 'ID da equipe não corresponde a um time existente.' });
    }
    return res.status(500).json({ erro: 'Erro ao registrar equipe.' });
  }
};

export const attTorneio = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, jogo, status } = req.body;

    const atual = await pool.query('SELECT * FROM tournaments WHERE id = $1', [id]);

    if (atual.rows.length === 0) {
      return res.status(404).json({ erro: 'Torneio não encontrado.' });
    }

    const torneioAtual = atual.rows[0];

    const { rows } = await pool.query(
      'UPDATE tournaments SET nome = $1, jogo = $2, status = $3 WHERE id = $4 RETURNING *',
      [
        nome || torneioAtual.nome,
        jogo || torneioAtual.jogo,
        status || torneioAtual.status,
        id
      ]
    );

    return res.status(200).json(await montarTorneio(rows[0]));
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao atualizar torneio.' });
  }
};

export const delTorneio = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rowCount } = await pool.query('DELETE FROM tournaments WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ erro: 'Torneio não encontrado.' });
    }

    return res.status(204).send();
  } catch (erro) {
    if (erro.code === '23503') {
      return res.status(400).json({ erro: 'Não é possível remover: este torneio possui partidas vinculadas.' });
    }
    return res.status(500).json({ erro: 'Erro ao remover torneio.' });
  }
};
