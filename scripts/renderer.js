let ipcRenderer = require('electron').ipcRenderer
let Vue = require('vue/dist/vue')
let Vuex = require('vuex')
let PortalVue = require('portal-vue').default

Vue.use(Vuex)
Vue.use(PortalVue)

const store = require('./store/store')
var fs = require('fs')

function component(name, url) {
    let content = fs.readFileSync(url + '.vue', 'utf-8')
    let element = document.createElement('body')
    element.innerHTML = content
    content = element.children[1].innerHTML.trim()
    return Vue.component(name, {
        template: element.children[0].innerHTML.trim(),
        ...eval('let module={};' + content)
    })
}

component('category-list', './components/category-list')
component('to-do', './components/to-do')
component('note-list', './components/note-list')
component('note', './components/content')


new Vue({
    store,
    el: '#app',
    methods: {
        delete_categories(key) {
            store.commit('deleteCategory', key)
        },
        delete_notes(key) {
            store.commit('deleteNote', key)
        }
    },
    mounted() {
        ipcRenderer.on('delete', (e, k) => {
            this.transition = 'zoom-out'
            let [type, key] = k.split(':')
            this['delete_' + type](key)
        })
        ipcRenderer.on('favourite:add', (e, k) => {
            this.togglefromFavourite(k)
        })
        ipcRenderer.on('to-do:add', (e, k) => {
            store.commit('addTodo', k)
        })
        ipcRenderer.on('restore', (e, k) => {
            this.transition = 'fade'
            let [type, key] = k.split(':')
            let data = [...this[type]]

            data = data.map(ec => {
                if (ec.key === key) {
                    ec.trashed_at = false
                    ec.updated_at = Date.now()
                    this.categories = [...this.categories].map(category => {
                        if (category.key === ec.category) {
                            category.trashed_at = false
                        }
                        return category
                    })
                }

                return ec;
            })
            this[type] = data
            this.transition = 'nothing'
        })
    }
})