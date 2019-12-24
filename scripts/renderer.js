var Editor = require('@tinymce/tinymce-vue').default;
let shuffle = require("lodash/shuffle")
let Vue = require('vue/dist/vue')
let upper = require("lodash/capitalize")
let sortBy = require("lodash/sortBy")
var moment = require("moment")
let ipcRenderer = require('electron').ipcRenderer
let { send, sendSync } = ipcRenderer
let sample = require('./config/sample')
let updated = false;
let data = sendSync('get-data', 'now')
new Vue({
    el: '#app',
    components:{
        'tinymce-editor': Editor
    },
    computed: {
        currentCategoryTitle: function () {
            if(this.selected.type) {
                return upper(this.selected.type)
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
        categoryList() {
            return sortBy(this.categories, 'updated_at').filter(category => !category.trashed_at).reverse()
        },
        list() {
            let notes = sortBy(this.notes,'updated_at').reverse()

            if (this.selected.type === 'notes') {
                if(this.search){
                    notes = notes.filter(note=>JSON.stringify(note).toLowerCase().indexOf(this.search.toLowerCase()) > -1)
                }
                return notes.filter(e => !e.trashed_at);
            }

            if (this.selected.type === 'trash') {
                return  notes.filter(e => e.trashed_at);
            }
            if (this.selected.type === 'favourites') {
                return  notes.filter(e => this.favourites.includes(e.key));
            }

            if(this.selected.category) {
                return notes.filter(e=>!e.trashed_at && e.category === this.selected.category)
            }
            return [];
        }
    },
    methods: {
        moment,
        editCategory(category) {
            this.categories.map(category => { category.disabled = true })
            category.disabled = false
        },
        removeFromTrash() {
            let accept = sendSync('confirm', { message: 'This action cannot be reversed', title: 'Are you sure?' })
            if (accept === 0) {
                let notes = this.notes
                notes = notes.filter(e => !e.trashed_at)
                if (this.current.trashed_at) {
                    this.selected.note = ''
                }
                this.notes = notes
            }
            return
        },
        select(note) {
            this.selected.note = note.key;
            this.editor = false
        },
        random: function () {
            return Math.round(Math.random() * 1000000).toString()
        },
        addNote(event, category) {
            this.transition = 'fade'
            let note = shuffle(sample.notes)[0]
            let notes = this.notes
            let random = this.random()
            notes.push({ updated_at: Date.now(), trashed_at: false, created_at: Date.now(), title: note.title, description: note.description, key: random, category: category || this.selected.category, content: '' })
            this.notes = notes;
            this.editor = true
            this.selected.note = random
            setTimeout(() => this.$refs.title.focus(), 400)
        },
        addCategory() {
            let random = this.random()
            let categories = this.categories
            categories.push({ title: shuffle(sample.categories)[0], disabled: true, key: random, created_at: Date.now() })
            this.categories = categories
            this.addNote(null, random)
            this.selected.category = random
        },
        selectCategory(category) {
            this.categories.map(category => { category.disabled = true })
            this.selected.category = category.key
            this.transition = 'fade-in'
            this.selected.type = ''
            let notes = this.notes.filter(e => e.category === category.key)
            this.selected.note = notes.length > 0 ? notes[0].key : ''
        },
        togglefromFavourite(key) {
            if (this.favourites.includes(key)) {
                this.favourites = [...this.favourites].filter(k => k !== key)
                return
            }
            this.favourites.push(key)
        },
        delete_categories(key) {

            this.notes = [...this.notes].map(note => {
                if (note.category === key) {
                    note.trashed_at = Date.now();
                }
                return note;
            })

            this.categories = [...this.categories].map(e => {
                if (e.key === key) {
                    e.trashed_at = Date.now()
                }
                return e
            })

        },
        delete_notes(key) {
            this.notes = [...this.notes].map(note => {
                if (note.key === key) {
                    note.trashed_at = Date.now();
                }
                return note;
            })
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
    },
    updated() {
        this.$refs['editor'] && this.$refs['editor'].editor && this.$refs['editor'].editor.on('keydown', e=>{
            e.key ==='Escape' && (this.editor=false)
            return true
        })
        updated = true
    },
    data
})