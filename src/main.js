import vue from 'vue';
import vuerouter from 'vue-router';
import 'vue-material/dist/vue-material.css';
import vue_material from 'vue-material';
import vue_resource from 'vue-resource';
import 'bulma/css/bulma.css';
import moment from 'moment';
import firebase from 'firebase';
import firestore from 'firebase/firestore';

import app from './app.vue';
import home from './components/home.vue';
import detail from './components/detail.vue';
import category from './components/category.vue';
import search from './components/search.vue'; // identical to category

vue.use(vuerouter);
vue.use(vue_material);
vue.use(vue_resource);
vue.use(moment);

window.vue = vue;

var config = require('../conf.json');

window.config = config;
firebase.initializeApp(config.firestore);

window.firebase = firebase;
window.db = firebase.firestore();

vue.filter('formatDate', value => {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY h:mm a');
  }
});

const router = new vuerouter({
  base: __dirname,
  routes: [
    {
      path: '/category/:category',
      name: 'category',
      component: category,
      children: [
	{
	  path: 'detail/:id',
	  name: 'category.detail',
	  component: detail
	}
      ]
    },
    {
      path: '/search/:q',
      name: 'search',
      component: search,
      children: [
	{
	  path: 'detail/:id',
	  name: 'search.detail',
	  component: detail
	}
      ]
    },
    {
      path: '/',
      name: 'home',
      component: home
    }
  ]
});

new vue({
  router,
  template: '<app></app>',
  components: { app }
}).$mount('#app');
