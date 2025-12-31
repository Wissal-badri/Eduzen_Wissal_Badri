import React, { useState, useEffect } from "react";
import AuthService from "../../services/auth.service";

const PasswordManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        setLoading(true);
        setError("");
        AuthService.adminGetAllUsers()
            .then((response) => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading users:", err);
                setError("Erreur lors du chargement des utilisateurs");
                setLoading(false);
            });
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openResetModal = (user) => {
        setSelectedUser(user);
        setNewPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setMessage({ text: "", type: "" });
    };

    const closeModal = () => {
        setSelectedUser(null);
        setNewPassword("");
        setConfirmPassword("");
        setMessage({ text: "", type: "" });
    };

    const handleResetPassword = (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            setMessage({ text: "Le mot de passe doit contenir au moins 6 caractères", type: "error" });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ text: "Les mots de passe ne correspondent pas", type: "error" });
            return;
        }

        setIsSubmitting(true);
        AuthService.adminResetPassword(selectedUser.id, newPassword)
            .then((response) => {
                setMessage({ text: `✓ Mot de passe de ${selectedUser.username} réinitialisé avec succès!`, type: "success" });
                setIsSubmitting(false);
                setTimeout(() => {
                    closeModal();
                    loadUsers(); // Refresh the list
                }, 2000);
            })
            .catch((err) => {
                console.error("Reset error:", err);
                const msg = err.response?.data?.message || "Erreur lors de la réinitialisation";
                setMessage({ text: msg, type: "error" });
                setIsSubmitting(false);
            });
    };

    const getRoleBadgeStyle = (role) => {
        const styles = {
            'ADMIN': { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' },
            'FORMATEUR': { background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' },
            'ASSISTANT': { background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee', border: '1px solid rgba(34, 211, 238, 0.3)' },
            'INDIVIDU': { background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)' }
        };
        return styles[role?.replace('ROLE_', '')] || styles['INDIVIDU'];
    };

    if (loading) {
        return (
            <div className="glass card" style={{ padding: '4rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                <p className="text-muted">Chargement des utilisateurs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass card" style={{ padding: '2rem', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>
                <button className="btn btn-primary" onClick={loadUsers}>Réessayer</button>
            </div>
        );
    }

    return (
        <section className="fade-in">
            <header className="content-title">
                <h1 className="text-gradient font-black">Gestion des Mots de Passe</h1>
                <p className="text-muted">Réinitialisez les mots de passe des utilisateurs</p>
            </header>

            {/* Search Bar */}
            <div className="glass card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="🔍 Rechercher par nom, email ou rôle..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '1rem' }}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="glass card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{
                                background: 'rgba(0, 0, 0, 0.3)',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem' }}>ID</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Utilisateur</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Email</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Rôle</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Dernière modification</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        Aucun utilisateur trouvé
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} style={{
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                    transition: 'background 0.2s ease'
                                }} className="table-row-hover">
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>#{user.id}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: '700',
                                                fontSize: '0.8rem',
                                                color: 'white'
                                            }}>
                                                {user.username?.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: '600', color: 'var(--text)' }}>{user.username}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {user.email || '-'}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            ...getRoleBadgeStyle(user.role),
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase'
                                        }}>
                                            {user.role?.replace('ROLE_', '') || 'N/A'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {user.lastPasswordChange
                                            ? new Date(user.lastPasswordChange).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })
                                            : 'Jamais'
                                        }
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => openResetModal(user)}
                                            style={{
                                                background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                padding: '0.5rem 1rem',
                                                color: 'white',
                                                fontWeight: '600',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 2px 8px rgba(0, 212, 255, 0.3)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 212, 255, 0.5)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 212, 255, 0.3)';
                                            }}
                                        >
                                            🔑 Réinitialiser
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reset Password Modal */}
            {selectedUser && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{
                        maxWidth: '450px',
                        padding: '2.5rem',
                        borderRadius: '1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                fontSize: '1.5rem'
                            }}>
                                🔐
                            </div>
                            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                                Réinitialiser le mot de passe
                            </h2>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                Utilisateur: <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{selectedUser.username}</span>
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword}>
                            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="input-label">Nouveau mot de passe</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="input-field"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimum 6 caractères"
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
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '0.25rem',
                                            opacity: 0.7
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            {showPassword ? (
                                                <>
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                                    <line x1="1" y1="1" x2="23" y2="23" />
                                                </>
                                            ) : (
                                                <>
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </>
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="input-label">Confirmer le mot de passe</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-field"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Répétez le mot de passe"
                                    required
                                />
                            </div>

                            {message.text && (
                                <div style={{
                                    padding: '1rem',
                                    borderRadius: '0.75rem',
                                    marginBottom: '1.5rem',
                                    background: message.type === 'success'
                                        ? 'rgba(16, 185, 129, 0.1)'
                                        : 'rgba(239, 68, 68, 0.1)',
                                    color: message.type === 'success' ? '#10b981' : '#f87171',
                                    border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                    fontSize: '0.9rem',
                                    textAlign: 'center'
                                }}>
                                    {message.text}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{
                                        flex: 1,
                                        padding: '0.875rem',
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: 'var(--text-muted)',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary"
                                    style={{
                                        flex: 1,
                                        padding: '0.875rem',
                                        opacity: isSubmitting ? 0.7 : 1
                                    }}
                                >
                                    {isSubmitting ? 'Réinitialisation...' : 'Confirmer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .table-row-hover:hover {
                    background: rgba(255, 255, 255, 0.03) !important;
                }
            `}</style>
        </section>
    );
};

export default PasswordManagement;
