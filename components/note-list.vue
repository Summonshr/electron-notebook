<template>
  <div
    id="notes"
    class="hidden md:block w-64 max-w-xs lg:w-full h-screen bg-gray-400 overflow-x-hidden overflow-y-auto"
  >
    <div class="flex flex-wrap justify-between items-center">
      <h2
        class="p-2 text-xs lg:text-base"
        v-text="currentCategoryTitle"
        v-if="selected.type !== 'notes'"
      ></h2>
      <input
        @keydown.esc="search"
        autofocus
        v-model="search"
        type="text"
        v-if="selected.type==='notes'"
        placeholder="Search for notes"
        class="w-full h-full p-2"
      />
      <button
        v-if="selected.type==='trash'"
        @click.prevent="removeFromTrash"
        class="bg-gray-200 hover:bg-gray-800 font-semibold rounded text-gray-900 hover:text-gray-200 px-2 h-6 mr-2"
      >Empty</button>
      <button
        v-if="!selected.type && list.length>0 && selected.category && selected.category.toLowerCase && selected.category.toLowerCase() !=='trash'"
        @click.prevent="addNote"
        class="font-semibold rounded hover:text-gray-200 text-gray-100 px-2 hover:bg-gray-900 bg-gray-800 h-6 mr-2"
      >
        Add
        Note +
      </button>
    </div>
    <div class="p-2" v-if="currentCategoryTitle === 'Trash' && list.length === 0">
      <div class="bg-gray-100 p-4 shadow">I'm really white trash</div>
    </div>
    <div class="p-2" v-if="currentCategoryTitle ==='Favourites' && list.length === 0">
      <div class="bg-gray-100 p-4 shadow">Click star icons to add to favorite</div>
    </div>
    <div v-if="selected.type === '' && list.length === 0" @click.prevent="addNote" class="p-2">
      <button
        class="bg-gray-800 text-gray-100 font-semibold rounded px-2 h-16 w-full hover:bg-gray-900 hover:text-gray-100 mr-2"
      >Add Note +</button>
    </div>
    <transition-group tag="div" :name="transition">
      <div :key="note.key" class="relative block select-none" v-for="note in list">
        <svg
          :title="favourites.includes(note.key)? 'Remove from favourite' : 'Add to favourite' "
          @click.prevent="togglefromFavourite(note.key)"
          class="z-10 absolute top-0 right-0 mt-1 mr-1 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            :style="{fill:favourites.includes(note.key) ? 'orange' : 'gray', transition: 'fill 0.25s ease-in', fillOpacity:1}"
            d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"
          />
        </svg>
        <a
          :href="'#notes#'+note.key + (note.trashed_at ? '#restore' : '')"
          class="relative block bg-gray-200 border-b px-2 cursor-pointer py-1 text-xs lg:text-base"
          :class="{' hover:bg-gray-500  hover:text-gray-900':selected.note !== note.key, 'bg-gray-800 text-gray-200': selected.note == note.key}"
          @click="select(note)"
        >
          <h3 v-text="note.title || 'What\'s the title?'" class="font-semibold"></h3>
          <span
            v-text="note.description || 'Short and sweet description would be nice'"
            class="text-xs leading-none"
          ></span>
          <br />
          <div class="w-full text-right" v-if="note.trashed_at">
            <span class="text-xs">
              Trashed
              <span v-html="moment(note.trashed_at).fromNow()"></span>
            </span>
          </div>
        </a>
      </div>
    </transition-group>
  </div>
</template>
<script>
let upper = require("lodash/capitalize");
let sortBy = require("lodash/sortBy");
let { sendSync } = ipcRenderer;
let { mapState } = Vuex;
let moment = require("moment");
module.exports = {
  computed: {
    ...mapState(["notes", "categories", "favourites", "selected", "current"]),
    list() {
      let notes = sortBy(this.notes, "updated_at").reverse();

      if (this.selected.type === "notes") {
        if (this.search) {
          notes = notes.filter(
            note =>
              JSON.stringify(note)
                .toLowerCase()
                .indexOf(this.search.toLowerCase()) > -1
          );
        }

        return notes.filter(e => !e.trashed_at);
      }

      if (this.selected.type === "trash") {
        return notes.filter(e => e.trashed_at);
      }

      if (this.selected.type === "favourites") {
        return notes.filter(
          e => !e.trashed_at && this.favourites.includes(e.key)
        );
      }

      if (this.selected.category) {
        return notes.filter(
          e => !e.trashed_at && e.category === this.selected.category
        );
      }

      return [];
    },
    currentCategoryTitle: function() {
      if (this.selected.type) {
        return upper(this.selected.type);
      }

      if (this.selected.category) {
        let first = this.categories.filter(
          category => category.key === this.selected.category
        )[0];
        if (!first) {
          return "";
        }
        return first.title;
      }

      return "";
    }
  },
  methods: {
    moment,
    removeFromTrash() {
      let accept = sendSync("confirm", {
        message: "This action cannot be reversed",
        title: "Are you sure?"
      });
      accept === 0 && store.commit("emptyTrash");
      return;
    },
    addNote(event, category) {
      this.transition = "fade";
      this.editor = true;
      store.commit("addNote");
    },
    select(note) {
      store.commit("selectNote", note.key);
      this.selected.note = note.key;
      this.editor = false;
    },
    togglefromFavourite(key) {
      store.commit("toggleFromFavourite", key);
    }
  },
  data() {
    return { transition: "", search: "" };
  }
};
</script>