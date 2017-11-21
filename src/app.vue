<template>
  <div>
    <md-toolbar class="md-medium columns md-fixed">
      <md-button class="md-icon-button" @click="toggleLeftSidenav">
	<md-icon>menu</md-icon>
      </md-button>
      
      <h1 class="md-title">The Journal</h1>

      <div class="field has-addons column" style="flex: 1">
	<p class="control is-7">
	  <input class="input"
		 type="text"
		 placeholder="Buscar"
		 @keyup.enter="buscar"
		 v-model="texto_busca">
	</p>
	<p class="control">
	  <a class="button is-primary" @click="buscar()">
	    <i class="material-icons">search</i>
	  </a>
	</p>
	<p class="control">
	  <a class="button is-danger" @click="apagar()">
	    <i class="material-icons">delete</i>
	  </a>
	</p>
      </div>

      <div v-if="!isLogged" class="columns" style="flex: 1">
	<p class="control is-5">
	  <input class="input"
		 type="text"
		 placeholder="e-mail"
		 v-model="email">
	</p>
	<p class="control is-5">
	  <input class="input"
		 type="password"
		 placeholder="senha"
		 v-model="passwd">
	</p>
	<p class="control">
	  <a class="button is-primary" @click="login()">Login</a>
	</p>
	<p class="control">
	  <a class="button is-primary" @click="register()">Registrar</a>
	</p>
      </div>

      <div v-if="isLogged" style="flex: 0">
	<p class="control">
	  <a class="button is-primary" @click="logout()">Logout</a>
	</p>
      </div>
    </md-toolbar>

    <md-sidenav class="md-left" ref="leftSidenav">
      <md-toolbar class="md-medium">
	<div class="md-toolbar-container">
	  <h3 class="md-title">Categorias</h3>
	</div>
      </md-toolbar>

      <div v-for="categoria in categorias.results">
	<md-list-item @click="loadCategory(categoria.id)"
		      href="">
	  {{ categoria.webTitle }}
	</md-list-item>
      </div>
    </md-sidenav>
    
    <router-view></router-view>
  </div>
</template>

<script>
 var guardian_api = require('../conf.json');
 
 export default {
   data() {
     return {
       categorias: [],
       texto_busca: '',
       email: '',
       passwd: '',
       isLogged: false
     }
   },
   methods: {
     buscar() {
       if (this.texto_busca) {
	 this.$router.push({ name: 'search', params: { q: this.texto_busca }});
       }
     },
     login() {
       firebase.auth()
	       .signInWithEmailAndPassword(this.email, this.passwd)
	       .then(response => {
		 this.email = response.email;
		 this.isLogged = true;
		 window.localStorage.isLogged = true;
	       })
	       .catch(error => {
		 console.error(error.message);
		 this.isLogged = false;
		 window.localStorage.isLogged = false;
	       });
     },
     logout() {
       firebase.auth()
	       .signOut()
	       .then(() => {
		 this.isLogged = false;
		 delete window.localStorage.isLogged;
	       })
	       .catch(err => {
		 console.error(error.message);
	       });
     },
     register() {
       this.$router.push({ name: 'home' });
     },
     apagar() {
       this.texto_busca = '';
     },
     toggleLeftSidenav() {
       this.$refs.leftSidenav.toggle();
     },
     loadCategory(category) {
       this.$refs.leftSidenav.close();
       this.$router.push(
	 { name: 'category',
	   params: {
	     category: category
	   }
	 }
       );
     }
   },
   beforeMount() {
     // get sections
     this.$http.get(guardian_api.guardian.url + 'sections', { params : { "api-key" : guardian_api.guardian.api_key }}).then(response => {
       this.categorias = response.data.response;
     });

     this.$router.push({ name: 'category', params: { category: 'technology' }});

     this.isLogged = window.localStorage.isLogged || false;
   }
 }
</script>
