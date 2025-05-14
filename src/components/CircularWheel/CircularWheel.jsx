import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../contexts/ProductsContext'
import '../../index.css'
import './CircularWheel.css'

export default function CircularWheel() {
    const products = useProducts()
    const [slice, setSlice] = useState([])
    const [angle, setAngle] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [moved, setMoved] = useState(false)

    // Random slice by 10 products
    useEffect(() => {
        if (products.length) {
            setSlice(
                [...products]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 10)
            )
        }
    }, [products])

    // Auto-scroll 
    useEffect(() => {
        const autoScroll = setInterval(() => {
            if (!isDragging) setAngle(prev => prev + 0.1)  //sensibility
        }, 16)
        return () => clearInterval(autoScroll)
    }, [isDragging])

    const handleMouseDown = e => {
        setIsDragging(true)
        setStartX(e.clientX)
        setMoved(false)
    }
    const handleMouseMove = e => {
        if (!isDragging) return
        const delta = e.clientX - startX
        if (Math.abs(delta) > 2) setMoved(true)
        setStartX(e.clientX)
        setAngle(prev => prev + delta * 0.2)
    }
    const handleMouseUp = () => setIsDragging(false)
    const handleMouseLeave = () => setIsDragging(false)

    if (!slice.length) {
        return <div className="spinner" />
    }

    const anglePerItem = 360 / slice.length
    const radius = 450

    return (
        <div
            className="circular-carousel-container large-wheel"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <div className="carousel-items">
                {slice.map((product, i) => {
                    const thisAngle = i * anglePerItem + angle
                    const transform = `rotateY(${thisAngle}deg) translateZ(${radius}px)`
                    const first = product.image_url[0]
                    return (
                        <Link
                            key={product.product_id}
                            to={`/product/${product.product_id}`}
                            className="carousel-item large-item"
                            style={{ transform }}
                            draggable={false}
                            onDragStart={e => e.preventDefault()}
                            onClick={e => moved && e.preventDefault()}
                        >
                            <img
                                src={first}
                                alt={product.name}
                                draggable={false}
                                onDragStart={e => e.preventDefault()}
                            />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
