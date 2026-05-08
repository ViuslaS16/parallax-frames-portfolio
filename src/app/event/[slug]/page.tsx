import { client } from "@/sanity/lib/client"
import EventGalleryClient from "./EventGalleryClient"

export default async function EventGallery({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const event = await client.fetch(`
    *[_type == "featuredEvent" && slug.current == $slug][0] {
      title,
      location,
      date,
      "gallery": gallery[].image.asset->fileURL
    }
  `, { slug })

  if (!event) {
    return (
      <main className="bg-[#050505] text-white min-h-screen flex items-center justify-center">
        <h1 className="text-2xl tracking-[0.2em] uppercase text-zinc-500">Event Not Found</h1>
      </main>
    )
  }

  return <EventGalleryClient event={event} />
}
