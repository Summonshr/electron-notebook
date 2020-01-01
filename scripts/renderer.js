import Vue from 'vue'
import PortalVue from 'portal-vue'
Vue.use(PortalVue)
import App from './app.vue'

// function component(name, url) {
//     let content = fs.readFileSync(url + '.vue', 'utf-8')
//     let element = document.createElement('body')
//     element.innerHTML = content
//     content = element.children[1].innerHTML.trim()
//     return Vue.component(name, {
//         template: element.children[0].innerHTML.trim(),
//         ...eval('let module={};' + content)
//     })
// }

// component('category-list', './components/category-list')
// component('to-do', './components/to-do')
// component('note-list', './components/note-list')
// component('note', './components/content')

new Vue({ render: createElement => createElement(App) }).$mount('#app');
