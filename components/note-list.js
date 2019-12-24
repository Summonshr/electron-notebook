let upper = require("lodash/capitalize")
let sortBy = require("lodash/sortBy")
let { sendSync} = ipcRenderer
let { mapState } = Vuex
let fs = require('fs')

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