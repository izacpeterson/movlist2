const express = require("express");
const app = express();
const fs = require("fs");

app.get("/api/getmovies", (req, res) => {
  let userEmail = req.query.user;
  let movies = JSON.parse(fs.readFileSync("./data/data.json"));
  movies.userData.forEach((user) => {
    if (user.email === userEmail) {
      res.send(user);
    } else {
      res.send("error");
    }
    console.log(user);
  });
});

app.use(express.static("public"));

app.listen(5500, () => {
  console.log("server listening on 5500");
});
