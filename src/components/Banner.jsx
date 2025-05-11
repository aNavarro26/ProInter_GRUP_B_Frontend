import { useMemo } from 'react'
import { useProducts } from '../contexts/ProductsContext'
import '../index.css'

export default function Banner() {
    const products = useProducts()
    const phone = useMemo(() => {
        const list = products.filter(p => p.category.name.toLowerCase() === 'phone')
        return list.length
            ? list[Math.floor(Math.random() * list.length)]
            : null  
    }, [products])

    return (
        <section className="banner">
            <div className="banner-content">
                <div className="banner-images">
                    {phone && (
                        <img
                            src={phone.image_url.split(',')[0]}
                            alt={phone.name}
                            draggable={false}
                        />
                    )}
                </div>
                <div className="banner-text">
                    <h1>Explore the Best Devices</h1>
                    <p>Find the perfect tech for your needs.</p>
                </div>
            </div>
        </section>
    )
}
