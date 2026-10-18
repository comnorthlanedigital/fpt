import { useEffect } from 'react'
import { initSmoothScroll } from './smooth-scroll.js'

export default function App() {
  useEffect(() => initSmoothScroll(), [])
  return <main />
}
