import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import { getProducts } from '../../services/productService';
import '../../index.css';
import './CategoryPage.css';
import logo from '../../assets/logo.png'

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
    const [loading, setLoading] = useState(true);
    const [seriesFilter, setSeriesFilter] = useState(new Set());
    const [attrFilter, setAttrFilter] = useState({});
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [ratingMin, setRatingMin] = useState(0);
    const [sortOrder, setSortOrder] = useState('none');
    const [sortName, setSortName] = useState('none');


    useEffect(() => {
        setLoading(true);
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
            .catch(console.error)
            .finally(() => setLoading(false));
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

    useEffect(() => {
        let temp = [...allProducts];

        if (seriesFilter.size) {
            temp = temp.filter(p => seriesFilter.has(p.series));
        }

        for (const [attr, vals] of Object.entries(attrFilter)) {
            if (vals.size) {
                temp = temp.filter(p =>
                    (p.attributes || []).some(pa =>
                        pa.attribute.name === attr && vals.has(pa.value)
                    )
                );
            }
        }

        temp = temp.filter(p =>
            p.price >= priceRange[0] &&
            p.price <= priceRange[1]
        );

        temp = temp.filter(p => (p.rating || 0) >= ratingMin);

        if (sortName === 'az') {
            temp.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortName === 'za') {
            temp.sort((a, b) => b.name.localeCompare(a.name));
        }
        else if (sortOrder === 'asc') {
            temp.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            temp.sort((a, b) => b.price - a.price);
        }

        setFiltered(temp);
    }, [allProducts, seriesFilter, attrFilter, priceRange, ratingMin, sortOrder, sortName]);

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

    if (loading) {
        return (
            <div className="category-loader">
                <img src={logo} alt="Loading..." className="logo-spinner" />
            </div>
        );
    }
    return (
        <>
            <div className="category-wrapper">
                <div className="category-page">
                    <aside className="filters">
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
                        <select
                            value={sortName}
                            onChange={e => setSortName(e.target.value)}
                            className='sort-select'
                        >
                            <option value="none">Order by Name</option>
                            <option value="az">Name: A → Z</option>
                            <option value="za">Name: Z → A</option>
                        </select>

                        <select
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                            className='sort-select'
                        >
                            <option value="none">Order by Price</option>
                            <option value="asc">Price: Low to High</option>
                            <option value="desc">Price: High to Low</option>
                        </select>
                        <h3>Price</h3>
                        <div className="price-range">
                            <input
                                type="number"
                                value={priceRange[0]}
                                onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                            />
                            –
                            <input
                                type="number"
                                value={priceRange[1]}
                                onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                            />
                        </div>

                        <h3>Rating ≥ {ratingMin}</h3>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={ratingMin}
                            onChange={e => setRatingMin(+e.target.value)}
                        />

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
            </div>
        </>
    );
}
