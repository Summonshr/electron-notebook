Vue.use(VueMarkdown);
new Vue({
    el: '#app',
    methods: {
        random: function () {
            return Math.round(Math.random() * 1000000)
        },
    },
    computed: {
        title: {
            get(){
                return this.notes.filter(e=>e.key === this.selected.note)[0].title
            },
            set(title){
                this.notes.filter(e=>e.key === this.selected.note)[0].title = title
            }
        },
        description: {
            get(){
                return this.notes.filter(e=>e.key === this.selected.note)[0].description
            },
            set(description){
                this.notes.filter(e=>e.key === this.selected.note)[0].description = description
            }
        },
        note: {
            get(){
                return this.notes.filter(e=>e.key === this.selected.note)[0].content
            },
            set(content){
                this.notes.filter(e=>e.key === this.selected.note)[0].content = content
            }
        },
        category(){
            return this.selected.category && this.categories.filter(e=>e.key == this.selected.category)[0]
        },
        list(){
            return this.selected.category ? this.notes.filter(e=>e.key == this.selected.category) : []
        }
    },
    data: {
        editor: true,
        content: 'WORKING',
        selected: {
            category:'1',
            note: '1'
        },
        notes:[
            {
                key: '1',
                title: 'Note 1',
                description: 'Note 1 Description',
                content: '## Start writing'
            }
        ],
        categories: [
            {
                key: '1',
                title:'Category 1',
                disabled: true
            },
            {
                key: '2',
                title:'Category 2',
                disabled: true
            },
            {
                key: '3',
                title:'Category 3',
                disabled: true
            }
        ]
    }
})