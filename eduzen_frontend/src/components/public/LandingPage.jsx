import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiBookOpen, FiClock, FiUsers, FiArrowRight, FiMessageSquare, FiTrendingUp, FiCode, FiDatabase, FiBriefcase } from 'react-icons/fi';
import { MdDesignServices, MdSettings } from 'react-icons/md';
import FormationService from '../../services/formation.service';
import FormateurService from '../../services/formateur.service';
import InscriptionService from '../../services/inscription.service';
import PublicNavbar from './PublicNavbar';
import './LandingPage.css';

const LandingPage = () => {
    const [formations, setFormations] = useState([]);
    const [filteredFormations, setFilteredFormations] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [studentCount, setStudentCount] = useState(0);
    const [expertCount, setExpertCount] = useState(0);

    // Domaines de formation
    const domains = [
        { id: 'all', name: 'Toutes les formations', Icon: FiBookOpen },
        { id: 'communication', name: 'Communication', Icon: FiMessageSquare },
        { id: 'marketing', name: 'Marketing', Icon: FiTrendingUp },
        { id: 'design', name: 'Graphic Design', Icon: MdDesignServices },
        { id: 'devops', name: 'DevOps', Icon: MdSettings },
        { id: 'web', name: 'Développement Web', Icon: FiCode },
        { id: 'data', name: 'Data Science', Icon: FiDatabase },
        { id: 'management', name: 'Management', Icon: FiBriefcase }
    ];

    useEffect(() => {
        loadFormations();
        loadStats();
    }, []);

    useEffect(() => {
        filterFormations();
    }, [formations, selectedDomain, searchQuery]);

    const loadFormations = () => {
        console.log('🔄 Loading formations from API...');
        FormationService.getAllFormationsPublic()
            .then(res => {
                console.log('✅ API Response received:', res);
                console.log('📊 Raw data:', res.data);
                console.log('📈 Number of formations:', res.data?.length);

                // Filter only open formations
                const openFormations = res.data.filter(f => f.statut === 'OUVERTE' || f.pourIndividus);
                console.log('✅ Filtered formations (OUVERTE or pourIndividus):', openFormations.length);
                console.log('📋 Formations:', openFormations);

                setFormations(openFormations);
            })
            .catch(err => {
                console.error('❌ Error loading formations:', err);
                console.error('❌ Error response:', err.response);
                console.error('❌ Error message:', err.message);
            });
    };

    const loadStats = () => {
        // Use InscriptionService (enrollments) to represent "Étudiants"
        InscriptionService.getPublicCount()
            .then(res => {
                console.log('👥 Inscription count:', res.data);
                setStudentCount(res.data);
            })
            .catch(err => console.error('❌ Error loading inscription count:', err));

        FormateurService.getPublicCount()
            .then(res => {
                console.log('👨‍🏫 Expert count:', res.data);
                setExpertCount(res.data);
            })
            .catch(err => console.error('❌ Error loading expert count:', err));
    };

    const filterFormations = () => {
        let filtered = formations;

        // Filter by domain - more flexible matching
        if (selectedDomain !== 'all') {
            filtered = filtered.filter(f => {
                if (!f.categorie) return false;

                const domaineLower = f.categorie.toLowerCase();
                const selectedLower = selectedDomain.toLowerCase();

                // Exact match or partial match
                return domaineLower === selectedLower ||
                    domaineLower.includes(selectedLower) ||
                    selectedLower.includes(domaineLower);
            });
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(f =>
                f.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.categorie?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredFormations(filtered);
    };

    const handleFormationClick = (formation) => {
        setSelectedFormation(formation);
        setShowSignupModal(true);
    };

    return (
        <div className="landing-page">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="hero-section" id="home">
                <div className="hero-content">
                    <div className="hero-badge">
                        <FiBookOpen style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Plateforme de Formation Professionnelle
                    </div>
                    <h1 className="hero-title">
                        Développez vos <span className="gradient-text">Compétences</span>
                        <br />avec Eduzen
                    </h1>
                    <p className="hero-description">
                        Accédez à des formations de qualité dispensées par des experts dans leur domaine.
                    </p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-number">{formations.length}+</div>
                            <div className="stat-label">Formations</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{studentCount}+</div>
                            <div className="stat-label">Étudiants</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{expertCount}+</div>
                            <div className="stat-label">Experts</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="filters-section">
                <div className="container">
                    {/* Search Bar */}
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher une formation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Domain Filters */}
                    <div className="domain-filters">
                        {domains.map(domain => (
                            <button
                                key={domain.id}
                                className={`domain-btn ${selectedDomain === domain.id ? 'active' : ''}`}
                                onClick={() => setSelectedDomain(domain.id)}
                            >
                                <domain.Icon className="domain-icon" size={20} />
                                <span className="domain-name">{domain.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Formations Grid */}
            <section className="formations-section" id="formations">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            {selectedDomain === 'all' ? 'Toutes nos formations' : `Formations en ${domains.find(d => d.id === selectedDomain)?.name}`}
                        </h2>
                        <p className="section-subtitle">
                            {filteredFormations.length} formation{filteredFormations.length > 1 ? 's' : ''} disponible{filteredFormations.length > 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="formations-grid">
                        {filteredFormations.map(formation => (
                            <div
                                key={formation.id}
                                className="formation-card"
                                onClick={() => handleFormationClick(formation)}
                            >
                                <div className="formation-header">
                                    <div className="formation-badge">{formation.categorie || 'Formation'}</div>
                                    <div className="formation-price">
                                        {formation.cout ? `${formation.cout} DH` : 'Gratuit'}
                                    </div>
                                </div>

                                <h3 className="formation-title">{formation.titre}</h3>
                                <p className="formation-description">
                                    {formation.description?.substring(0, 120)}...
                                </p>

                                <div className="formation-meta">
                                    <div className="meta-item">
                                        <FiClock size={16} />
                                        <span>{formation.dureeEnHeures}h</span>
                                    </div>
                                    <div className="meta-item">
                                        <FiUsers size={16} />
                                        <span>{formation.formateur?.user?.username || 'Expert'}</span>
                                    </div>
                                </div>

                                <button className="formation-cta">
                                    En savoir plus
                                    <FiArrowRight />
                                </button>
                            </div>
                        ))}
                    </div>

                    {filteredFormations.length === 0 && (
                        <div className="no-results">
                            <FiBookOpen size={64} />
                            <h3>Aucune formation trouvée</h3>
                            <p>Essayez de modifier vos critères de recherche</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Signup Modal */}
            {showSignupModal && (
                <div className="modal-overlay" onClick={() => setShowSignupModal(false)}>
                    <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowSignupModal(false)}>×</button>

                        <div className="modal-icon">
                            <FiBookOpen size={64} style={{ color: '#06b6d4' }} />
                        </div>
                        <h2 className="modal-title">Rejoignez Eduzen</h2>
                        <p className="modal-description">
                            Inscrivez-vous à notre plateforme pour avoir l'exclusivité de passer nos formations
                            et développer vos compétences avec les meilleurs experts.
                        </p>

                        {selectedFormation && (
                            <div className="selected-formation-info">
                                <h4>Formation sélectionnée:</h4>
                                <p><strong>{selectedFormation.titre}</strong></p>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button className="btn-primary" onClick={() => window.location.href = '/login'}>
                                Se connecter
                            </button>
                            <button className="btn-secondary" onClick={() => window.location.href = '/register'}>
                                Créer un compte
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h3>Eduzen</h3>
                            <p>Votre partenaire pour la formation professionnelle</p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Formations</h4>
                                <a href="#formations" onClick={(e) => { e.preventDefault(); document.getElementById('formations')?.scrollIntoView({ behavior: 'smooth' }); }}>Communication</a>
                                <a href="#formations" onClick={(e) => { e.preventDefault(); document.getElementById('formations')?.scrollIntoView({ behavior: 'smooth' }); }}>Marketing</a>
                                <a href="#formations" onClick={(e) => { e.preventDefault(); document.getElementById('formations')?.scrollIntoView({ behavior: 'smooth' }); }}>Design</a>
                            </div>
                            <div className="footer-column">
                                <h4>À propos</h4>
                                <a href="#home" onClick={(e) => { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }}>Notre mission</a>
                                <a href="#formations" onClick={(e) => { e.preventDefault(); document.getElementById('formations')?.scrollIntoView({ behavior: 'smooth' }); }}>Nos experts</a>
                                <a href="#home" onClick={(e) => { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 Eduzen. Tous droits réservés. Développé par <strong>BADRI Wissal</strong></p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
