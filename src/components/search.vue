<template>
  <div>
    <div class="columns is-multiline is-8"
	 v-infinite-scroll="loadMore"
	 infinite-scroll-distance="2">
      <md-card class="column is-3"
	       md-with-hover
	       v-for="item in content.results"
	       :key="item.id">
	<div @click="showDetails(item.id)">
	  <md-card-media md-big>
	    <img v-if="item.fields" :src="item.fields.thumbnail"/>
	    <img v-if="!item.fields" src="../../images/no_img.png"/>
	  </md-card-media>

	  <md-card-header>
	    <md-card-header-text>
	      <div class="md-title">{{ item.webTitle }}</div>
	      <div class="md-subhead">{{ item.webPublicationDate | formatDate }}</div>
	    </md-card-header-text>
	  </md-card-header>
	</div>
      </md-card>
    </div>
    <div v-if="content.results && content.results.length === 0">
      <h2>Sem notícias</h2>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
 var guardian_api = require('../../conf.json');
 
 export default {
   data() {
     return {
       content: [],
       last_page: 0
     }
   },
   methods: {
     showDetails(id) {
       this.$router.push({ name: 'search.detail', params: { id: id }});
     },
     loadMore() {
       if (this.last_page > 0) {
	 this.$http.get(guardian_api.guardian.url + 'search', { params : { "api-key" : guardian_api.guardian.api_key, "show-fields": "thumbnail", "page-size" : 10, "page" : this.last_page + 1, "order-date" : "published", "q": this.$route.params.q }}).then(response => {
	   if(response.data.response.status === 'ok') {
	     response.data.response.results.forEach(item => {
	       if (this.content.results) {
		 this.content.results.push(item);
	       }
	     });
	   }
	   this.last_page += 1;
	 });
       }
     },
     loadData() {
       this.$http.get(guardian_api.guardian.url + 'search', { params : { "api-key" : guardian_api.guardian.api_key, "show-fields": "thumbnail", "page-size" : 10, "order-date" : "published", "q": this.$route.params.q }}).then(response => {
	 this.content = response.data.response;
	 this.last_page = 1;
       });
     }
   },
   watch: {
     '$route' (to, from) {
       this.loadData();
     }
   },
   beforeMount() {
     this.loadData();
   }
 }
</script>
