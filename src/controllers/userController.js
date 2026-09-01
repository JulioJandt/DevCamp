let users = [
  { id: 1, nome: 'FalleN', email: 'fallen@cs.com', senha: '123' },
  { id: 2, nome: 'Aspas', email: 'aspas@val.com', senha: '456' }
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
  const { nome, nick, email, senha} = req.body;

  if (!nome || !nick || !email || !senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  // validação de e-mail único
  const emailJaExiste = users.find(u => u.email === email);

  if (emailJaExiste) {
    return res.status(400).json({ message: 'Este e-mail já está cadastrado no sistema!' });
  }

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1, 
    nome, nick, email, senha
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