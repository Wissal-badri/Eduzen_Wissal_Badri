import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiInfo, FiCheckCircle, FiHome } from 'react-icons/fi';
import AuthService from "../services/auth.service";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("individu");
    const [competences, setCompetences] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleAuth = (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        if (isLogin) {
            AuthService.login(username, password).then(
                () => {
                    navigate("/dashboard");
                    window.location.reload();
                },
                (error) => {
                    console.error("Login error details:", error);
                    console.error("Error response:", error.response);

                    let resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

                    // Check if it's a 401 error - could be disabled account
                    if (error.response?.status === 401) {
                        if (resMessage.toLowerCase().includes('disabled') || resMessage.toLowerCase().includes('not enabled')) {
                            resMessage = "⏳ Votre compte est en attente d'approbation par un administrateur. Vous recevrez un email une fois approuvé.";
                        } else {
                            resMessage = `❌ Identifiants incorrects. Vérifiez votre nom d'utilisateur et mot de passe.\n\nDétails: ${resMessage}`;
                        }
                    }

                    setLoading(false);
                    setMessage(resMessage);
                }
            );
        } else {
            AuthService.register(username, email, password, role, competences).then(
                (response) => {
                    let successMsg = response.data.message || "Registration successful! Please login.";

                    // Special message for formateurs
                    if (role === 'formateur') {
                        successMsg = "✅ Inscription réussie ! Votre demande a été envoyée à l'administrateur. Vous pourrez vous connecter une fois votre compte approuvé (vous recevrez un email).";
                    }

                    setMessage(successMsg);
                    setSuccessful(true);
                    setLoading(false);
                    setTimeout(() => {
                        setIsLogin(true);
                        setSuccessful(false);
                        setMessage("");
                    }, role === 'formateur' ? 5000 : 2000); // Longer display for formateurs
                },
                (error) => {
                    const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                    setSuccessful(false);
                    setLoading(false);
                    setMessage(resMessage);
                }
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="glass card auth-card">
                <div className="auth-toggle">
                    <button
                        className="auth-toggle-btn"
                        style={{ position: 'absolute', left: '-60px', top: '20px', background: 'transparent', width: 'auto', padding: '0.5rem', opacity: 0.7 }}
                        onClick={() => navigate("/")}
                        title="Retour à l'accueil"
                    >
                        <FiHome size={24} />
                    </button>
                    <button
                        className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(true); setMessage(""); }}
                    >
                        Login
                    </button>
                    <button
                        className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(false); setMessage(""); }}
                    >
                        Register
                    </button>
                </div>

                <div className="auth-header">
                    <h2 className="text-gradient font-black auth-title">
                        {isLogin ? "Welcome Back" : "Join EduZen"}
                    </h2>
                    <p className="text-muted auth-subtitle">
                        {isLogin ? "Enter your credentials to access your dashboard" : "Create your account and start your journey with us"}
                    </p>
                </div>

                <form onSubmit={handleAuth}>
                    {!isLogin && (
                        <>
                            <div className="role-selector">
                                <button
                                    type="button"
                                    className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                                    onClick={() => setRole('admin')}
                                >
                                    Admin
                                </button>
                                <button
                                    type="button"
                                    className={`role-btn ${role === 'formateur' ? 'active' : ''}`}
                                    onClick={() => setRole('formateur')}
                                >
                                    Formateur
                                </button>
                                <button
                                    type="button"
                                    className={`role-btn ${role === 'assistant' ? 'active' : ''}`}
                                    onClick={() => setRole('assistant')}
                                >
                                    Assistant
                                </button>
                                <button
                                    type="button"
                                    className={`role-btn ${role === 'individu' ? 'active' : ''}`}
                                    onClick={() => setRole('individu')}
                                >
                                    Individu
                                </button>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            {role === 'formateur' && (
                                <div className="input-group">
                                    <label className="input-label">Mots-clés (Compétences)</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={competences}
                                        onChange={(e) => setCompetences(e.target.value)}
                                        placeholder="Ex: Spring Boot, React, DevOps..."
                                        required
                                    />
                                    <small className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>
                                        Séparez vos mots-clés par des virgules.
                                    </small>
                                </div>
                            )}
                        </>
                    )}

                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: '2rem' }}>
                        <label className="input-label">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transition: 'all 0.3s ease' }}>
                                    <defs>
                                        <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#00d4ff" />
                                            <stop offset="100%" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                    {showPassword ? (
                                        <>
                                            <path
                                                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                                                stroke="url(#eyeGradient)"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <line
                                                x1="1" y1="1" x2="23" y2="23"
                                                stroke="url(#eyeGradient)"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <path
                                                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                                stroke="url(#eyeGradient)"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <circle
                                                cx="12" cy="12" r="3"
                                                stroke="url(#eyeGradient)"
                                                strokeWidth="2"
                                                fill="rgba(0, 212, 255, 0.1)"
                                            />
                                        </>
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div
                            className={`auth-alert ${successful ? 'auth-alert-success' : 'auth-alert-error'}`}
                            style={{
                                whiteSpace: 'pre-line',
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                fontSize: '0.9rem',
                                lineHeight: '1.6',
                                position: 'relative',
                                border: successful ? '2px solid #10b981' : '2px solid #ef4444',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                        >
                            <button
                                onClick={() => setMessage('')}
                                style={{
                                    position: 'absolute',
                                    top: '0.5rem',
                                    right: '0.5rem',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    lineHeight: '1',
                                    color: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                title="Fermer"
                            >
                                ×
                            </button>
                            {message}
                        </div>
                    )}

                    <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
                        {loading && <span className="spinner"></span>}
                        <span>{isLogin ? "Sign In" : "Create Account"}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
