import React, { useState } from 'react';
import { FiUser, FiStar, FiMenu, FiX, FiBookOpen, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './PublicNavbar.css';

const PublicNavbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <nav className="public-navbar">
            <div className="navbar-container">
                {/* Logo */}
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    <FiBookOpen className="logo-icon" size={32} />
                    <span className="logo-text">Eduzen</span>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    <a href="#formations" onClick={(e) => { e.preventDefault(); document.getElementById('formations')?.scrollIntoView({ behavior: 'smooth' }); }} className="nav-link">Formations</a>
                    <a href="#home" onClick={(e) => { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }} className="nav-link">À propos</a>
                    <a href="#home" onClick={(e) => { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }} className="nav-link">Contact</a>
                </div>

                {/* Actions */}
                <div className="navbar-actions">
                    <button
                        className="btn-status"
                        onClick={() => navigate('/check-application-status')}
                        title="Vérifier le statut de ma demande d'expert"
                    >
                        <FiSearch size={18} />
                        <span>Suivi Demande</span>
                    </button>
                    <button
                        className="btn-expert"
                        onClick={() => navigate('/become-expert')}
                    >
                        <FiStar size={18} />
                        <span>Devenir Expert</span>
                    </button>
                    <button
                        className="btn-login"
                        onClick={() => navigate('/login')}
                    >
                        <FiUser size={18} />
                        <span>Connexion</span>
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu">
                    <a href="#formations" className="mobile-link">Formations</a>
                    <a href="#about" className="mobile-link">À propos</a>
                    <a href="#contact" className="mobile-link">Contact</a>
                    <div className="mobile-actions">
                        <button
                            className="btn-status mobile"
                            onClick={() => { navigate('/check-application-status'); setMobileMenuOpen(false); }}
                        >
                            <FiSearch size={18} />
                            <span>Suivi Demande</span>
                        </button>
                        <button
                            className="btn-expert mobile"
                            onClick={() => { navigate('/become-expert'); setMobileMenuOpen(false); }}
                        >
                            <FiStar size={18} />
                            <span>Devenir Expert</span>
                        </button>
                        <button
                            className="btn-login mobile"
                            onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                        >
                            <FiUser size={18} />
                            <span>Connexion</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default PublicNavbar;
