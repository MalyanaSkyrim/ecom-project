import Footer from '@/layout/Footer'
import NavBar from '@/layout/NavBar'

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavBar />
      <div className="grid flex-1">{children}</div>
      <Footer />
    </>
  )
}
