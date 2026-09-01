let users = [
  { id: 1, nome: 'FalleN', email: 'fallen@cs.com', senha: '123', tipo: 'organizador' },
  { id: 2, nome: 'Aspas', email: 'aspas@val.com', senha: '456', tipo: 'capitao' }
];

// GET: Buscar todos
export const lerUsuarios = (req, res) => {
  res.json(users); 
};

// GET: Buscar por ID
export const lerUsuarioPorId = (req, res) => {
  const id = parseInt(req.params.id); 
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }
  res.json(user);
};

// POST: Criar 
export const addUsuario = (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1, 
    nome, email, senha, tipo 
  };

  users.push(newUser); 
  res.status(201).json(newUser); 
};

// PUT: Atualizar
export const attUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, senha, tipo } = req.body;
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  users[index] = { id, nome, email, senha, tipo };
  res.json(users[index]);
};

// DELETE: Deletar
export const delUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  users.splice(index, 1); 
  res.status(204).send(); 
};