var Editor = require('@tinymce/tinymce-vue').default;
var moment = require("moment")
let { mapState } = Vuex

Vue.component('note', {
    template: template('content'),
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
