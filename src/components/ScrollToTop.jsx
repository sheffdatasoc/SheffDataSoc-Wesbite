import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import './ScrollToTop.css';

const ScrollToTop = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const { pathname } = useLocation();

    // Hide on BlogDetail and GuideDetail since they have their own FABs
    // Pattern: /blog/:id and /guides/:id
    const isExcluded = pathname.startsWith('/blog/') || pathname.startsWith('/guides/');

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            setShowScrollTop(scrollTop > 400);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (isExcluded) return null;

    return (
        <button
            className={`scroll-to-top-btn ${showScrollTop ? 'visible' : ''}`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <ArrowUp size={24} />
        </button>
    );
};

export default ScrollToTop;
