const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Banco de Dados SQLite
const db = new sqlite3.Database(':memory:'); // Banco em memória (para testes)

db.serialize(() => {
  // Criação das tabelas
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      assignee TEXT,
      creator TEXT NOT NULL
    )
  `);
});

// Endpoints

// Cadastro de Usuário
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    function (err) {
      if (err) {
        return res.status(400).json({ message: 'Usuário já existe.' });
      }
      res.status(201).json({ message: 'Usuário registrado com sucesso.' });
    }
  );
});

// Login de Usuário
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
      }
      res.json({ message: 'Login bem-sucedido!', username: user.username });
    }
  );
});

// Criar Tarefa
app.post('/tasks', (req, res) => {
  const { title, description, assignee, creator } = req.body;

  if (!title || !creator) {
    return res.status(400).json({ message: 'Título e criador são obrigatórios.' });
  }

  db.run(
    'INSERT INTO tasks (title, description, assignee, creator) VALUES (?, ?, ?, ?)',
    [title, description, assignee, creator],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao criar tarefa.' });
      }
      res.status(201).json({ message: 'Tarefa criada com sucesso.', taskId: this.lastID });
    }
  );
});

// Listar Tarefas
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar tarefas.' });
    }
    res.json(rows);
  });
});

// Editar Tarefa
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, assignee } = req.body;

  db.run(
    'UPDATE tasks SET title = ?, description = ?, assignee = ? WHERE id = ?',
    [title, description, assignee, id],
    function (err) {
      if (err || this.changes === 0) {
        return res.status(400).json({ message: 'Erro ao editar tarefa ou tarefa não encontrada.' });
      }
      res.json({ message: 'Tarefa atualizada com sucesso.' });
    }
  );
});

// Excluir Tarefa
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', id, function (err) {
    if (err || this.changes === 0) {
      return res.status(400).json({ message: 'Erro ao excluir tarefa ou tarefa não encontrada.' });
    }
    res.json({ message: 'Tarefa excluída com sucesso.' });
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
