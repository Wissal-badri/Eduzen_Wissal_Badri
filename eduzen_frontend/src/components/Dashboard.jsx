import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import FormationService from "../services/formation.service";
import FormationForm from "./admin/FormationForm";
import FormateurForm from "./admin/FormateurForm";
import FormateurService from "../services/formateur.service";
import MemoService from "../services/memo.service";
import EntrepriseService from "../services/entreprise.service";
import EntrepriseForm from "./admin/EntrepriseForm";
import CalendarView from "./CalendarView";
import IndividuService from "../services/individu.service";
import InscriptionService from "../services/inscription.service";
import NotificationService from "../services/notification.service";
import PlanningService from "../services/planning.service";
import axios from "axios";
import authHeader from "../services/auth-header";
import ProfileCompletion from "./ProfileCompletion";

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
        new_training: "Nouvelle Formation",
        trainings_desc: "Créez et gérez votre catalogue de cours",
        formateurs_desc: "Gérez les intervenants et leurs compétences",
        new_formateur: "Nouveau Formateur",
        entreprises: "Gestion des Entreprises",
        entreprises_desc: "Gérez votre carnet d'adresses entreprises",
        new_entreprise: "Nouvelle Entreprise",
        planning: "Planning et Calendrier",
        planning_desc: "Gérez les emplois du temps des formations",
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
        back_list: "Retour à la liste",
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
        latest_news: "Dernières Infos",
        individus: "Gestion des Individus",
        individus_desc: "Gérez les inscriptions des particuliers",
        confirm_delete_individu: "Supprimer cette inscription ?",
        inscription_title: "Inscription à la formation",
        confirm_unenroll_title: "Désinscription",
        confirm_unenroll: "Êtes-vous sûr de vouloir vous désinscrire de cette formation ?",
        unenroll_btn: "Se désinscrire",
        keep_enrolled: "Rester inscrit"
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
        new_training: "New Training",
        trainings_desc: "Create and manage your course catalog",
        formateurs_desc: "Manage trainers and their skills",
        new_formateur: "New Trainer",
        entreprises: "Company Management",
        entreprises_desc: "Manage your business address book",
        new_entreprise: "New Company",
        planning: "Planning & Calendar",
        planning_desc: "Manage training schedules",
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
        back_list: "Back to list",
        no_trainings: "No training available at the moment.",
        no_formateurs: "No trainers available at the moment.",
        confirm_delete_training: "Are you sure you want to delete this training?",
        select_language: "Select Language",
        change_password_title: "Change Password",
        current_password: "Current Password",
        new_password: "New Password",
        confirm_password: "Confirm New Password",
        save_changes: "Save Changes",
        inscription_title: "Course Enrollment",
        confirm_unenroll_title: "Unenrollment",
        confirm_unenroll: "Are you sure you want to unenroll from this course?",
        unenroll_btn: "Unenroll",
        keep_enrolled: "Stay enrolled",
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
        confirm_delete_formateur: "Are you sure you want to delete this trainer?",
        individus: "Individual Management",
        individus_desc: "Manage individual registrations",
        confirm_delete_individu: "Delete this registration?"
    }
}

const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
    const [activeTab, setActiveTab] = useState(() => {
        const user = AuthService.getCurrentUser();
        if (user?.role?.name === "ROLE_INDIVIDU" || user?.role === "ROLE_INDIVIDU") return "catalogue";
        return "overview";
    });
    const [trainings, setTrainings] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [entreprises, setEntreprises] = useState([]);
    const [formationToEdit, setFormationToEdit] = useState(null);
    const [formateurToEdit, setFormateurToEdit] = useState(null);
    const [entrepriseToEdit, setEntrepriseToEdit] = useState(null);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [individus, setIndividus] = useState([]);
    const [individuFilter, setIndividuFilter] = useState('');
    const [myInscriptions, setMyInscriptions] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [stats, setStats] = useState({ totalInscriptions: 0, totalIndividus: 0 });
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
    const [individuToDelete, setIndividuToDelete] = useState(null);
    const [allInscriptions, setAllInscriptions] = useState([]);
    const [plannings, setPlannings] = useState([]);
    const [alertConfig, setAlertConfig] = useState(null); // { title: string, message: string, type: 'success' | 'error' | 'info' }
    const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
    const [enrollmentFormation, setEnrollmentFormation] = useState(null);
    const [enrollmentData, setEnrollmentData] = useState({
        nom: currentUser.lastName || '',
        prenom: currentUser.firstName || '',
        email: currentUser.email || '',
        telephone: currentUser.phone || '',
        ville: '',
        dateNaissance: ''
    });
    const [trainingToUnenroll, setTrainingToUnenroll] = useState(null);

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

    const t = (key) => {
        const trans = translations[lang] || translations.fr;
        return trans[key] || key;
    };

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

    const loadIndividus = () => {
        setLoading(true);
        axios.get("http://localhost:8096/api/management/individus", { headers: authHeader() }).then(
            (response) => {
                setIndividus(response.data);
                setLoading(false);
            },
            (err) => {
                console.error("Error loading individus:", err);
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
    const isIndividu = roleName === 'ROLE_INDIVIDU' || roleName === 'INDIVIDU';
    const isProfileComplete = currentUser && currentUser.profileCompleted;

    const formatLastChange = (dateString) => {
        if (!dateString) return t('password_never');
        const date = new Date(dateString);
        return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get("http://localhost:8096/api/auth/me", { headers: authHeader() });
                if (res.data) {
                    const token = JSON.parse(localStorage.getItem("user"))?.authdata;
                    const updatedUser = { ...res.data, authdata: token };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    setCurrentUser(updatedUser);
                }
            } catch (err) {
                console.error("Failed to refresh user data", err);
            }
        };
        fetchCurrentUser();
    }, []); // Run once on mount

    useEffect(() => {
        if (currentUser?.id) {
            loadFormations();
            loadMemos();
            if (isAdmin || isAssistant) {
                loadFormateurs();
            }
            if (isAdmin || isAssistant) {
                loadEntreprises();
                loadIndividus();
                loadStats();
                loadNotifications();
                loadAllInscriptions();
                loadPlannings();
            }
            if (isIndividu) {
                loadMyInscriptions();
                if (!activeTab || activeTab === 'overview') {
                    setActiveTab('catalogue');
                }
            }
        }
    }, [currentUser?.id, isAdmin, isAssistant, isIndividu]);

    const loadMyInscriptions = () => {
        InscriptionService.getMyInscriptions().then(res => setMyInscriptions(res.data));
    };

    const loadStats = () => {
        InscriptionService.getStats().then(res => setStats(res.data));
    };

    const loadNotifications = () => {
        NotificationService.getNotifications().then(res => setNotifications(res.data));
        NotificationService.getUnreadCount().then(res => setUnreadNotifications(res.data));
    };

    const loadAllInscriptions = () => {
        InscriptionService.getAllInscriptions().then(res => setAllInscriptions(res.data));
    };

    const loadPlannings = () => {
        PlanningService.getAllPlannings().then(res => setPlannings(res.data));
    };

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
                    setAlertConfig({
                        title: "Erreur",
                        message: (err.response?.data?.message || err.message),
                        type: 'error'
                    });
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

    const handleDeleteIndividu = (id) => {
        setIndividuToDelete(id);
    };

    const confirmDeleteIndividu = () => {
        if (individuToDelete) {
            IndividuService.deleteIndividu(individuToDelete, { Authorization: "Basic " + currentUser.authdata }).then(() => {
                setIndividuToDelete(null);
                loadIndividus();
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
    const displayName = (currentUser.firstName && currentUser.lastName)
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : username;
    const initials = (currentUser.firstName && currentUser.lastName)
        ? (currentUser.firstName[0] + currentUser.lastName[0]).toUpperCase()
        : username.substring(0, 2).toUpperCase();

    return (
        <div className={`dashboard-container ${theme}`}>
            {isIndividu && !isProfileComplete && <ProfileCompletion user={currentUser} onComplete={() => { }} />}

            <aside className="sidebar glass text-muted">
                <div className="sidebar-header glass" style={{ padding: '1.5rem', marginBottom: '2rem', borderBottom: 'none' }}>
                    <div className="avatar" style={{
                        width: '70px',
                        height: '70px',
                        fontSize: '1.4rem',
                        margin: '0 auto 1rem',
                        border: '3px solid rgba(255, 255, 255, 0.1)',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
                    }}>{initials}</div>
                    <div className="user-info" style={{ gap: '0.3rem' }}>
                        <span className="username" style={{ color: 'var(--text)', fontSize: '1.1rem', fontWeight: '800' }}>{displayName}</span>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <span className="role-tag" style={{
                                background: 'rgba(6, 182, 212, 0.15)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '1rem',
                                fontSize: '0.65rem'
                            }}>{roleName.replace('ROLE_', '')}</span>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {(isAdmin || isAssistant) && (
                        <button
                            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <span className="icon">🏠</span> {t('overview')}
                        </button>
                    )}

                    {isIndividu && (
                        <>
                            <button
                                className={`nav-item ${activeTab === 'catalogue' ? 'active' : ''}`}
                                onClick={() => setActiveTab('catalogue')}
                            >
                                <span className="icon">📚</span> Catalogue
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'my-trainings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('my-trainings')}
                            >
                                <span className="icon">🎓</span> Mes Formations
                            </button>
                        </>
                    )}
                    <button
                        className={`nav-item ${activeTab === 'trainings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trainings')}
                    >
                        <span className="icon">📘</span> {t('trainings')}
                    </button>

                    {(isAdmin || isAssistant) && (
                        <button
                            className={`nav-item ${activeTab === 'formateurs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('formateurs')}
                        >
                            <span className="icon">👤</span> {t('formateurs')}
                        </button>
                    )}

                    {(isAdmin || isAssistant) && (
                        <button
                            className={`nav-item ${activeTab === 'planning' ? 'active' : ''}`}
                            onClick={() => setActiveTab('planning')}
                        >
                            <span className="icon">📅</span> {t('planning')}
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
                    {(isAdmin || isAssistant) && (
                        <button
                            className={`nav-item ${activeTab === 'individus' ? 'active' : ''}`}
                            onClick={() => setActiveTab('individus')}
                        >
                            <span className="icon">👥</span> {t('individus')}
                        </button>
                    )}

                    {(isAdmin || isAssistant) && (
                        <button
                            className={`nav-item ${activeTab === 'inscriptions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('inscriptions')}
                        >
                            <span className="icon">📝</span> Inscriptions
                        </button>
                    )}

                    {(isAdmin || isAssistant) && (
                        <button
                            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notifications')}
                            style={{ position: 'relative' }}
                        >
                            <span className="icon">🔔</span> Notifications
                            {unreadNotifications > 0 && <span className="sidebar-badge">{unreadNotifications}</span>}
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
                {isIndividu && activeTab === 'catalogue' && (
                    <section className="fade-in">
                        <header className="content-title">
                            <h1 className="text-gradient font-black">Catalogue de Formations</h1>
                            <p className="text-muted">Découvrez et inscrivez-vous à nos sessions disponibles</p>
                        </header>
                        {trainings.filter(f => f.pourIndividus || f.statut === 'OUVERTE').length === 0 ? (
                            <div className="glass card text-center" style={{ padding: '6rem 2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <div style={{
                                    fontSize: '4rem',
                                    marginBottom: '1.5rem',
                                    filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.3))'
                                }}>💡</div>
                                <h3 className="text-gradient font-black" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Aucune formation ouverte</h3>
                                <p className="text-muted" style={{ maxWidth: '400px', margin: '0 auto' }}>
                                    Nous préparons actuellement de nouvelles sessions passionnantes. Revenez bientôt pour les découvrir !
                                </p>
                            </div>
                        ) : (
                            <div className="trainings-grid">
                                {trainings.filter(f => f.pourIndividus || f.statut === 'OUVERTE').map(f => {
                                    const isEnrolled = myInscriptions.some(ins => ins.formation?.id === f.id);
                                    return (
                                        <div key={f.id} className="training-card glass fade-in" style={{
                                            padding: '2rem',
                                            minHeight: '420px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            background: 'rgba(16, 23, 42, 0.4)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                                <div style={{
                                                    padding: '0.4rem 0.9rem',
                                                    borderRadius: '2rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '800',
                                                    background: 'rgba(34, 211, 238, 0.15)',
                                                    color: '#22d3ee',
                                                    border: '1px solid rgba(34, 211, 238, 0.3)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    BIENTÔT
                                                </div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', opacity: 0.4 }}>#{f.id}</div>
                                            </div>

                                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: '1.3', marginBottom: '0.8rem', color: '#fff' }}>
                                                {f.titre}
                                            </h3>

                                            <p className="training-desc" style={{
                                                marginBottom: '1.5rem',
                                                fontSize: '0.9rem',
                                                color: 'var(--text-muted)',
                                                lineHeight: '1.6',
                                                height: 'auto',
                                                display: '-webkit-box',
                                                WebkitLineClamp: '3',
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                opacity: 0.8
                                            }}>
                                                {f.objectifs}
                                            </p>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.6rem',
                                                    color: 'var(--text)',
                                                    fontSize: '0.85rem',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    padding: '0.5rem 0.8rem',
                                                    borderRadius: '0.8rem'
                                                }}>
                                                    <span>⏱️</span> <strong>{f.nombreHeures}h</strong>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.6rem',
                                                    color: 'var(--text)',
                                                    fontSize: '0.85rem',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    padding: '0.5rem 0.8rem',
                                                    borderRadius: '0.8rem'
                                                }}>
                                                    <span>📍</span> <strong>{f.ville}</strong>
                                                </div>
                                            </div>

                                            <div className="training-footer" style={{
                                                marginTop: 'auto',
                                                paddingTop: '1.5rem',
                                                borderTop: '1px solid rgba(255,255,255,0.05)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '700', marginBottom: '0.2rem' }}>INVESTISSEMENT</span>
                                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                                        <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff' }}>{f.cout}</span>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>MAD</span>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                                                    <button
                                                        className={`btn ${isEnrolled ? 'btn-outline' : 'btn-primary'}`}
                                                        style={{
                                                            padding: '0.7rem 1.4rem',
                                                            borderRadius: '0.8rem',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '800',
                                                            boxShadow: isEnrolled ? 'none' : '0 8px 16px rgba(34, 211, 238, 0.2)'
                                                        }}
                                                        onClick={() => {
                                                            if (isEnrolled) {
                                                                setTrainingToUnenroll(f);
                                                            } else {
                                                                setEnrollmentFormation(f);
                                                                setEnrollmentData({
                                                                    nom: currentUser.lastName || '',
                                                                    prenom: currentUser.firstName || '',
                                                                    email: currentUser.email || '',
                                                                    telephone: currentUser.phone || '',
                                                                    ville: '',
                                                                    dateNaissance: ''
                                                                });
                                                                setShowEnrollmentForm(true);
                                                            }
                                                        }}
                                                    >
                                                        {isEnrolled ? "✓ Inscrit" : "S'inscrire"}
                                                    </button>
                                                    <button
                                                        className="btn"
                                                        style={{
                                                            padding: '0.65rem 1.2rem',
                                                            borderRadius: '0.8rem',
                                                            border: '1px solid rgba(34, 211, 238, 0.3)',
                                                            color: '#22d3ee',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '700',
                                                            background: 'rgba(34,211,238,0.03)',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onClick={() => setSelectedFormation(f)}
                                                    >
                                                        Détails
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}

                {isIndividu && activeTab === 'my-trainings' && (
                    <section className="fade-in">
                        <header className="content-title">
                            <h1 className="text-gradient font-black">Mes Formations</h1>
                            <p className="text-muted">Suivez vos sessions et accédez au contenu pédagogique</p>
                        </header>

                        {myInscriptions.length === 0 ? (
                            <div className="glass card text-center" style={{ padding: '6rem 2rem', background: 'rgba(255,255,255,0.01)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎓</div>
                                <h3 className="font-black" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Commencez votre apprentissage</h3>
                                <p className="text-muted" style={{ marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
                                    Vous n'avez pas encore d'inscriptions actives. Explorez notre catalogue pour trouver la formation qui vous correspond.
                                </p>
                                <button className="btn btn-primary" onClick={() => setActiveTab('catalogue')}>
                                    Parcourir le catalogue
                                </button>
                            </div>
                        ) : (
                            <div className="trainings-grid">
                                {myInscriptions.map(i => (
                                    <div key={i.id} className="training-card glass fade-in" style={{ padding: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                            <div className="training-badge" style={{
                                                position: 'static',
                                                backgroundColor: i.statut === 'CONFIRMEE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(6, 182, 212, 0.1)',
                                                color: i.statut === 'CONFIRMEE' ? '#10b981' : 'var(--primary)',
                                                borderColor: i.statut === 'CONFIRMEE' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(6, 182, 212, 0.3)'
                                            }}>
                                                {i.statut}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID-{i.id}</div>
                                        </div>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem' }}>{i.formation?.titre}</h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem' }}>
                                                <span style={{ opacity: 0.7 }}>📅</span>
                                                <span>{i.formation?.dateDebut && new Date(i.formation.dateDebut).toLocaleDateString()} — {i.formation?.dateFin && new Date(i.formation.dateFin).toLocaleDateString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem' }}>
                                                <span style={{ opacity: 0.7 }}>📍</span>
                                                <span>{i.formation?.ville}</span>
                                            </div>
                                        </div>

                                        <button className="btn btn-outline" style={{ width: '100%', borderRadius: '1rem' }} onClick={() => setSelectedFormation(i.formation)}>
                                            Accéder aux ressources
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {(isAdmin || isAssistant) && activeTab === 'overview' && (
                    <section className="fade-in">
                        <header className="content-title">
                            <h1 className="text-gradient font-black">{t('dashboard_title')}</h1>
                            <p className="text-muted">{t('welcome')}, {username} !</p>
                        </header>

                        <div className="overview-layout">
                            <div className="main-stats">
                                <div className="stats-grid" style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '1.2rem',
                                    maxWidth: '1000px'
                                }}>
                                    {/* Compte Principal */}
                                    <div className="stat-card glass" style={{
                                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.02))',
                                        border: '1px solid rgba(6, 182, 212, 0.2)',
                                        borderLeft: '4px solid var(--primary)',
                                        padding: '1rem 1.2rem'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <span className="stat-label" style={{ fontWeight: '800', fontSize: '0.75rem', opacity: 0.7 }}>Compte Principal</span>
                                                <div style={{ padding: '0.5rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '10px', color: 'var(--primary)' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '0.6rem' }}>
                                                <span className="stat-value" style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text)', wordBreak: 'break-all', opacity: 0.9 }}>{currentUser.email}</span>
                                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actif</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Formations Actives */}
                                    <div className="stat-card glass" style={{
                                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.02))',
                                        border: '1px solid rgba(139, 92, 246, 0.2)',
                                        borderLeft: '4px solid #8b5cf6',
                                        padding: '1rem 1.2rem'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <span className="stat-label" style={{ fontWeight: '800', fontSize: '0.75rem', opacity: 0.7 }}>{t('active_trainings')}</span>
                                                <div style={{ padding: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '10px', color: '#8b5cf6' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '0.6rem' }}>
                                                <span className="stat-value" style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 }}>{trainings.length}</span>
                                                <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Catalogue complet</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Formateurs Total */}
                                    <div className="stat-card glass" style={{
                                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.02))',
                                        border: '1px solid rgba(236, 72, 153, 0.2)',
                                        borderLeft: '4px solid #ec4899',
                                        padding: '1rem 1.2rem'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <span className="stat-label" style={{ fontWeight: '800', fontSize: '0.75rem', opacity: 0.7 }}>{t('total_formateurs')}</span>
                                                <div style={{ padding: '0.5rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '10px', color: '#ec4899' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '0.6rem' }}>
                                                <span className="stat-value" style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 }}>{formateurs.length}</span>
                                                <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Experts certifiés</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Calendrier */}
                                    <div className="stat-card glass" onClick={() => setActiveTab('planning')} style={{
                                        cursor: 'pointer',
                                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.02))',
                                        border: '1px solid rgba(245, 158, 11, 0.2)',
                                        borderLeft: '4px solid #f59e0b',
                                        padding: '1rem 1.2rem'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <span className="stat-label" style={{ fontWeight: '800', fontSize: '0.75rem', opacity: 0.7 }}>Calendrier</span>
                                                <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px', color: '#f59e0b' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '0.6rem' }}>
                                                <span className="stat-value" style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Voir Planning</span>
                                                <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sessions à venir</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Inscriptions Formations */}
                                    <div className="stat-card glass" onClick={() => setActiveTab('inscriptions')} style={{
                                        cursor: 'pointer',
                                        background: 'linear-gradient(135deg, rgba(63, 102, 241, 0.1), rgba(63, 102, 241, 0.02))',
                                        border: '1px solid rgba(63, 102, 241, 0.2)',
                                        borderLeft: '4px solid #6366f1',
                                        padding: '1rem 1.2rem'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <span className="stat-label" style={{ fontWeight: '800', fontSize: '0.75rem', opacity: 0.7 }}>Inscriptions</span>
                                                <div style={{ padding: '0.5rem', background: 'rgba(63, 102, 241, 0.1)', borderRadius: '10px', color: '#6366f1' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '0.6rem' }}>
                                                <span className="stat-value" style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 }}>{stats.totalInscriptions}</span>
                                                <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Inscriptions totales</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Individus Enregistrés */}
                                    <div className="stat-card glass" onClick={() => setActiveTab('individus')} style={{
                                        cursor: 'pointer',
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))',
                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                        borderLeft: '4px solid #10b981',
                                        padding: '1rem 1.2rem'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <span className="stat-label" style={{ fontWeight: '800', fontSize: '0.75rem', opacity: 0.7 }}>Individus</span>
                                                <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', color: '#10b981' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '0.6rem' }}>
                                                <span className="stat-value" style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 }}>{stats.totalIndividus || 0}</span>
                                                <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Individus enregistrés</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="memo-section glass" style={{ marginTop: '1.5rem', padding: '1.5rem', maxWidth: '600px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                        <div>
                                            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.2rem' }}>{t('memos')}</h2>
                                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Notes rapides</p>
                                        </div>
                                        <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '800', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span style={{ color: 'var(--primary)' }}>{memos.length}</span> / 5
                                        </div>
                                    </div>

                                    <form onSubmit={addMemo} className="memo-form" style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <input
                                                type="text"
                                                className="input-field memo-input"
                                                placeholder="Ajouter une note..."
                                                value={memoInput}
                                                onChange={(e) => setMemoInput(e.target.value)}
                                                style={{ paddingLeft: '1.2rem', background: 'rgba(255,255,255,0.02)', height: '44px', fontSize: '0.85rem' }}
                                            />
                                        </div>
                                        <button className="memo-btn" style={{ height: '44px', width: '44px', fontSize: '1.2rem' }}>+</button>
                                    </form>

                                    <div className="memo-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        {memos.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.01)', borderRadius: '1.5rem', border: '1px dashed rgba(255,255,255,0.05)' }}>
                                                <p className="text-muted" style={{ fontStyle: 'italic' }}>Aucune note pour le moment</p>
                                            </div>
                                        ) : (
                                            memos.map(memo => (
                                                <div key={memo.id} className="memo-item glass" style={{ padding: '1.2rem 1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    {editingMemoId === memo.id ? (
                                                        <div style={{ display: 'flex', gap: '0.8rem', width: '100%' }}>
                                                            <input
                                                                type="text"
                                                                className="input-field memo-input"
                                                                value={editingMemoContent}
                                                                onChange={(e) => setEditingMemoContent(e.target.value)}
                                                                autoFocus
                                                                style={{ padding: '0.5rem 1rem', fontSize: '0.95rem' }}
                                                            />
                                                            <button onClick={() => saveEditingMemo(memo.id)} className="memo-action-btn check">✓</button>
                                                            <button onClick={cancelEditingMemo} className="memo-action-btn cancel">✕</button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }}></div>
                                                                <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text)' }}>{memo.content}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                            {(isAdmin || isAssistant) && (
                                <button className="btn btn-primary" onClick={() => setActiveTab('add-training')}>
                                    <span style={{ marginRight: '0.5rem', fontSize: '1.2rem' }}>+</span> {t('new_training')}
                                </button>
                            )}
                        </header>

                        <div className="trainings-grid">
                            {loading && <div className="text-muted">{t('loading')}</div>}
                            {formationsError && (
                                <div className="glass" style={{ padding: '1.2rem 2rem', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', borderRadius: '1.5rem', gridColumn: '1 / -1' }}>
                                    ⚠️ {t('error_loading')} ({formationsError})
                                </div>
                            )}
                            {!loading && trainings.length === 0 ? (
                                <div className="glass card text-center" style={{ padding: '4rem', gridColumn: '1 / -1' }}>
                                    <p className="text-muted">{t('no_trainings')}</p>
                                </div>
                            ) : (
                                trainings.map(t_item => (
                                    <div key={t_item.id} className="training-card glass fade-in" style={{ padding: '1.5rem', minHeight: '320px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div style={{ padding: '0.3rem 0.6rem', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: '800', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                                                {t_item.nombreHeures} HEURES
                                            </div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--accent)', opacity: 0.6 }}>#{t_item.id}</div>
                                        </div>

                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.6rem', lineHeight: '1.4' }}>{t_item.titre}</h3>
                                        <p className="training-desc" style={{ marginBottom: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineClamp: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t_item.objectifs}</p>

                                        {t_item.formateur && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.6rem', marginBottom: '1.2rem' }}>
                                                <span style={{ fontSize: '0.9rem' }}>👨‍🏫</span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text)' }}>{t_item.formateur.user?.firstName || t_item.formateur.user?.username}</span>
                                            </div>
                                        )}

                                        <div className="training-footer" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>COÛT</span>
                                                <span className="price" style={{ fontSize: '1.1rem' }}>{t_item.cout} <small style={{ fontSize: '0.7rem' }}>MAD</small></span>
                                            </div>
                                            {(isAdmin || isAssistant) && (
                                                <div style={{ display: 'flex', gap: '0.6rem' }}>
                                                    <button className="btn-icon edit" onClick={() => handleEditTraining(t_item)} title="Modifier" style={{ width: '34px', height: '34px', borderRadius: '8px' }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                    <button className="btn-icon delete" onClick={() => handleDeleteTraining(t_item.id)} title="Supprimer" style={{ width: '34px', height: '34px', borderRadius: '8px' }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </button>
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
                                <span style={{ marginRight: '0.5rem', fontSize: '1.2rem' }}>+</span> {t('new_entreprise')}
                            </button>
                        </header>

                        <div className="trainings-grid">
                            {loading && <div className="text-muted">{t('loading')}</div>}
                            {!loading && entreprises.length === 0 ? (
                                <div className="glass card text-center" style={{ padding: '4rem', gridColumn: '1 / -1' }}>
                                    <p className="text-muted">{t('no_entreprises')}</p>
                                </div>
                            ) : (
                                entreprises.map(e => (
                                    <div key={e.id} className="training-card glass fade-in" style={{ padding: '1.5rem', minHeight: '280px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: '1rem',
                                                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(99, 102, 241, 0.1))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem',
                                                border: '1px solid rgba(255, 255, 255, 0.05)'
                                            }}>🏢</div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{e.nom}</h3>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>{e.secteur || 'ENTREPRISE'}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.8rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--text)' }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                <span style={{ opacity: 0.8 }}>{e.adresse || 'N/A'}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--text)' }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                                <span style={{ opacity: 0.8 }}>{e.telephone || 'Non renseigné'}</span>
                                            </div>
                                            {e.url && (
                                                <a
                                                    href={e.url.startsWith('http') ? e.url : `https://${e.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="glass-btn"
                                                    style={{
                                                        marginTop: '0.4rem',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.6rem',
                                                        padding: '0.6rem 1rem',
                                                        borderRadius: '0.6rem',
                                                        background: 'rgba(6, 182, 212, 0.08)',
                                                        border: '1px solid rgba(6, 182, 212, 0.2)',
                                                        color: 'var(--primary)',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700',
                                                        textDecoration: 'none',
                                                        transition: 'all 0.3s ease',
                                                        width: 'fit-content'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)';
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.15)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.background = 'rgba(6, 182, 212, 0.08)';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                                    <span>{e.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                                                </a>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: 'auto' }}>
                                            <button className="btn btn-outline" style={{ padding: '0.5rem 0.8rem', borderRadius: '0.6rem', fontSize: '0.8rem' }} onClick={() => handleEditEntreprise(e)}>
                                                Gérer
                                            </button>
                                            <button className="btn-icon delete" title="Supprimer" onClick={() => handleDeleteEntreprise(e.id)} style={{ width: '36px', height: '36px', borderRadius: '0.6rem' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'individus' && (isAdmin || isAssistant) && (
                    <section className="fade-in">
                        <header className="content-title">
                            <h1 className="text-gradient font-black">{t('individus')}</h1>
                            <p className="text-muted">{t('individus_desc')}</p>
                        </header>

                        <div className="filters-bar glass" style={{ marginBottom: '3rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom, email ou entreprise..."
                                    className="input-field"
                                    style={{ margin: 0, paddingLeft: '2.8rem', width: '100%' }}
                                    onChange={(e) => setIndividuFilter(e.target.value.toLowerCase())}
                                />
                            </div>
                        </div>

                        {loading && <div className="text-muted">{t('loading')}</div>}
                        {!loading && individus.length === 0 ? (
                            <div className="glass card text-center" style={{ padding: '4rem' }}>
                                <p className="text-muted">Aucun individu inscrit pour le moment.</p>
                            </div>
                        ) : (
                            <div className="entreprise-categories">
                                {[...new Set(individus
                                    .filter(i =>
                                        (i.firstName || '').toLowerCase().includes(individuFilter) ||
                                        (i.lastName || '').toLowerCase().includes(individuFilter) ||
                                        (i.email || '').toLowerCase().includes(individuFilter) ||
                                        (i.entreprise || 'Sans Entreprise').toLowerCase().includes(individuFilter)
                                    )
                                    .map(i => i.entreprise || "Sans Entreprise")
                                )].map(ent => (
                                    <div key={ent} className="entreprise-group" style={{ marginBottom: '4rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                            <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <span style={{ fontSize: '1.2rem' }}>🏢</span> {ent}
                                            </h2>
                                            <div style={{ flex: 1, height: '1px', background: 'var(--border)', opacity: 0.5, marginLeft: '1rem' }}></div>
                                        </div>

                                        <div className="trainings-grid">
                                            {individus
                                                .filter(i => (i.entreprise || "Sans Entreprise") === ent)
                                                .filter(i =>
                                                    (i.firstName || '').toLowerCase().includes(individuFilter) ||
                                                    (i.lastName || '').toLowerCase().includes(individuFilter) ||
                                                    (i.email || '').toLowerCase().includes(individuFilter)
                                                )
                                                .map(i => (
                                                    <div key={i.id} className="training-card glass fade-in" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                                                            <div className="avatar" style={{
                                                                width: '48px',
                                                                height: '48px',
                                                                fontSize: '1rem',
                                                                background: i.profileCompleted ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                                boxShadow: i.profileCompleted ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 4px 12px rgba(239, 68, 68, 0.2)',
                                                                border: 'none'
                                                            }}>
                                                                {(i.firstName?.[0] || i.username[0]).toUpperCase()}
                                                            </div>
                                                            <div style={{
                                                                padding: '0.4rem 0.8rem',
                                                                borderRadius: '2rem',
                                                                fontSize: '0.7rem',
                                                                fontWeight: '800',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.05em',
                                                                background: i.profileCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                                color: i.profileCompleted ? '#10b981' : '#ef4444',
                                                                border: `1px solid ${i.profileCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                                            }}>
                                                                {i.profileCompleted ? "✓ Complet" : "⚠ Incomplet"}
                                                            </div>
                                                        </div>

                                                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '800', color: 'var(--text)' }}>
                                                            {i.firstName} {i.lastName}
                                                        </h3>
                                                        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', opacity: 0.8 }}>
                                                            @{i.username}
                                                        </p>

                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-muted)' }}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                                                <span style={{ fontSize: '0.9rem', color: 'var(--text)', opacity: 0.9 }}>{i.email}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-muted)' }}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                                                <span style={{ fontSize: '0.9rem', color: 'var(--text)', opacity: 0.9 }}>{i.phone || "Non renseigné"}</span>
                                                            </div>
                                                        </div>

                                                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                                                            <button
                                                                className="btn-icon delete"
                                                                title="Supprimer"
                                                                onClick={() => handleDeleteIndividu(i.id)}
                                                                style={{ width: '40px', height: '40px', borderRadius: '12px' }}
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {
                    activeTab === 'add-entreprise' && (isAdmin || isAssistant) && (
                        <section className="fade-in">
                            <button
                                className="btn-back glass"
                                onClick={() => { setActiveTab('entreprises'); setEntrepriseToEdit(null); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    padding: '0.7rem 1.2rem',
                                    borderRadius: '1rem',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    color: 'var(--primary)',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    marginBottom: '2rem',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>←</span> {t('back_list')}
                            </button>
                            <EntrepriseForm
                                onSuccess={() => { setActiveTab('entreprises'); setEntrepriseToEdit(null); loadEntreprises(); }}
                                entrepriseToEdit={entrepriseToEdit}
                            />
                        </section>
                    )
                }

                {
                    activeTab === 'planning' && (
                        <section className="fade-in">
                            <CalendarView role={isAdmin ? 'ADMIN' : (isAssistant ? 'ASSISTANT' : 'USER')} />
                        </section>
                    )
                }

                {
                    activeTab === 'formateurs' && (isAdmin || isAssistant) && (
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
                    )
                }

                {
                    activeTab === 'add-formateur' && (isAdmin || isAssistant) && (
                        <section className="fade-in">
                            <button
                                className="btn-back glass"
                                onClick={() => { setActiveTab('formateurs'); setFormateurToEdit(null); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    padding: '0.7rem 1.2rem',
                                    borderRadius: '1rem',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    color: 'var(--primary)',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    marginBottom: '2rem',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>←</span> {t('back_list')}
                            </button>
                            <FormateurForm
                                onSuccess={() => { setActiveTab('formateurs'); setFormateurToEdit(null); loadFormateurs(); }}
                                formateurToEdit={formateurToEdit}
                            />
                        </section>
                    )
                }

                {
                    activeTab === 'add-training' && (isAdmin || isAssistant) && (
                        <section className="fade-in">
                            <button
                                className="btn-back glass"
                                onClick={() => { setActiveTab('trainings'); setFormationToEdit(null); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    padding: '0.7rem 1.2rem',
                                    borderRadius: '1rem',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    color: 'var(--primary)',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    marginBottom: '2rem',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>←</span> {t('back_list')}
                            </button>
                            <FormationForm
                                onSuccess={() => { setActiveTab('trainings'); setFormationToEdit(null); loadFormations(); }}
                                formationToEdit={formationToEdit}
                                formateurs={formateurs}
                            />
                        </section>
                    )
                }

                {
                    activeTab === 'newsletters' && (
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
                    )
                }

                {
                    activeTab === 'settings' && (
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
                    )
                }

                {
                    (isAdmin || isAssistant) && activeTab === 'notifications' && (
                        <section className="fade-in">
                            <header className="content-title">
                                <h1 className="text-gradient font-black">Centre de Notifications</h1>
                                <p className="text-muted">Suivez les activités et inscriptions en temps réel</p>
                            </header>
                            <div className="notifications-list-container card glass" style={{ padding: '2rem' }}>
                                {notifications.length === 0 ? (
                                    <p className="text-muted" style={{ textAlign: 'center' }}>Aucune notification pour le moment.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {notifications.map(n => (
                                            <div
                                                key={n.id}
                                                className={`notification-item glass ${n.read ? 'read' : 'unread'}`}
                                                style={{
                                                    padding: '1.2rem',
                                                    borderRadius: '12px',
                                                    borderLeft: n.read ? '1px solid rgba(255,255,255,0.05)' : '4px solid var(--primary)',
                                                    background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <div>
                                                    <p style={{ fontWeight: n.read ? '400' : '600', marginBottom: '0.3rem' }}>{n.message}</p>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleString()}</span>
                                                </div>
                                                {!n.read && (
                                                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => {
                                                        NotificationService.markAsRead(n.id).then(() => loadNotifications());
                                                    }}>Marquer comme lu</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )
                }

                {
                    (isAdmin || isAssistant) && activeTab === 'inscriptions' && (
                        <section className="fade-in">
                            <header className="content-title">
                                <h1 className="text-gradient font-black">Gestion des Inscriptions</h1>
                                <p className="text-muted">Affectez les individus à des sessions de formation</p>
                            </header>

                            <div className="inscriptions-list card glass" style={{ padding: '2.5rem', background: 'rgba(10, 15, 30, 0.4)' }}>
                                {allInscriptions.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📝</div>
                                        <p className="text-muted">Aucune inscription à gérer pour le moment.</p>
                                    </div>
                                ) : (
                                    <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                    <th style={{ padding: '0 1.5rem' }}>Individu</th>
                                                    <th style={{ padding: '0 1.5rem' }}>Formation Voulue</th>
                                                    <th style={{ padding: '0 1.5rem' }}>Date d'inscription</th>
                                                    <th style={{ padding: '0 1.5rem' }}>Session / Formateur</th>
                                                    <th style={{ padding: '0 1.5rem', textAlign: 'center' }}>Statut</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allInscriptions.map(insc => (
                                                    <tr key={insc.id} className="glass" style={{
                                                        borderRadius: '16px',
                                                        background: 'rgba(255,255,255,0.02)',
                                                        transition: 'all 0.3s ease',
                                                        verticalAlign: 'middle'
                                                    }}>
                                                        <td style={{ padding: '1.2rem 1.5rem', borderRadius: '16px 0 0 16px' }}>
                                                            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>{insc.individu?.prenom} {insc.individu?.nom}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', opacity: 0.8, fontWeight: '500' }}>{insc.individu?.email}</div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                                            <span className="training-badge" style={{
                                                                position: 'static',
                                                                backgroundColor: 'rgba(34, 211, 238, 0.08)',
                                                                color: '#22d3ee',
                                                                padding: '0.4rem 1rem',
                                                                borderRadius: '2rem',
                                                                border: '1px solid rgba(34, 211, 238, 0.2)',
                                                                fontSize: '0.8rem',
                                                                fontWeight: '700'
                                                            }}>
                                                                {insc.formation?.titre}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1.2rem 1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <span>📅</span> {new Date(insc.dateInscription).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem 1.5rem', minWidth: '240px' }}>
                                                            <select
                                                                className="form-control glass"
                                                                style={{
                                                                    padding: '0.6rem 1rem',
                                                                    fontSize: '0.85rem',
                                                                    background: 'rgba(255,255,255,0.05)',
                                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                                    color: 'white',
                                                                    borderRadius: '10px',
                                                                    width: '100%',
                                                                    outline: 'none',
                                                                    cursor: 'pointer'
                                                                }}
                                                                value={insc.planification?.id || ""}
                                                                onChange={(e) => {
                                                                    if (e.target.value) {
                                                                        InscriptionService.assignPlanning(insc.id, e.target.value)
                                                                            .then(() => {
                                                                                setAlertConfig({ title: "Succès", message: "Affectation réussie !", type: 'success' });
                                                                                loadAllInscriptions();
                                                                            })
                                                                            .catch(err => {
                                                                                setAlertConfig({ title: "Erreur", message: "Échec de l'affectation", type: 'error' });
                                                                            });
                                                                    }
                                                                }}
                                                            >
                                                                <option value="" style={{ background: '#0f172a' }}>-- Affecter une session --</option>
                                                                {plannings
                                                                    .filter(p => p.formation?.id === insc.formation?.id)
                                                                    .map(p => (
                                                                        <option key={p.id} value={p.id} style={{ background: '#0f172a' }}>
                                                                            {new Date(p.dateDebut).toLocaleDateString()} - {p.formateur?.user?.username}
                                                                        </option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </td>
                                                        <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center', borderRadius: '0 16px 16px 0' }}>
                                                            <span style={{
                                                                display: 'inline-block',
                                                                padding: '0.4rem 0.8rem',
                                                                borderRadius: '8px',
                                                                fontSize: '0.7rem',
                                                                fontWeight: '800',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.05em',
                                                                background: insc.statut === 'CONFIRMEE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                                color: insc.statut === 'CONFIRMEE' ? '#10b981' : '#f87171',
                                                                border: `1px solid ${insc.statut === 'CONFIRMEE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                                            }}>
                                                                {insc.statut === 'CONFIRMEE' ? '✓ Confirmée' : '⌛ En attente'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </section>
                    )
                }
            </main >

            {/* Language Selection Modal */}
            {
                isLangModalOpen && (
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
                )
            }
            {/* Password Change Modal */}
            {
                isPasswordModalOpen && (
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
                )
            }

            {/* News Detail Modal */}
            {
                selectedNews && (
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
                )
            }
            {/* Memo Delete Confirmation Modal */}
            {
                memoToDelete && (
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
                )
            }

            {/* Training Delete Confirmation Modal */}
            {
                trainingToDelete && (
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
                )
            }

            {/* Formateur Delete Confirmation Modal */}
            {
                formateurToDelete && (
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
                )
            }

            {/* Entreprise Delete Confirmation Modal */}
            {
                entrepriseToDelete && (
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
                )
            }
            {/* Individu Delete Confirmation Modal */}
            {
                individuToDelete && (
                    <div className="modal-overlay" onClick={() => setIndividuToDelete(null)}>
                        <div className="modal-content glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
                            <h2 className="text-gradient font-black" style={{ marginBottom: '1rem' }}>{t('confirm_delete_individu')}</h2>
                            <p className="text-muted" style={{ marginBottom: '2rem' }}>Cette action est irréversible. Voulez-vous vraiment supprimer cette inscription ?</p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIndividuToDelete(null)}>
                                    {t('close')}
                                </button>
                                <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--error)' }} onClick={confirmDeleteIndividu}>
                                    {t('delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Formation Details Modal for Individu */}
            {
                selectedFormation && (
                    <div className="modal-overlay" onClick={() => setSelectedFormation(null)} style={{ zIndex: 1100 }}>
                        <div className="modal-content glass fade-in" onClick={e => e.stopPropagation()} style={{
                            maxWidth: '800px',
                            width: '90%',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '0',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}>
                            {/* Modal Header */}
                            <div style={{
                                padding: '2.5rem 2.5rem 1.5rem',
                                background: 'linear-gradient(to bottom, rgba(34, 211, 238, 0.05), transparent)',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h2 className="text-gradient font-black" style={{ fontSize: '2rem', margin: 0, lineHeight: '1.2' }}>
                                        {selectedFormation.titre}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedFormation(null)}
                                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', opacity: 0.5 }}
                                    >✕</button>
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem' }}>
                                    <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: '800', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                                        {selectedFormation.categorie || 'FORMATION'}
                                    </span>
                                </div>
                            </div>

                            {/* Modal Body - Scrollable */}
                            <div style={{
                                padding: '2.5rem',
                                overflowY: 'auto',
                                flex: 1,
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(34, 211, 238, 0.3) transparent'
                            }} className="custom-scroll">
                                <div className="detail-section" style={{ marginBottom: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <span style={{ fontSize: '1.4rem' }}>🎯</span> Objectifs de la formation
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1rem' }}>
                                        {selectedFormation.objectifs}
                                    </p>
                                </div>

                                <div className="detail-section" style={{ marginBottom: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <span style={{ fontSize: '1.4rem' }}>📝</span> Programme détaillé
                                    </h3>
                                    <div style={{
                                        padding: '1.8rem',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: '1.2rem',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        whiteSpace: 'pre-wrap',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        lineHeight: '1.8',
                                        fontSize: '0.95rem'
                                    }}>
                                        {selectedFormation.programmeDetaille}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                                    <div style={{ padding: '1.2rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                        <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '0.5rem' }}>📅 PLANNING</span>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                                            {selectedFormation.dateDebut ?
                                                `${new Date(selectedFormation.dateDebut).toLocaleDateString()} au ${selectedFormation.dateFin ? new Date(selectedFormation.dateFin).toLocaleDateString() : '?'}`
                                                : 'Date à venir'}
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.2rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                        <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '0.5rem' }}>🏢 VILLE</span>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedFormation.ville}</div>
                                    </div>
                                    <div style={{ padding: '1.2rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                        <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '0.5rem' }}>⏱️ DURÉE</span>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedFormation.nombreHeures} heures</div>
                                    </div>
                                    <div style={{ padding: '1.2rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                        <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '0.5rem' }}>💰 PRIX</span>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#22d3ee' }}>{selectedFormation.cout} MAD</div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div style={{
                                padding: '1.5rem 2.5rem',
                                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                background: 'rgba(255, 255, 255, 0.01)',
                                display: 'flex',
                                gap: '1rem'
                            }}>
                                <button
                                    className="btn btn-outline"
                                    style={{ flex: 1, padding: '1rem' }}
                                    onClick={() => setSelectedFormation(null)}
                                >
                                    Fermer
                                </button>
                                {isIndividu && (
                                    <button
                                        className={`btn ${myInscriptions.some(ins => ins.formation?.id === selectedFormation.id) ? 'btn-outline' : 'btn-primary'}`}
                                        style={{
                                            flex: 1.5,
                                            padding: '1rem',
                                            boxShadow: myInscriptions.some(ins => ins.formation?.id === selectedFormation.id) ? 'none' : '0 10px 20px rgba(34, 211, 238, 0.2)'
                                        }}
                                        onClick={() => {
                                            if (myInscriptions.some(ins => ins.formation?.id === selectedFormation.id)) {
                                                setTrainingToUnenroll(selectedFormation);
                                            } else {
                                                setEnrollmentFormation(selectedFormation);
                                                setEnrollmentData({
                                                    nom: currentUser.lastName || '',
                                                    prenom: currentUser.firstName || '',
                                                    email: currentUser.email || '',
                                                    telephone: currentUser.phone || '',
                                                    ville: '',
                                                    dateNaissance: ''
                                                });
                                                setShowEnrollmentForm(true);
                                            }
                                        }}
                                    >
                                        {myInscriptions.some(ins => ins.formation?.id === selectedFormation.id) ? "✓ Déjà inscrit (Se désinscrire)" : "S'inscrire maintenant"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Compact Elevated Enrollment Form Modal */}
            {showEnrollmentForm && enrollmentFormation && (
                <div className="modal-overlay fade-in" style={{
                    zIndex: 2500,
                    backgroundColor: 'rgba(2, 6, 23, 0.85)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="modal-content glass fade-in-up" style={{
                        maxWidth: '520px',
                        width: '95%',
                        padding: '0',
                        overflow: 'hidden',
                        borderRadius: '1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.1)'
                    }}>
                        {/* Modal Header Wrap */}
                        <div style={{
                            padding: '2rem 1.5rem 1.5rem',
                            textAlign: 'center',
                            background: 'linear-gradient(to bottom, rgba(6, 182, 212, 0.05), transparent)',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))',
                                borderRadius: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.2rem',
                                fontSize: '1.8rem',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
                            }}>
                                📝
                            </div>
                            <h2 className="text-gradient font-black" style={{ fontSize: '1.8rem', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                                {t('inscription_title') || "Inscription"}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                                {enrollmentFormation.titre}
                            </p>

                            <button
                                onClick={() => setShowEnrollmentForm(false)}
                                style={{
                                    position: 'absolute', top: '1.2rem', right: '1.2rem',
                                    background: 'rgba(255,255,255,0.05)', border: 'none',
                                    borderRadius: '50%', width: '28px', height: '28px',
                                    color: 'white', cursor: 'pointer', transition: 'var(--transition)'
                                }}
                            >×</button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                InscriptionService.registerToFormation(enrollmentFormation.id, enrollmentData)
                                    .then(() => {
                                        setShowEnrollmentForm(false);
                                        setSelectedFormation(null);
                                        loadMyInscriptions();
                                        setAlertConfig({
                                            title: "Succès !",
                                            message: "Votre demande d'inscription a été envoyée.",
                                            type: 'success'
                                        });
                                    })
                                    .catch(err => {
                                        const msg = err.response?.data?.message || err.response?.data || "Erreur lors de l'inscription";
                                        setAlertConfig({ title: "Échec", message: msg, type: 'error' });
                                    });
                            }}
                            style={{ padding: '0 1.5rem 2rem' }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group-custom">
                                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Nom</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.8rem', padding: '0.7rem 1rem', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}
                                        required
                                        value={enrollmentData.nom}
                                        onChange={e => setEnrollmentData({ ...enrollmentData, nom: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-custom">
                                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Prénom</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.8rem', padding: '0.7rem 1rem', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}
                                        required
                                        value={enrollmentData.prenom}
                                        onChange={e => setEnrollmentData({ ...enrollmentData, prenom: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group-custom" style={{ marginTop: '1rem' }}>
                                <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Email Professionnelle</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.8rem', padding: '0.7rem 1rem', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}
                                    required
                                    value={enrollmentData.email}
                                    onChange={e => setEnrollmentData({ ...enrollmentData, email: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                <div className="form-group-custom">
                                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Naissance</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.8rem', padding: '0.78rem 1rem', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}
                                        required
                                        value={enrollmentData.dateNaissance}
                                        onChange={e => setEnrollmentData({ ...enrollmentData, dateNaissance: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-custom">
                                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Téléphone</label>
                                    <input
                                        type="tel"
                                        className="input-field"
                                        style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.8rem', padding: '0.7rem 1rem', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}
                                        required
                                        value={enrollmentData.telephone}
                                        onChange={e => setEnrollmentData({ ...enrollmentData, telephone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group-custom" style={{ marginTop: '1rem' }}>
                                <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Ville</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.8rem', padding: '0.7rem 1rem', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}
                                    required
                                    value={enrollmentData.ville}
                                    onChange={e => setEnrollmentData({ ...enrollmentData, ville: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1, padding: '0.7rem', borderRadius: '0.8rem', fontSize: '0.85rem' }} onClick={() => setShowEnrollmentForm(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1.5, padding: '0.7rem', borderRadius: '0.8rem', fontSize: '0.85rem' }}>
                                    Confirmer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Unenrollment Confirmation Modal */}
            {trainingToUnenroll && (
                <div className="modal-overlay fade-in" style={{ backgroundColor: 'rgba(6, 9, 19, 0.95)', zIndex: 2000 }}>
                    <div className="modal-content glass" style={{ maxWidth: '450px', padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.4))' }}>⚠️</div>
                        <h2 className="font-black" style={{ fontSize: '1.6rem', marginBottom: '1rem', color: '#ef4444' }}>{t('confirm_unenroll_title')}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                            {t('confirm_unenroll')} <br /><strong>{trainingToUnenroll.titre}</strong>
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setTrainingToUnenroll(null)}>
                                {t('keep_enrolled')}
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1.2, background: '#ef4444', boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)' }}
                                onClick={() => {
                                    InscriptionService.unregisterFromFormation(trainingToUnenroll.id)
                                        .then(() => {
                                            loadMyInscriptions();
                                            setTrainingToUnenroll(null);
                                            setSelectedFormation(null);
                                            setAlertConfig({
                                                title: "Réussi",
                                                message: "Vous avez été désinscrit avec succès.",
                                                type: 'success'
                                            });
                                        })
                                        .catch(err => {
                                            setAlertConfig({ title: "Erreur", message: "Échec de la désinscription", type: 'error' });
                                        });
                                }}
                            >
                                {t('unenroll_btn')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Alert Modal */}
            {alertConfig && (
                <div className="modal-overlay fade-in" style={{ backgroundColor: 'rgba(6, 9, 19, 0.95)', zIndex: 9999 }}>
                    <div className="modal-content glass" style={{ maxWidth: '450px', padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: alertConfig.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            margin: '0 auto 1.5rem',
                            border: `2px solid ${alertConfig.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                        }}>
                            {alertConfig.type === 'success' ? '✓' : '⚠'}
                        </div>
                        <h2 className="font-black" style={{ marginBottom: '1rem', color: alertConfig.type === 'success' ? '#10b981' : '#ef4444' }}>
                            {alertConfig.title}
                        </h2>
                        <p className="text-muted" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
                            {alertConfig.message}
                        </p>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', borderRadius: '1rem' }}
                            onClick={() => setAlertConfig(null)}
                        >
                            Compris
                        </button>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Dashboard;
