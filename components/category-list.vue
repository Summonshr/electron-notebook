<template>
<div id="sidebar" class="hidden lg:block w-48 h-screen bg-gray-800  overflow-x-hidden overflow-y-scroll ">
    <div class="p-2 flex flex-wrap justify-between border-b border-gray-800">
        <h2 class="text-gray-300">NoteBook</h2 class="text-gray-300">
        <button @click="addCategory" class="text-gray-100 bg-gray-600 hover:bg-gray-800 px-2 leading-normal rounded">New
            +</button>
    </div>
    <div class="">
        <ul class="select-none cursor-pointer mb-2">
            <li class="flex items-center px-4" :class="{'bg-gray-700 text-gray-400': selected.type === 'notes'}">
                <svg fill="#fff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px"
                    viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                    <path d="M352,0H96v448h384V128L352,0z M352,45.25L434.75,128H352V45.25z M448,416H128V32h192v128h128V416z M288,128H160V96h128V128z M160,192h256v32H160V192z M160,288h256v32H160V288z M480,480v32H32V0h32v480H480z" />
                </svg>
                <span class="text-gray-100 w-full h-6 block px-2 h-8 pt-1 text-sm"
                    @click="selected.type='notes'">Notes</span>
            </li>
            <li class="flex items-center px-4" :class="{'bg-gray-700 text-gray-400': selected.type === 'favourites'}">
                <svg class="z-10" fill="#fff" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px"
                    viewBox="0 0 24 24">
                    <path
                        d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z" />
                </svg>
                <span class="text-gray-100 w-full h-6 block px-2 h-8 pt-1 text-sm"
                    @click="selected.type='favourites'">Favourite
                </span>
            </li>
            <li class="flex items-center px-4" :class="{'bg-gray-700 text-gray-400': selected.type === 'trash'}">
                <svg class="inline" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16px"
                    height="16px">
                    <path
                        d="M 10.3125 -0.03125 C 8.589844 -0.03125 7.164063 1.316406 7 3 L 2 3 L 2 5 L 6.96875 5 L 6.96875 5.03125 L 17.03125 5.03125 L 17.03125 5 L 22 5 L 22 3 L 17 3 C 16.84375 1.316406 15.484375 -0.03125 13.8125 -0.03125 Z M 10.3125 2.03125 L 13.8125 2.03125 C 14.320313 2.03125 14.695313 2.429688 14.84375 2.96875 L 9.15625 2.96875 C 9.296875 2.429688 9.6875 2.03125 10.3125 2.03125 Z M 4 6 L 4 22.5 C 4 23.300781 4.699219 24 5.5 24 L 18.59375 24 C 19.394531 24 20.09375 23.300781 20.09375 22.5 L 20.09375 6 Z M 7 9 L 8 9 L 8 22 L 7 22 Z M 10 9 L 11 9 L 11 22 L 10 22 Z M 13 9 L 14 9 L 14 22 L 13 22 Z M 16 9 L 17 9 L 17 22 L 16 22 Z" />
                </svg>
                <span class="float-left text-gray-100 w-full h-6 block px-2 h-8 pt-1 text-sm"
                    @click="selected.type='trash'">Trash</span>
            </li>
        </ul>
        <div :key="category.key" class="select-none cursor-pointer hover:bg-gray-700 hover:text-gray-400"
            :class="{'bg-gray-700 text-gray-400': !selected.type && selected.category && selected.category==category.key}"
            v-for="category in categoryList">
            <a :href="'#categories#'+category.key"
                class="text-gray-100 w-full h-6 block px-2 lg:px-4 h-8 pt-2 lg:pt-1 text-xs lg:text-sm"
                v-if="category.disabled" @click="selectCategory(category.key)" @dblclick="editCategory(category.key)"
                v-html="'# '+category.title"></a>
            <input maxlength="15" v-if="!category.disabled" @keydown.enter="selectCategory(category.key)"
                @keydown.tab='selectCategory(category.key)' @keydown.esc="category.disabled=true"
                v-model="category.title" :disabled="category.disabled"
                class="bg-gray-200 w-full px-4 h-8 pt-1 text-gray-900 outline-none h-6 border-b border-gray-300" />
        </div>
        <div v-if="categoryList.length === 0" class="p-4">
            <button @click="addCategory" class="w-full bg-gray-700 text-gray-100 px-2 py-1 rounded">Create
                Category</button>
        </div>
    </div>
</div>
</template>
<script>
import sortBy from "lodash/sortBy"
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'category-list',
  computed: {
    ...mapState(["notes", "categories", "favourites", "selected", "current"]),
    categoryList() {
      return sortBy(this.categories, "updated_at")
        .filter(category => !category.trashed_at)
        .reverse();
    }
  },
  data() {
    return { transition: "" };
  },
  methods: {
    moment,
    editCategory(key) {
      console.log(this);
      this.$store.commit("editCategory", key);
    },
    addCategory() {
      this.$store.commit("addCategory");
    },
    selectCategory(key) {
      this.transition = "fade-in";
      this.$store.commit("selectCategory", key);
    }
  }
}
</script>