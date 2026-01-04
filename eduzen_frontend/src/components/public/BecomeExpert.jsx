import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiFileText, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import './BecomeExpert.css';
import AuthService from '../../services/auth.service';

const BecomeExpert = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        competences: '',
        remarques: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Le nom d\'utilisateur est requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }

        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        if (!formData.competences.trim()) {
            newErrors.competences = 'Les compétences sont requises';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Use AuthService to register as formateur
            await AuthService.register(
                formData.username,
                formData.email,
                formData.password,
                'formateur',
                formData.competences
            );

            setSubmitSuccess(true);

            // Redirect to landing page after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (error) {
            console.error('Error submitting application:', error);
            setErrors({
                submit: error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="become-expert-page">
            <PublicNavbar />

            <div className="become-expert-container">
                <div className="become-expert-content">
                    {!submitSuccess ? (
                        <>
                            <div className="form-header">
                                <div className="header-icon">
                                    <FiUser size={48} />
                                </div>
                                <h1>Devenez Expert Formateur</h1>
                                <p>Partagez votre expertise et formez la prochaine génération de professionnels</p>
                            </div>

                            <form onSubmit={handleSubmit} className="expert-form">
                                {/* Username */}
                                <div className="form-group">
                                    <label htmlFor="username">
                                        <FiUser size={18} />
                                        Nom d'utilisateur
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={errors.username ? 'error' : ''}
                                        placeholder="Votre nom d'utilisateur"
                                    />
                                    {errors.username && (
                                        <span className="error-message">
                                            <FiAlertCircle size={14} />
                                            {errors.username}
                                        </span>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="form-group">
                                    <label htmlFor="email">
                                        <FiMail size={18} />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={errors.email ? 'error' : ''}
                                        placeholder="votre.email@example.com"
                                    />
                                    {errors.email && (
                                        <span className="error-message">
                                            <FiAlertCircle size={14} />
                                            {errors.email}
                                        </span>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="form-group">
                                    <label htmlFor="password">
                                        <FiLock size={18} />
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={errors.password ? 'error' : ''}
                                        placeholder="••••••••"
                                    />
                                    {errors.password && (
                                        <span className="error-message">
                                            <FiAlertCircle size={14} />
                                            {errors.password}
                                        </span>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">
                                        <FiLock size={18} />
                                        Confirmer le mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={errors.confirmPassword ? 'error' : ''}
                                        placeholder="••••••••"
                                    />
                                    {errors.confirmPassword && (
                                        <span className="error-message">
                                            <FiAlertCircle size={14} />
                                            {errors.confirmPassword}
                                        </span>
                                    )}
                                </div>

                                {/* Competences */}
                                <div className="form-group">
                                    <label htmlFor="competences">
                                        <FiFileText size={18} />
                                        Compétences
                                    </label>
                                    <textarea
                                        id="competences"
                                        name="competences"
                                        value={formData.competences}
                                        onChange={handleChange}
                                        className={errors.competences ? 'error' : ''}
                                        placeholder="Décrivez vos compétences et domaines d'expertise..."
                                        rows="4"
                                    />
                                    {errors.competences && (
                                        <span className="error-message">
                                            <FiAlertCircle size={14} />
                                            {errors.competences}
                                        </span>
                                    )}
                                </div>

                                {/* Remarques */}
                                <div className="form-group">
                                    <label htmlFor="remarques">
                                        <FiFileText size={18} />
                                        Remarques (optionnel)
                                    </label>
                                    <textarea
                                        id="remarques"
                                        name="remarques"
                                        value={formData.remarques}
                                        onChange={handleChange}
                                        placeholder="Informations supplémentaires..."
                                        rows="3"
                                    />
                                </div>

                                {/* Submit Error */}
                                {errors.submit && (
                                    <div className="submit-error">
                                        <FiAlertCircle size={20} />
                                        {errors.submit}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Envoi en cours...' : 'Soumettre ma candidature'}
                                </button>

                                <p className="form-footer">
                                    Déjà inscrit? <a href="/login">Se connecter</a>
                                </p>
                            </form>
                        </>
                    ) : (
                        <div className="success-message">
                            <div className="success-icon">
                                <FiCheck size={64} />
                            </div>
                            <h2>Candidature envoyée avec succès!</h2>
                            <p>
                                Votre demande pour devenir expert formateur a été soumise.
                                Un administrateur examinera votre candidature et vous recevrez un email de confirmation.
                            </p>
                            <div className="success-info">
                                <p>
                                    <strong>Email:</strong> {formData.email}
                                </p>
                                <p className="info-text">
                                    ⏳ Votre compte sera activé après approbation par l'administrateur
                                </p>
                                <p className="info-text">
                                    Vous pouvez vérifier le statut de votre demande à tout moment via la page d'accueil
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BecomeExpert;
