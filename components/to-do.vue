<template>
  <div>
    <portal to="menu-bar">
      <p
        class="h-6 cursor-pointer w-6 inline-block bg-gray-700 hover:bg-gray-900 p-1 rounded mb-0 align-middle ml-2"
        @click.prevent="sidebar=true"
      >
        <svg
          fill="#fff"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="10px"
          viewBox="0 0 150 150"
          style="enable-background:new 0 0 150 150;"
          xml:space="preserve"
        >
          <g id="XMLID_240_">
            <path
              id="XMLID_241_"
              d="M15,30h120c8.284,0,15-6.716,15-15s-6.716-15-15-15H15C6.716,0,0,6.716,0,15S6.716,30,15,30z"
            />
            <path
              id="XMLID_242_"
              d="M135,60H15C6.716,60,0,66.716,0,75s6.716,15,15,15h120c8.284,0,15-6.716,15-15S143.284,60,135,60z"
            />
            <path
              id="XMLID_243_"
              d="M135,120H15c-8.284,0-15,6.716-15,15s6.716,15,15,15h120c8.284,0,15-6.716,15-15S143.284,120,135,120z"
            />
          </g>
        </svg>
      </p>
    </portal>
    <transition name="fade-both">
      <div
        v-if="sidebar"
        @click="sidebar=false"
        class="z-10 w-full h-screen absolute bg-gray-500 opacity-25"
      ></div>
    </transition>
    <div
      :class="sidebar ? 'transition opened' : 'transition closed'"
      class="z-20 absolute top-0 right-0 bg-gray-200 shadow h-screen overflow-x-hidden overflow-y-scroll max-w-xs w-full"
    >
      <div class="flex flex-wrap mt-2 px-2 relative">
        <a
          href="#"
          class="bg-gray-300 text-gray-800 font-bold shadow rounded cursor-pointer p-2 mx-1"
        >To Do</a>
        <a
          href="#"
          class="bg-gray-300 text-gray-800 font-bold shadow rounded cursor-pointer p-2 mx-1"
        >Working</a>
        <a
          href="#"
          class="bg-gray-300 text-gray-800 font-bold shadow rounded cursor-pointer p-2 mx-1"
        >Done</a>
        <a
          href="#"
          @click.prevent="sidebar=false"
          class="absolute top-0 right-0 mr-2 bg-gray-200 hover:bg-gray-800 text-gray-900 hover:text-gray-200 w-8 h-8 rounded-full flex items-center justify-center"
        >X</a>
      </div>
      <div class="p-2 mt-2">
        <ul class="shadow">
          <li class="border-b pl-2 py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer select-none">
            <span>Watch all star wars movies</span>
            <div class="mt-2">
              <button
                title="Move to To - Do"
                class="bg-gray-300 text-gray-800 font-semibold px-2 rounded"
              >T</button>
              <button
                title="Move to Working"
                class="bg-gray-300 text-gray-800 font-semibold px-2 rounded"
              >W</button>
              <button
                title="Move to Done"
                class="bg-gray-300 text-gray-800 font-semibold px-2 rounded"
              >D</button>
            </div>
          </li>
          <li class="border-b pl-2 py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer select-none">
            <span>Buy Dark Knight DVD</span>
            <div class="mt-2">
              <button
                title="Move to To - Do"
                class="bg-gray-300 text-gray-800 font-semibold px-2 rounded"
              >T</button>
              <button
                title="Move to Working"
                class="bg-gray-300 text-gray-800 font-semibold px-2 rounded"
              >W</button>
              <button
                title="Move to Done"
                class="bg-gray-300 text-gray-800 font-semibold px-2 rounded"
              >D</button>
            </div>
          </li>
          <li class="border-b pl-2 py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer select-none">
            <span>Pass MBA</span>
            <div class="mt-2">
              <button
                title="Move to To - Do"
                class="bg-gray-300 text-gray-800 font-semibold px-2 rounded"
              >T</button>
              <button
                title="Move to Working"
                class="bg-gray-300 text-gray-800 font-semibold px-2 rounded"
              >W</button>
              <button
                title="Move to Done"
                class="bg-gray-300 text-gray-800 font-semibold px-2 rounded"
              >D</button>
            </div>
          </li>
          <li class="border-b pl-2 py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer select-none">
            <span>Learn Swimming</span>
            <div class="mt-2">
              <button
                title="Move to To - Do"
                class="bg-gray-300 text-gray-800 font-semibold px-2 rounded"
              >T</button>
              <button
                title="Move to Working"
                class="bg-gray-300 text-gray-800 font-semibold px-2 rounded"
              >W</button>
              <button
                title="Move to Done"
                class="bg-gray-300 text-gray-800 font-semibold px-2 rounded"
              >D</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  data() {
    return { sidebar: false };
  }
};
</script>