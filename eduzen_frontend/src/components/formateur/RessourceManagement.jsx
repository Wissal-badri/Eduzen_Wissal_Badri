import React, { useState, useEffect, useRef } from "react";
import RessourceService from "../../services/ressource.service";

const RessourceManagement = ({ formations, currentUser, onSuccess }) => {
    const [ressources, setRessources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [editingResource, setEditingResource] = useState(null);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [showArchived, setShowArchived] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showViewModal, setShowViewModal] = useState(null);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        nom: "",
        description: "",
        type: "DOCUMENT",
        lienExterne: "",
        file: null
    });

    // Filter formations assigned to this formateur
    const myFormations = formations.filter(f =>
        f.formateur?.user?.id === currentUser?.id ||
        f.formateur?.user?.username === currentUser?.username
    );

    useEffect(() => {
        loadAllResources();
    }, [showArchived]);

    const loadAllResources = async () => {
        setLoading(true);
        try {
            const response = await RessourceService.getMyResources(showArchived);
            setRessources(response.data);
        } catch (err) {
            console.error("Error loading resources:", err);
        }
        setLoading(false);
    };

    const handleOpenAddModal = (formation) => {
        setSelectedFormation(formation);
        setEditingResource(null);
        setFormData({
            nom: "",
            description: "",
            type: "DOCUMENT",
            lienExterne: "",
            file: null
        });
        setMessage({ text: "", type: "" });
        setShowAddModal(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleEditResource = (resource) => {
        setEditingResource(resource);
        setSelectedFormation(myFormations.find(f => f.id === resource.formationId));
        setFormData({
            nom: resource.nom || "",
            description: resource.description || "",
            type: resource.type || "DOCUMENT",
            lienExterne: resource.lienExterne || "",
            file: null
        });
        setMessage({ text: "", type: "" });
        setShowAddModal(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Auto-detect type based on file extension
            const extension = file.name.split('.').pop().toLowerCase();
            let detectedType = "DOCUMENT";

            if (extension === 'pdf') detectedType = "PDF";
            else if (['mp4', 'avi', 'mkv', 'mov', 'webm'].includes(extension)) detectedType = "VIDEO";
            else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) detectedType = "IMAGE";

            setFormData({
                ...formData,
                file: file,
                type: detectedType
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nom.trim()) {
            setMessage({ text: "Le nom est requis", type: "error" });
            return;
        }

        // Check if we have either a file or an external link
        if (!formData.file && !formData.lienExterne && !editingResource?.hasFile) {
            setMessage({ text: "Veuillez joindre un fichier ou ajouter un lien externe", type: "error" });
            return;
        }

        setUploading(true);

        try {
            if (editingResource) {
                if (formData.file) {
                    // Update with new file
                    const formDataToSend = new FormData();
                    formDataToSend.append('nom', formData.nom);
                    formDataToSend.append('description', formData.description || '');
                    formDataToSend.append('type', formData.type);
                    formDataToSend.append('lienExterne', formData.lienExterne || '');
                    formDataToSend.append('file', formData.file);

                    await RessourceService.updateResourceWithFile(editingResource.id, formDataToSend);
                } else {
                    // Update without file
                    await RessourceService.updateResource(editingResource.id, {
                        nom: formData.nom,
                        description: formData.description,
                        type: formData.type,
                        lienExterne: formData.lienExterne
                    });
                }
                setMessage({ text: "Ressource mise à jour avec succès !", type: "success" });
            } else {
                if (formData.file) {
                    // Create with file
                    const formDataToSend = new FormData();
                    formDataToSend.append('formationId', selectedFormation.id);
                    formDataToSend.append('nom', formData.nom);
                    formDataToSend.append('description', formData.description || '');
                    formDataToSend.append('type', formData.type);
                    formDataToSend.append('lienExterne', formData.lienExterne || '');
                    formDataToSend.append('file', formData.file);

                    await RessourceService.addResourceWithFile(formDataToSend);
                } else {
                    // Create without file (external link only)
                    await RessourceService.addResource({
                        formationId: selectedFormation.id,
                        nom: formData.nom,
                        description: formData.description,
                        type: formData.type,
                        lienExterne: formData.lienExterne
                    });
                }
                setMessage({ text: "Ressource ajoutée avec succès !", type: "success" });
            }

            setTimeout(() => {
                setShowAddModal(false);
                loadAllResources();
            }, 1500);
        } catch (err) {
            console.error("Error saving resource:", err);
            setMessage({ text: err.response?.data?.message || "Erreur lors de l'enregistrement", type: "error" });
        }
        setUploading(false);
    };

    const handleDeleteResource = async (id) => {
        try {
            await RessourceService.deleteResource(id);
            setShowDeleteConfirm(null);
            loadAllResources();
        } catch (err) {
            console.error("Error deleting resource:", err);
        }
    };

    const handleArchiveResource = async (resource) => {
        try {
            if (resource.archived) {
                await RessourceService.unarchiveResource(resource.id);
            } else {
                await RessourceService.archiveResource(resource.id);
            }
            loadAllResources();
        } catch (err) {
            console.error("Error archiving resource:", err);
        }
    };

    const handleViewResource = (resource) => {
        if (resource.hasFile) {
            setShowViewModal(resource);
        } else if (resource.lienExterne) {
            window.open(resource.lienExterne, '_blank');
        }
    };

    const handleDownloadResource = async (resource) => {
        if (resource.hasFile) {
            try {
                await RessourceService.downloadFile(resource.id, resource.nomFichierOriginal || resource.nom);
            } catch (err) {
                console.error("Error downloading:", err);
            }
        } else if (resource.lienExterne) {
            window.open(resource.lienExterne, '_blank');
        }
    };

    const getTypeIcon = (type) => {
        const icons = {
            'PDF': '📄',
            'VIDEO': '🎬',
            'LIEN': '🔗',
            'DOCUMENT': '📁',
            'IMAGE': '🖼️'
        };
        return icons[type] || '📁';
    };

    const getTypeBadgeStyle = (type) => {
        const styles = {
            'PDF': { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' },
            'VIDEO': { background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' },
            'LIEN': { background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee', border: '1px solid rgba(34, 211, 238, 0.3)' },
            'DOCUMENT': { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' },
            'IMAGE': { background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)' }
        };
        return styles[type] || styles['DOCUMENT'];
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (loading) {
        return (
            <div className="glass card" style={{ padding: '4rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                <p className="text-muted">Chargement des ressources...</p>
            </div>
        );
    }

    return (
        <section className="fade-in">
            <header className="content-title">
                <h1 className="text-gradient font-black">Mes Ressources</h1>
                <p className="text-muted">Gérez les documents et liens pour vos formations</p>
            </header>

            {/* Toggle archived view */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={showArchived}
                        onChange={(e) => setShowArchived(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#a855f7' }}
                    />
                    <span className="text-muted">Afficher les ressources archivées</span>
                </label>
            </div>

            {/* My Formations with resources */}
            {myFormations.length === 0 ? (
                <div className="glass card" style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📚</div>
                    <h3 className="text-gradient font-black" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Aucune formation assignée
                    </h3>
                    <p className="text-muted">Vous n'avez pas encore de formation assignée.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {myFormations.map(formation => {
                        const formationResources = ressources.filter(r => r.formationId === formation.id);

                        return (
                            <div key={formation.id} className="glass card" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' }}>
                                            {formation.titre}
                                        </h3>
                                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                                            {formation.nombreHeures}h • {formation.ville}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleOpenAddModal(formation)}
                                        style={{
                                            background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                                            border: 'none',
                                            borderRadius: '0.75rem',
                                            padding: '0.75rem 1.25rem',
                                            color: 'white',
                                            fontWeight: '700',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
                                        }}
                                    >
                                        <span>+</span> Ajouter une ressource
                                    </button>
                                </div>

                                {formationResources.length === 0 ? (
                                    <div style={{
                                        padding: '2rem',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: '1rem',
                                        border: '1px dashed rgba(255, 255, 255, 0.1)',
                                        textAlign: 'center'
                                    }}>
                                        <p className="text-muted">Aucune ressource ajoutée</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {formationResources.map(resource => (
                                            <div
                                                key={resource.id}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '1rem 1.25rem',
                                                    background: resource.archived
                                                        ? 'rgba(100, 100, 100, 0.1)'
                                                        : 'rgba(255, 255, 255, 0.03)',
                                                    borderRadius: '0.75rem',
                                                    border: resource.archived
                                                        ? '1px solid rgba(100, 100, 100, 0.2)'
                                                        : '1px solid rgba(255, 255, 255, 0.05)',
                                                    opacity: resource.archived ? 0.7 : 1
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                                    <div style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '0.75rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.5rem',
                                                        ...getTypeBadgeStyle(resource.type)
                                                    }}>
                                                        {getTypeIcon(resource.type)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{
                                                            fontWeight: '600',
                                                            color: 'var(--text)',
                                                            marginBottom: '0.25rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem'
                                                        }}>
                                                            {resource.nom}
                                                            {resource.archived && (
                                                                <span style={{
                                                                    background: 'rgba(100, 100, 100, 0.3)',
                                                                    color: '#888',
                                                                    padding: '0.15rem 0.5rem',
                                                                    borderRadius: '0.5rem',
                                                                    fontSize: '0.65rem',
                                                                    fontWeight: '600'
                                                                }}>ARCHIVÉ</span>
                                                            )}
                                                        </div>
                                                        {resource.description && (
                                                            <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                                                {resource.description.length > 60
                                                                    ? resource.description.substring(0, 60) + '...'
                                                                    : resource.description}
                                                            </div>
                                                        )}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                            <span style={{
                                                                ...getTypeBadgeStyle(resource.type),
                                                                padding: '0.2rem 0.6rem',
                                                                borderRadius: '2rem',
                                                                fontSize: '0.65rem',
                                                                fontWeight: '700'
                                                            }}>
                                                                {resource.type}
                                                            </span>
                                                            {resource.hasFile && (
                                                                <span style={{
                                                                    background: 'rgba(16, 185, 129, 0.15)',
                                                                    color: '#10b981',
                                                                    padding: '0.2rem 0.6rem',
                                                                    borderRadius: '2rem',
                                                                    fontSize: '0.65rem',
                                                                    fontWeight: '600'
                                                                }}>
                                                                    📎 Fichier joint
                                                                </span>
                                                            )}
                                                            {resource.tailleFichier && (
                                                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                                    {formatFileSize(resource.tailleFichier)}
                                                                </span>
                                                            )}
                                                            {resource.nombreTelechargements > 0 && (
                                                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                                    📥 {resource.nombreTelechargements}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {/* View button */}
                                                    {(resource.hasFile || resource.lienExterne) && (
                                                        <button
                                                            onClick={() => handleViewResource(resource)}
                                                            title="Afficher"
                                                            style={{
                                                                padding: '0.5rem',
                                                                background: 'rgba(0, 212, 255, 0.1)',
                                                                border: 'none',
                                                                borderRadius: '0.5rem',
                                                                cursor: 'pointer',
                                                                fontSize: '1rem'
                                                            }}
                                                        >
                                                            👁️
                                                        </button>
                                                    )}

                                                    {/* Download button */}
                                                    {(resource.hasFile || resource.lienExterne) && (
                                                        <button
                                                            onClick={() => handleDownloadResource(resource)}
                                                            title="Télécharger"
                                                            style={{
                                                                padding: '0.5rem',
                                                                background: 'rgba(16, 185, 129, 0.1)',
                                                                border: 'none',
                                                                borderRadius: '0.5rem',
                                                                cursor: 'pointer',
                                                                fontSize: '1rem'
                                                            }}
                                                        >
                                                            📥
                                                        </button>
                                                    )}

                                                    {/* Edit button */}
                                                    <button
                                                        onClick={() => handleEditResource(resource)}
                                                        title="Modifier"
                                                        style={{
                                                            padding: '0.5rem',
                                                            background: 'rgba(245, 158, 11, 0.1)',
                                                            border: 'none',
                                                            borderRadius: '0.5rem',
                                                            cursor: 'pointer',
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        ✏️
                                                    </button>

                                                    {/* Archive button */}
                                                    <button
                                                        onClick={() => handleArchiveResource(resource)}
                                                        title={resource.archived ? "Désarchiver" : "Archiver"}
                                                        style={{
                                                            padding: '0.5rem',
                                                            background: 'rgba(168, 85, 247, 0.1)',
                                                            border: 'none',
                                                            borderRadius: '0.5rem',
                                                            cursor: 'pointer',
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        {resource.archived ? '📤' : '📦'}
                                                    </button>

                                                    {/* Delete button */}
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(resource)}
                                                        title="Supprimer"
                                                        style={{
                                                            padding: '0.5rem',
                                                            background: 'rgba(239, 68, 68, 0.1)',
                                                            border: 'none',
                                                            borderRadius: '0.5rem',
                                                            cursor: 'pointer',
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Resource Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{
                        maxWidth: '550px',
                        padding: '2.5rem',
                        borderRadius: '1.5rem'
                    }}>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                            {editingResource ? 'Modifier la ressource' : 'Ajouter une ressource'}
                        </h2>
                        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>
                            Formation: <span style={{ color: 'var(--primary)' }}>{selectedFormation?.titre}</span>
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="input-label">Nom de la ressource *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    placeholder="Ex: Support de cours PDF"
                                    required
                                />
                            </div>

                            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="input-label">Type de ressource</label>
                                <select
                                    className="input-field"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                                >
                                    <option value="DOCUMENT">📁 Document</option>
                                    <option value="PDF">📄 PDF</option>
                                    <option value="VIDEO">🎬 Vidéo</option>
                                    <option value="LIEN">🔗 Lien externe</option>
                                    <option value="IMAGE">🖼️ Image</option>
                                </select>
                            </div>

                            {/* File Upload */}
                            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="input-label">
                                    Joindre un fichier {editingResource?.hasFile && '(remplacer l\'existant)'}
                                </label>
                                <div style={{
                                    border: '2px dashed rgba(0, 212, 255, 0.3)',
                                    borderRadius: '0.75rem',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    background: 'rgba(0, 212, 255, 0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mkv,.mov,.webm,.zip,.rar"
                                    />
                                    {formData.file ? (
                                        <div>
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📎</div>
                                            <p style={{ color: 'var(--text)', fontWeight: '600' }}>{formData.file.name}</p>
                                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                {formatFileSize(formData.file.size)}
                                            </p>
                                        </div>
                                    ) : editingResource?.hasFile ? (
                                        <div>
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                                            <p className="text-muted">Fichier actuel: {editingResource.nomFichierOriginal}</p>
                                            <p style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>
                                                Cliquez pour remplacer
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📤</div>
                                            <p className="text-muted">Glissez un fichier ici ou cliquez pour parcourir</p>
                                            <p style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>
                                                PDF, Documents, Images, Vidéos...
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                margin: '1.5rem 0',
                                color: 'var(--text-muted)'
                            }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                                <span style={{ fontSize: '0.8rem' }}>OU</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                            </div>

                            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="input-label">Lien externe (URL)</label>
                                <input
                                    type="url"
                                    className="input-field"
                                    value={formData.lienExterne}
                                    onChange={(e) => setFormData({ ...formData, lienExterne: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="input-label">Description</label>
                                <textarea
                                    className="input-field"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Description de la ressource..."
                                    rows="3"
                                    style={{ resize: 'vertical' }}
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
                                    textAlign: 'center',
                                    fontSize: '0.9rem'
                                }}>
                                    {message.text}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '0.875rem',
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: 'var(--text-muted)',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 1, padding: '0.875rem' }}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                            <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
                                            Upload en cours...
                                        </span>
                                    ) : (
                                        editingResource ? 'Mettre à jour' : 'Ajouter'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
                    <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{
                        maxWidth: '420px',
                        padding: '2rem',
                        borderRadius: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
                        <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                            Supprimer cette ressource ?
                        </h3>
                        <p className="text-muted" style={{ marginBottom: '0.5rem' }}>
                            Êtes-vous sûr de vouloir supprimer
                        </p>
                        <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '1.5rem' }}>
                            "{showDeleteConfirm.nom}"
                        </p>
                        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            Cette action est irréversible. Le fichier sera également supprimé.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem',
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-muted)',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => handleDeleteResource(showDeleteConfirm.id)}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem',
                                    borderRadius: '0.75rem',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    color: 'white',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                                }}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View File Modal */}
            {showViewModal && (
                <div className="modal-overlay" onClick={() => setShowViewModal(null)}>
                    <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{
                        maxWidth: '900px',
                        maxHeight: '90vh',
                        padding: '1.5rem',
                        borderRadius: '1.5rem',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '700' }}>
                                {showViewModal.nom}
                            </h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleDownloadResource(showViewModal)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    📥 Télécharger
                                </button>
                                <button
                                    onClick={() => setShowViewModal(null)}
                                    style={{
                                        padding: '0.5rem',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '0.75rem',
                            overflow: 'hidden',
                            height: 'calc(90vh - 120px)'
                        }}>
                            {showViewModal.contentType?.startsWith('image/') ? (
                                <img
                                    src={`http://localhost:8096/api/ressources/${showViewModal.id}/view`}
                                    alt={showViewModal.nom}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            ) : showViewModal.contentType === 'application/pdf' ? (
                                <iframe
                                    src={`http://localhost:8096/api/ressources/${showViewModal.id}/view`}
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                    title={showViewModal.nom}
                                />
                            ) : showViewModal.contentType?.startsWith('video/') ? (
                                <video
                                    src={`http://localhost:8096/api/ressources/${showViewModal.id}/view`}
                                    controls
                                    style={{ width: '100%', height: '100%' }}
                                />
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    color: 'var(--text-muted)'
                                }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
                                    <p>Aperçu non disponible pour ce type de fichier</p>
                                    <button
                                        onClick={() => handleDownloadResource(showViewModal)}
                                        style={{
                                            marginTop: '1rem',
                                            padding: '0.75rem 1.5rem',
                                            background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                                            border: 'none',
                                            borderRadius: '0.75rem',
                                            color: 'white',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        📥 Télécharger le fichier
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default RessourceManagement;
