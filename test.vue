<template>
  <div>
    <span v-if="display" v-html="working"></span>
    <span v-html="moment().format('LLLL')"></span>
  </div>
</template>
<script>
let moment = require('moment')
module.exports = {
  computed: {
    working() {
        return 'workings from method'
    }
  },
  methods:{
      moment
  },
  data() {
    return { workisng: "Nonsense", display: true };
  }
};
</script>