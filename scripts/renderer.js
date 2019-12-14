Vue.use(VueMarkdown);
let shuffle = require("lodash/shuffle")
let sortBy = require("lodash/sortBy")
let ipcRenderer = require('electron').ipcRenderer
let { send, sendSync, on } = ipcRenderer

let sample = {
    categories: [
        'JEDI MIND TRICK',
        'THE FORCE',
        'THE DARK SIDE',
        'STORMTROOPER',
        'DROID',
        'STORMTROOPER',
        'PHANTOM MENACE'
    ],
    notes: [
        {
            title: 'The Force will be with you. Always',
            description: 'Obi-Wan Kenobi'
        },
        {
            title: 'Yoda',
            description: 'When gone am I, the last of the Jedi will you be. The Force runs strong in your family. Pass on what you have learned.'
        },
        {
            title: 'Darth Vader',
            description: 'Just for once, let me look on you with my own eyes.'
        },
        {
            title: 'The begining',
            description: 'Just for once, let me look on you with my own eyes.'
        },
        {
            title: 'Anakin Skywalker',
            description: 'Someday I will be the most powerful Jedi ever.'
        },
        {
            title: 'Obi-Wan Kenobi',
            description: 'If you strike me down I shall become more powerful than you can possibly imagine.'
        },
        {
            title: 'Han Solo',
            description: 'It’s the ship that made the Kessel run in less than twelve parsecs. I’ve outrun Imperial starships. '
        },
        {
            title: 'Darth Vader',
            description: 'Luke, you can destroy the Emperor. He has foreseen this. '
        },
        {
            title: 'Darth Maul',
            description: 'Fear is the path to the dark side. Fear leads to anger; anger leads to hate; hate leads to suffering. I sense much fear in you.'
        },
        {
            title: 'Darth Maul',
            description: 'At last we will reveal ourselves to the Jedi. At last we will have revenge.'
        },
        {
            title: 'Yoda',
            description: 'Train yourself to let go of everything you fear to lose.'
        },
        {
            title: 'Obi-Wan Kenobi',
            description: 'I have taught you everything I know. And you have become a far greater Jedi than I could ever hope to be.'
        },
        {
            title: 'Darth Vader',
            description: 'Don’t be too proud of this technological terror you’ve constructed.'
        }
    ]
}
let updated = false;
let data = sendSync('get-data', 'now')
new Vue({
    el: '#app',
    methods: {
        select(note) {
            this.selected.note = note.key,
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
            setTimeout(()=>this.$refs.title.focus(), 100)
        },
        addCategory() {
            let random = this.random()
            let categories = this.categories
            categories.push({ title: shuffle(sample.categories)[0], disabled: true, key: random })
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
        currentCategoryTitle: function(){
            if(this.selected.category.toLowerCase() ==='trash') {
                return "Trash"
            }

            if(this.selected.category) {
                return this.categories.filter(ec=>ec.key === this.selected.category)[0].title
            }

            return 'Notes'
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
        list() {
            let notes = this.notes

            if (this.selected.category.toLowerCase() === 'trash') {
                notes = sortBy(notes.filter(e => e.trashed_at), 'updated_at');
            } else if (this.selected.category) {
                notes = sortBy(notes.filter(e => !e.trashed_at && e.category === this.selected.category), 'updated_at')
            } else if (!this.selected.category) {
                notes = sortBy(notes, 'updated_at').filter(e=>!e.trashed_at)
                if(this.search){
                    notes = notes.filter(note=>JSON.stringify(note).toLowerCase().indexOf(this.search.toLowerCase()) > -1)
                }
            }

            notes = notes.reverse()

            if(notes.length > 0) {
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
            console.log(data)
            this[type] = data
        })
    },
    updated() {
        updated = true
    },
    data: {
        ...data
    }
})