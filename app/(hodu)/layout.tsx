import HoduNavbar from '@/components/hodu/HoduNavbar'
import HoduFooter from '@/components/hodu/HoduFooter'

export default function HoduLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HoduNavbar />
      <main>{children}</main>
      <HoduFooter />
    </>
  )
}
