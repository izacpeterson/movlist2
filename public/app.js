Vue.component("pageheader", {
  template: `
  <header>
    <h1>Movie List</h1>
    <button>Account</button>
  </header>`,
});
Vue.component("username", {
  props: ["email"],
  template: `<h2>User: {{email}}</h2>`,
});

let app = new Vue({
  el: "#app",
  data: {
    email: "",
  },
  methods: {
    getUser: () => {
      fetch("/api/getmovies?user=izacpeterson@gmail.com")
        .then((raw) => raw.json())
        .then((data) => {
          console.log(data);
          return data.email;
        });
    },
  },
});
