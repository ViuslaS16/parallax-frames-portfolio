import { client } from '@/sanity/lib/client'
import ClientPage from './ClientPage'

// Force the page to be dynamic if we want real-time updates, or use revalidation
export const revalidate = 60; // revalidate every 60 seconds

export default async function Page() {
  const featuredEvents = await client.fetch(`
    *[_type == "featuredEvent"] | order(date desc) {
      "id": slug.current,
      title,
      location,
      date,
      "image": thumbnail.asset->fileURL
    }
  `)

  const galleryImages = await client.fetch(`
    *[_type == "galleryImage"] {
      title,
      "src": image.asset->fileURL
    }
  `)

  return <ClientPage featuredEvents={featuredEvents} galleryImages={galleryImages} />
}
