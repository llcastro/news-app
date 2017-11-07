<template>
  <div>
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
	<header class="modal-card-head">
	  <p v-if="content !== null" class="modal-card-title" style="flex-shrink: 1">{{ content.content.webTitle }}</p>
	  <button class="delete" @click="close()" aria-label="close"></button>
	</header>
	<section class="modal-card-body">
	  <p v-if="content !== null" class="image is-3by2">
	    <img v-if="content.content.fields.thumbnail" :src="content.content.fields.thumbnail">
	    <img v-if="!content.content.fields.thumbnail" src="../../images/no_img.png">
	  </p>
	  <div v-if="content !== null" v-html="content.content.fields.body"></div>
	</section>
      </div>
    </div>
  </div>
</template>

<script>
 import vue from 'vue';

 import guardian_api from '../../conf.json';
 
 export default {
   data() {
     return {
       content: null
     }
   },
   methods: {
     close() {
       this.$router.go(-1);
     },
     loadData() {
       this.$http.get(guardian_api.guardian.url + this.$route.params.id, { params : { "api-key" : guardian_api.guardian.api_key, "show-fields": "thumbnail,body", "order-date" : "published" }}).then(response => {
	 this.content = response.data.response;
       });
     }
   },
   beforeMount() {
     this.loadData();
   }
 }
</script>
