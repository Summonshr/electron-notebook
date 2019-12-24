let fs = require('fs')

Vue.component('to-do', {
    template: fs.readFileSync('./templates/to-do.html', 'utf-8'),
    data() {
        return { sidebar: false }
    }
})
