<template>
  <div class="flex flex-wrap relative overflow-hidden">
    <to-do></to-do>
    <category-list></category-list>
    <note-list></note-list>
    <note></note>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";
import Todo from "../components/to-do";
import CategoryList from "../components/category-list";
import Content from "../components/content";
import NoteList from "../components/note-list";
import store from "../store/store";
import fs from "fs";
import { mapState } from "vuex";

export default {
  store,
  components: {
    "to-do": Todo,
    note: Content,
    "category-list": CategoryList,
    "note-list": NoteList
  },
  computed: {
    ...mapState(["notes","categories"])
  },
  methods: {
    delete_categories(key) {
      store.commit("deleteCategory", key);
    },
    delete_notes(key) {
      store.commit("deleteNote", key);
    }
  },
  mounted() {
    ipcRenderer.on("delete", (e, k) => {
      this.transition = "zoom-out";
      let [type, key] = k.split(":");
      this["delete_" + type](key);
    });
    ipcRenderer.on("favourite:add", (e, k) => {
      this.togglefromFavourite(k);
    });
    ipcRenderer.on("to-do:add", (e, k) => {
      store.commit("addTodo", k);
    });
    ipcRenderer.on("restore", (e, k) => {
      this.transition = "fade";
      let [type, key] = k.split(":");
      this.$store.commit('restore', {type, key})
      this.transition = "nothing";
    });
  }
};
</script>