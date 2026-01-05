const subjectImageMap: { [key: string]: string[] } = {
  "Toán": [
    "/subjects/math-1.jpg",
    "/subjects/math-2.jpg",
    "/subjects/math-3.jpg"
  ],
  "Ngữ Văn": [
    "/subjects/literature-1.jpg",
    "/subjects/literature-2.jpg",
    "/subjects/literature-3.jpg"
  ],
  "Tiếng Anh": [
    "/subjects/english-1.jpg",
    "/subjects/english-2.jpg",
    "/subjects/english-3.jpg"
  ],
  "Hóa Học": [
    "/subjects/chemistry-1.jpg",
    "/subjects/chemistry-2.jpg",
    "/subjects/chemistry-3.jpg"
  ],
  "Vật Lý": [
    "/subjects/physics-1.jpg",
    "/subjects/physics-2.jpg",
    "/subjects/physics-3.jpg"
  ]
}

const defaultImages = [
  "/subjects/default-1.jpg",

]

export const getRandomSubjectImage = (subjectName?: string, courseId?: number): string => {
  // if (subjectName && subjectImageMap[subjectName]) {
  //   const images = subjectImageMap[subjectName]
  //   const index = courseId ? courseId % images.length : Math.floor(Math.random() * images.length)
  //   return images[index]
  // }
  
  const index = courseId ? courseId % defaultImages.length : Math.floor(Math.random() * defaultImages.length)
  return defaultImages[index]
}

