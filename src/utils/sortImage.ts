import Timages from "../types/image"

const sortImage = (search: string, images: Timages[] | undefined): Timages[] => {

    if(!images) return [];

    return images.filter(image => image.title.toLowerCase().includes(search.toLowerCase())) 
}

export default sortImage