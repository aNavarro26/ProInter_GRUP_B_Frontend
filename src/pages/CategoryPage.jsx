import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import '../index.css';

const ATTRIBUTES_BY_CATEGORY = {
    phone: ['Processor', 'Noise Cancelling', 'Storage', 'Battery Life', 'Screen Size'],
    audio: ['Noise Cancelling', 'Battery Life'],
    tablet: ['Processor', 'Storage', 'Screen Size', 'Rating'],
    wearables: ['Battery Life', 'Storage']
};

export default function CategoryPage() {
    const { name } = useParams();
    const [allProducts, setAllProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [seriesFilter, setSeriesFilter] = useState(new Set());
    const [attrFilter, setAttrFilter] = useState({});
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [ratingMin, setRatingMin] = useState(0);

    // initial products from this category
    useEffect(() => {
        getProducts()
            .then(all => {
                const cat = all.filter(p =>
                    p.category.name.toLowerCase() === name
                );
                setAllProducts(cat);
                if (cat.length) {
                    const prices = cat.map(p => p.price);
                    setPriceRange([Math.min(...prices), Math.max(...prices)]);
                }
            })
            .catch(console.error);
    }, [name]);

    const seriesOptions = useMemo(() => {
        return Array.from(new Set(allProducts.map(p => p.series)));
    }, [allProducts]);

    const attrOptions = useMemo(() => {
        const map = {};
        const attrs = ATTRIBUTES_BY_CATEGORY[name] || [];
        attrs.forEach(attrName => {
            const vals = new Set();
            allProducts.forEach(p => {
                (p.attributes || []).forEach(pa => {
                    if (pa.attribute.name === attrName) {
                        vals.add(pa.value);
                    }
                });
            });
            map[attrName] = Array.from(vals).sort();
        });
        return map;
    }, [allProducts, name]);

    // Apply all filters
    useEffect(() => {
        let temp = [...allProducts];

        // Series
        if (seriesFilter.size) {
            temp = temp.filter(p => seriesFilter.has(p.series));
        }

        // Atributtes
        for (const [attr, vals] of Object.entries(attrFilter)) {
            if (vals.size) {
                temp = temp.filter(p =>
                    (p.attributes || []).some(pa =>
                        pa.attribute.name === attr && vals.has(pa.value)
                    )
                );
            }
        }

        // Price
        temp = temp.filter(p =>
            p.price >= priceRange[0] &&
            p.price <= priceRange[1]
        );

        // Rating
        temp = temp.filter(p =>
            (p.rating || 0) >= ratingMin
        );

        setFiltered(temp);
    }, [allProducts, seriesFilter, attrFilter, priceRange, ratingMin]);

    // Handlers
    const toggleSeries = s => {
        const next = new Set(seriesFilter);
        next.has(s) ? next.delete(s) : next.add(s);
        setSeriesFilter(next);
    };
    const toggleAttr = (attr, val) => {
        const next = { ...attrFilter };
        next[attr] = next[attr] || new Set();
        next[attr].has(val) ? next[attr].delete(val) : next[attr].add(val);
        setAttrFilter(next);
    };

    return (
        <>
            <div className="category-page">
                <aside className="filters">
                    {/* Series */}
                    <h3>Series</h3>
                    {seriesOptions.map(s => (
                        <label key={s}>
                            <input
                                type="checkbox"
                                checked={seriesFilter.has(s)}
                                onChange={() => toggleSeries(s)}
                            />
                            {s}
                        </label>
                    ))}

                    {/* Price */}
                    <h3>Price</h3>
                    <div>
                        <input
                            type="number"
                            value={priceRange[0]}
                            onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                            style={{ width: '70px', marginRight: '0.5rem' }}
                        />
                        –
                        <input
                            type="number"
                            value={priceRange[1]}
                            onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                            style={{ width: '70px', marginLeft: '0.5rem' }}
                        />
                    </div>

                    {/* Rating */}
                    <h3>Rating ≥ {ratingMin}</h3>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={ratingMin}
                        onChange={e => setRatingMin(+e.target.value)}
                    />

                    {/* Atributtes statics by category */}
                    {Object.entries(attrOptions).map(([attr, vals]) => (
                        <div key={attr}>
                            <h3>{attr}</h3>
                            {vals.map(v => (
                                <label key={v}>
                                    <input
                                        type="checkbox"
                                        checked={attrFilter[attr]?.has(v) || false}
                                        onChange={() => toggleAttr(attr, v)}
                                    />
                                    {v}
                                </label>
                            ))}
                        </div>
                    ))}
                </aside>

                <section className="product-grid">
                    {filtered.map(p => (
                        <ProductCard key={p.product_id} product={p} />
                    ))}
                    {filtered.length === 0 && (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                            No products match these filters.
                        </p>
                    )}
                </section>
            </div>
        </>
    );
}
