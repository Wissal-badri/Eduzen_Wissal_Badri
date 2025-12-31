import React, { useState } from "react";
import EvaluationService from "../../services/evaluation.service";

const EvaluationModal = ({ formation, onClose, onSuccess }) => {
    const [ratings, setRatings] = useState({
        qualitePedagogique: 5,
        rythme: 5,
        supportCours: 5,
        maitriseSujet: 5,
        commentaires: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleRatingChange = (field, value) => {
        setRatings({ ...ratings, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await EvaluationService.submitEvaluation(formation.id, ratings);
            setMessage("Merci pour votre évaluation !");
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error submitting evaluation:", error);
            setMessage("Une erreur est survenue lors de l'envoi.");
        }
        setLoading(false);
    };

    const renderStars = (field) => {
        return (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => handleRatingChange(field, star)}
                        style={{
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: star <= ratings[field] ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1300 }}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{
                maxWidth: '500px',
                padding: '2.5rem',
                borderRadius: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
                    <h2 className="text-gradient font-black" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                        Évaluer la formation
                    </h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {formation.titre}
                    </p>
                </div>

                {message ? (
                    <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: message.includes("Merci") ? '#10b981' : '#ef4444',
                        background: message.includes("Merci") ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '1rem',
                        border: `1px solid ${message.includes("Merci") ? '#10b981' : '#ef4444'}`
                    }}>
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>
                                Qualité pédagogique
                            </label>
                            {renderStars('qualitePedagogique')}
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>
                                Rythme de la formation
                            </label>
                            {renderStars('rythme')}
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>
                                Support de cours et TP
                            </label>
                            {renderStars('supportCours')}
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>
                                Maîtrise du sujet par le formateur
                            </label>
                            {renderStars('maitriseSujet')}
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>
                                Commentaires (optionnel)
                            </label>
                            <textarea
                                className="form-control glass"
                                value={ratings.commentaires}
                                onChange={(e) => handleRatingChange('commentaires', e.target.value)}
                                style={{
                                    width: '100%',
                                    minHeight: '100px',
                                    padding: '1rem',
                                    borderRadius: '1rem',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    resize: 'vertical'
                                }}
                                placeholder="Votre avis nous intéresse..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={onClose}
                                style={{ flex: 1 }}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{
                                    flex: 2,
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)'
                                }}
                            >
                                {loading ? "Envoi..." : "Envoyer l'évaluation"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EvaluationModal;
