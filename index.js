const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

app.get("/api/getmovies", (req, res) => {
  let userEmail = req.query.user;
  let data = JSON.parse(fs.readFileSync("./data/data.json"));
  let index = data.userData.map((user) => user.email).indexOf(userEmail);
  res.send(data.userData[index] || "error");
});

app.post("/api/addmovie", (req, res) => {
  let userEmail = req.body.email;
  let movie = req.body.movie;
  let data = JSON.parse(fs.readFileSync("./data/data.json"));
  let index = data.userData.map((user) => user.email).indexOf(userEmail);
  data.userData[index].movies.push(movie);
  fs.writeFileSync("./data/data.json", JSON.stringify(data));
  res.send("movie added");
});

app.post("/api/deletemovie", (req, res) => {
  let userEmail = req.body.email;
  let movie = req.body.movie;
  let data = JSON.parse(fs.readFileSync("./data/data.json"));
  let index = data.userData.map((user) => user.email).indexOf(userEmail);
  let movIndex = data.userData[index].movies.indexOf(movie);
  let movList = data.userData[index].movies;
  movList.splice(movIndex, 1);
  data.userData[index].movies = movList;
  fs.writeFileSync("./data/data.json", JSON.stringify(data));
  res.send("deleted");
});

app.use(express.static("public"));

app.listen(5500, () => {
  console.log("server listening on 5500");
});
