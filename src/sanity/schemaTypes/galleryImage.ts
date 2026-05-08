export default {
  name: 'galleryImage',
  title: 'General Gallery Image',
  type: 'document',
  fields: [
    { name: 'title', title: 'Event Name (Hover Text)', type: 'string' },
    { name: 'image', title: 'Image', type: 's3-files.media', options: { accept: { 'image/*': [] }, storeOriginalFilename: true } }
  ]
}
