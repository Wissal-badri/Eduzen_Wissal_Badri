import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("individu");
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
                    const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                    setLoading(false);
                    setMessage(resMessage);
                }
            );
        } else {
            AuthService.register(username, email, password, role).then(
                (response) => {
                    setMessage(response.data.message || "Registration successful! Please login.");
                    setSuccessful(true);
                    setLoading(false);
                    setTimeout(() => {
                        setIsLogin(true);
                        setSuccessful(false);
                        setMessage("");
                    }, 2000);
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
        <div style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass card" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem' }}>
                <div className="auth-toggle">
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

                <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                    <h2 className="text-gradient font-black" style={{ fontSize: '2.1rem', marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>
                        {isLogin ? "Welcome Back" : "Join EduZen"}
                    </h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
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
                        <div style={{ position: 'relative' }}>
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
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    padding: '0.4rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(4px)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.4)';
                                    e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
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
                        <div style={{
                            padding: '1rem',
                            borderRadius: '0.8rem',
                            marginBottom: '2rem',
                            backgroundColor: successful ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                            color: successful ? 'var(--success)' : 'var(--error)',
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            border: `1px solid ${successful ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            backdropFilter: 'blur(5px)'
                        }}>
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
