let sortBy = require("lodash/sortBy")
let { mapState } = Vuex
let fs = require('fs')
Vue.component('category-list', {
    template: template('category-list'),
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