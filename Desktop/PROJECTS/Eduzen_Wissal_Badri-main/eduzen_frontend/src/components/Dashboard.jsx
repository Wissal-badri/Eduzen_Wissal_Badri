import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import FormationService from "../services/formation.service";
import FormationForm from "./admin/FormationForm";
import FormateurForm from "./admin/FormateurForm";
import FormateurService from "../services/formateur.service";

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
        dashboard_title: "Tableau de Bord",
        new_training: "+ Nouvelle Formation",
        trainings_desc: "Créez et gérez votre catalogue de cours",
        formateurs_desc: "Gérez les intervenants et leurs compétences",
        new_formateur: "+ Nouveau Formateur",
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
        newsletters_desc: "Nouveautés et offres spéciales",
        security: "Sécurité",
        password: "Mot de passe",
        password_desc: "Dernière modification il y a 3 mois",
        change: "Changer",
        delete_account: "Supprimer mon compte",
        delete_account_desc: "Cette action est irréversible",
        delete: "Supprimer",
        back_list: "← Retour à la liste",
        no_trainings: "Aucune formation disponible pour le moment.",
        no_formateurs: "Aucun formateur disponible pour le moment.",
        confirm_delete_training: "Êtes-vous sûr de vouloir supprimer cette formation ?",
        select_language: "Choisir la langue",
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
        dashboard_title: "Dashboard",
        new_training: "+ New Training",
        trainings_desc: "Create and manage your course catalog",
        formateurs_desc: "Manage trainers and their skills",
        new_formateur: "+ New Trainer",
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
        password_desc: "Last modified 3 months ago",
        change: "Change",
        delete_account: "Delete account",
        delete_account_desc: "This action is irreversible",
        delete: "Delete",
        back_list: "← Back to list",
        no_trainings: "No training available at the moment.",
        no_formateurs: "No trainers available at the moment.",
        confirm_delete_training: "Are you sure you want to delete this training?",
        select_language: "Select Language",
    }
};

const Dashboard = () => {
    const [currentUser] = useState(AuthService.getCurrentUser());
    const [activeTab, setActiveTab] = useState("overview");
    const [trainings, setTrainings] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [formationToEdit, setFormationToEdit] = useState(null);
    const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
    const [isLangModalOpen, setIsLangModalOpen] = useState(false);

    const t = (key) => translations[lang][key] || key;

    useEffect(() => {
        localStorage.setItem("lang", lang);
    }, [lang]);

    const loadFormateurs = () => {
        FormateurService.getAllFormateurs().then(
            (response) => {
                setFormateurs(response.data);
            },
            (error) => {
                console.error("Error loading formateurs", error);
            }
        );
    };

    const loadFormations = () => {
        FormationService.getAllFormations().then(
            (response) => {
                setTrainings(response.data);
            },
            (error) => {
                console.error("Error loading formations", error);
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

    useEffect(() => {
        if (isAdmin) {
            loadFormations();
            loadFormateurs();
        }
    }, [currentUser]); // Depend on currentUser, but use derived isAdmin

    const handleDeleteTraining = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
            FormationService.deleteFormation(id).then(() => {
                loadFormations();
            });
        }
    };

    const handleEditTraining = (training) => {
        setFormationToEdit(training);
        setActiveTab('add-training');
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
                <div className="sidebar-header">
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
                        <span className="icon">📊</span> {t('overview')}
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                className={`nav-item ${activeTab === 'trainings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('trainings')}
                            >
                                <span className="icon">📚</span> {t('trainings')}
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'formateurs' ? 'active' : ''}`}
                                onClick={() => setActiveTab('formateurs')}
                            >
                                <span className="icon">👨‍🏫</span> {t('formateurs')}
                            </button>
                        </>
                    )}

                    <button
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <span className="icon">⚙️</span> {t('settings')}
                    </button>
                </nav>

                <button className="logout-btn" onClick={() => { AuthService.logout(); window.location.reload(); }}>
                    <span className="icon">🚪</span> {t('logout')}
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

                        <div className="stats-grid">
                            <div className="stat-card glass">
                                <span className="stat-label">{t('email')}</span>
                                <span className="stat-value">{currentUser.email}</span>
                            </div>
                            <div className="stat-card glass">
                                <span className="stat-label">{t('id')}</span>
                                <span className="stat-value">#{currentUser.id}</span>
                            </div>
                            <div className="stat-card glass">
                                <span className="stat-label">{t('active_trainings')}</span>
                                <span className="stat-value">{trainings.length}</span>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'trainings' && isAdmin && (
                    <section className="fade-in">
                        <header className="content-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 className="text-gradient font-black">{t('trainings')}</h1>
                                <p className="text-muted">{t('trainings_desc')}</p>
                            </div>
                            <button className="btn btn-primary" onClick={() => setActiveTab('add-training')}>
                                {t('new_training')}
                            </button>
                        </header>

                        <div className="trainings-grid">
                            {trainings.length === 0 ? (
                                <div className="text-muted">{t('no_trainings')}</div>
                            ) : (
                                trainings.map(t_item => (
                                    <div key={t_item.id} className="training-card glass">
                                        <div className="training-badge">{t_item.nombreHeures} Heures</div>
                                        <h3>{t_item.titre}</h3>
                                        <p className="training-desc">{t_item.objectifs}</p>
                                        <div className="training-footer">
                                            <span className="price">{t_item.cout} MAD</span>
                                            <div>
                                                <button className="btn-icon edit" onClick={() => handleEditTraining(t_item)}>✏️</button>
                                                <button className="btn-icon delete" onClick={() => handleDeleteTraining(t_item.id)}>🗑️</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
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
                            {formateurs.length === 0 ? (
                                <div className="text-muted">{t('no_formateurs')}</div>
                            ) : (
                                formateurs.map(f => (
                                    <div key={f.id} className="training-card glass">
                                        <div className="training-badge">ID: {f.user.id}</div>
                                        <h3>{f.user.username}</h3>
                                        <p className="training-desc"><strong>Compétences:</strong> {f.competences}</p>
                                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>{f.remarques}</p>
                                        <div className="training-footer">
                                            <span className="price">{f.user.email}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'add-formateur' && isAdmin && (
                    <section className="fade-in">
                        <button className="auth-nav-link" onClick={() => setActiveTab('formateurs')}>{t('back_list')}</button>
                        <FormateurForm onSuccess={() => { setActiveTab('formateurs'); loadFormateurs(); }} />
                    </section>
                )}

                {activeTab === 'add-training' && isAdmin && (
                    <section className="fade-in">
                        <button className="auth-nav-link" onClick={() => { setActiveTab('trainings'); setFormationToEdit(null); }}>{t('back_list')}</button>
                        <FormationForm onSuccess={() => { setActiveTab('trainings'); setFormationToEdit(null); loadFormations(); }} formationToEdit={formationToEdit} />
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
                                            <span className="setting-name">{t('email_alerts')}</span>
                                            <span className="setting-desc">{t('email_alerts_desc')}</span>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-name">{t('newsletters')}</span>
                                            <span className="setting-desc">{t('newsletters_desc')}</span>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" />
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
                                            <span className="setting-desc">{t('password_desc')}</span>
                                        </div>
                                        <button className="btn-settings" onClick={() => alert("Fonctionnalité bientôt disponible !")}>{t('change')}</button>
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
        </div >
    );
};

export default Dashboard;
