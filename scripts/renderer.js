let ipcRenderer = require('electron').ipcRenderer
let Vue = require('vue/dist/vue')
let Vuex = require('vuex')
Vue.use(Vuex)
let PortalVue = require('portal-vue').default
Vue.use(PortalVue)
const store = require('./store/store')

require('./components/to-do')
require('./components/content')
require('./components/category-list')
require('./components/note-list')


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