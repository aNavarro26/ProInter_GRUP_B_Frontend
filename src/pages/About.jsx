import Navbar from '../components/Navbar';
import '../index.css';

export default function About() {
    return (
        <>
            <Navbar />
            <main className="about-page" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1>About Axion</h1>
                <p>
                    Welcome to <strong>Axion</strong>, your go‑to destination for the latest and greatest in consumer
                    technology. Whether you’re hunting for a budget‑friendly device or a top‑of‑the‑line flagship
                    powerhouse, we’ve got you covered.
                </p>
                <p>
                    Our mission is simple: to bring you cutting‑edge smartphones, tablets, audio gear and
                    wearables that fit every pocket and passion. We hand‑pick every product based on quality,
                    performance and value, so you can shop with confidence.
                </p>
                <p>
                    At Axion, we believe technology should be accessible and exciting. From affordable entry‑level
                    models to premium devices with all the bells and whistles, our curated selection makes it easy
                    to find exactly what you need. Join us as we explore the future of tech—one device at a time.
                </p>
                <h2>Why Choose Us?</h2>
                <ul>
                    <li><strong>Curated Selection:</strong> We only stock products that meet our high standards.</li>
                    <li><strong>Best Prices:</strong> Competitive pricing across all budgets, from entry‑level to flagship.</li>
                    <li><strong>Expert Support:</strong> Our team is here to help you make the right choice.</li>
                    <li><strong>Fast Shipping:</strong> Get your gear delivered quickly, no matter where you are.</li>
                </ul>
                <p>
                    Thank you for choosing Axion — we’re excited to help you power your world with the technology
                    of tomorrow, today.
                </p>
            </main>
        </>
    );
}
