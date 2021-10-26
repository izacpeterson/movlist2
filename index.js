const express = require("express");
const app = express();
const fs = require("fs");
const PORT = process.env.PORT || 5500;

//MONGO
var mongoose = require("mongoose");
const URISTR =
  "mongodb+srv://izac:izac1122@cluster0.kewyg.mongodb.net/movieList?retryWrites=true&w=majority";
const MONGODB_URI = process.env.MONGODB_URI || URISTR;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB conection error:"));

app.use(express.json());
app.use(express.static("public"));

//Schema
let Schema = mongoose.Schema;
let movieSchema = new Schema({
  user: String,
  movies: [],
});

app.get("/api/getmovies", (req, res) => {
  let userEmail = req.query.user;

  let userModel = mongoose.model("model", movieSchema);
  userModel.findOne({ user: userEmail }, (err, user) => {
    res.json({ email: userEmail, movies: user.movies });
  });
});

app.post("/api/addmovie", (req, res) => {
  let userEmail = req.body.email;
  let movie = req.body.movie;
  let userModel = mongoose.model("model", movieSchema);
  userModel.findOne({ user: userEmail }, (err, user) => {
    let movieList = user.movies;
    movieList.push(movie);
    user.movies = movieList;
    user.save(() => {
      res.send("movie added");
    });
  });
});

app.post("/api/deletemovie", (req, res) => {
  let userEmail = req.body.email;
  let movie = req.body.movie;
  let userModel = mongoose.model("model", movieSchema);
  userModel.findOne({ user: userEmail }, (err, user) => {
    let movieList = user.movies;
    let index = movieList.indexOf(movie);
    movieList.splice(index, 1);
    user.movies = movieList;
    user.save(() => {
      res.send("movie Deleted");
    });
  });

  // let userEmail = req.body.email;
  // let movie = req.body.movie;
  // let data = JSON.parse(fs.readFileSync("./data/data.json"));
  // let index = data.userData.map((user) => user.email).indexOf(userEmail);
  // let movIndex = data.userData[index].movies.indexOf(movie);
  // let movList = data.userData[index].movies;
  // movList.splice(movIndex, 1);
  // data.userData[index].movies = movList;
  // fs.writeFileSync("./data/data.json", JSON.stringify(data));
  // res.send("deleted");
});

app.listen(PORT, () => {
  console.log("server listening on 5500");
});
