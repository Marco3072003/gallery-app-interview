import { ref } from 'vue';
import dataImages from '../../data/images.json'
import Timages from '../types/images'

const getImages = () => {
   const images = ref<Timages[]>();
   const load = () =>{
      images.value = dataImages
   }
   return { images, load };
}

export default getImages;