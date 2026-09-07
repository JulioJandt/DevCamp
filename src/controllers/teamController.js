let teams = [
  { id: 1, nome: 'FURIA', capitaoId: 1, jogadores: [1, 2], pontos: 10 },
  { id: 2, nome: 'LOUD', capitaoId: 2, jogadores: [2], pontos: 5 }
];

// GET: Listar times (ranking por pontos)
export const lerTimes = (req, res) => {
  const ranking = [...teams].sort((a, b) => b.pontos - a.pontos);
  res.json(ranking);
};

// GET: Buscar time por ID
export const lerTimePorId = (req, res) => {
  const id = parseInt(req.params.id);
  const team = teams.find(t => t.id === id);

  if (!team) {
    return res.status(404).json({ message: 'Time não encontrado' });
  }
  res.json(team);
};

// POST: Fundar time
export const addTime = (req, res) => {
  const { nome, capitaoId } = req.body;

  if (!nome || !capitaoId) {
    return res.status(400).json({ message: 'Nome do time e ID do capitão são obrigatórios!' });
  }

  const nomeJaExiste = teams.find(t => t.nome === nome);

  if (nomeJaExiste) {
    return res.status(400).json({ message: 'Já existe um time cadastrado com este nome!' });
  }

  const newTeam = {
    id: teams.length > 0 ? teams[teams.length - 1].id + 1 : 1,
    nome,
    capitaoId,
    jogadores: [],
    pontos: 0
  };

  teams.push(newTeam);
  res.status(201).json(newTeam);
};

// PUT: Atualizar time (nome/capitão)
export const attTime = (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, capitaoId } = req.body;
  const team = teams.find(t => t.id === id);

  if (!team) {
    return res.status(404).json({ message: 'Time não encontrado' });
  }

  if (nome) team.nome = nome;
  if (capitaoId) team.capitaoId = capitaoId;

  res.json(team);
};

// DELETE: Desfazer time
export const delTime = (req, res) => {
  const id = parseInt(req.params.id);
  const index = teams.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Time não encontrado' });
  }

  teams.splice(index, 1);
  res.status(204).send();
};

// POST: Adicionar jogador na line-up
export const addJogador = (req, res) => {
  const id = parseInt(req.params.id);
  const { jogadorId } = req.body;
  const team = teams.find(t => t.id === id);

  if (!team) {
    return res.status(404).json({ message: 'Time não encontrado' });
  }

  if (!jogadorId) {
    return res.status(400).json({ message: 'ID do jogador é obrigatório!' });
  }

  if (team.jogadores.includes(jogadorId)) {
    return res.status(400).json({ message: 'Jogador já está na line-up deste time!' });
  }

  team.jogadores.push(jogadorId);
  res.status(201).json(team);
};

// DELETE: Remover jogador da line-up
export const removeJogador = (req, res) => {
  const id = parseInt(req.params.id);
  const jogadorId = parseInt(req.params.jogadorId);
  const team = teams.find(t => t.id === id);

  if (!team) {
    return res.status(404).json({ message: 'Time não encontrado' });
  }

  const index = team.jogadores.indexOf(jogadorId);

  if (index === -1) {
    return res.status(404).json({ message: 'Jogador não está na line-up deste time' });
  }

  team.jogadores.splice(index, 1);
  res.json(team);
};
