-- Executado automaticamente pelo Postgres na primeira inicialização do container (volume vazio)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  nick VARCHAR(50),
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(100) NOT NULL,
  tipo VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) UNIQUE NOT NULL,
  capitao_id INTEGER REFERENCES users(id),
  pontos INTEGER NOT NULL DEFAULT 0
);

-- Line-up ativa do time (IDs dos jogadores vinculados)
CREATE TABLE IF NOT EXISTS team_players (
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  jogador_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, jogador_id)
);

CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  genero VARCHAR(100),
  publicadora VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS tournaments (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  jogo VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Aberto'
);

-- Times inscritos em cada torneio
CREATE TABLE IF NOT EXISTS tournament_participants (
  tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  PRIMARY KEY (tournament_id, team_id)
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  torneio_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  time1_id INTEGER NOT NULL REFERENCES teams(id),
  time2_id INTEGER NOT NULL REFERENCES teams(id),
  placar_time1 INTEGER,
  placar_time2 INTEGER,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente'
);

-- Dados iniciais (equivalentes aos arrays em memória que existiam antes)
INSERT INTO users (nome, email, senha) VALUES
  ('FalleN', 'fallen@cs.com', '123'),
  ('Aspas', 'aspas@val.com', '456');

INSERT INTO teams (nome, capitao_id, pontos) VALUES
  ('FURIA', 1, 10),
  ('LOUD', 2, 5);

INSERT INTO team_players (team_id, jogador_id) VALUES
  (1, 1),
  (1, 2),
  (2, 2);

INSERT INTO games (nome, genero, publicadora) VALUES
  ('Rocket League', 'Desporto/Ação', 'Epic Games'),
  ('Clash of Clans', 'Estratégia', 'Supercell'),
  ('Counter-Strike 2', 'FPS', 'Valve');
