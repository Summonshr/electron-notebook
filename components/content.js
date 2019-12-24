var Classic = require('@ckeditor/ckeditor5-build-classic');
var CKEditor = require('@ckeditor/ckeditor5-vue');
Vue.use( CKEditor );
var moment = require("moment")
let { mapState } = Vuex
let fs = require('fs')

Vue.component('note', {
    template: fs.readFileSync('./templates/content.html', 'utf-8'),
    methods: {
        moment
    },
    data() {
        return { display: false, editor: Classic }
    },
    mounted(){
        window.onkeyup = e=>e.key==='Escape' && this.display && (this.display = false)
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
