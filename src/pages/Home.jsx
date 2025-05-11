// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import CircularWheel from '../components/CircularWheel'
import '../index.css'

export default function Home() {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        // delay so we show banner and wheel at the same time
        const t = setTimeout(() => setReady(true), 300)
        return () => clearTimeout(t)
    }, [])

    if (!ready) return <div className="spinner" />

    return (
        <>
            <Navbar />
            <div className="fade-page">
                <Banner />
                <CircularWheel />
            </div>
        </>
    )
}
