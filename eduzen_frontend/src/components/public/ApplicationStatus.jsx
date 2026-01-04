import React, { useState } from 'react';
import { FiMail, FiSearch, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import './ApplicationStatus.css';
import axios from 'axios';

const ApplicationStatus = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheck = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Veuillez entrer votre email');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email invalide');
            return;
        }

        setLoading(true);
        setError('');
        setStatus(null);

        try {
            // Check application status by email
            const response = await axios.get(`http://localhost:8096/api/formateurs/check-status?email=${email}`);
            setStatus(response.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Aucune demande trouvée pour cet email');
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = () => {
        if (!status) return null;

        if (status.enabled) {
            return {
                icon: <FiCheckCircle size={64} />,
                color: '#10b981', // Green
                title: 'Demande Acceptée',
                message: 'Félicitations! Votre demande a été acceptée. Vous pouvez maintenant vous connecter à votre compte.',
                action: (
                    <button className="status-action-btn accepted" onClick={() => navigate('/login')}>
                        Se connecter
                    </button>
                )
            };
        } else {
            return {
                icon: <FiClock size={64} />,
                color: '#f59e0b', // Orange
                title: 'En Attente de Validation',
                message: 'Votre compte a bien été créé mais est en attente de validation par un administrateur.',
                action: null
            };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="application-status-page">
            <PublicNavbar />

            <div className="status-container">
                <div className="status-content">
                    <div className="status-header">
                        <div className="header-icon">
                            <FiSearch size={48} />
                        </div>
                        <h1>Suivi de ma Demande</h1>
                        <p>Vérifiez le statut de votre candidature pour devenir expert formateur</p>
                    </div>

                    {!status ? (
                        <form onSubmit={handleCheck} className="status-form">
                            <div className="form-group">
                                <label htmlFor="email">
                                    <FiMail size={18} />
                                    Email utilisé lors de votre candidature
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    className={error ? 'error' : ''}
                                    placeholder="votre.email@example.com"
                                    disabled={loading}
                                />
                                {error && (
                                    <span className="error-message">
                                        <FiAlertCircle size={14} />
                                        {error}
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="check-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner"></div>
                                        Vérification...
                                    </>
                                ) : (
                                    <>
                                        <FiSearch size={20} />
                                        Vérifier le statut
                                    </>
                                )}
                            </button>

                            <p className="form-footer">
                                Pas encore candidaté? <a href="/become-expert">Devenir Expert</a>
                            </p>
                        </form>
                    ) : (
                        <div className="status-result">
                            <div className="status-icon" style={{ color: statusInfo.color }}>
                                {statusInfo.icon}
                            </div>
                            <h2 style={{ color: statusInfo.color }}>{statusInfo.title}</h2>
                            <p className="status-message">{statusInfo.message}</p>

                            <div className="status-details">
                                <div className="detail-item">
                                    <span className="detail-label">Email:</span>
                                    <span className="detail-value">{status.email}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Nom d'utilisateur:</span>
                                    <span className="detail-value">{status.username}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Statut:</span>
                                    <span className={`status-badge ${status.enabled ? 'accepted' : 'pending'}`}>
                                        {status.enabled ? 'Accepté' : 'En attente'}
                                    </span>
                                </div>
                            </div>

                            {statusInfo.action}

                            <button
                                className="back-btn"
                                onClick={() => {
                                    setStatus(null);
                                    setEmail('');
                                }}
                            >
                                Vérifier une autre demande
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationStatus;
