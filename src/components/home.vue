<template>
  <div>
    <h1>Home</h1>
    <div class="control is-5">
      <input class="input"
	     type="text"
	     placeholder="e-mail"
	     v-model="email">
    </div>
    <div class="control is-5">
      <input class="input"
	     type="password"
	     placeholder="senha"
	     v-model="passwd">
    </div>
    <div class="control">
      <button class="button is-primary" @click="confirm()">Confirm</button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
 export default {
   data() {
     return {
       email: '',
       passwd: ''
     }
   },
   methods: {
     confirm() {
       firebase.auth()
	       .createUserWithEmailAndPassword(this.email, this.passwd)
	       .then(response => {
		 window.localStorage.isLogged = true;
		 window.localStorage.user_email = response.email;
		 location.reload();
	       })
	       .catch(error => {
		 console.error(error.message);
		 window.localStorage.isLogged = false;
		 this.email = '';
		 this.passwd = '';
	       });
     }
   }
 }
</script>
