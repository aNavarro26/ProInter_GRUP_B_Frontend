import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Banner from '../components/Banner/Banner'
import CircularWheel from '../components/CircularWheel/CircularWheel'
import '../index.css'

export default function Home() {
    return (
        <>
            <div className="fade-page">
                <Banner />
                <CircularWheel />
            </div>
        </>
    )
}
