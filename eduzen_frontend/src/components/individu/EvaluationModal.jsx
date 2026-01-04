import React, { useState } from "react";
import { FiStar, FiX, FiCheckCircle, FiAlertCircle, FiActivity } from "react-icons/fi";
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
            <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => handleRatingChange(field, star)}
                        style={{
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            color: star <= ratings[field] ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)',
                            transition: 'all 0.2s ease',
                            transform: star <= ratings[field] ? 'scale(1.1)' : 'scale(1)'
                        }}
                    >
                        {star <= ratings[field] ? <FiStar fill="#f59e0b" /> : <FiStar />}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1300 }}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{
                maxWidth: '440px',
                padding: '2rem',
                borderRadius: '1.2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#f59e0b'
                        }}>
                            <FiStar size={20} fill="#f59e0b" />
                        </div>
                        <div>
                            <h2 className="text-gradient font-black" style={{ fontSize: '1.3rem', marginBottom: '0.1rem' }}>
                                Évaluer
                            </h2>
                            <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                {formation.titre}
                            </p>
                        </div>
                    </div>
                    <button className="btn-close" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>
                        <FiX />
                    </button>
                </div>

                {message ? (
                    <div className="fade-in" style={{
                        padding: '1.5rem',
                        textAlign: 'center',
                        color: message.includes("Merci") ? '#10b981' : '#f87171',
                        background: message.includes("Merci") ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '1rem',
                        border: `1px solid ${message.includes("Merci") ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{message.includes("Merci") ? <FiCheckCircle style={{ margin: '0 auto' }} /> : <FiAlertCircle style={{ margin: '0 auto' }} />}</div>
                        <p style={{ fontWeight: '600' }}>{message}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: '1rem',
                            background: 'rgba(255,255,255,0.02)',
                            padding: '1.2rem',
                            borderRadius: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            {[
                                { label: 'Qualité pédagogique', field: 'qualitePedagogique' },
                                { label: 'Rythme de la formation', field: 'rythme' },
                                { label: 'Support de cours et TP', field: 'supportCours' },
                                { label: 'Maîtrise du formateur', field: 'maitriseSujet' }
                            ].map(item => (
                                <div key={item.field} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label className="text-muted" style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                                        {item.label}
                                    </label>
                                    {renderStars(item.field)}
                                </div>
                            ))}
                        </div>

                        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="input-label" style={{ fontSize: '0.75rem' }}>Commentaires (optionnel)</label>
                            <textarea
                                className="input-field"
                                value={ratings.commentaires}
                                onChange={(e) => handleRatingChange('commentaires', e.target.value)}
                                style={{
                                    width: '100%',
                                    minHeight: '80px',
                                    padding: '0.8rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    fontSize: '0.85rem'
                                }}
                                placeholder="Votre avis nous intéresse..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={onClose}
                                style={{ flex: 1, padding: '0.7rem' }}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{
                                    flex: 2,
                                    padding: '0.7rem',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    boxShadow: '0 8px 16px rgba(245, 158, 11, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {loading ? <FiActivity className="spin" /> : <FiStar />}
                                <span>{loading ? "Envoi..." : "Envoyer"}</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EvaluationModal;
