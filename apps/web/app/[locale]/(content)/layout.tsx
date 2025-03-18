import NavBar from '@/components/NavBar'

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavBar />
      <div className="grid flex-1">{children}</div>
    </>
  )
}
