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
	    <img v-if="!content.content.fields.thumbnail" src="../assets/no_img.png">
	  </p>
	  <div v-if="content !== null" v-html="content.content.fields.body"></div>
	</section>

	<footer class="modal-card-foot">
	  <button :class="classe" v-if="!doc_id" @click="save()">Bookmark</button>
	  <button :class="classe" v-if="doc_id" @click="remove()">Remove bookmark</button>
	  <button :class="class_favorite" v-if="!doc_id_favorite" @click="save_favorite()">Favorite</button>
	  <button :class="class_favorite" v-if="doc_id_favorite" @click="remove_favorite()">Remove favorite</button>
	  <button class="button is-primary" v-if="doc_id_favorite" @click="open_close_comments()">Comments</button>
	</footer>
      </div>
    </div>
    
    <div :class="comments_modal">
      <div class="modal-background"></div>
      <div class="modal-card">
	<header class="modal-card-head">
	  <p class="modal-card-title" style="flex-shrink: 1">Comments</p>
	  <button class="delete" @click="open_close_comments()" aria-label="close"></button>
	</header>
	<section class="modal-card-body">
	  <div v-if="comments.length">
	    <ul>
	      <li v-for="comment in comments">
		<strong>{{ comment.user_email }}</strong>
		<br>
		{{ comment.comment }}
	      </li>
	    </ul>
	  </div>
	  <div v-else>
	    No comments
	  </div>
	</section>
	<footer class="modal-card-foot">
	  <input class="input is-primary" v-model="comment" type="text" placeholder="Say something">
	  <button class="button is-primary" @click="save_comment()">Comment</button>
	</footer>
      </div>
    </div>
  </div>
</template>

<script>
 var guardian_api = require('../../conf.json');
 
 export default {
   data() {
     return {
       content: null,
       doc_id: null,
       doc_id_favorite: null,
       classe: 'button is-primary',
       class_favorite: 'button is-primary',
       comments_modal: 'modal',
       comment: '',
       comments: []
     }
   },
   methods: {
     close() {
       this.$router.go(-1);
     },
     open_close_comments() {
       if (this.comments_modal === 'modal is-active') {
	 this.comments_modal = 'modal';
       } else {
	 this.comments_modal = 'modal is-active';
	 this.load_comments();
       }
     },
     load_comments() {
       db.collection("comments")
	 .where("news_id", "==", this.content.content.id)
	 .get()
	 .then(docs => {
	   docs.forEach(doc => {
	     this.comments.push(doc.data());
	     console.log(doc.data());
	   });
	 })
	 .catch(error => {
	   console.error('error: ', error);
	 });
     },
     save_comment() {
       let c = {
	 user_email: localStorage.user_email,
	 news_id: this.content.content.id,
	 comment: this.comment
       };
       
       db.collection('comments')
	 .add(c)
	 .then(doc => {
	   this.comments.push(c);
	   this.comment = '';
	 })
	 .catch(error => {
	   console.error('error', error);
	 });
     },
     save() {
       if (localStorage.user_email) {
	 db.collection('bookmarks')
	   .add({
	     user_email: localStorage.user_email,
	     id: this.content.content.id
	   })
	   .then(doc => {
	     this.doc_id = doc.id;
	   })
	   .catch(error => {
	     console.error('error', error);
	   });
	 this.classe = 'button is-danger';
       } else {
	 console.error('user not logged');
       }
     },
     remove() {
       db.collection('bookmarks')
	 .doc(this.doc_id)
	 .delete()
	 .then(() => {
	   this.doc_id = null;
	 })
	 .catch(error => {
	   console.error('error: ', error);
	 });
       this.classe = 'button is-primary';
     },
     save_favorite() {
       if (localStorage.user_email) {
	 db.collection('favorites')
	   .add({
	     user_email: localStorage.user_email,
	     id: this.content.content.id
	   })
	   .then(doc => {
	     this.doc_id_favorite = doc.id;
	   })
	   .catch(error => {
	     console.error('error', error);
	   });
	 this.class_favorite = 'button is-danger';
       } else {
	 console.error('user not logged');
       }
     },
     remove_favorite() {
       db.collection('favorites')
	 .doc(this.doc_id_favorite)
	 .delete()
	 .then(() => {
	   this.doc_id_favorite = null;
	 })
	 .catch(error => {
	   console.error('error: ', error);
	 });
       this.class_favorite = 'button is-primary';
     },
     loadData() {
       this.$http.get(guardian_api.guardian.url + this.$route.params.id, { params : { "api-key" : guardian_api.guardian.api_key, "show-fields": "thumbnail,body", "order-date" : "published" }}).then(response => {
	 this.content = response.data.response;
	 if (localStorage.user_email) {
	   db.collection("bookmarks")
	     .where("id", "==", this.content.content.id)
	     .where("user_email", "==", localStorage.user_email)
	     .get()
	     .then(docs => {
	       docs.forEach(doc => {
		 this.doc_id = doc.id;
		 this.classe = 'button is-danger';
	       });
	     })
	     .catch(error => {
	       console.error('error: ', error);
	     });
	   db.collection("favorites")
	     .where("id", "==", this.content.content.id)
	     .where("user_email", "==", localStorage.user_email)
	     .get()
	     .then(docs => {
	       docs.forEach(doc => {
		 this.doc_id_favorite = doc.id;
		 this.class_favorite = 'button is-danger';
	       });
	     })
	     .catch(error => {
	       console.error('error: ', error);
	     });
	 }
       });
     }
   },
   beforeMount() {
     this.loadData();
   }
 }
</script>
