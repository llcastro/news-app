<template>
  <div id="app">
    <md-toolbar class="md-medium columns md-fixed">
      <md-button class="md-icon-button" @click="toggleLeftSidenav">
	<md-icon>menu</md-icon>
      </md-button>
      
      <h1 class="md-title">The Journal</h1>

      <div class="field has-addons column">
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
 import vue from 'vue';
 import vuerouter from 'vue-router';
 import moment from 'moment';
 
 import guardian_api from '../conf.json';

 vue.use(vuerouter);

 vue.filter('formatDate', value => {
   if (value) {
     return moment(String(value)).format('DD/MM/YYYY h:mm a');
   }
 });
 
 export default {
   data() {
     return {
       categorias: [],
       texto_busca: ''
     }
   },
   methods: {
     buscar() {
       if (this.texto_busca) {
	 this.$router.push({ name: 'search', params: { q: this.texto_busca }});
       }
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
   }
 }
</script>
