import { atualizarPontos } from './teamController.js';

let partidas = [
  { id: 1, torneioId: 1, time1Id: 1, time2Id: 2, placarTime1: null, placarTime2: null, status: 'pendente' }
];

// GET: Listar partidas (chaves de jogos)
// Suporta filtro opcional por torneio: /partidas?torneioId=1
export const lerPartidas = (req, res) => {
  const { torneioId } = req.query;

  let resultado = [...partidas];

  if (torneioId) {
    resultado = resultado.filter(p => p.torneioId === parseInt(torneioId));
  }

  res.json(resultado);
};

// GET: Buscar partida por ID
export const lerPartidaPorId = (req, res) => {
  const id = parseInt(req.params.id);
  const partida = partidas.find(p => p.id === id);

  if (!partida) {
    return res.status(404).json({ message: 'Partida não encontrada' });
  }
  res.json(partida);
};

// POST: Gerar confronto (vincula torneioId aos IDs dos dois times)
export const addPartida = (req, res) => {
  const { torneioId, time1Id, time2Id } = req.body;

  if (!torneioId || !time1Id || !time2Id) {
    return res.status(400).json({ message: 'ID do torneio e IDs dos dois times são obrigatórios!' });
  }

  if (time1Id === time2Id) {
    return res.status(400).json({ message: 'Um time não pode enfrentar ele mesmo!' });
  }

  const newPartida = {
    id: partidas.length > 0 ? partidas[partidas.length - 1].id + 1 : 1,
    torneioId,
    time1Id,
    time2Id,
    placarTime1: null,
    placarTime2: null,
    status: 'pendente'
  };

  partidas.push(newPartida);
  res.status(201).json(newPartida);
};

// PUT: Atualizar placar e concluir a partida
export const attPlacar = (req, res) => {
  const id = parseInt(req.params.id);
  const { placarTime1, placarTime2 } = req.body;
  const partida = partidas.find(p => p.id === id);

  if (!partida) {
    return res.status(404).json({ message: 'Partida não encontrada' });
  }

  if (placarTime1 === undefined || placarTime2 === undefined) {
    return res.status(400).json({ message: 'Placar de ambos os times é obrigatório!' });
  }

  if (partida.status === 'concluída') {
    return res.status(400).json({ message: 'Esta partida já foi concluída!' });
  }

  partida.placarTime1 = placarTime1;
  partida.placarTime2 = placarTime2;
  partida.status = 'concluída';

  // Atualiza o ranking dos times com base no resultado
  if (placarTime1 > placarTime2) {
    atualizarPontos(partida.time1Id, 3);
  } else if (placarTime2 > placarTime1) {
    atualizarPontos(partida.time2Id, 3);
  } else {
    atualizarPontos(partida.time1Id, 1);
    atualizarPontos(partida.time2Id, 1);
  }

  res.json(partida);
};

// DELETE: Cancelar/desfazer um confronto
export const delPartida = (req, res) => {
  const id = parseInt(req.params.id);
  const index = partidas.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Partida não encontrada' });
  }

  partidas.splice(index, 1);
  res.status(204).send();
};
