import crypto from 'crypto';

let bdTorneios = [];

export const addTorneio = (req, res) => {
  try {
    const { nome, jogo, status } = req.body;

    if (!nome || !jogo) {
      return res.status(400).json({ erro: 'Nome e jogo são campos obrigatórios.' });
    }

    const novoTorneio = {
      id: crypto.randomUUID(),
      nome,
      jogo,
      status: status || 'Aberto',
      participantes: []
    };

    bdTorneios.push(novoTorneio);
    return res.status(201).json(novoTorneio);
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro interno ao criar torneio.' });
  }
};

export const lerTorneios = (req, res) => {
  try {
    return res.status(200).json(bdTorneios);
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao buscar torneios.' });
  }
};

export const inscreverEquipe = (req, res) => {
  try {
    const { id } = req.params;
    const { idEquipe } = req.body; // Mudei de teamId para idEquipe

    if (!idEquipe) {
      return res.status(400).json({ erro: 'O ID da equipe é obrigatório.' });
    }

    const torneio = bdTorneios.find(t => t.id === id);

    if (!torneio) {
      return res.status(404).json({ erro: 'Torneio não encontrado.' });
    }

    if (torneio.participantes.includes(idEquipe)) {
      return res.status(400).json({ erro: 'Esta equipe já está inscrita no torneio.' });
    }

    torneio.participantes.push(idEquipe);
    return res.status(200).json(torneio);
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao registrar equipe.' });
  }
};

export const attTorneio = (req, res) => {
  try {
    const { id } = req.params;
    const { nome, jogo, status } = req.body;

    const index = bdTorneios.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ erro: 'Torneio não encontrado.' });
    }

    const torneioAtualizado = {
      ...bdTorneios[index],
      nome: nome || bdTorneios[index].nome,
      jogo: jogo || bdTorneios[index].jogo,
      status: status || bdTorneios[index].status
    };

    bdTorneios[index] = torneioAtualizado;
    return res.status(200).json(torneioAtualizado);
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao atualizar torneio.' });
  }
};

export const delTorneio = (req, res) => {
  try {
    const { id } = req.params;
    const index = bdTorneios.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ erro: 'Torneio não encontrado.' });
    }

    bdTorneios.splice(index, 1);
    return res.status(204).send();
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao remover torneio.' });
  }
};