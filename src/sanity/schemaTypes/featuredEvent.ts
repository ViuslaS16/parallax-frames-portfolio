export default {
  name: 'featuredEvent',
  title: 'Featured Event',
  type: 'document',
  fields: [
    { name: 'title', title: 'Event Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'date', title: 'Date', type: 'date' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'thumbnail', title: 'Thumbnail', type: 's3-files.media', options: { accept: { 'image/*': [] }, storeOriginalFilename: true } },
    { 
      name: 'gallery', 
      title: 'Gallery Images', 
      type: 'array', 
      of: [{
        type: 'object',
        name: 'galleryItem',
        fields: [{
          name: 'image',
          title: 'Image',
          type: 's3-files.media',
          options: { accept: { 'image/*': [] }, storeOriginalFilename: true }
        }],
        preview: {
          select: { media: 'image' },
          prepare({ media }: any) {
            return { title: 'Gallery Image', media }
          }
        }
      }]
    },
  ]
}
