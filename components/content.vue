<template>
<div class=" flex-1 flex-grow text-white overflow-x-hidden overflow-y-scroll h-screen">
    <div v-if="current" class="bg-gray-200 text-gray-800 h-full ">
        <transition name="fade">
            <div @dblclick="display=!display" v-if="!display && current"
                class="bg-gray-200 min-h-screen p-2 flex flex-col">
                <span class="absolute top-r right-0 mt-4 mr-8 text-xs text-gray-700">
                    Created <span v-html="moment(current.created_at).fromNow()"></span>
                    <portal-target class="inline" name="menu-bar"></portal-target>
                </span>
                <div class=" border-t-4 border-gray-900 bg-white px-4 pb-4 h-full w-full flex-grow">
                    <h2 class="text-2xl leading-tight mb-0" v-html="title"></h2>
                    <div class="mb-4">
                        <span class="text-sm text-gray-600" v-html="description"></span>
                    </div>
                    <div class="wysiwyg" v-html="note"></div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div v-if="display" class="flex flex-col h-full bg-gray-100 text-gray-900 wysiwyg">
                <div class="flex flex-wrap justify-between items-end border-b-2">
                    <input ref="title" type="text" v-model="title" placeholder="Title"
                        class="text-gray-800 text-2xl flex-1 flex-grow px-2 pt-2 bg-gray-100 w-full outline-none font-semibold">
                </div>
                <input ref="description" type="text" v-model="description" placeholder="Description"
                    class=" py-2 text-xs px-2 bg-gray-100 w-full outline-none bg-gray-100 text-gray-900 text-sm border-b">
                <ckeditor :editor="editor" v-model="note" :config="{}"></ckeditor>
            </div>
        </transition>
    </div>
    <div v-else class='border-t-4 max-w-sm border-orange-500 bg-orange-100 border p-6 text-orange-900 shadow mx-auto mt-16'>
        <div>Select a note</div>
    </div>
</div>
</template>
<script>
import Classic from '@ckeditor/ckeditor5-build-classic'
import CKEditor from '@ckeditor/ckeditor5-vue'
import moment from "moment"
import {mapState} from 'vuex'

export default {
    components:{
        'ckeditor': CKEditor.component
    },
    methods: {
        moment
    },
    data() {
        return { display: false, editor: Classic }
    },
    mounted() {
        window.onkeyup = e => e.key === 'Escape' && this.display && (this.display = false)
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
                this.current && this.$store.commit('updateNote', { title })
            }
        },
        description: {
            get() {
                return this.current && this.current.description
            },
            set(description) {
                this.$store.commit('updateNote', { description })
            }
        },
        note: {
            get() {
                return this.current && this.current.content
            },
            set(content) {
                this.$store.commit('updateNote', { content })
            }
        },
    }
}
</script>