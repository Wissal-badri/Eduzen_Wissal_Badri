import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FormationService from "../services/formation.service";
import IndividuService from "../services/individu.service";

const Home = () => {
    const [formations, setFormations] = useState([]);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        dateNaissance: "",
        ville: "",
        email: "",
        telephone: ""
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        FormationService.getAllFormations().then(res => {
            // Filter formations meant for individuals
            const individuFormations = res.data.filter(f => f.pourIndividus === true);
            setFormations(individuFormations);
        });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            ...formData,
            formation: { id: selectedFormation.id }
        };

        IndividuService.register(payload).then(
            () => {
                setMessage({ text: "Inscription réussie ! Nous vous contacterons bientôt.", type: "success" });
                setFormData({ nom: "", prenom: "", dateNaissance: "", ville: "", email: "", telephone: "" });
                setSelectedFormation(null);
                setLoading(false);
            },
            (error) => {
                setMessage({ text: "Erreur lors de l'inscription. Veuillez réessayer.", type: "error" });
                setLoading(false);
            }
        );
    };

    return (
        <div className="home-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                <h1 className="text-gradient font-black" style={{ fontSize: '2.5rem' }}>EduZen</h1>
                <Link to="/login" className="btn btn-outline">Accès Admin / Formateur</Link>
            </header>

            <section className="hero" style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Formez-vous avec les meilleurs</h2>
                <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    Découvrez nos formations certifiantes pour booster votre carrière. Inscrivez-vous dès aujourd'hui.
                </p>
            </section>

            <section className="formations-list">
                <h3 className="font-bold" style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>Nos Formations pour Individus</h3>
                <div className="trainings-grid">
                    {formations.length === 0 ? (
                        <p className="text-muted">Aucune formation disponible pour le moment.</p>
                    ) : (
                        formations.map(f => (
                            <div key={f.id} className="training-card glass">
                                <div className="training-badge">{f.nombreHeures} Heures</div>
                                <h3>{f.titre}</h3>
                                <p className="training-desc">{f.objectifs}</p>
                                <div className="training-footer">
                                    <span className="price">{f.cout} MAD</span>
                                    <button className="btn btn-primary" onClick={() => setSelectedFormation(f)}>S'inscrire</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {selectedFormation && (
                <div className="modal-overlay" onClick={() => setSelectedFormation(null)}>
                    <div className="modal-content glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <h2 className="text-gradient font-black" style={{ marginBottom: '1.5rem' }}>Inscription : {selectedFormation.titre}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                            <div className="input-group">
                                <label className="input-label">Nom</label>
                                <input type="text" name="nom" className="input-field" value={formData.nom} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Prénom</label>
                                <input type="text" name="prenom" className="input-field" value={formData.prenom} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Date de naissance</label>
                                <input type="date" name="dateNaissance" className="input-field" value={formData.dateNaissance} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Ville</label>
                                <input type="text" name="ville" className="input-field" value={formData.ville} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Email</label>
                                <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Téléphone</label>
                                <input type="tel" name="telephone" className="input-field" value={formData.telephone} onChange={handleChange} required />
                            </div>
                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSelectedFormation(null)}>Annuler</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? "Envoi..." : "Confirmer l'inscription"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {message.text && (
                <div className="modal-overlay" onClick={() => setMessage({ text: "", type: "" })}>
                    <div className="modal-content glass" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{message.type === 'success' ? '✅' : '❌'}</div>
                        <h3 className="font-bold" style={{ marginBottom: '1rem' }}>{message.type === 'success' ? 'Succès' : 'Erreur'}</h3>
                        <p className="text-muted">{message.text}</p>
                        <button className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }} onClick={() => setMessage({ text: "", type: "" })}>D'accord</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
