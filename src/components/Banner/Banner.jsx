import { useMemo } from 'react'
import { useProducts } from '../../contexts/ProductsContext'
import '../../index.css'
import './Banner.css'

export default function Banner() {
    const products = useProducts()
    const phone = useMemo(() => {
        const list = products.filter(p => p.category?.name?.toLowerCase() === 'phone')
        return list.length
            ? list[Math.floor(Math.random() * list.length)]
            : null
    }, [products])

    const imageSrc = phone?.image_url?.[0] || ''
    return (
        <section className="banner">
            <div className="banner-content">
                <div className="banner-images">
                    {imageSrc && (
                        <img
                            src={imageSrc}
                            alt={phone.name}
                            draggable={false}
                            onError={(e) => {
                                e.target.style.display = 'none'
                            }}
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
