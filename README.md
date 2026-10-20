# DevCamp - Gestão de Torneios

API para gestão de torneios, times, partidas e jogos, com autenticação via JWT e banco PostgreSQL.

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e aberto

## Como rodar

Na raiz do projeto:

```bash
docker compose up --build
```

Isso sobe dois containers:
- **API** em `http://localhost:3000`
- **Postgres** na porta `5433` do host (o banco já é criado e populado automaticamente na primeira execução)

Para parar:

```bash
docker compose down
```

Para resetar o banco (apaga os dados e recria do zero):

```bash
docker compose down -v
docker compose up --build
```

## Como testar

Quase todas as rotas exigem autenticação. Primeiro faça login:

```
POST http://localhost:3000/login
Content-Type: application/json

{
  "email": "fallen@cs.com",
  "senha": "123"
}
```

A resposta traz um `token`. Use-o no header de todas as outras requisições:

```
Authorization: Bearer <token>
```

> Usuários já cadastrados para teste: `fallen@cs.com` / `123` e `aspas@val.com` / `456`

Existe uma coleção pronta para o [Insomnia](https://insomnia.rest/) em `DevCamp.insomnia.json` — basta importar.

## Rotas disponíveis

| Recurso | Rotas |
|---|---|
| Auth | `POST /login` |
| Usuários | `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id` |
| Times | `GET /teams`, `GET /teams/:id`, `POST /teams`, `PUT /teams/:id`, `DELETE /teams/:id`, `POST /teams/:id/jogadores`, `DELETE /teams/:id/jogadores/:jogadorId` |
| Partidas | `GET /matches`, `GET /matches/:id`, `POST /matches`, `PUT /matches/:id/placar`, `DELETE /matches/:id` |
| Torneios | `GET /tournaments`, `GET /tournaments/:id`, `POST /tournaments`, `POST /tournaments/:id/inscrever`, `PUT /tournaments/:id`, `DELETE /tournaments/:id` |
| Jogos | `GET /games`, `GET /games/:id`, `POST /games`, `DELETE /games/:id` |

## Rodando sem Docker (opcional)

Precisa de Node.js e de um Postgres próprio rodando. Copie `.env.example` para `.env`, ajuste as variáveis e rode:

```bash
npm install
node server.js
```
