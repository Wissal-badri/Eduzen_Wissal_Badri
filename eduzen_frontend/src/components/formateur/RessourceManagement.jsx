import React, { useState, useEffect, useRef } from "react";
import RessourceService from "../../services/ressource.service";
import "../../styles/pages/ressources.css";
import {
    FiEye, FiDownload, FiEdit2, FiTrash2, FiArchive, FiPackage,
    FiFileText, FiVideo, FiLink, FiImage, FiFile, FiFolder,
    FiPlus, FiLayers, FiAlertCircle, FiX, FiUpload, FiCheck
} from "react-icons/fi";

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
    const [viewBlobUrl, setViewBlobUrl] = useState(null);
    const [isViewLoading, setIsViewLoading] = useState(false);
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
    }, []);

    const loadAllResources = async () => {
        setLoading(true);
        try {
            // Always load all resources including archived for proper tab counts
            const response = await RessourceService.getMyResources(true);
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

    const handleViewResource = async (resource) => {
        if (resource.hasFile) {
            setShowViewModal(resource);
            setIsViewLoading(true);
            try {
                const response = await RessourceService.getResourceFile(resource.id);
                // Usually axios response.data is the blob directly if responseType is blob
                const blob = response.data;
                // Alternatively verify if response.data is Blob, if not make one. 
                // But with responseType: 'blob', it is a Blob.

                const url = window.URL.createObjectURL(blob);
                setViewBlobUrl(url);
            } catch (err) {
                console.error("Error fetching file preview:", err);
            }
            setIsViewLoading(false);
        } else if (resource.lienExterne) {
            window.open(resource.lienExterne, '_blank');
        }
    };

    const handleCloseViewModal = () => {
        setShowViewModal(null);
        if (viewBlobUrl) {
            window.URL.revokeObjectURL(viewBlobUrl);
            setViewBlobUrl(null);
        }
        setIsViewLoading(false);
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
            'PDF': <FiFileText size={24} />,
            'VIDEO': <FiVideo size={24} />,
            'LIEN': <FiLink size={24} />,
            'DOCUMENT': <FiFile size={24} />,
            'IMAGE': <FiImage size={24} />
        };
        return icons[type] || <FiFile size={24} />;
    };

    const getTypeClass = (type) => {
        const classes = {
            'PDF': 'pdf',
            'VIDEO': 'video',
            'LIEN': 'lien',
            'DOCUMENT': 'document',
            'IMAGE': 'image'
        };
        return classes[type] || 'document';
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (loading) {
        return (
            <div className="glass card loading-container">
                <div className="spinner loading-spinner"></div>
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

            {/* Toggle tabs for Active/Archived resources */}
            <div className="ressources-tabs">
                <button
                    onClick={() => setShowArchived(false)}
                    className={`ressources-tab ${!showArchived ? 'active' : ''}`}
                >
                    <FiLayers style={{ marginRight: '0.5rem' }} /> Ressources actives
                    <span className="ressources-tab-count">
                        {ressources.filter(r => !r.archived).length}
                    </span>
                </button>
                <button
                    onClick={() => setShowArchived(true)}
                    className={`ressources-tab archived ${showArchived ? 'active' : ''}`}
                >
                    <FiArchive style={{ marginRight: '0.5rem' }} /> Archivées
                    <span className="ressources-tab-count">
                        {ressources.filter(r => r.archived).length}
                    </span>
                </button>
            </div>

            {/* My Formations with resources */}
            {myFormations.length === 0 ? (
                <div className="glass card loading-container">
                    <div className="empty-state-icon"><FiFolder size={48} /></div>
                    <h3 className="text-gradient font-black empty-state-title">
                        Aucune formation assignée
                    </h3>
                    <p className="text-muted">Vous n'avez pas encore de formation assignée.</p>
                </div>
            ) : (
                <div className="formations-container">
                    {myFormations.map(formation => {
                        // Filter resources based on active tab (archived or not)
                        const formationResources = ressources.filter(r =>
                            r.formationId === formation.id &&
                            (showArchived ? r.archived : !r.archived)
                        );

                        return (
                            <div key={formation.id} className="glass card formation-card">
                                <div className="formation-header">
                                    <div>
                                        <h3 className="formation-title">
                                            {formation.titre}
                                        </h3>
                                        <p className="text-muted formation-subtitle">
                                            {formation.nombreHeures}h • {formation.ville}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleOpenAddModal(formation)}
                                        className="btn-add-resource"
                                    >
                                        <FiPlus size={18} style={{ marginRight: '0.3rem' }} /> Ajouter une ressource
                                    </button>
                                </div>

                                {formationResources.length === 0 ? (
                                    <div className="empty-resources">
                                        <p className="text-muted">Aucune ressource ajoutée</p>
                                    </div>
                                ) : (
                                    <div className="resources-list">
                                        {formationResources.map(resource => (
                                            <div
                                                key={resource.id}
                                                className={`resource-item ${resource.archived ? 'archived' : ''}`}
                                            >
                                                <div className="resource-content">
                                                    <div className={`resource-type-icon ${getTypeClass(resource.type)}`}>
                                                        {getTypeIcon(resource.type)}
                                                    </div>
                                                    <div className="resource-info">
                                                        <div className="resource-name">
                                                            {resource.nom}
                                                            {resource.archived && (
                                                                <span className="badge-archived">ARCHIVÉ</span>
                                                            )}
                                                        </div>
                                                        {resource.description && (
                                                            <div className="text-muted resource-description">
                                                                {resource.description.length > 60
                                                                    ? resource.description.substring(0, 60) + '...'
                                                                    : resource.description}
                                                            </div>
                                                        )}
                                                        <div className="resource-meta">
                                                            <span className={`badge badge-${getTypeClass(resource.type)}`}>
                                                                {resource.type}
                                                            </span>
                                                            {resource.hasFile && (
                                                                <span className="badge-file">
                                                                    <FiFile size={12} style={{ marginRight: '0.2rem' }} /> Fichier joint
                                                                </span>
                                                            )}
                                                            {resource.tailleFichier && (
                                                                <span className="text-muted resource-size">
                                                                    {formatFileSize(resource.tailleFichier)}
                                                                </span>
                                                            )}
                                                            {resource.nombreTelechargements > 0 && (
                                                                <span className="text-muted resource-size">
                                                                    <FiDownload size={12} style={{ marginRight: '0.2rem' }} /> {resource.nombreTelechargements}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div className="resource-actions">
                                                    {/* View button */}
                                                    {(resource.hasFile || resource.lienExterne) && (
                                                        <button
                                                            onClick={() => handleViewResource(resource)}
                                                            title="Afficher"
                                                            className="btn-action view"
                                                        >
                                                            <FiEye size={18} />
                                                        </button>
                                                    )}

                                                    {/* Download button */}
                                                    {(resource.hasFile || resource.lienExterne) && (
                                                        <button
                                                            onClick={() => handleDownloadResource(resource)}
                                                            title="Télécharger"
                                                            className="btn-action download"
                                                        >
                                                            <FiDownload size={18} />
                                                        </button>
                                                    )}

                                                    {/* Edit button */}
                                                    <button
                                                        onClick={() => handleEditResource(resource)}
                                                        title="Modifier"
                                                        className="btn-action edit"
                                                    >
                                                        <FiEdit2 size={18} />
                                                    </button>

                                                    {/* Archive button */}
                                                    <button
                                                        onClick={() => handleArchiveResource(resource)}
                                                        title={resource.archived ? "Désarchiver" : "Archiver"}
                                                        className="btn-action archive"
                                                    >
                                                        {resource.archived ? <FiPackage size={18} /> : <FiArchive size={18} />}
                                                    </button>

                                                    {/* Delete button */}
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(resource)}
                                                        title="Supprimer"
                                                        className="btn-action delete"
                                                    >
                                                        <FiTrash2 size={18} />
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
                    <div className="modal-content glass resource-modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="resource-modal-title">
                            {editingResource ? 'Modifier la ressource' : 'Ajouter une ressource'}
                        </h2>
                        <p className="text-muted resource-modal-subtitle">
                            Formation: <span>{selectedFormation?.titre}</span>
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
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

                            <div className="input-group">
                                <label className="input-label">Type de ressource</label>
                                <select
                                    className="input-field"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="DOCUMENT">📁 Document</option>
                                    <option value="PDF">📄 PDF</option>
                                    <option value="VIDEO">🎬 Vidéo</option>
                                    <option value="LIEN">🔗 Lien externe</option>
                                    <option value="IMAGE">🖼️ Image</option>
                                </select>
                            </div>

                            {/* File Upload */}
                            <div className="input-group">
                                <label className="input-label">
                                    Joindre un fichier {editingResource?.hasFile && '(remplacer l\'existant)'}
                                </label>
                                <div
                                    className="file-upload-zone"
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
                                            <div className="file-upload-icon"><FiCheck size={32} color="#10b981" /></div>
                                            <p className="file-upload-name">{formData.file.name}</p>
                                            <p className="text-muted file-upload-size">
                                                {formatFileSize(formData.file.size)}
                                            </p>
                                        </div>
                                    ) : editingResource?.hasFile ? (
                                        <div>
                                            <div className="file-upload-icon"><FiFileText size={32} /></div>
                                            <p className="text-muted">Fichier actuel: {editingResource.nomFichierOriginal}</p>
                                            <p className="file-upload-hint">
                                                Cliquez pour remplacer
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="file-upload-icon"><FiUpload size={32} /></div>
                                            <p className="text-muted">Glissez un fichier ici ou cliquez pour parcourir</p>
                                            <p className="file-upload-hint">
                                                PDF, Documents, Images, Vidéos...
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-divider">
                                <div className="form-divider-line"></div>
                                <span className="form-divider-text">OU</span>
                                <div className="form-divider-line"></div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Lien externe (URL)</label>
                                <input
                                    type="url"
                                    className="input-field"
                                    value={formData.lienExterne}
                                    onChange={(e) => setFormData({ ...formData, lienExterne: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Description</label>
                                <textarea
                                    className="input-field"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Description de la ressource..."
                                    rows="3"
                                />
                            </div>

                            {message.text && (
                                <div className={`form-message ${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="btn-cancel"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="btn-submit"
                                >
                                    {uploading ? (
                                        <span className="btn-submit-content loading">
                                            <span className="spinner"></span>
                                            Enregistrement...
                                        </span>
                                    ) : (
                                        <span className="btn-submit-content">
                                            {editingResource ? '✓ Mettre à jour' : '✓ Enregistrer la ressource'}
                                        </span>
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
                    <div className="modal-content glass delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-icon"><FiAlertCircle size={48} color="#ef4444" /></div>
                        <h3 className="delete-modal-title">
                            Supprimer cette ressource ?
                        </h3>
                        <p className="text-muted">
                            Êtes-vous sûr de vouloir supprimer
                        </p>
                        <p className="delete-modal-name">
                            "{showDeleteConfirm.nom}"
                        </p>
                        <p className="text-muted delete-modal-warning">
                            Cette action est irréversible. Le fichier sera également supprimé.
                        </p>
                        <div className="delete-modal-actions">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="btn-cancel"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => handleDeleteResource(showDeleteConfirm.id)}
                                className="btn-delete"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View File Modal */}
            {showViewModal && (
                <div className="modal-overlay" onClick={handleCloseViewModal}>
                    <div className="modal-content glass view-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="view-modal-header">
                            <h3 className="view-modal-title">
                                {showViewModal.nom}
                            </h3>
                            <div className="view-modal-actions">
                                <button
                                    onClick={() => handleDownloadResource(showViewModal)}
                                    className="btn-download"
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <FiDownload size={18} style={{ marginRight: '0.5rem' }} /> Télécharger
                                </button>
                                <button
                                    onClick={handleCloseViewModal}
                                    className="btn-close"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="view-modal-content">
                            {isViewLoading ? (
                                <div className="loading-container" style={{ padding: '3rem', textAlign: 'center' }}>
                                    <div className="spinner loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
                                    <p className="text-muted">Chargement de l'aperçu...</p>
                                </div>
                            ) : viewBlobUrl ? (
                                showViewModal.contentType?.startsWith('image/') ? (
                                    <img
                                        src={viewBlobUrl}
                                        alt={showViewModal.nom}
                                        className="view-modal-preview"
                                    />
                                ) : showViewModal.contentType === 'application/pdf' ? (
                                    <iframe
                                        src={viewBlobUrl}
                                        className="view-modal-preview"
                                        title={showViewModal.nom}
                                    />
                                ) : showViewModal.contentType?.startsWith('video/') ? (
                                    <video
                                        src={viewBlobUrl}
                                        controls
                                        className="view-modal-preview"
                                    />
                                ) : (
                                    <div className="view-modal-fallback">
                                        <div className="view-modal-fallback-icon"><FiFileText size={48} /></div>
                                        <p>Aperçu non disponible pour ce type de fichier</p>
                                        <button
                                            onClick={() => handleDownloadResource(showViewModal)}
                                            className="btn-download-fallback"
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <FiDownload size={18} style={{ marginRight: '0.5rem' }} /> Télécharger le fichier
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="view-modal-fallback">
                                    <p className="text-muted">Impossible de charger l'aperçu</p>
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
