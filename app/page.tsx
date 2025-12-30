
import { TrackingProvider } from "@/Context/tracking"

import { Navbar, Footer } from "@/Components"
import DAshboard from "@/Components/Dashboard"

export default function Home() {
  return(
    <>
    <TrackingProvider>
      <Navbar/>
      <DAshboard/>
      </TrackingProvider>
      <Footer/>
    </>
  )
}
