import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import './splashStyles.css';

export default function SplashScreen({ duration = 3000, onFinish }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onFinish) onFinish();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onFinish]);

    if (!visible) return null;

    return (
        <div className="splash-container">
            <img src={logo} alt="Logo" className="splash-logo animation-fade-scale" />
        </div>
    );
}
