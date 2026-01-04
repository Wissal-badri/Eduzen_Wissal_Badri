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
import RessourceViewer from "./individu/RessourceViewer";
import EvaluationModal from "./individu/EvaluationModal";
import InscriptionService from "../services/inscription.service";
import NotificationService from "../services/notification.service";
import PlanningService from "../services/planning.service";
import axios from "axios";
import authHeader from "../services/auth-header";
import ProfileCompletion from "./ProfileCompletion";
import PasswordManagement from "./admin/PasswordManagement";
import RessourceManagement from "./formateur/RessourceManagement";
import StarRating from "./StarRating";
import {
    FiHome, FiBookOpen, FiAward, FiBook, FiUsers,
    FiCalendar, FiBriefcase, FiEdit, FiBell, FiLock,
    FiLogOut, FiSettings, FiStar, FiSearch, FiPlus,
    FiTrash2, FiClock, FiActivity, FiMail, FiCheckCircle,
    FiInfo, FiAlertCircle, FiChevronRight, FiGrid, FiUser,
    FiMapPin, FiCpu, FiLayout, FiMessageSquare, FiPhone, FiGlobe
} from 'react-icons/fi';

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
        if (!user || !user.role) return "overview";

        // Helper to safely extract role (copied logic for initialization)
        const getInitRoleName = (u) => {
            if (!u || !u.role) return '';
            if (typeof u.role === 'string') return u.role;
            if (typeof u.role === 'object' && u.role.name) return u.role.name;
            return String(u.role);
        };

        const rName = getInitRoleName(user);
        if (rName === "ROLE_INDIVIDU" || rName === "INDIVIDU") return "catalogue";
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
    const [showResourcesModal, setShowResourcesModal] = useState(null);
    const [showEvaluationModal, setShowEvaluationModal] = useState(null);
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
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedInscToEdit, setSelectedInscToEdit] = useState(null);
    const [formateurToApprove, setFormateurToApprove] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedIndividuProfile, setSelectedIndividuProfile] = useState(null);

    // Helper to safely extract role
    const getRoleNameFromUser = (user) => {
        if (!user || !user.role) return '';
        if (typeof user.role === 'string') return user.role;
        if (typeof user.role === 'object' && user.role.name) return user.role.name;
        return String(user.role);
    };

    const currentUserRole = getRoleNameFromUser(currentUser);
    const isCurrentFormateur = currentUserRole === 'ROLE_FORMATEUR' || currentUserRole === 'FORMATEUR';

    // Centralized role definitions (moved from bottom to fix ReferenceErrors)
    const roleName = currentUserRole;
    const isFormateur = isCurrentFormateur;
    const isAdmin = currentUserRole === 'ROLE_ADMIN' || currentUserRole === 'ADMIN';
    const isAssistant = currentUserRole === 'ROLE_ASSISTANT' || currentUserRole === 'ASSISTANT';
    const isIndividu = currentUserRole === 'ROLE_INDIVIDU' || currentUserRole === 'INDIVIDU';


    // Check if current user is a FORMATEUR pending approval (not admin or other roles)
    // TEMPORARILY DISABLED FOR DEBUGGING
    const isPendingApproval = false; // currentUser && !currentUser.enabled && isCurrentFormateur;

    // Log for debugging
    if (currentUser && isCurrentFormateur) {
        console.log('DEBUG - Current User:', currentUser);
        console.log('DEBUG - Enabled:', currentUser.enabled);
        console.log('DEBUG - Is Formateur:', isCurrentFormateur);
    }

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
    const [formateurRatings, setFormateurRatings] = useState({});

    useEffect(() => {
        if (formateurs && formateurs.length > 0) {
            console.log('Loading ratings for', formateurs.length, 'formateurs');
            formateurs.forEach(f => {
                // Use f.user.id instead of f.id because evaluations are linked to the user
                const userId = f.user?.id;
                if (userId) {
                    FormateurService.getFormateurRatingByUserId(userId).then(res => {
                        console.log(`Rating loaded for formateur ${f.user.username} (ID: ${userId}):`, res.data);
                        setFormateurRatings(prev => ({ ...prev, [f.id]: res.data }));
                    }).catch(err => {
                        console.error(`Error loading rating for formateur ${f.user.username} (ID: ${userId})`, err);
                        // Set default rating even on error so the UI shows something
                        setFormateurRatings(prev => ({ ...prev, [f.id]: { averageRating: 0, totalEvaluations: 0 } }));
                    });
                }
            });
        }
    }, [formateurs]);

    const [currentUserRating, setCurrentUserRating] = useState(null);

    useEffect(() => {
        if (isFormateur && currentUser?.id) {
            console.log('Loading rating for current formateur user:', currentUser.id, currentUser.username);
            FormateurService.getFormateurRatingByUserId(currentUser.id).then(res => {
                console.log('Current user rating loaded:', res.data);
                setCurrentUserRating(res.data);
            }).catch(err => {
                console.error("Could not load my rating:", err);
                console.error("Error details:", err.response?.data);
                // Set default rating even on error
                setCurrentUserRating({ averageRating: 0, totalEvaluations: 0 });
            });
        } else {
            console.log('Not loading rating - isFormateur:', isFormateur, 'currentUser.id:', currentUser?.id);
        }
    }, [isFormateur, currentUser]);

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
                const status = err.response?.status;
                let msg = err.response?.data?.message || err.message || "Erreur réseau";
                if (status === 401) {
                    msg = "Session expirée ou droits insuffisants. Veuillez vous reconnecter.";
                }
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
                let loadedTrainings = Array.isArray(response.data) ? response.data : [];

                // Filter for FORMATEUR role: only show their own formations
                const userRole = currentUser?.role?.name || currentUser?.role;
                if (userRole === 'FORMATEUR' || userRole === 'ROLE_FORMATEUR') {
                    loadedTrainings = loadedTrainings.filter(f =>
                        f.formateur?.user?.id === currentUser.id
                    );
                }

                setTrainings(loadedTrainings);
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
                if (err.response?.status === 401) {
                    // Stale session detected
                    localStorage.removeItem("user");
                    window.location.reload();
                }
            }
        };
        fetchCurrentUser();
    }, []); // Run once on mount

    useEffect(() => {
        if (currentUser?.id) {
            loadFormations();
            loadMemos();
            if (isAdmin || isAssistant || isFormateur) {
                loadFormateurs();
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
    }, [currentUser?.id, isAdmin, isAssistant, isIndividu, isFormateur]);

    useEffect(() => {
        if (activeTab === 'inscriptions' && (isAdmin || isAssistant)) {
            loadAllInscriptions();
            loadPlannings();
        }
    }, [activeTab, isAdmin, isAssistant]);

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

    const handleClearNotifications = () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les notifications ?")) {
            NotificationService.clearAllNotifications().then(() => {
                loadNotifications();
            });
        }
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

            {/* Pending Approval Modal - Blocks everything */}
            {isPendingApproval && (
                <div className="modal-overlay" style={{ zIndex: 9999, backdropFilter: 'blur(10px)' }}>
                    <div className="glass card modal-content-premium" style={{ maxWidth: '500px', padding: '3rem', textAlign: 'center' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(168, 85, 247, 0.2))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            margin: '0 auto 2rem',
                            border: '3px solid rgba(6, 182, 212, 0.4)',
                            animation: 'pulse 2s infinite'
                        }}>
                            ⏳
                        </div>
                        <h2 className="font-black text-gradient" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                            Compte en attente d'approbation
                        </h2>
                        <p className="text-muted" style={{ marginBottom: '1.5rem', lineHeight: '1.8', fontSize: '1.05rem' }}>
                            Votre compte formateur a été créé avec succès et est actuellement en cours de vérification par notre équipe administrative.
                        </p>
                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(6, 182, 212, 0.1)',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            border: '1px solid rgba(6, 182, 212, 0.2)'
                        }}>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--primary)' }}>
                                <strong>📧 Vous recevrez un email</strong> dès que votre compte sera approuvé. Cela peut prendre quelques heures.
                            </p>
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
                            onClick={() => {
                                AuthService.logout();
                                window.location.href = '/login';
                            }}
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>
            )}

            <aside className="sidebar glass text-muted">
                <div className="sidebar-header glass" style={{
                    padding: '2rem 1.5rem',
                    marginBottom: '2rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08), transparent)'
                }}>
                    {/* Avatar with modern design */}
                    <div className="avatar" style={{
                        width: '80px',
                        height: '80px',
                        fontSize: '1.6rem',
                        margin: '0 auto 1.2rem',
                        border: '3px solid rgba(6, 182, 212, 0.3)',
                        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                        boxShadow: '0 8px 24px rgba(6, 182, 212, 0.25), 0 0 20px rgba(6, 182, 212, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        letterSpacing: '0.05em'
                    }}>{initials}</div>

                    {/* User info */}
                    <div className="user-info" style={{ gap: '0.5rem', textAlign: 'center' }}>
                        <span className="username" style={{
                            color: '#fff',
                            fontSize: '1.2rem',
                            fontWeight: '800',
                            display: 'block',
                            marginBottom: '0.5rem',
                            lineHeight: '1.3'
                        }}>{displayName}</span>

                        {/* Role badge */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.8rem' }}>
                            <span className="role-tag" style={{
                                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1))',
                                padding: '0.4rem 1rem',
                                borderRadius: '2rem',
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                color: '#06b6d4'
                            }}>{roleName.replace('ROLE_', '')}</span>
                        </div>

                        {/* Rating for formateurs - Compact version */}
                        {isFormateur && (
                            <div style={{
                                marginTop: '0.6rem',
                                padding: '0.5rem 0.6rem',
                                background: 'rgba(245, 158, 11, 0.06)',
                                borderRadius: '0.6rem',
                                border: '1px solid rgba(245, 158, 11, 0.12)',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                {currentUserRating ? (
                                    <StarRating
                                        rating={currentUserRating.averageRating || 0}
                                        totalEvaluations={currentUserRating.totalEvaluations || 0}
                                        size={14}
                                        showCount={true}
                                    />
                                ) : (
                                    <div style={{
                                        fontSize: '0.7rem',
                                        color: 'rgba(245, 158, 11, 0.6)',
                                        fontStyle: 'italic'
                                    }}>
                                        Chargement...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {(isAdmin || isAssistant || isFormateur) && (
                        <button
                            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <FiHome className="sidebar-icon" /> {t('overview')}
                        </button>
                    )}

                    {isIndividu && (
                        <>
                            <button
                                className={`nav-item ${activeTab === 'catalogue' ? 'active' : ''}`}
                                onClick={() => setActiveTab('catalogue')}
                            >
                                <FiGrid className="sidebar-icon" /> Catalogue
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'my-trainings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('my-trainings')}
                            >
                                <FiAward className="sidebar-icon" /> Mes Formations
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'evaluations' ? 'active' : ''}`}
                                onClick={() => setActiveTab('evaluations')}
                            >
                                <FiStar className="sidebar-icon" /> Évaluations
                            </button>
                        </>
                    )}
                    <button
                        className={`nav-item ${activeTab === 'trainings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trainings')}
                    >
                        <FiBook className="sidebar-icon" /> {t('trainings')}
                    </button>

                    {(isAdmin || isAssistant) && (
                        <button
                            className={`nav-item ${activeTab === 'formateurs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('formateurs')}
                        >
                            <FiUsers className="sidebar-icon" /> {t('formateurs')}
                        </button>
                    )}

                    {(isAdmin || isAssistant || isFormateur) && (
                        <button
                            className={`nav-item ${activeTab === 'planning' ? 'active' : ''}`}
                            onClick={() => setActiveTab('planning')}
                        >
                            <FiCalendar className="sidebar-icon" /> {t('planning')}
                        </button>
                    )}

                    {(isAdmin || isAssistant) && (
                        <button
                            className={`nav-item ${activeTab === 'entreprises' ? 'active' : ''}`}
                            onClick={() => setActiveTab('entreprises')}
                        >
                            <FiBriefcase className="sidebar-icon" /> {t('entreprises')}
                        </button>
                    )}
                    {(isAdmin || isAssistant) && (
                        <button
                            className={`nav-item ${activeTab === 'individus' ? 'active' : ''}`}
                            onClick={() => setActiveTab('individus')}
                        >
                            <FiUsers className="sidebar-icon" /> {t('individus')}
                        </button>
                    )}

                    {(isAdmin || isAssistant) && (
                        <button
                            className={`nav-item ${activeTab === 'inscriptions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('inscriptions')}
                        >
                            <FiEdit className="sidebar-icon" /> Inscriptions
                        </button>
                    )}

                    {(isAdmin || isAssistant) && (
                        <button
                            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notifications')}
                            style={{ position: 'relative' }}
                        >
                            <FiBell className="sidebar-icon" /> Notifications
                            {unreadNotifications > 0 && <span className="sidebar-badge">{unreadNotifications}</span>}
                        </button>
                    )}

                    {isAdmin && (
                        <button
                            className={`nav-item ${activeTab === 'passwords' ? 'active' : ''}`}
                            onClick={() => setActiveTab('passwords')}
                        >
                            <FiLock className="sidebar-icon" /> Mots de passe
                        </button>
                    )}

                    {isFormateur && !isAdmin && !isAssistant && (
                        <button
                            className={`nav-item ${activeTab === 'mes-ressources' ? 'active' : ''}`}
                            onClick={() => setActiveTab('mes-ressources')}
                        >
                            <FiBookOpen className="sidebar-icon" /> Mes Ressources
                        </button>
                    )}

                    {isFormateur && !isAdmin && !isAssistant && (
                        <button
                            className={`nav-item ${activeTab === 'mes-inscrits' ? 'active' : ''}`}
                            onClick={() => setActiveTab('mes-inscrits')}
                        >
                            <FiUsers className="sidebar-icon" /> Mes Inscrits
                        </button>
                    )}

                    <button
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <FiSettings className="sidebar-icon" /> {t('settings')}
                    </button>

                    {currentUser?.newsletters === true && (
                        <button
                            className={`nav-item ${activeTab === 'newsletters' ? 'active' : ''}`}
                            onClick={() => setActiveTab('newsletters')}
                            style={{ marginTop: 'auto', position: 'relative' }}
                        >
                            <FiMail className="sidebar-icon" /> {t('newsletters')}
                            {hasUnreadNews && <span className="sidebar-badge"></span>}
                        </button>
                    )}
                </nav>

                <button className="logout-btn" onClick={() => { AuthService.logout(); window.location.reload(); }}>
                    <FiLogOut className="sidebar-icon" /> {t('logout')}
                </button>
            </aside >

            {/* Main Content */}
            < main className="dashboard-content" >
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
                                    filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.3))',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    color: 'var(--primary)',
                                    opacity: 0.5
                                }}>
                                    <FiBookOpen size={80} />
                                </div>
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
                                                <FiClock style={{ color: 'var(--primary)' }} /> <strong>{f.nombreHeures}h</strong>
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
                                                <FiMapPin style={{ color: 'var(--primary)' }} /> <strong>{f.ville}</strong>
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

                {
                    isIndividu && activeTab === 'my-trainings' && (
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
                                                    <FiCalendar style={{ opacity: 0.7 }} />
                                                    <span>{i.formation?.dateDebut && new Date(i.formation.dateDebut).toLocaleDateString()} — {i.formation?.dateFin && new Date(i.formation.dateFin).toLocaleDateString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem' }}>
                                                    <FiMapPin style={{ opacity: 0.7 }} />
                                                    <span>{i.formation?.ville}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                <button className="btn btn-primary" style={{ flex: 2, borderRadius: '1rem', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={() => setShowResourcesModal(i.formation)}>
                                                    <FiBookOpen /> Ressources
                                                </button>
                                                <button className="btn btn-primary" style={{ flex: 1, borderRadius: '1rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }} onClick={() => setShowEvaluationModal(i.formation)}>
                                                    <FiStar strokeWidth={2.5} /> Évaluer
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )
                }

                {
                    isIndividu && activeTab === 'evaluations' && (
                        <section className="fade-in">
                            <header className="content-title">
                                <h1 className="text-gradient font-black">Évaluations à réaliser</h1>
                                <p className="text-muted">Partagez votre avis sur les formations que vous avez suivies</p>
                            </header>

                            {myInscriptions.length === 0 ? (
                                <div className="glass card text-center" style={{ padding: '6rem 2rem' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem', color: '#f59e0b', opacity: 0.3, display: 'flex', justifyContent: 'center' }}>
                                        <FiStar size={80} />
                                    </div>
                                    <h3 className="font-black" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Aucune évaluation possible</h3>
                                    <p className="text-muted">Inscrivez-vous à une formation pour pouvoir l'évaluer ensuite.</p>
                                </div>
                            ) : (
                                <div className="trainings-grid">
                                    {myInscriptions.map(i => (
                                        <div key={i.id} className="training-card glass fade-in" style={{
                                            padding: '1.5rem',
                                            border: '1px solid rgba(245, 158, 11, 0.2)',
                                            background: 'rgba(245, 158, 11, 0.05)'
                                        }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>{i.formation?.titre}</h3>
                                            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>
                                                Donnez votre avis sur la qualité pédagogique, le rythme et le support de cette formation.
                                            </p>
                                            <button
                                                className="btn btn-primary"
                                                style={{
                                                    width: '100%',
                                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                    boxShadow: '0 8px 16px rgba(245, 158, 11, 0.2)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.6rem'
                                                }}
                                                onClick={() => setShowEvaluationModal(i.formation)}
                                            >
                                                <FiStar /> Évaluer maintenant
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )
                }

                {
                    (isAdmin || isAssistant || isFormateur) && activeTab === 'overview' && (
                        <section className="fade-in">
                            {/* Fixed Clock Widget - Only visible on overview page */}
                            <div style={{
                                position: 'fixed',
                                top: '1.5rem',
                                right: '1.5rem',
                                zIndex: 1000,
                                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(16, 23, 42, 0.95))',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                borderRadius: '1.2rem',
                                padding: '1.2rem 1.8rem',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(6, 182, 212, 0.2)',
                                textAlign: 'center',
                                minWidth: '180px'
                            }}>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: '900',
                                    color: '#06b6d4',
                                    marginBottom: '0.3rem',
                                    textShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
                                    letterSpacing: '0.05em'
                                }}>
                                    {currentTime.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    textTransform: 'capitalize',
                                    fontWeight: '600',
                                    letterSpacing: '0.05em'
                                }}>
                                    {currentTime.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                                </div>
                            </div>

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
                                                        <FiMail size={24} />
                                                    </div>
                                                </div>
                                                <div style={{ marginTop: '0.6rem' }}>
                                                    <span className="stat-value" style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text)', wordBreak: 'break-all', opacity: 1 }}>{currentUser.email}</span>
                                                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actif</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Formations Actives - Admin/Assistant only */}
                                        {(isAdmin || isAssistant) && (
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
                                        )}

                                        {/* Formateurs Total - Admin/Assistant only */}
                                        {(isAdmin || isAssistant) && (
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
                                                            <FiUsers size={24} />
                                                        </div>
                                                    </div>
                                                    <div style={{ marginTop: '0.6rem' }}>
                                                        <span className="stat-value" style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 }}>{formateurs.length}</span>
                                                        <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Experts certifiés</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Mes Formations - Formateur only */}
                                        {isFormateur && !isAdmin && !isAssistant && (
                                            <div className="stat-card glass" onClick={() => setActiveTab('trainings')} style={{
                                                cursor: 'pointer',
                                                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.02))',
                                                border: '1px solid rgba(236, 72, 153, 0.2)',
                                                borderLeft: '4px solid #ec4899',
                                                padding: '1rem 1.2rem'
                                            }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <span className="stat-label" style={{ fontWeight: '800', fontSize: '0.75rem', opacity: 0.7 }}>Mes Formations</span>
                                                        <div style={{ padding: '0.5rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '10px', color: '#ec4899' }}>
                                                            <FiBook size={24} />
                                                        </div>
                                                    </div>
                                                    <div style={{ marginTop: '0.6rem' }}>
                                                        <span className="stat-value" style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 }}>
                                                            {trainings.filter(f => f.formateur?.user?.id === currentUser?.id || f.formateur?.user?.username === currentUser?.username).length}
                                                        </span>
                                                        <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Formations assignées</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

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
                                                        <FiCalendar size={24} />
                                                    </div>
                                                </div>
                                                <div style={{ marginTop: '0.6rem' }}>
                                                    <span className="stat-value" style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Voir Planning</span>
                                                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sessions à venir</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Inscriptions Formations - Admin/Assistant only */}
                                        {(isAdmin || isAssistant) && (
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
                                                            <FiCheckCircle size={24} />
                                                        </div>
                                                    </div>
                                                    <div style={{ marginTop: '0.6rem' }}>
                                                        <span className="stat-value" style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 }}>{stats.totalInscriptions}</span>
                                                        <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Inscriptions totales</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Inscrits à mes formations - Formateur only */}
                                        {isFormateur && !isAdmin && !isAssistant && (
                                            <div className="stat-card glass" onClick={() => setActiveTab('mes-inscrits')} style={{
                                                cursor: 'pointer',
                                                background: 'linear-gradient(135deg, rgba(63, 102, 241, 0.1), rgba(63, 102, 241, 0.02))',
                                                border: '1px solid rgba(63, 102, 241, 0.2)',
                                                borderLeft: '4px solid #6366f1',
                                                padding: '1rem 1.2rem'
                                            }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <span className="stat-label" style={{ fontWeight: '800', fontSize: '0.75rem', opacity: 0.7 }}>Mes Inscrits</span>
                                                        <div style={{ padding: '0.5rem', background: 'rgba(63, 102, 241, 0.1)', borderRadius: '10px', color: '#6366f1' }}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
                                                        </div>
                                                    </div>
                                                    <div style={{ marginTop: '0.6rem' }}>
                                                        <span className="stat-value" style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 }}>
                                                            {allInscriptions.filter(insc => {
                                                                const formation = trainings.find(f => f.id === insc.formation?.id);
                                                                return formation?.formateur?.user?.id === currentUser?.id || formation?.formateur?.user?.username === currentUser?.username;
                                                            }).length}
                                                        </span>
                                                        <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Personnes inscrites</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Individus Enregistrés - Admin/Assistant only */}
                                        {(isAdmin || isAssistant) && (
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
                                        )}

                                        {/* Ressources - Formateur only */}
                                        {isFormateur && !isAdmin && !isAssistant && (
                                            <div className="stat-card glass" onClick={() => setActiveTab('mes-ressources')} style={{
                                                cursor: 'pointer',
                                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))',
                                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                                borderLeft: '4px solid #10b981',
                                                padding: '1rem 1.2rem'
                                            }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <span className="stat-label" style={{ fontWeight: '800', fontSize: '0.75rem', opacity: 0.7 }}>Ressources</span>
                                                        <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', color: '#10b981' }}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                                                        </div>
                                                    </div>
                                                    <div style={{ marginTop: '0.6rem' }}>
                                                        <span className="stat-value" style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gérer</span>
                                                        <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Documents & liens</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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
                    )
                }

                {
                    activeTab === 'trainings' && (
                        <section className="fade-in">
                            <header className="content-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h1 className="text-gradient font-black">{t('trainings')}</h1>
                                    <p className="text-muted">{t('trainings_desc')}</p>
                                </div>
                                {(isAdmin || isAssistant) && (
                                    <button className="btn-add-custom" onClick={() => setActiveTab('add-training')}>
                                        <FiPlus /> {t('new_training')}
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
                                                    <FiUser style={{ fontSize: '0.9rem', color: 'var(--primary)' }} />
                                                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text)' }}>{t_item.formateur.user?.firstName || t_item.formateur.user?.username}</span>
                                                    {formateurRatings[t_item.formateur?.id] && (
                                                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <StarRating
                                                                rating={formateurRatings[t_item.formateur.id].averageRating || 0}
                                                                size={14}
                                                            />
                                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                                ({formateurRatings[t_item.formateur.id].totalEvaluations || 0})
                                                            </span>
                                                        </div>
                                                    )}
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
                                                            <FiEdit size={14} />
                                                        </button>
                                                        <button className="btn-icon delete" onClick={() => handleDeleteTraining(t_item.id)} title="Supprimer" style={{ width: '34px', height: '34px', borderRadius: '8px' }}>
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )
                }

                {
                    activeTab === 'entreprises' && (isAdmin || isAssistant) && (
                        <section className="fade-in">
                            <header className="content-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h1 className="text-gradient font-black">{t('entreprises')}</h1>
                                    <p className="text-muted">{t('entreprises_desc')}</p>
                                </div>
                                <button className="btn-add-custom" onClick={() => setActiveTab('add-entreprise')}>
                                    <FiPlus /> {t('new_entreprise')}
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
                                                <div className="entity-card-icon">
                                                    <FiBriefcase style={{ color: 'var(--primary)' }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h3 className="entity-card-title">{e.nom}</h3>
                                                    <span className="entity-card-subtitle">{e.secteur || 'ENTREPRISE'}</span>
                                                </div>
                                            </div>

                                            <div className="info-container-glass">
                                                <div className="info-row">
                                                    <FiMapPin size={12} style={{ opacity: 0.6 }} />
                                                    <span>{e.adresse || 'N/A'}</span>
                                                </div>
                                                <div className="info-row">
                                                    <FiPhone size={12} style={{ opacity: 0.6 }} />
                                                    <span>{e.telephone || 'Non renseigné'}</span>
                                                </div>
                                                {e.url && (
                                                    <a
                                                        href={e.url.startsWith('http') ? e.url : `https://${e.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="glass-btn-sm"
                                                        style={{ marginTop: '0.4rem', width: 'fit-content' }}
                                                    >
                                                        <FiGlobe size={14} />
                                                        <span>{e.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                                        <FiChevronRight size={12} style={{ opacity: 0.7 }} />
                                                    </a>
                                                )}
                                            </div>

                                            <div className="action-footer">
                                                <button className="btn btn-outline action-btn-sm" onClick={() => handleEditEntreprise(e)}>
                                                    Gérer
                                                </button>
                                                <button className="btn-icon delete icon-btn-action" title="Supprimer" onClick={() => handleDeleteEntreprise(e.id)}>
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )
                }

                {
                    activeTab === 'individus' && (isAdmin || isAssistant) && (
                        <section className="fade-in">
                            <header className="content-title">
                                <h1 className="text-gradient font-black">{t('individus')}</h1>
                                <p className="text-muted">{t('individus_desc')}</p>
                            </header>

                            <div className="filters-bar glass" style={{ marginBottom: '3rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
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
                                        <div key={ent} className="entity-group">
                                            <div className="entity-group-header">
                                                <div className="entity-group-indicator"></div>
                                                <h2 className="entity-group-title">
                                                    <FiBriefcase style={{ fontSize: '1.2rem', color: 'var(--primary)' }} /> {ent}
                                                </h2>
                                                <div className="entity-group-line"></div>
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
                                                                <div className={`status-avatar ${i.profileCompleted ? 'complete' : 'incomplete'}`}>
                                                                    {(i.firstName?.[0] || i.username[0]).toUpperCase()}
                                                                </div>
                                                                <div className={`badge ${i.profileCompleted ? 'badge-success' : 'badge-error'}`}>
                                                                    {i.profileCompleted ? "✓ Complet" : "⚠ Incomplet"}
                                                                </div>
                                                            </div>

                                                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '800', color: 'var(--text)' }}>
                                                                {i.firstName} {i.lastName}
                                                            </h3>
                                                            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', opacity: 0.8 }}>
                                                                @{i.username}
                                                            </p>

                                                            <div className="info-container-glass">
                                                                <div className="info-row">
                                                                    <FiMail size={14} style={{ opacity: 0.6 }} />
                                                                    <span>{i.email}</span>
                                                                </div>
                                                                <div className="info-row">
                                                                    <FiPhone size={14} style={{ opacity: 0.6 }} />
                                                                    <span>{i.telephone || 'Non renseigné'}</span>
                                                                </div>
                                                            </div>

                                                            <div className="action-footer">
                                                                <button
                                                                    className="btn btn-outline action-btn-sm"
                                                                    onClick={() => {
                                                                        setSelectedIndividuProfile(i);
                                                                        setShowProfileModal(true);
                                                                    }}
                                                                >
                                                                    Profil
                                                                </button>
                                                                <button className="btn-icon delete icon-btn-action" title="Supprimer" onClick={() => handleDeleteIndividu(i.id)}>
                                                                    <FiTrash2 size={16} />
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
                    )
                }

                {
                    activeTab === 'add-entreprise' && (isAdmin || isAssistant) && (
                        <section className="fade-in">
                            <button
                                className="btn-back-custom"
                                onClick={() => { setActiveTab('entreprises'); setEntrepriseToEdit(null); }}
                                style={{ marginBottom: '2rem' }}
                            >
                                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>←</span> {t('back_list')}
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
                                <button className="btn-add-custom" onClick={() => setActiveTab('add-formateur')}>
                                    <FiPlus /> {t('new_formateur')}
                                </button>
                            </header>

                            <div className="trainings-grid">
                                {loading && <div className="text-muted">{t('loading')}</div>}
                                {formateursError && <div className="text-error" style={{ color: '#ef4444', marginBottom: '1rem' }}>{t('error_loading')} ({formateursError})</div>}
                                {!loading && formateurs.length === 0 ? (
                                    <div className="text-muted">{t('no_formateurs')}</div>
                                ) : (
                                    formateurs.map(f => (
                                        <div key={f.id} className="training-card glass" style={{
                                            border: !f.user.enabled ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                                            padding: '1.8rem',
                                            background: !f.user.enabled ? 'rgba(239, 68, 68, 0.03)' : 'rgba(16, 23, 42, 0.4)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1.2rem'
                                        }}>
                                            {/* Header with ID and Status */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '0.6rem',
                                                    fontSize: '0.7rem',
                                                    fontWeight: '700',
                                                    background: 'rgba(6, 182, 212, 0.1)',
                                                    color: '#06b6d4',
                                                    border: '1px solid rgba(6, 182, 212, 0.2)',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    ID: {f.user.id}
                                                </div>
                                                <span style={{
                                                    padding: '0.4rem 0.9rem',
                                                    borderRadius: '2rem',
                                                    fontSize: '0.65rem',
                                                    fontWeight: '800',
                                                    background: f.user.enabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                    color: f.user.enabled ? '#10b981' : '#ef4444',
                                                    border: `1px solid ${f.user.enabled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    {f.user.enabled ? "✓ ACTIF" : "⏳ EN ATTENTE"}
                                                </span>
                                            </div>

                                            {/* Name */}
                                            <div>
                                                <h3 style={{
                                                    fontSize: '1.3rem',
                                                    fontWeight: '800',
                                                    margin: 0,
                                                    color: '#fff',
                                                    lineHeight: '1.3'
                                                }}>
                                                    {f.user.firstName && f.user.lastName
                                                        ? `${f.user.firstName} ${f.user.lastName}`
                                                        : f.user.username}
                                                </h3>
                                                {f.user.firstName && f.user.lastName && (
                                                    <p style={{
                                                        margin: '0.3rem 0 0 0',
                                                        fontSize: '0.8rem',
                                                        color: 'var(--primary)',
                                                        fontWeight: '600',
                                                        opacity: 0.8
                                                    }}>
                                                        @{f.user.username}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Rating Section - Always show if user is enabled */}
                                            {f.user.enabled && (
                                                <div style={{
                                                    padding: '1rem',
                                                    background: 'rgba(245, 158, 11, 0.05)',
                                                    borderRadius: '0.8rem',
                                                    border: '1px solid rgba(245, 158, 11, 0.15)'
                                                }}>
                                                    {formateurRatings[f.id] ? (
                                                        <StarRating
                                                            rating={formateurRatings[f.id].averageRating || 0}
                                                            totalEvaluations={formateurRatings[f.id].totalEvaluations || 0}
                                                            size={18}
                                                        />
                                                    ) : (
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            color: 'var(--text-muted)',
                                                            fontSize: '0.8rem',
                                                            fontStyle: 'italic'
                                                        }}>
                                                            <FiStar size={16} style={{ opacity: 0.5 }} />
                                                            Chargement de l'évaluation...
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Competences */}
                                            <div style={{
                                                padding: '1rem',
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: '0.8rem',
                                                border: '1px solid rgba(255,255,255,0.05)'
                                            }}>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-muted)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                    fontWeight: '700',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    Compétences
                                                </p>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '0.9rem',
                                                    color: 'var(--text)',
                                                    lineHeight: '1.5'
                                                }}>
                                                    {f.competences}
                                                </p>
                                            </div>

                                            {/* Remarques */}
                                            {(f.remarques || !f.user.enabled) && (
                                                <div style={{
                                                    padding: '1rem',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    borderRadius: '0.8rem',
                                                    border: '1px solid rgba(255,255,255,0.05)'
                                                }}>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '0.75rem',
                                                        color: 'var(--text-muted)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.1em',
                                                        fontWeight: '700',
                                                        marginBottom: '0.5rem'
                                                    }}>
                                                        Remarque
                                                    </p>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '0.85rem',
                                                        color: 'var(--text-muted)',
                                                        fontStyle: 'italic',
                                                        lineHeight: '1.5'
                                                    }}>
                                                        {f.remarques || "Demande d'inscription externe"}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="action-footer" style={{
                                                marginTop: 'auto',
                                                paddingTop: '1rem',
                                                borderTop: '1px solid rgba(255,255,255,0.05)',
                                                display: 'flex',
                                                gap: '0.6rem',
                                                alignItems: 'center'
                                            }}>
                                                {!f.user.enabled && (
                                                    <button
                                                        className="btn btn-primary action-btn-sm"
                                                        style={{
                                                            flex: 1,
                                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                                            border: 'none',
                                                            padding: '0.7rem 1.2rem',
                                                            fontWeight: '700',
                                                            fontSize: '0.85rem'
                                                        }}
                                                        onClick={() => setFormateurToApprove(f)}
                                                    >
                                                        ✓ Approuver
                                                    </button>
                                                )}
                                                <button
                                                    className="btn-icon edit icon-btn-action"
                                                    onClick={() => handleEditFormateur(f)}
                                                    title="Modifier"
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <FiEdit size={16} />
                                                </button>
                                                <button
                                                    className="btn-icon delete icon-btn-action"
                                                    onClick={() => handleDeleteFormateur(f.id)}
                                                    title="Supprimer"
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
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
                                className="btn-back-custom"
                                onClick={() => { setActiveTab('formateurs'); setFormateurToEdit(null); }}
                                style={{ marginBottom: '2rem' }}
                            >
                                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>←</span> {t('back_list')}
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
                                className="btn-back-custom"
                                onClick={() => { setActiveTab('trainings'); setFormationToEdit(null); }}
                                style={{ marginBottom: '2rem' }}
                            >
                                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>←</span> {t('back_list')}
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
                    isAdmin && activeTab === 'passwords' && (
                        <PasswordManagement />
                    )
                }

                {
                    isFormateur && !isAdmin && !isAssistant && activeTab === 'mes-ressources' && (
                        <RessourceManagement
                            formations={trainings}
                            currentUser={currentUser}
                        />
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
                            <header className="content-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h1 className="text-gradient font-black">Centre de Notifications</h1>
                                    <p className="text-muted">Suivez les activités et inscriptions en temps réel</p>
                                </div>
                                {notifications.length > 0 && (
                                    <button className="btn btn-ghost" onClick={handleClearNotifications} style={{ border: '1px solid rgba(255,255,255,0.1)', width: 'auto' }}>
                                        <FiTrash2 style={{ marginRight: '0.5rem' }} /> Vider
                                    </button>
                                )}
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
                                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.3, color: 'var(--primary)' }}>
                                            <FiEdit size={64} style={{ margin: '0 auto' }} />
                                        </div>
                                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Aucune inscription à gérer pour le moment.</p>
                                    </div>
                                ) : (
                                    <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                    <th style={{ padding: '0 1.5rem', minWidth: '180px' }}>Individu</th>
                                                    <th style={{ padding: '0 1.5rem', minWidth: '220px' }}>Formation Voulue</th>
                                                    <th style={{ padding: '0 1.5rem' }}>Date d'inscription</th>
                                                    <th style={{ padding: '0 1.5rem' }}>Formateur</th>
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
                                                            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#fff', lineHeight: '1.3' }}>{insc.individu?.prenom} {insc.individu?.nom}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', opacity: 0.8, fontWeight: '500', marginTop: '0.2rem' }}>{insc.individu?.email}</div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                                            <span className="training-badge" style={{
                                                                position: 'static',
                                                                display: 'inline-block',
                                                                backgroundColor: 'rgba(34, 211, 238, 0.08)',
                                                                color: '#22d3ee',
                                                                padding: '0.4rem 1rem',
                                                                borderRadius: '0.8rem',
                                                                border: '1px solid rgba(34, 211, 238, 0.2)',
                                                                fontSize: '0.8rem',
                                                                fontWeight: '700',
                                                                lineHeight: '1.4',
                                                                whiteSpace: 'normal'
                                                            }}>
                                                                {insc.formation?.titre}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1.2rem 1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                                <FiCalendar style={{ color: 'var(--primary)', opacity: 0.8 }} /> {new Date(insc.dateInscription).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem 1.5rem', minWidth: '200px' }}>
                                                            {(() => {
                                                                const fId = insc.formation?.id || insc.formation;
                                                                const fDetail = trainings && trainings.length > 0 ? trainings.find(f => String(f.id) === String(fId)) : null;

                                                                const fName = fDetail?.formateur?.user?.firstName
                                                                    ? `${fDetail.formateur.user.firstName} ${fDetail.formateur.user.lastName}`
                                                                    : (fDetail?.formateur?.user?.username || 'Non assigné');
                                                                const fInitial = (fDetail?.formateur?.user?.firstName?.[0] || fDetail?.formateur?.user?.username?.[0] || 'F').toUpperCase();

                                                                return (
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                                        <div style={{
                                                                            width: '32px',
                                                                            height: '32px',
                                                                            borderRadius: '50%',
                                                                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            fontSize: '0.8rem',
                                                                            fontWeight: 'bold',
                                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                                                        }}>
                                                                            {fInitial}
                                                                        </div>
                                                                        <div>
                                                                            <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff' }}>
                                                                                {fName}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </td>
                                                        <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center', borderRadius: '0 16px 16px 0' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                                                                <span style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.4rem',
                                                                    padding: '0.4rem 0.8rem',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: '800',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.05em',
                                                                    background: insc.statut === 'CONFIRMEE' ? 'rgba(16, 185, 129, 0.15)' : (insc.statut === 'BLOQUEE' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 211, 238, 0.15)'),
                                                                    color: insc.statut === 'CONFIRMEE' ? '#10b981' : (insc.statut === 'BLOQUEE' ? '#f87171' : '#22d3ee'),
                                                                    border: `1px solid ${insc.statut === 'CONFIRMEE' ? 'rgba(16, 185, 129, 0.2)' : (insc.statut === 'BLOQUEE' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 211, 238, 0.2)')}`
                                                                }}>
                                                                    {insc.statut === 'CONFIRMEE' ? <><FiCheckCircle /> Autorisé</> : (insc.statut === 'BLOQUEE' ? <><FiAlertCircle /> Bloqué</> : <><FiClock /> Inscrit</>)}
                                                                </span>
                                                                <button className="btn-icon edit" title="Editer le statut" style={{ width: '32px', height: '32px' }} onClick={() => {
                                                                    setSelectedInscToEdit(insc);
                                                                    setShowStatusModal(true);
                                                                }}><FiEdit size={14} /></button>
                                                            </div>
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

                {/* Mes Inscrits - Formateur only */}
                {
                    isFormateur && !isAdmin && !isAssistant && activeTab === 'mes-inscrits' && (
                        <section className="fade-in">
                            <header className="content-title">
                                <h1 className="text-gradient font-black">Mes Inscrits</h1>
                                <p className="text-muted">Personnes inscrites à vos formations</p>
                            </header>

                            <div className="inscriptions-list card glass" style={{ padding: '2.5rem', background: 'rgba(10, 15, 30, 0.4)' }}>
                                {(() => {
                                    const myInscriptionsList = allInscriptions.filter(insc => {
                                        const formation = trainings.find(f => f.id === insc.formation?.id);
                                        return formation?.formateur?.user?.id === currentUser?.id || formation?.formateur?.user?.username === currentUser?.username;
                                    });

                                    if (myInscriptionsList.length === 0) {
                                        return (
                                            <div style={{ textAlign: 'center', padding: '4rem' }}>
                                                <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.2, color: 'var(--primary)' }}>
                                                    <FiUsers size={80} style={{ margin: '0 auto' }} />
                                                </div>
                                                <h3 className="text-gradient font-black" style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}>Aucun inscrit</h3>
                                                <p className="text-muted" style={{ fontSize: '1.1rem' }}>Aucune personne n'est encore inscrite à vos formations.</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem' }}>
                                                <thead>
                                                    <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                        <th style={{ padding: '0 1.5rem' }}>Inscrit</th>
                                                        <th style={{ padding: '0 1.5rem' }}>Contact</th>
                                                        <th style={{ padding: '0 1.5rem' }}>Formation</th>
                                                        <th style={{ padding: '0 1.5rem' }}>Date d'inscription</th>
                                                        <th style={{ padding: '0 1.5rem', textAlign: 'center' }}>Statut</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {myInscriptionsList.map(insc => (
                                                        <tr key={insc.id} className="glass" style={{
                                                            borderRadius: '16px',
                                                            background: 'rgba(255,255,255,0.02)',
                                                            transition: 'all 0.3s ease',
                                                            verticalAlign: 'middle'
                                                        }}>
                                                            <td style={{ padding: '1.2rem 1.5rem', borderRadius: '16px 0 0 16px' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                    <div style={{
                                                                        width: '45px',
                                                                        height: '45px',
                                                                        borderRadius: '12px',
                                                                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontWeight: '700',
                                                                        fontSize: '1rem',
                                                                        color: 'white'
                                                                    }}>
                                                                        {(insc.individu?.prenom?.[0] || '').toUpperCase()}{(insc.individu?.nom?.[0] || '').toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <div style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>
                                                                            {insc.individu?.prenom} {insc.individu?.nom}
                                                                        </div>
                                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                            {insc.individu?.ville || 'Non renseignée'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '500' }}>
                                                                    {insc.individu?.email}
                                                                </div>
                                                                {insc.individu?.telephone && (
                                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                        <FiPhone size={12} style={{ color: 'var(--primary)', opacity: 0.8 }} /> {insc.individu?.telephone}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                                <span style={{
                                                                    display: 'inline-block',
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
                                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                                    {insc.dateInscription ? new Date(insc.dateInscription).toLocaleDateString('fr-FR', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    }) : 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center', borderRadius: '0 16px 16px 0' }}>
                                                                <span style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.4rem',
                                                                    padding: '0.4rem 0.8rem',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: '800',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.05em',
                                                                    background: insc.statut === 'CONFIRMEE' ? 'rgba(16, 185, 129, 0.15)' : (insc.statut === 'BLOQUEE' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 211, 238, 0.15)'),
                                                                    color: insc.statut === 'CONFIRMEE' ? '#10b981' : (insc.statut === 'BLOQUEE' ? '#f87171' : '#22d3ee'),
                                                                    border: `1px solid ${insc.statut === 'CONFIRMEE' ? 'rgba(16, 185, 129, 0.2)' : (insc.statut === 'BLOQUEE' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 211, 238, 0.2)')}`
                                                                }}>
                                                                    {insc.statut === 'CONFIRMEE' ? <><FiCheckCircle /> Confirmé</> : (insc.statut === 'BLOQUEE' ? <><FiAlertCircle /> Bloqué</> : <><FiClock /> En attente</>)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()}
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
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                color: '#ef4444'
                            }}>
                                <FiTrash2 size={40} />
                            </div>
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
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                color: '#ef4444'
                            }}>
                                <FiTrash2 size={40} />
                            </div>
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
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                color: '#ef4444'
                            }}>
                                <FiTrash2 size={40} />
                            </div>
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
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                color: '#ef4444'
                            }}>
                                <FiTrash2 size={40} />
                            </div>
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
                                gap: '1rem',
                                flexWrap: 'wrap'
                            }}>
                                <button
                                    className="btn btn-outline"
                                    style={{ flex: 1, padding: '1rem', minWidth: '120px' }}
                                    onClick={() => setSelectedFormation(null)}
                                >
                                    Fermer
                                </button>

                                {/* Show Resources button for enrolled individus */}
                                {isIndividu && myInscriptions.some(ins => ins.formation?.id === selectedFormation.id) && (
                                    <>
                                        <button
                                            className="btn btn-primary"
                                            style={{
                                                flex: 1,
                                                padding: '1rem',
                                                minWidth: '150px',
                                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                                boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'
                                            }}
                                            onClick={() => {
                                                setShowResourcesModal(selectedFormation);
                                            }}
                                        >
                                            📚 Voir les ressources
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            style={{
                                                flex: 1,
                                                padding: '1rem',
                                                minWidth: '150px',
                                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)'
                                            }}
                                            onClick={() => {
                                                setShowEvaluationModal(selectedFormation);
                                            }}
                                        >
                                            ⭐ Évaluer
                                        </button>
                                    </>
                                )}

                                {isIndividu && (
                                    <button
                                        className={`btn ${myInscriptions.some(ins => ins.formation?.id === selectedFormation.id) ? 'btn-outline' : 'btn-primary'}`}
                                        style={{
                                            flex: 1.5,
                                            padding: '1rem',
                                            minWidth: '180px',
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
            {
                showEnrollmentForm && enrollmentFormation && (
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
                )
            }
            {/* Unenrollment Confirmation Modal */}
            {
                trainingToUnenroll && (
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
                )
            }

            {/* Premium Alert Modal */}
            {
                alertConfig && (
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
                )
            }

            {/* Status Edit Modal */}
            {
                showStatusModal && selectedInscToEdit && (
                    <div className="modal-overlay fade-in" style={{ backgroundColor: 'rgba(6, 9, 19, 0.95)', zIndex: 9000 }}>
                        <div className="modal-content glass" style={{ maxWidth: '450px', padding: '2.5rem', textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'rgba(6, 182, 212, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                margin: '0 auto 1.5rem',
                                border: '2px solid rgba(6, 182, 212, 0.3)'
                            }}>
                                👤
                            </div>
                            <h2 className="font-black" style={{ marginBottom: '1rem' }}>Gérer l'accès</h2>
                            <p className="text-muted" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
                                Modifier les droits de <strong>{selectedInscToEdit?.individu?.prenom} {selectedInscToEdit?.individu?.nom}</strong> pour la formation <strong>{selectedInscToEdit?.formation?.titre}</strong>.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button
                                    className="btn btn-primary"
                                    style={{ background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    onClick={() => {
                                        if (selectedInscToEdit?.id) {
                                            InscriptionService.updateStatus(selectedInscToEdit.id, 'CONFIRMEE').then(() => {
                                                loadAllInscriptions();
                                                setShowStatusModal(false);
                                                setAlertConfig({ title: "Succès", message: "Individu autorisé avec succès", type: 'success' });
                                            });
                                        }
                                    }}
                                >
                                    <span>✓</span> Autoriser l'individu
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{ background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    onClick={() => {
                                        if (selectedInscToEdit?.id) {
                                            InscriptionService.updateStatus(selectedInscToEdit.id, 'BLOQUEE').then(() => {
                                                loadAllInscriptions();
                                                setShowStatusModal(false);
                                                setAlertConfig({ title: "Bloqué", message: "Individu bloqué pour cette formation", type: 'error' });
                                            });
                                        }
                                    }}
                                >
                                    <span>🚫</span> Bloquer complètement
                                </button>
                                <button
                                    className="btn btn-outline"
                                    style={{ marginTop: '1rem' }}
                                    onClick={() => setShowStatusModal(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Resources Modal for Individu */}
            {
                showResourcesModal && isIndividu && (
                    <RessourceViewer
                        formation={showResourcesModal}
                        onClose={() => setShowResourcesModal(null)}
                    />
                )
            }

            {/* Evaluation Modal for Individu */}
            {
                showEvaluationModal && isIndividu && (
                    <EvaluationModal
                        formation={showEvaluationModal}
                        onClose={() => setShowEvaluationModal(null)}
                        onSuccess={() => {
                            console.log("Evaluation submitted successfully");
                        }}
                    />
                )
            }
            {/* Formateur Approval Modal */}
            {
                formateurToApprove && (
                    <div className="modal-overlay" onClick={() => setFormateurToApprove(null)}>
                        <div className="glass card modal-content-premium" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', padding: '3rem' }}>
                            <div className="modal-icon-wrapper" style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'rgba(16, 185, 129, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                margin: '0 auto 1.5rem',
                                border: '2px solid rgba(16, 185, 129, 0.3)'
                            }}>
                                <FiCheckCircle style={{ color: '#10b981' }} />
                            </div>
                            <h2 className="font-black" style={{ marginBottom: '1rem', textAlign: 'center' }}>Approuver Formateur</h2>
                            <p className="text-muted" style={{ marginBottom: '2rem', lineHeight: '1.6', textAlign: 'center' }}>
                                Voulez-vous approuver le formateur <strong>{formateurToApprove.user.username}</strong> ?
                                Ceci lui permettra de se connecter et de gérer ses formations.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    className="btn btn-outline"
                                    style={{ flex: 1 }}
                                    onClick={() => setFormateurToApprove(null)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 1, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
                                    onClick={() => {
                                        FormateurService.approveFormateur(formateurToApprove.id).then(() => {
                                            loadFormateurs();
                                            setFormateurToApprove(null);
                                            setAlertConfig({ title: "Succès", message: "Formateur approuvé avec succès !", type: 'success' });
                                        }).catch(err => {
                                            setAlertConfig({ title: "Erreur", message: "Échec de l'approbation", type: 'error' });
                                        });
                                    }}
                                >
                                    Approuver
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Premium Profile Modal for Individuals */}
            {
                showProfileModal && selectedIndividuProfile && (
                    <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
                        <div className="glass card" onClick={e => e.stopPropagation()} style={{
                            maxWidth: '550px',
                            padding: 0,
                            overflow: 'hidden',
                            background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.95) 0%, rgba(15, 23, 42, 0.98) 45%)',
                            border: '1px solid rgba(6, 182, 212, 0.3)'
                        }}>
                            {/* Header Section with Gradient */}
                            <div style={{
                                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                padding: '3rem 2rem 4rem',
                                textAlign: 'center',
                                position: 'relative'
                            }}>
                                <button
                                    onClick={() => setShowProfileModal(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        cursor: 'pointer',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ×
                                </button>
                                <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                                    Mon Profil
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                                    {selectedIndividuProfile.firstName} {selectedIndividuProfile.lastName}
                                </p>
                                <div style={{
                                    display: 'inline-block',
                                    marginTop: '1rem',
                                    padding: '0.4rem 1rem',
                                    background: 'rgba(255,255,255,0.25)',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    color: 'white',
                                    letterSpacing: '0.5px'
                                }}>
                                    {selectedIndividuProfile.role?.name || 'INDIVIDU'}
                                </div>
                            </div>

                            {/* Avatar Circle - Overlapping */}
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3rem',
                                fontWeight: '800',
                                color: 'white',
                                margin: '-60px auto 0',
                                border: '6px solid var(--bg)',
                                boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {(selectedIndividuProfile.firstName?.[0] || selectedIndividuProfile.username[0]).toUpperCase()}
                                {(selectedIndividuProfile.lastName?.[0] || selectedIndividuProfile.username[1] || '').toUpperCase()}
                            </div>

                            {/* Content Section */}
                            <div style={{ padding: '2rem' }}>
                                {/* Info Cards */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Username */}
                                    <div style={{
                                        background: 'rgba(6, 182, 212, 0.05)',
                                        padding: '1.2rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(6, 182, 212, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#06b6d4',
                                            fontSize: '1.2rem'
                                        }}>
                                            @
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                IDENTIFIANT
                                            </div>
                                            <div style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: '700' }}>
                                                {selectedIndividuProfile.username}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div style={{
                                        background: 'rgba(6, 182, 212, 0.05)',
                                        padding: '1.2rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(6, 182, 212, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#06b6d4',
                                            fontSize: '1.2rem'
                                        }}>
                                            ✉
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                EMAIL
                                            </div>
                                            <div style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: '700' }}>
                                                {selectedIndividuProfile.email}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    {selectedIndividuProfile.telephone && (
                                        <div style={{
                                            background: 'rgba(6, 182, 212, 0.05)',
                                            padding: '1.2rem',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(6, 182, 212, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#06b6d4',
                                                fontSize: '1.2rem'
                                            }}>
                                                📞
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    TÉLÉPHONE
                                                </div>
                                                <div style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: '700' }}>
                                                    {selectedIndividuProfile.telephone}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Company */}
                                    {selectedIndividuProfile.entreprise && (
                                        <div style={{
                                            background: 'rgba(6, 182, 212, 0.05)',
                                            padding: '1.2rem',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(6, 182, 212, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#06b6d4',
                                                fontSize: '1.2rem'
                                            }}>
                                                🏢
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    ENTREPRISE
                                                </div>
                                                <div style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: '700' }}>
                                                    {selectedIndividuProfile.entreprise}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Dashboard;
