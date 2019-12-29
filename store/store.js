let Vuex = require('vuex')
let shuffle = require("lodash/shuffle")
let { send, sendSync } = ipcRenderer
let sample = require('../config/sample')
let data = sendSync('get-data', 'now')
let { VuexPersistence } = require('vuex-persist')

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

module.exports = new Vuex.Store({
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
        todos:[],
        current: ''
    },
    mutations: {
        addTodo(state, key){
            state.todos.push({status: 'T', item: key, key: random()})
        },
        updateTodos(state, {key,status}){
            console.log(key,status)
            state.todos = state.todos.map(todo=>{
                if(todo.key === key) {
                    todo.status = status
                }
                return todo
            })
        },
        addNote(state) {
            let note  = shuffle(sample.notes)[0]
            let notes = state.notes
            let rand  = random()
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