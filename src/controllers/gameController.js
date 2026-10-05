let games = [
  { id: 1, nome: 'Rocket League', genero: 'Desporto/Ação', publicadora: 'Epic Games' },
  { id: 2, nome: 'Clash of Clans', genero: 'Estratégia', publicadora: 'Supercell' },
  { id: 3, nome: 'Counter-Strike 2', genero: 'FPS', publicadora: 'Valve' }
];

// GET: Listar todos os jogos disponíveis na plataforma
export const lerJogos = (req, res) => {
  res.json(games);
};

// GET: Buscar jogo por ID
export const lerJogoPorId = (req, res) => {
  const id = parseInt(req.params.id);
  const game = games.find(g => g.id === id);

  if (!game) {
    return res.status(404).json({ message: 'Jogo não encontrado no catálogo' });
  }
  res.json(game);
};

// POST: Adicionar um novo jogo ao catálogo (Uso exclusivo de administradores)
export const addJogo = (req, res) => {
  const { nome, genero, publicadora } = req.body;

  if (!nome) {
    return res.status(400).json({ message: 'O nome do jogo é obrigatório!' });
  }

  const newGame = {
    id: games.length > 0 ? games[games.length - 1].id + 1 : 1,
    nome,
    genero: genero || 'Não especificado',
    publicadora: publicadora || 'Não especificada'
  };

  games.push(newGame);
  res.status(201).json(newGame);
};

// DELETE: Remover jogo do catálogo
export const delJogo = (req, res) => {
  const id = parseInt(req.params.id);
  const index = games.findIndex(g => g.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Jogo não encontrado' });
  }

  games.splice(index, 1);
  res.status(204).send();
};