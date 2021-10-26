//Page Header
Vue.component("pageheader", {
  props: ["user"],
  template: `
  <header>
    <h1>Movie List</h1>
    <h2>{{user}}</h2>
  </header>`,
});

//List of movies
Vue.component("movielist", {
  props: {
    user: { type: String, required: true },
    movies: { type: Array, required: true },
  },
  template: `<ul class="movieList"><li v-for="movie in movies" class="movie"><h2 class="movieName">{{movie}}</h2><button class="delete" v-on:click="deleteMovie(movie)"><span class="material-icons"> delete_outline </span></button></li></ul>`,

  methods: {
    deleteMovie(movietitle) {
      this.$emit("delMov", movietitle);
      console.log(movietitle);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        email: this.user,
        movie: movietitle,
      });
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch("/api/deletemovie", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    },
  },
});

//Add a movie
Vue.component("addmovie", {
  props: {
    user: { type: String, required: true },
  },
  template: `<div class="addMov"><input v-model="movieTitle" id="newMovieName" placeholder="Movie Name" type="text"><button @click="submit"><span class="material-icons">add</span></button></div>`,
  data() {
    return {
      movieTitle: "",
    };
  },
  methods: {
    submit: function () {
      this.$emit("addMov", document.getElementById("newMovieName").value);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        email: this.user,
        movie: document.getElementById("newMovieName").value,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("/api/addmovie", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log(error));
      document.getElementById("newMovieName").value = "";
      document.getElementById("newMovieName").focus();
    },
  },
});

//Vue App
let app = new Vue({
  el: "#app",
  template: `<div class="app">
      <pageheader v-bind:user="user"></pageheader>
      <movielist v-bind:user="user" v-bind:movies="movies" @delMov="removeMovFromList($event)"></movielist>
      <addmovie v-bind:user="user" @addMov="addMovtoList($event)"></addmovie>
      </div>`,
  data: {
    user:
      new URLSearchParams(window.location.search).get("username") ||
      localStorage.getItem("username"),
    movies: [],
  },
  created() {
    this.getMovies();
  },
  methods: {
    getMovies() {
      fetch("/api/getmovies?user=" + this.user)
        .then((raw) => raw.json())
        .then((data) => {
          this.movies = data.movies;
        });
    },
    addMovtoList(newMov) {
      this.movies.push(newMov);
      console.log("newMOV", this.movies);
    },
    removeMovFromList(mov) {
      const index = this.movies.indexOf(mov);
      this.movies.splice(index, 1);
    },
  },
});

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("username") || localStorage.getItem("username");
const userName = localStorage.getItem("username");
if (myParam) {
  localStorage.setItem("username", myParam);
  console.log(myParam);
}
if (!myParam) {
  window.location = "/login";
}
