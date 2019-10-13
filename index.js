const express = require("express");

const server = express();

server.use(express.json());

//Query params = ?teste=1
//routes params = /users/1
// request body = { "name": "Gabriel", "email": "gabrieldiaspmg@gmail.com" }

//CRUD - Create, Read, Update, Delete

const users = ["Diego", "Robson", "Victor"];
//aplicando middleware global
server.use((req, res, next) => {
  console.time(`Request`);
  console.log(`Metodo: ${req.method}; URL: ${req.url}; `);

  next();

  console.timeEnd(`Request`);
});
//verifica se o nome do usuario existe
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}
//verifica se o usuario existe no array
function checkUserinArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
}
//retorna todos usuarios
server.get("/users", checkUserinArray, (req, res) => {
  return res.json(users);
});
//retorna um usuarios
server.get("/users/:index", checkUserinArray, (req, res) => {
  return res.json(req.user);
});
//cria um usuario
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});
//altera um usuario
server.put("/users/:index", checkUserinArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});
//deleta um usuario
server.delete("/users/:index", checkUserinArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});
server.listen(3000);
