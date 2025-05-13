// src/pages/Home.jsx
import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import CircularWheel from '../components/CircularWheel'
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
