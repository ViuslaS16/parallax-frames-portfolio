export const metadata = {
  title: 'Sanity Studio',
  description: 'Manage EDM Portfolio Content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
