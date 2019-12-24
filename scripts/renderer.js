var Editor = require('@tinymce/tinymce-vue').default;
let shuffle = require("lodash/shuffle")
let upper = require("lodash/capitalize")
let sortBy = require("lodash/sortBy")
var moment = require("moment")
let ipcRenderer = require('electron').ipcRenderer
let { send, sendSync, on } = ipcRenderer
let Vue = require('vue/dist/vue')
let Vuex = require('vuex')
Vue.use(Vuex)
let { mapState } = Vuex
let sample = require('./config/sample')
let data = sendSync('get-data', 'now')
let { VuexPersistence } = require('vuex-persist')
let PortalVue = require('portal-vue').default
Vue.use(PortalVue)
let fs = require('fs')

const vuexLocal = new VuexPersistence({
    storage: {
        getItem() {
            return data
        },
        setItem(name, data) {
            send('data', data)
        }
    }
})

const random = function () {
    return Math.round(Math.random() * 1000000).toString()
}

Vue.component('to-do', {
    template: fs.readFileSync('./templates/to-do.html', 'utf-8'),
    data() {
        return { sidebar: true }
    }
})

Vue.component('note', {
    template: fs.readFileSync('./templates/content.html', 'utf-8'),
    methods: {
        moment
    },
    components: {
        'tinymce-editor': Editor,
    },
    data() {
        return { editor: false }
    },
    computed: {
        ...mapState(['notes', 'categories', 'favourites', 'selected', 'current']),
        current: {
            get() {
                return this.notes.filter(e => e.key === this.selected.note)[0]
            }
        },
        title: {
            get() {
                return this.current && this.current.title
            },
            set(title) {
                this.current && store.commit('updateNote', { title })
            }
        },
        description: {
            get() {
                return this.current && this.current.description
            },
            set(description) {
                store.commit('updateNote', { description })
            }
        },
        note: {
            get() {
                return this.current && this.current.content
            },
            set(content) {
                store.commit('updateNote', { content })
            }
        },
    }

})

Vue.component('note-list', {
    template: fs.readFileSync('./templates/note-list.html', 'utf-8'),
    computed: {
        ...mapState(['notes', 'categories', 'favourites', 'selected', 'current']),
        list() {
            let notes = sortBy(this.notes, 'updated_at').reverse()

            if (this.selected.type === 'notes') {

                if (this.search) {
                    notes = notes.filter(note => JSON.stringify(note).toLowerCase().indexOf(this.search.toLowerCase()) > -1)
                }

                return notes.filter(e => !e.trashed_at);

            }

            if (this.selected.type === 'trash') {
                return notes.filter(e => e.trashed_at);
            }

            if (this.selected.type === 'favourites') {
                return notes.filter(e => !e.trashed_at && this.favourites.includes(e.key));
            }

            if (this.selected.category) {
                return notes.filter(e => !e.trashed_at && e.category === this.selected.category)
            }

            return [];
        },
        currentCategoryTitle: function () {

            if (this.selected.type) {
                return upper(this.selected.type)
            }

            if (this.selected.category) {
                let first = this.categories.filter(category => category.key === this.selected.category)[0]
                if (!first) {
                    return ''
                }
                return first.title
            }

            return ''
        },
    },
    methods: {
        removeFromTrash() {
            let accept = sendSync('confirm', { message: 'This action cannot be reversed', title: 'Are you sure?' })
            accept === 0 && store.commit('emptyTrash')
            return
        },
        addNote(event, category) {
            this.transition = 'fade'
            this.editor = true
            store.commit('addNote')
        },
        select(note) {
            store.commit('selectNote', note.key)
            this.selected.note = note.key;
            this.editor = false
        },
        togglefromFavourite(key) {
            store.commit('toggleFromFavourite', key)
        },
    },
    data() {
        return { transition: '', search: '' }
    }
})
Vue.component('category-list', {
    template: fs.readFileSync('./templates/category-list.html', 'utf-8'),
    computed: {
        ...mapState(['notes', 'categories', 'favourites', 'selected', 'current']),
        categoryList() {
            return sortBy(this.categories, 'updated_at').filter(category => !category.trashed_at).reverse()
        },
    },
    methods: {
        editCategory(category) {
            store.commit('editCategory', category.key)
        },
        addCategory() {
            store.commit('addCategory')
        },
        selectCategory(key) {
            this.transition = 'fade-in'
            store.commit('selectCategory', key)
        },
    }
})
const store = new Vuex.Store({
    plugins: [vuexLocal.plugin],
    state: {
        notes: [],
        categories: [],
        favourites: [],
        selected: {
            category: "",
            note: "",
            type: ""
        },
        current: ''
    },
    mutations: {
        addNote(state) {
            let note = shuffle(sample.notes)[0]
            let notes = state.notes
            let rand = random()
            notes.push({ updated_at: Date.now(), trashed_at: false, created_at: Date.now(), title: note.title, description: note.description, key: rand, category: state.selected.category, content: '' })
            state.notes = notes;
            state.selected.note = rand
        },
        addCategory(state) {
            let rand = random()
            let categories = state.categories
            categories.push({ title: shuffle(sample.categories)[0], disabled: true, key: rand, created_at: Date.now() })
            state.categories = categories
            state.selected.category = rand
            this.commit('addNote')
        },
        deleteNote(state, key) {
            state.notes = [...state.notes].map(note => {
                if (note.key === key) {
                    note.trashed_at = Date.now();
                }
                return note;
            })
        },
        deleteCategory(state, key) {
            state.notes = [...state.notes].map(note => {
                if (note.category === key) {
                    note.trashed_at = Date.now();
                }
                return note;
            })

            state.categories = [...state.categories].map(e => {
                if (e.key === key) {
                    e.trashed_at = Date.now()
                }
                return e
            })
        },
        selectCategory(state, key) {
            state.categories.map(category => { category.disabled = true })
            state.selected.category = key
            state.selected.type = ''
            let notes = state.notes.filter(e => e.category === key)
            state.selected.note = notes.length > 0 ? notes[0].key : ''
        },
        toggleFromFavourite(state, key) {
            if (state.favourites.includes(key)) {
                state.favourites = [...state.favourites].filter(k => k !== key)
                return
            }
            state.favourites.push(key)
        },
        selectNote(state, key) {
            state.selected.note = key
        },
        emptyTrash(state) {
            let notes = state.notes
            notes = notes.filter(e => !e.trashed_at)
            if (state.current.trashed_at) {
                state.selected.note = ''
            }
            state.notes = notes
        },
        editCategory(state, key) {
            state.categories.map(category => {
                if (category.key === key) {
                    category.disabled = false
                    return
                }
                category.disabled = true
            })
        },
        updateNote(state, obj) {
            let notes = state.notes
            state.notes = notes.map(note => {
                if (note.key === state.selected.note)
                    return { ...note, ...obj }
                return note;
            })
        },
    }
})
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