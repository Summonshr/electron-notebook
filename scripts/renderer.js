Vue.use(VueMarkdown);
let shuffle = require("lodash/shuffle")
let sortBy = require("lodash/sortBy")
let ipcRenderer = require('electron').ipcRenderer
let { send, sendSync, on } = ipcRenderer
let sample = require('./config/sample')
let updated = false;
let data = sendSync('get-data', 'now')
new Vue({
    el: '#app',
    methods: {
        removeFromTrash() {
            let notes = this.notes
            notes = notes.filter(e => !e.trashed_at)
            if (this.current.trashed_at) {
                this.selected.note = ''
            }
            this.notes = notes
        },
        select(note) {
            this.selected.note = note.key;
            this.editor = false
        },
        random: function () {
            return Math.round(Math.random() * 1000000).toString()
        },
        addNote(event, category) {
            let note = shuffle(sample.notes)[0]
            let notes = this.notes
            let random = this.random()
            notes.push({ updated_at: Date.now(), trashed_at: false, created_at: Date.now(), title: note.title, description: note.description, key: random, category: category || this.selected.category, content: '' })
            this.notes = notes;
            this.editor = true
            this.selected.note = random
            setTimeout(() => this.$refs.title.focus(), 100)
        },
        addCategory() {
            let random = this.random()
            let categories = this.categories
            categories.push({ title: shuffle(sample.categories)[0], disabled: true, key: random,created_at: Date.now() })
            this.categories = categories
            this.addNote(null, random)
            this.selected.category = random
        },
        selectCategory(category) {
            category.disabled = true
            this.selected.category = category.key
            this.selected.note = this.notes.filter(e => e.category === category.key)[0].key
        }
    },
    computed: {
        currentCategoryTitle: function () {
            if (this.selected.category.toLowerCase() === 'trash') {
                return "Trash"
            }

            if (this.selected.category) {
                return this.categories.filter(ec => ec.key === this.selected.category)[0].title
            }

            return ''
        },
        current: {
            get() {
                return this.notes.filter(e => e.key === this.selected.note)[0]
            }
        },
        title: {
            get() {
                return this.current.title
            },
            set(title) {
                this.notes.filter(e => e.key === this.selected.note)[0].updated_at = Date.now()
                this.notes.filter(e => e.key === this.selected.note)[0].title = title
            }
        },
        description: {
            get() {
                return this.current.description
            },
            set(description) {
                this.notes.filter(e => e.key === this.selected.note)[0].updated_at = Date.now()
                this.notes.filter(e => e.key === this.selected.note)[0].description = description
            }
        },
        note: {
            get() {
                return this.current.content
            },
            set(content) {
                this.notes.filter(e => e.key === this.selected.note)[0].updated_at = Date.now()
                this.notes.filter(e => e.key === this.selected.note)[0].content = content
            }
        },
        category() {
            return this.selected.category && this.categories.filter(e => e.key == this.selected.category)[0]
        },
        categoryList(){
            return sortBy(this.categories, 'updated_at').reverse()
        },
        list() {
            let notes = this.notes

            if (this.selected.category.toLowerCase() === 'trash') {
                notes = notes.filter(e => e.trashed_at);
            } else if (this.selected.category) {
                notes = notes.filter(e => !e.trashed_at && e.category === this.selected.category)
            } else if (!this.selected.category) {
                notes = notes.filter(e => !e.trashed_at)
                if (this.search) {
                    notes = notes.filter(note => JSON.stringify(note).toLowerCase().indexOf(this.search.toLowerCase()) > -1)
                }
            }

            notes = sortBy(notes,'updated_at')

            notes = notes.reverse()

            if (notes.length > 0) {
                this.selected.note = notes[0].key
            }

            return notes

        }
    },
    mounted() {
        setInterval(() => {
            if (!updated) {
                return;
            }
            updated = false
            send('data', { ...this.$data })
        }, 5000)
        ipcRenderer.on('delete', (e, k) => {
            let [type, key] = k.split(':')
            let data = [...this[type]]
            data = data.map(ec => {
                if (ec.key.toString() === key.toString()) {
                    ec.trashed_at = Date.now()
                }
                return ec;
            })
            this[type] = data
        })
        ipcRenderer.on('restore', (e, k) => {
            let [type, key] = k.split(':')
            let data = [...this[type]]
            data = data.map(ec => {
                if (ec.key.toString() === key.toString()) {
                    ec.trashed_at = false
                    ec.updated_at = Date.now()
                }
                return ec;
            })
            this[type] = data
        })
    },
    updated() {
        updated = true
    },
    data
})