import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import FormationService from "../services/formation.service";
import FormationForm from "./admin/FormationForm";
import FormateurForm from "./admin/FormateurForm";
import FormateurService from "../services/formateur.service";
import MemoService from "../services/memo.service";
import EntrepriseService from "../services/entreprise.service";
import EntrepriseForm from "./admin/EntrepriseForm";

const translations = {
    fr: {
        overview: "Vue d'ensemble",
        trainings: "Gestion des Formations",
        formateurs: "Gestion des Formateurs",
        settings: "Paramètres",
        logout: "Déconnexion",
        welcome: "Ravi de vous revoir",
        email: "Adresse Email",
        id: "ID Compte",
        active_trainings: "Formations Actives",
        total_formateurs: "Formateurs Total",
        dashboard_title: "Tableau de Bord",
        new_training: "+ Nouvelle Formation",
        trainings_desc: "Créez et gérez votre catalogue de cours",
        formateurs_desc: "Gérez les intervenants et leurs compétences",
        new_formateur: "+ Nouveau Formateur",
        entreprises: "Gestion des Entreprises",
        entreprises_desc: "Gérez votre carnet d'adresses entreprises",
        new_entreprise: "+ Nouvelle Entreprise",
        no_entreprises: "Aucune entreprise enregistrée.",
        confirm_delete_entreprise: "Supprimer cette entreprise ?",
        settings_title: "Paramètres du Compte",
        settings_desc: "Gérez vos préférences et la sécurité de votre compte",
        appearance: "Apparence",
        dark_mode: "Mode Sombre",
        dark_mode_desc: "Basculez entre l'interface claire et sombre",
        language: "Langue de l'interface",
        language_desc: "Français",
        modify: "Modifier",
        notifications: "Notifications",
        email_alerts: "Alertes par email",
        email_alerts_desc: "Recevoir des mises à jour sur vos formations",
        newsletters: "Newsletters",
        newsletters_desc: "Nouveautés pour étudiants et formateurs",
        security: "Sécurité",
        password: "Mot de passe",
        password_desc: "Dernière modification : ",
        password_never: "Jamais modifié",
        change: "Changer",
        delete_account: "Supprimer mon compte",
        delete_account_desc: "Cette action est irréversible",
        delete: "Supprimer",
        back_list: "← Retour à la liste",
        no_trainings: "Aucune formation disponible pour le moment.",
        no_formateurs: "Aucun formateur disponible pour le moment.",
        confirm_delete_training: "Êtes-vous sûr de vouloir supprimer cette formation ?",
        select_language: "Choisir la langue",
        change_password_title: "Changer le mot de passe",
        current_password: "Mot de passe actuel",
        new_password: "Nouveau mot de passe",
        confirm_password: "Confirmer le nouveau mot de passe",
        save_changes: "Enregistrer les modifications",
        password_mismatch: "Les nouveaux mots de passe ne correspondent pas",
        password_success: "Mot de passe mis à jour !",
        password_error: "Échec : Vérifiez votre mot de passe actuel",
        close: "Fermer",
        news_title: "Nouveautés Eduzen",
        no_news: "Aucune nouvelle pour le moment.",
        pref_updated: "Préférences mises à jour",
        new_version_msg: "Une nouvelle version est disponible ! Découvrez les dernières fonctionnalités.",
        update_available: "Mise à jour disponible",
        loading: "Chargement en cours...",
        error_loading: "Erreur lors du chargement des données. Veuillez réessayer.",
        confirm_delete_memo: "Êtes-vous sûr de vouloir supprimer cette note ?",
        confirm_delete_formateur: "Êtes-vous sûr de vouloir supprimer ce formateur ?",
        memos: "Mes Mémos",
        add_memo: "Ajouter une note...",
        system_status: "État du Système",
        online: "En ligne",
        shortcuts: "Raccourcis",
        quick_add: "Ajout Rapide",
        latest_news: "Dernières Infos"
    },
    en: {
        overview: "Overview",
        trainings: "Training Management",
        formateurs: "Trainer Management",
        settings: "Settings",
        logout: "Logout",
        welcome: "Welcome back",
        email: "Email Address",
        id: "Account ID",
        active_trainings: "Active Trainings",
        total_formateurs: "Total Trainers",
        dashboard_title: "Dashboard",
        new_training: "+ New Training",
        trainings_desc: "Create and manage your course catalog",
        formateurs_desc: "Manage trainers and their skills",
        new_formateur: "+ New Trainer",
        entreprises: "Company Management",
        entreprises_desc: "Manage your business address book",
        new_entreprise: "+ New Company",
        no_entreprises: "No companies registered.",
        confirm_delete_entreprise: "Delete this company?",
        settings_title: "Account Settings",
        settings_desc: "Manage your preferences and account security",
        appearance: "Appearance",
        dark_mode: "Dark Mode",
        dark_mode_desc: "Switch between light and dark interface",
        language: "Interface Language",
        language_desc: "English",
        modify: "Modify",
        notifications: "Notifications",
        email_alerts: "Email Alerts",
        email_alerts_desc: "Receive updates about your trainings",
        newsletters: "Newsletters",
        newsletters_desc: "Latest news and special offers",
        security: "Security",
        password: "Password",
        password_desc: "Last modified: ",
        password_never: "Never modified",
        change: "Change",
        delete_account: "Delete account",
        delete_account_desc: "This action is irreversible",
        delete: "Delete",
        back_list: "← Back to list",
        no_trainings: "No training available at the moment.",
        no_formateurs: "No trainers available at the moment.",
        confirm_delete_training: "Are you sure you want to delete this training?",
        select_language: "Select Language",
        change_password_title: "Change Password",
        current_password: "Current Password",
        new_password: "New Password",
        confirm_password: "Confirm New Password",
        save_changes: "Save Changes",
        password_mismatch: "New passwords do not match",
        password_success: "Password updated successfully!",
        password_error: "Failed: Check your current password",
        close: "Close",
        news_title: "Eduzen News",
        no_news: "No news for now.",
        pref_updated: "Preferences updated",
        new_version_msg: "A new version is available! Discover the latest features.",
        update_available: "Update available",
        confirm_delete_memo: "Are you sure you want to delete this note?",
        confirm_delete_formateur: "Are you sure you want to delete this trainer?"
    }
}

const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
    const [activeTab, setActiveTab] = useState("overview");
    const [trainings, setTrainings] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [entreprises, setEntreprises] = useState([]);
    const [formationToEdit, setFormationToEdit] = useState(null);
    const [formateurToEdit, setFormateurToEdit] = useState(null);
    const [entrepriseToEdit, setEntrepriseToEdit] = useState(null);
    const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
    const [isLangModalOpen, setIsLangModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordMessage, setPasswordMessage] = useState({ text: "", type: "" });
    const [isNewsOpen, setIsNewsOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [seenNewsIds, setSeenNewsIds] = useState(JSON.parse(localStorage.getItem("seenNewsIds") || "[]"));
    const [news, setNews] = useState([
        { id: 1, title: "Version 2.0 lancée !", content: "Le système de mot de passe est maintenant 100% opérationnel et sécurisé. Vous pouvez désormais changer votre mot de passe en toute sécurité depuis vos paramètres, avec une validation en temps réel et une mise à jour instantanée de la base de données sans déconnexion.", date: "2025-12-25T12:00:00Z" },
        { id: 2, title: "Nouvelles Formations", content: "Découvrez notre nouveau catalogue de formations en Intelligence Artificielle et Développement Cloud. Ces formations sont conçues pour vous donner les compétences les plus demandées sur le marché actuel.", date: "2025-12-25T12:05:00Z" }
    ]);

    const hasUnreadNews = news.some(n => !seenNewsIds.includes(n.id));
    const [loading, setLoading] = useState(false);
    const [formationsError, setFormationsError] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [memos, setMemos] = useState([]);
    const [memoInput, setMemoInput] = useState("");
    const [editingMemoId, setEditingMemoId] = useState(null);
    const [editingMemoContent, setEditingMemoContent] = useState("");
    const [memoToDelete, setMemoToDelete] = useState(null);
    const [trainingToDelete, setTrainingToDelete] = useState(null);
    const [formateurToDelete, setFormateurToDelete] = useState(null);
    const [entrepriseToDelete, setEntrepriseToDelete] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const addMemo = (e) => {
        e.preventDefault();
        if (!memoInput.trim()) return;
        MemoService.addMemo(memoInput).then(() => {
            setMemoInput("");
            loadMemos();
        });
    };

    const deleteMemo = (id) => {
        setMemoToDelete(id);
    };

    const confirmDeleteMemo = () => {
        if (memoToDelete) {
            MemoService.deleteMemo(memoToDelete).then(() => {
                setMemoToDelete(null);
                loadMemos();
            });
        }
    };

    const startEditingMemo = (memo) => {
        setEditingMemoId(memo.id);
        setEditingMemoContent(memo.content);
    };

    const cancelEditingMemo = () => {
        setEditingMemoId(null);
        setEditingMemoContent("");
    };

    const saveEditingMemo = (id) => {
        if (!editingMemoContent.trim()) return;
        MemoService.updateMemo(id, editingMemoContent).then(() => {
            setEditingMemoId(null);
            setEditingMemoContent("");
            loadMemos();
        });
    };

    const loadMemos = () => {
        MemoService.getMemos().then(
            (response) => {
                setMemos(response.data.slice(0, 5));
            }
        );
    };
    const [formateursError, setFormateursError] = useState("");

    const t = (key) => translations[lang][key] || key;

    useEffect(() => {
        localStorage.setItem("lang", lang);
    }, [lang]);

    const loadFormateurs = () => {
        setLoading(true);
        setFormateursError("");
        FormateurService.getAllFormateurs().then(
            (response) => {
                setFormateurs(response.data);
                setLoading(false);
            },
            (err) => {
                const msg = err.response?.data?.message || err.message || "Erreur réseau";
                setFormateursError(msg);
                setLoading(false);
            }
        );
    };

    const loadEntreprises = () => {
        setLoading(true);
        EntrepriseService.getAllEntreprises().then(
            (response) => {
                setEntreprises(response.data);
                setLoading(false);
            },
            (err) => {
                setLoading(false);
            }
        );
    };

    const loadFormations = () => {
        setLoading(true);
        setFormationsError("");
        console.log("Loading formations from:", FormationService.getAllFormations); 
        FormationService.getAllFormations().then(
            (response) => {
                console.log("Formations loaded:", response.data);
                setTrainings(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            },
            (err) => {
                console.error("Error loading formations FULL:", err);
                const msg = err.response?.data?.message || err.message || "Erreur réseau";
                setFormationsError(msg);
                setLoading(false);
            }
        );
    };

    // Helper to safely extract role
    const getRoleName = (user) => {
        if (!user || !user.role) return '';
        if (typeof user.role === 'string') return user.role;
        if (typeof user.role === 'object' && user.role.name) return user.role.name;
        return String(user.role);
    };

    const roleName = getRoleName(currentUser);
    const isAdmin = roleName === 'ROLE_ADMIN' || roleName === 'ADMIN';
    const isAssistant = roleName === 'ROLE_ASSISTANT' || roleName === 'ASSISTANT';

    const formatLastChange = (dateString) => {
        if (!dateString) return t('password_never');
        const date = new Date(dateString);
        return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    useEffect(() => {
        if (currentUser?.id) {
            loadFormations();
            loadMemos();
            if (isAdmin) {
                loadFormateurs();
            }
            if (isAdmin || isAssistant) {
                loadEntreprises();
            }
        }
    }, [currentUser?.id, isAdmin, isAssistant]); 

    const handleEditFormateur = (formateur) => {
        setFormateurToEdit(formateur);
        setActiveTab('add-formateur');
    };

    const handleEditEntreprise = (entreprise) => {
        setEntrepriseToEdit(entreprise);
        setActiveTab('add-entreprise');
    };

    const handleDeleteEntreprise = (id) => {
        setEntrepriseToDelete(id);
    };

    const confirmDeleteEntreprise = () => {
        if (entrepriseToDelete) {
            EntrepriseService.deleteEntreprise(entrepriseToDelete).then(() => {
                setEntrepriseToDelete(null);
                loadEntreprises();
            });
        }
    };

    const handleDeleteFormateur = (id) => {
        setFormateurToDelete(id);
    };

    const confirmDeleteFormateur = () => {
        if (formateurToDelete) {
            FormateurService.deleteFormateur(formateurToDelete).then(
                () => {
                    setFormateurToDelete(null);
                    loadFormateurs();
                },
                (err) => {
                    setFormateurToDelete(null);
                    alert("Erreur lors de la suppression: " + (err.response?.data?.message || err.message));
                }
            );
        }
    };
 

    const handleDeleteTraining = (id) => {
        setTrainingToDelete(id);
    };

    const confirmDeleteTraining = () => {
        if (trainingToDelete) {
            FormationService.deleteFormation(trainingToDelete).then(() => {
                setTrainingToDelete(null);
                loadFormations();
            });
        }
    };

    const handleEditTraining = (training) => {
        setFormationToEdit(training);
        setActiveTab('add-training');
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ text: t('password_mismatch'), type: 'error' });
            return;
        }

        AuthService.changePassword(passwordData.currentPassword, passwordData.newPassword)
            .then(() => {
                const updatedUser = AuthService.getCurrentUser();
                setCurrentUser(updatedUser);
                setPasswordMessage({ text: t('password_success'), type: 'success' });
                setTimeout(() => {
                    setIsPasswordModalOpen(false);
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setPasswordMessage({ text: "", type: "" });
                }, 2000);
            })
            .catch((error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || t('password_error');
                setPasswordMessage({ text: resMessage, type: 'error' });
            });
    };

    const handlePreferenceChange = (name, value) => {
        AuthService.updatePreferences({ [name]: value })
            .then(() => {
                const updatedUser = AuthService.getCurrentUser();
                setCurrentUser(updatedUser);
            });
    };

    const handleOpenNews = () => {
        setIsNewsOpen(true);
    };

    const handleReadNews = (id) => {
        if (!seenNewsIds.includes(id)) {
            const newSeen = [...seenNewsIds, id];
            setSeenNewsIds(newSeen);
            localStorage.setItem("seenNewsIds", JSON.stringify(newSeen));
        }
    };

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    if (!currentUser) return <div className="text-center mt-5">Veuillez vous connecter pour accéder au tableau de bord.</div>;

    const username = currentUser.username || "User";

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar glass text-muted">
                <div className="sidebar-header" style={{ position: 'relative' }}>
                    <div className="avatar">{username.substring(0, 2).toUpperCase()}</div>
                    <div className="user-info">
                        <span className="username" style={{ color: 'var(--text)' }}>{username}</span>
                        <span className="role-tag">{roleName.replace('ROLE_', '')}</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="icon">🏠</span> {t('overview')}
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'trainings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trainings')}
                    >
                        <span className="icon">📘</span> {t('trainings')}
                    </button>

                    {isAdmin && (
                        <button
                            className={`nav-item ${activeTab === 'formateurs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('formateurs')}
                        >
                            <span className="icon">👤</span> {t('formateurs')}
                        </button>
                    )}

                    {(isAdmin || isAssistant) && (
                        <button
                            className={`nav-item ${activeTab === 'entreprises' ? 'active' : ''}`}
                            onClick={() => setActiveTab('entreprises')}
                        >
                            <span className="icon">🏢</span> {t('entreprises')}
                        </button>
                    )}

                    <button
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <span className="icon">⚙️</span> {t('settings')}
                    </button>

                    {currentUser?.newsletters === true && (
                        <button
                            className={`nav-item ${activeTab === 'newsletters' ? 'active' : ''}`}
                            onClick={() => setActiveTab('newsletters')}
                            style={{ marginTop: 'auto', position: 'relative' }}
                        >
                            <span className="icon">📩</span> {t('newsletters')}
                            {hasUnreadNews && <span className="sidebar-badge"></span>}
                        </button>
                    )}
                </nav>

                <button className="logout-btn" onClick={() => { AuthService.logout(); window.location.reload(); }}>
                    <span className="icon">🔌</span> {t('logout')}
                </button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-content">
                {activeTab === 'overview' && (
                    <section className="fade-in">
                        <header className="content-title">
                            <h1 className="text-gradient font-black">{t('dashboard_title')}</h1>
                            <p className="text-muted">{t('welcome')}, {username} !</p>
                        </header>

                        <div className="overview-layout">
                            <div className="main-stats">
                                <div className="stats-grid">
                                    <div className="stat-card glass">
                                        <span className="stat-label">{t('email')}</span>
                                        <span className="stat-value">{currentUser.email}</span>
                                    </div>
                                    <div className="stat-card glass">
                                        <span className="stat-label">{t('active_trainings')}</span>
                                        <span className="stat-value">{trainings.length}</span>
                                    </div>
                                    <div className="stat-card glass">
                                        <span className="stat-label">{t('total_formateurs')}</span>
                                        <span className="stat-value">{formateurs.length}</span>
                                    </div>
                                </div>

                                <div className="memo-section glass" style={{ marginTop: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{t('memos')}</h2>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{memos.length}/5</span>
                                    </div>
                                    <form onSubmit={addMemo} className="memo-form">
                                        <input 
                                            type="text" 
                                            className="input-field memo-input" 
                                            placeholder={t('add_memo')}
                                            value={memoInput}
                                            onChange={(e) => setMemoInput(e.target.value)}
                                        />
                                        <button className="memo-btn">+</button>
                                    </form>
                                    <div className="memo-list">
                                        {memos.length === 0 ? (
                                            <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem' }}>Aucune note enregistrée</p>
                                        ) : (
                                            memos.map(memo => (
                                                <div key={memo.id} className="memo-item">
                                                    {editingMemoId === memo.id ? (
                                                        <div style={{ display: 'flex', gap: '0.8rem', width: '100%' }}>
                                                            <input 
                                                                type="text" 
                                                                className="input-field memo-input" 
                                                                value={editingMemoContent}
                                                                onChange={(e) => setEditingMemoContent(e.target.value)}
                                                                autoFocus
                                                                style={{ padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}
                                                            />
                                                            <button onClick={() => saveEditingMemo(memo.id)} className="memo-action-btn check">✓</button>
                                                            <button onClick={cancelEditingMemo} className="memo-action-btn cancel">✕</button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{memo.content}</span>
                                                            <div style={{ display: 'flex', gap: '0.2rem' }}>
                                                                <button className="memo-action-btn edit" onClick={() => startEditingMemo(memo)}>✏️</button>
                                                                <button className="memo-action-btn delete" onClick={() => deleteMemo(memo.id)}>🗑️</button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <aside className="overview-sidebar">
                                <div className="clock-card glass" style={{ textAlign: 'center', padding: '2rem', marginBottom: '2rem' }}>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                                        {currentTime.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-muted" style={{ textTransform: 'capitalize' }}>
                                        {currentTime.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </div>
                                </div>

                                <div className="status-card glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{t('system_status')}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></span>
                                        <span style={{ fontWeight: '600' }}>{t('online')}</span>
                                    </div>
                                    <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>V. 2.4.0 - Signal stable</p>
                                </div>

                                <div className="news-preview glass" style={{ padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{t('latest_news')}</h3>
                                    {news.slice(0, 1).map(n => (
                                        <div key={n.id} onClick={() => { setSelectedNews(n); setActiveTab('newsletters'); }} style={{ cursor: 'pointer' }}>
                                            <h4 style={{ color: 'var(--accent)', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{n.title}</h4>
                                            <p className="line-clamp-2" style={{ fontSize: '0.85rem', opacity: 0.7 }}>{n.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </aside>
                        </div>
                    </section>
                )}

                {activeTab === 'trainings' && (
                    <section className="fade-in">
                        <header className="content-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 className="text-gradient font-black">{t('trainings')}</h1>
                                <p className="text-muted">{t('trainings_desc')}</p>
                            </div>
                            {isAdmin && (
                                <button className="btn btn-primary" onClick={() => setActiveTab('add-training')}>
                                    {t('new_training')}
                                </button>
                            )}
                        </header>

                        <div className="trainings-grid">
                            {loading && <div className="text-muted">{t('loading')}</div>}
                            {formationsError && <div className="text-error" style={{ color: '#ef4444', marginBottom: '1rem' }}>{t('error_loading')} ({formationsError})</div>}
                            {!loading && trainings.length === 0 ? (
                                <div className="text-muted">{t('no_trainings')}</div>
                            ) : (
                                trainings.map(t_item => (
                                    <div key={t_item.id} className="training-card glass">
                                        <div className="training-badge">{t_item.nombreHeures} Heures</div>
                                        <h3>{t_item.titre}</h3>
                                        <p className="training-desc">{t_item.objectifs}</p>
                                        {t_item.formateur && (
                                            <p className="training-instructor" style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.5rem' }}>
                                                👨‍🏫 {t_item.formateur.user.username}
                                            </p>
                                        )}
                                        <div className="training-footer">
                                            <span className="price">{t_item.cout} MAD</span>
                                            {isAdmin && (
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <button className="btn-icon edit" onClick={() => handleEditTraining(t_item)} title="Modifier">✏️</button>
                                                    <button className="btn-icon delete" onClick={() => handleDeleteTraining(t_item.id)} title="Supprimer">🗑️</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'entreprises' && (isAdmin || isAssistant) && (
                    <section className="fade-in">
                        <header className="content-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 className="text-gradient font-black">{t('entreprises')}</h1>
                                <p className="text-muted">{t('entreprises_desc')}</p>
                            </div>
                            <button className="btn btn-primary" onClick={() => setActiveTab('add-entreprise')}>
                                {t('new_entreprise')}
                            </button>
                        </header>

                        <div className="trainings-grid">
                            {loading && <div className="text-muted">{t('loading')}</div>}
                            {!loading && entreprises.length === 0 ? (
                                <div className="text-muted">{t('no_entreprises')}</div>
                            ) : (
                                entreprises.map(e => (
                                    <div key={e.id} className="training-card glass">
                                        <h3>{e.nom}</h3>
                                        <p className="training-desc" style={{ marginBottom: '0.8rem' }}>📍 {e.adresse || "Non spécifiée"}</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                                            {e.telephone && <span>📞 {e.telephone}</span>}
                                            {e.email && <span>📧 {e.email}</span>}
                                            {e.url && <a href={e.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>🌐 Site Web</a>}
                                        </div>
                                        <div className="training-footer" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end', marginTop: '1.2rem' }}>
                                            <button className="btn-icon edit" onClick={() => handleEditEntreprise(e)} title="Modifier">✏️</button>
                                            <button className="btn-icon delete" onClick={() => handleDeleteEntreprise(e.id)} title="Supprimer">🗑️</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'add-entreprise' && (isAdmin || isAssistant) && (
                    <section className="fade-in">
                        <button className="auth-nav-link" onClick={() => { setActiveTab('entreprises'); setEntrepriseToEdit(null); }}>{t('back_list')}</button>
                        <EntrepriseForm 
                            onSuccess={() => { setActiveTab('entreprises'); setEntrepriseToEdit(null); loadEntreprises(); }} 
                            entrepriseToEdit={entrepriseToEdit}
                        />
                    </section>
                )}

                {activeTab === 'formateurs' && isAdmin && (
                    <section className="fade-in">
                        <header className="content-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 className="text-gradient font-black">{t('formateurs')}</h1>
                                <p className="text-muted">{t('formateurs_desc')}</p>
                            </div>
                            <button className="btn btn-primary" onClick={() => setActiveTab('add-formateur')}>
                                {t('new_formateur')}
                            </button>
                        </header>

                        <div className="trainings-grid">
                            {loading && <div className="text-muted">{t('loading')}</div>}
                            {formateursError && <div className="text-error" style={{ color: '#ef4444', marginBottom: '1rem' }}>{t('error_loading')} ({formateursError})</div>}
                            {!loading && formateurs.length === 0 ? (
                                <div className="text-muted">{t('no_formateurs')}</div>
                            ) : (
                                formateurs.map(f => (
                                    <div key={f.id} className="training-card glass">
                                        <div className="training-badge">ID: {f.user.id}</div>
                                        <h3>{f.user.username}</h3>
                                        <p className="training-desc" style={{ marginBottom: '0.5rem' }}><strong>Compétences:</strong> {f.competences}</p>
                                        <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginTop: 'auto' }}>
                                            <p className="text-muted" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
                                                <strong>Remarque:</strong> {f.remarques || "Aucune"}
                                            </p>
                                        </div>
                                        <div className="training-footer" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                            <button className="btn-icon edit" onClick={() => handleEditFormateur(f)} title="Modifier">✏️</button>
                                            <button className="btn-icon delete" onClick={() => handleDeleteFormateur(f.id)} title="Supprimer">🗑️</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'add-formateur' && isAdmin && (
                    <section className="fade-in">
                        <button className="auth-nav-link" onClick={() => { setActiveTab('formateurs'); setFormateurToEdit(null); }}>{t('back_list')}</button>
                        <FormateurForm 
                            onSuccess={() => { setActiveTab('formateurs'); setFormateurToEdit(null); loadFormateurs(); }} 
                            formateurToEdit={formateurToEdit}
                        />
                    </section>
                )}

                {activeTab === 'add-training' && isAdmin && (
                    <section className="fade-in">
                        <button className="auth-nav-link" onClick={() => { setActiveTab('trainings'); setFormationToEdit(null); }}>{t('back_list')}</button>
                        <FormationForm 
                            onSuccess={() => { setActiveTab('trainings'); setFormationToEdit(null); loadFormations(); }} 
                            formationToEdit={formationToEdit} 
                            formateurs={formateurs}
                        />
                    </section>
                )}

                {activeTab === 'newsletters' && (
                    <section className="fade-in">
                        <header className="content-title">
                            <h1 className="text-gradient font-black">{t('news_title')}</h1>
                            <p className="text-muted">{t('newsletters_desc')}</p>
                        </header>

                        <div className="news-list-container glass card" style={{ padding: '2rem' }}>
                            {news.length === 0 ? (
                                <p className="text-muted">{t('no_news')}</p>
                            ) : (
                                <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {news.map(item => (
                                        <div 
                                            key={item.id} 
                                            className="news-item glass card" 
                                            style={{ 
                                                padding: '1.5rem', 
                                                cursor: 'pointer',
                                                border: seenNewsIds.includes(item.id) 
                                                    ? '1px solid rgba(255,255,255,0.05)' 
                                                    : '1px solid var(--error)',
                                                position: 'relative'
                                            }}
                                            onClick={() => {
                                                setSelectedNews(item);
                                                handleReadNews(item.id);
                                            }}
                                        >
                                            {!seenNewsIds.includes(item.id) && (
                                                <span className="sidebar-badge" style={{ right: '1rem', top: '1rem' }}></span>
                                            )}
                                            <div style={{ marginBottom: '1rem' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(item.date).toLocaleDateString()}</span>
                                                <h3 style={{ color: seenNewsIds.includes(item.id) ? 'var(--primary)' : 'var(--error)', marginTop: '0.3rem' }}>{item.title}</h3>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text)', opacity: 0.8 }} className="line-clamp-2">{item.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'settings' && (
                    <section className="fade-in">
                        <header className="content-title">
                            <h1 className="text-gradient font-black">{t('settings_title')}</h1>
                            <p className="text-muted">{t('settings_desc')}</p>
                        </header>

                        <div className="settings-container" style={{ maxWidth: '800px' }}>
                            <div className="settings-section">
                                <h3 className="font-bold">{t('appearance')}</h3>
                                <div className="glass card" style={{ padding: '1.5rem 2rem' }}>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-name">{t('dark_mode')}</span>
                                            <span className="setting-desc">{t('dark_mode_desc')}</span>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={theme === "dark"}
                                                onChange={toggleTheme}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-name">{t('language')}</span>
                                            <span className="setting-desc">{t('language_desc')}</span>
                                        </div>
                                        <button className="btn-settings" onClick={() => setIsLangModalOpen(true)}>{t('modify')}</button>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-section">
                                <h3 className="font-bold">{t('notifications')}</h3>
                                <div className="glass card" style={{ padding: '1.5rem 2rem' }}>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-name">{t('newsletters')}</span>
                                            <span className="setting-desc">{t('newsletters_desc')}</span>
                                        </div>
                                        <label className="switch">
                                            <input 
                                                type="checkbox" 
                                                checked={currentUser.newsletters === true} 
                                                onChange={(e) => handlePreferenceChange('newsletters', e.target.checked)}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-section">
                                <h3 className="font-bold">{t('security')}</h3>
                                <div className="glass card" style={{ padding: '1.5rem 2rem' }}>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-name">{t('password')}</span>
                                            <span className="setting-desc">
                                                {t('password_desc')} 
                                                <span style={{ color: 'var(--primary)', fontWeight: '500' }}>
                                                    {formatLastChange(currentUser.lastPasswordChange)}
                                                </span>
                                            </span>
                                        </div>
                                        <button className="btn-settings" onClick={() => setIsPasswordModalOpen(true)}>{t('change')}</button>
                                    </div>
                                    <div className="setting-item" style={{ border: 'none' }}>
                                        <div className="setting-info">
                                            <span className="setting-name" style={{ color: 'var(--error)' }}>{t('delete_account')}</span>
                                            <span className="setting-desc">{t('delete_account_desc')}</span>
                                        </div>
                                        <button className="btn-settings danger" onClick={() => alert("Action sécurisée : Veuillez contacter l'administrateur.")}>{t('delete')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* Language Selection Modal */}
            {isLangModalOpen && (
                <div className="modal-overlay" onClick={() => setIsLangModalOpen(false)}>
                    <div className="modal-content glass" onClick={e => e.stopPropagation()}>
                        <h2 className="text-gradient font-black" style={{ marginBottom: '1.5rem' }}>{t('select_language')}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                className={`btn ${lang === 'fr' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => { setLang('fr'); setIsLangModalOpen(false); }}
                            >
                                Français 🇫🇷
                            </button>
                            <button
                                className={`btn ${lang === 'en' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => { setLang('en'); setIsLangModalOpen(false); }}
                            >
                                English 🇬🇧
                            </button>
                        </div>
                        <button
                            className="auth-nav-link"
                            style={{ marginTop: '1.5rem' }}
                            onClick={() => setIsLangModalOpen(false)}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
            {/* Password Change Modal */}
            {isPasswordModalOpen && (
                <div className="modal-overlay" onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordMessage({ text: "", type: "" });
                }}>
                    <div className="modal-content glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                        <h2 className="text-gradient font-black" style={{ marginBottom: '1.5rem' }}>{t('change_password_title')}</h2>

                        {passwordMessage.text && (
                            <div className={`alert ${passwordMessage.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1rem', padding: '0.8rem', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: passwordMessage.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: passwordMessage.type === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${passwordMessage.type === 'success' ? '#10b981' : '#ef4444'}` }}>
                                {passwordMessage.text}
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div className="form-group-custom">
                                <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>{t('current_password')}</label>
                                <input
                                    type="password"
                                    className="form-control glass"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)' }}
                                />
                            </div>
                            <div className="form-group-custom">
                                <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>{t('new_password')}</label>
                                <input
                                    type="password"
                                    className="form-control glass"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)' }}
                                />
                            </div>
                            <div className="form-group-custom">
                                <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>{t('confirm_password')}</label>
                                <input
                                    type="password"
                                    className="form-control glass"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {t('save_changes')}
                                </button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => {
                                    setIsPasswordModalOpen(false);
                                    setPasswordMessage({ text: "", type: "" });
                                }}>
                                    {t('close')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* News Detail Modal */}
            {selectedNews && (
                <div className="modal-overlay" onClick={() => setSelectedNews(null)} style={{ zIndex: 1100 }}>
                    <div className="modal-content glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '3.5rem' }}>
                        <div className="news-detail-header" style={{ marginBottom: '2rem', textAlign: 'left' }}>
                            <span style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.5rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>
                                {t('news_title')} • {new Date(selectedNews.date).toLocaleDateString()}
                            </span>
                            <h2 className="text-gradient font-black" style={{ fontSize: '2rem', lineHeight: '1.2' }}>{selectedNews.title}</h2>
                        </div>
                        
                        <div className="news-detail-content" style={{ textAlign: 'left', lineHeight: '1.8', color: 'var(--text)', fontSize: '1.05rem', background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {selectedNews.content}
                        </div>

                        <button 
                            className="btn btn-primary" 
                            style={{ marginTop: '2.5rem', width: '100%' }}
                            onClick={() => setSelectedNews(null)}
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            )}
            {/* Memo Delete Confirmation Modal */}
            {memoToDelete && (
                <div className="modal-overlay" onClick={() => setMemoToDelete(null)}>
                    <div className="modal-content glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
                        <h2 className="text-gradient font-black" style={{ marginBottom: '1rem' }}>{t('confirm_delete_memo')}</h2>
                        <p className="text-muted" style={{ marginBottom: '2rem' }}>Cette action est irréversible. Voulez-vous vraiment supprimer ce mémo ?</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setMemoToDelete(null)}>
                                {t('close')}
                            </button>
                            <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--error)' }} onClick={confirmDeleteMemo}>
                                {t('delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Training Delete Confirmation Modal */}
            {trainingToDelete && (
                <div className="modal-overlay" onClick={() => setTrainingToDelete(null)}>
                    <div className="modal-content glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
                        <h2 className="text-gradient font-black" style={{ marginBottom: '1rem' }}>{t('confirm_delete_training')}</h2>
                        <p className="text-muted" style={{ marginBottom: '2rem' }}>Cette action est irréversible. Voulez-vous vraiment supprimer cette formation ?</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setTrainingToDelete(null)}>
                                {t('close')}
                            </button>
                            <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--error)' }} onClick={confirmDeleteTraining}>
                                {t('delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Formateur Delete Confirmation Modal */}
            {formateurToDelete && (
                <div className="modal-overlay" onClick={() => setFormateurToDelete(null)}>
                    <div className="modal-content glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
                        <h2 className="text-gradient font-black" style={{ marginBottom: '1rem' }}>{t('confirm_delete_formateur')}</h2>
                        <p className="text-muted" style={{ marginBottom: '2rem' }}>Cette action est irréversible. Voulez-vous vraiment supprimer ce formateur ?</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setFormateurToDelete(null)}>
                                {t('close')}
                            </button>
                            <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--error)' }} onClick={confirmDeleteFormateur}>
                                {t('delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Entreprise Delete Confirmation Modal */}
            {entrepriseToDelete && (
                <div className="modal-overlay" onClick={() => setEntrepriseToDelete(null)}>
                    <div className="modal-content glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
                        <h2 className="text-gradient font-black" style={{ marginBottom: '1rem' }}>{t('confirm_delete_entreprise')}</h2>
                        <p className="text-muted" style={{ marginBottom: '2rem' }}>Cette action est irréversible. Voulez-vous vraiment supprimer cette entreprise ?</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEntrepriseToDelete(null)}>
                                {t('close')}
                            </button>
                            <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--error)' }} onClick={confirmDeleteEntreprise}>
                                {t('delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
