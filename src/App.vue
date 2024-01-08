<script setup lang="ts">
import getImages from './composable/getImages'
import { watch, ref, computed } from 'vue'
import sortImage from './utils/sortImage'

const { images, load } =  getImages();
load();

//autocomplete and sort images state
const search = ref<string>("")
const sortedImages = computed(() => sortImage(search.value, images.value))
const showAutoComplete = ref<boolean>(false)

//favorite 
const favoriteImages = computed(() => sortedImages.value.filter(image => image.is_featured === true))

//navigation state
const showComponent = ref<string>('gallery');

 //tooltip state
 const imageHovered = ref<string>('')

 //carousel state
 const scrlEl = ref<HTMLElement>();

  //autocomplete 
  watch(search, () =>{
    showAutoComplete.value = search.value.length > 0 ?  true : false
    const result: boolean | undefined = images.value?.some(image => image.title == search.value);
    typeof result  === 'boolean' && result === true ? showAutoComplete.value = !result : null
  })

  const chooseImage = (title: string) => {
    search.value = title
  }

  //navigation
  const checkActive =(component: string, page: string): boolean =>{
    return component === page ? true : false
  }

  const carouselHandle = () =>{
    showComponent.value = 'carousel'
  }

  const galleryHandle = () =>{
    showComponent.value  = 'gallery'
  }

  const favoriteHandle = () => {
    showComponent.value = 'favorite'
  }

  //tooltip
  const handleMouseOver = (title: string) => {
    imageHovered.value = title
  }
  
  const handleMouseOut = () => {
    imageHovered.value = ''
  }

  const handleHover = (title: string) =>{
    return imageHovered.value === title;
  }

  const scrollRight = () => {
    scrlEl.value?.scrollBy({
      left: 500,
      behavior: 'smooth'
    })
  }

  const scrollLeft = () =>{
    scrlEl.value?.scrollBy({
      left: -500,
      behavior: 'smooth'
    })
  }

</script>

<template>
  <!-- navbar component -->
  <div class="flex mb-5 items-center gap-8 px-8 py-4 shadow-lg shadow-green-200">
    <h1 class="text-3xl text-green-800 font-bold font-custom">Images Gallery</h1>
    <div class="relative w-1/3">
      <input v-model="search" class="px-2 py-1 border-4 border-green-200 rounded-lg w-full" type="text" placeholder="Input image title">
      <ul v-if="showAutoComplete" class="absolute bg-slate-100 rounded-lg w-full mt-1  z-50">
        <li @click="chooseImage(image.title)" v-for="image in sortedImages" class="px-2 hover:bg-slate-400 rounded-md">{{ image.title }}</li>
      </ul>
    </div>
  </div>
  <!-- navigation component -->
  <div class="px-8 flex gap-6 mb-4">
      <button @click="galleryHandle" :class="{'bg-green-400': checkActive(showComponent, 'gallery'),  'text-white' : checkActive(showComponent, 'gallery')}" class="border-2 border-green-400 px-2 py-2 rounded-md text-green-600 hover:bg-green-200 ">Gallery</button>
      <button @click="carouselHandle" :class="{'bg-green-400': checkActive(showComponent, 'carousel'),  'text-white' : checkActive(showComponent, 'carousel')}"  class="border-2 border-green-400 px-2 py-2 rounded-md text-green-600 hover:bg-green-200 active:bg-green-400 active:text-green-200">Carousel</button>
      <button @click="favoriteHandle" :class="{'bg-green-400': checkActive(showComponent, 'favorite'),  'text-white' : checkActive(showComponent, 'favorite')}"  class="border-2 border-green-400 px-2 py-2 rounded-md text-green-600 hover:bg-green-200 active:bg-green-400 active:text-green-200">Favorite</button>
  </div>
  <!-- gallery component -->
  <div v-if="showComponent === 'gallery'" class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10 place-items-center px-8">
    <div @mouseover="handleMouseOver(image.title)" @mouseout="handleMouseOut()" class="border-4 border-green-200 rounded-lg shadow-lg relative" v-for="image in sortedImages">
      <h1 v-if="handleHover(image.title)" class="absolute left-2 top-3 p-2 bg-slate-700 text-white rounded-lg">{{ image.title }}</h1>
      <img class="rounded-t-md" :src="image.image_url" :key="image.title">
      <div class="flex items-center gap-4 p-5 bg-slate-50 rounded-lg ">
        <h1 class="text-xl md:text-md sm:text-sm font-bold">Rating :</h1>
        <i v-for="star in image.rating" class="md:text-md sm:text-sm fa-solid fa-star text-yellow-500 text-2xl pl-2" />
        <h2 class="text-xl md:text-md sm:text-sm font-bold">{{ image.rating }} / 5</h2>
      </div>
    </div>
  </div>
   <!-- favorite component  -->
   <div v-if="showComponent === 'favorite'" class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10 place-items-center px-8">
      <div @mouseover="handleMouseOver(image.title)" @mouseout="handleMouseOut()" class="border-4 border-green-200 rounded-lg shadow-lg relative" v-for="image in favoriteImages">
        <h1 v-if="handleHover(image.title)" class="absolute left-2 top-3 p-2 bg-slate-700 text-white rounded-lg">{{ image.title }}</h1>
        <img :src="image.image_url" :key="image.title">
        <div class="flex items-center gap-4 p-5 bg-slate-50 rounded-lg ">
          <h1 class="text-xl md:text-md sm:text-sm font-bold">Rating :</h1>
          <i v-for="star in image.rating" class="text-2xl md:text-md sm:text-sm fa-solid fa-star text-yellow-500  pl-2" />
          <h2 class="md:text-md sm:text-sm text-xl font-bold">{{ image.rating }} / 5</h2>
        </div>
      </div>
    </div>
    <!-- carousel component -->
    <div v-if="showComponent === 'carousel'" class="px-8">
        <div  class="w-full flex gap-[54px] overflow-scroll snap-x scroll-smooth" ref="scrlEl" style="overflow-y: hidden;" id="carousel-container">
          <i @click="scrollLeft" class="fa-solid fa-circle-left absolute left-11 z-50 top-1/2  translate-y-[-50%] text-6xl text-slate-300"></i>
          <div class="snap-center border-4 border-green-200 rounded-lg shadow-lg min-w-[500px] ml-1 relative" @mouseover="handleMouseOver(image.title)" @mouseout="handleMouseOut()"  v-for="image in sortedImages">
            <h1 v-if="handleHover(image.title)" class="absolute left-2 top-3 p-2 bg-slate-700 text-white rounded-lg">{{ image.title }}</h1>
            <img  :src="image.image_url" :key="image.title" >
            <div class="flex items-center gap-4 p-5 bg-slate-50 rounded-lg">
              <h1 class="text-xl font-bold md:text-md sm:text-sm">Rating :</h1>
              <i v-for="star in image.rating" class="md:text-md sm:text-sm fa-solid fa-star text-yellow-500 text-2xl pl-2"/>
              <h2 class=" md:text-md sm:text-sm text-xl font-bold">{{ image.rating }} / 5</h2>
            </div>
          </div>
          <i @click="scrollRight" class="fa-solid fa-circle-right absolute right-11 top-1/2 translate-y-[-50%] text-6xl text-slate-300 disabled"></i>
        </div>
    </div>
</template>