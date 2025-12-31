import React, { useState, useEffect } from "react";
import RessourceService from "../../services/ressource.service";

const RessourceViewer = ({ formation, onClose }) => {
    const [ressources, setRessources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
    const [showViewModal, setShowViewModal] = useState(null);

    useEffect(() => {
        if (formation?.id) {
            loadResources();
        }
    }, [formation?.id]);

    const loadResources = async () => {
        setLoading(true);
        try {
            console.log("Loading resources for formation ID:", formation.id);
            console.log("Formation object:", formation);
            const response = await RessourceService.getResourcesByFormation(formation.id);
            console.log("Resources response:", response.data);
            setRessources(response.data);
        } catch (err) {
            console.error("Error loading resources:", err);
            console.error("Error response:", err.response?.data);
        }
        setLoading(false);
    };

    const handleDownload = async (resource) => {
        setDownloading(resource.id);
        try {
            if (resource.hasFile) {
                // Download actual file
                await RessourceService.downloadFile(resource.id, resource.nomFichierOriginal || resource.nom);
            } else if (resource.lienExterne) {
                // Increment download count then open external link
                await RessourceService.incrementDownload(resource.id);
                window.open(resource.lienExterne, '_blank');
            }
        } catch (err) {
            console.error("Error:", err);
            // Fallback to external link if download fails
            if (resource.lienExterne) {
                window.open(resource.lienExterne, '_blank');
            }
        }
        setDownloading(null);
    };

    const handleView = (resource) => {
        if (resource.hasFile) {
            setShowViewModal(resource);
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
            'PDF': { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
            'VIDEO': { background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' },
            'LIEN': { background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee' },
            'DOCUMENT': { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
            'IMAGE': { background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80' }
        };
        return styles[type] || styles['DOCUMENT'];
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
                <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{
                    maxWidth: '700px',
                    maxHeight: '85vh',
                    overflow: 'auto',
                    padding: '2.5rem',
                    borderRadius: '1.5rem'
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                                    📚 Ressources de la formation
                                </h2>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                    {formation?.titre}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    fontSize: '1.2rem'
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                            <p className="text-muted">Chargement des ressources...</p>
                        </div>
                    ) : ressources.length === 0 ? (
                        <div style={{
                            padding: '4rem 2rem',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '1rem',
                            border: '1px dashed rgba(255, 255, 255, 0.1)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                            <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>Aucune ressource disponible</h3>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                Le formateur n'a pas encore ajouté de ressources pour cette formation.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {ressources.map(resource => (
                                <div
                                    key={resource.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1.25rem 1.5rem',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: '1rem',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="resource-item-hover"
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
                                                fontSize: '1rem'
                                            }}>
                                                {resource.nom}
                                            </div>
                                            {resource.description && (
                                                <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                                    {resource.description.length > 80
                                                        ? resource.description.substring(0, 80) + '...'
                                                        : resource.description}
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                <span style={{
                                                    ...getTypeBadgeStyle(resource.type),
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '1rem',
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
                                                        borderRadius: '1rem',
                                                        fontSize: '0.65rem',
                                                        fontWeight: '600'
                                                    }}>
                                                        📎 Fichier
                                                    </span>
                                                )}
                                                {resource.tailleFichier && (
                                                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                        {formatFileSize(resource.tailleFichier)}
                                                    </span>
                                                )}
                                                {resource.nombreTelechargements > 0 && (
                                                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                        📥 {resource.nombreTelechargements} téléchargement{resource.nombreTelechargements > 1 ? 's' : ''}
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
                                                onClick={() => handleView(resource)}
                                                title="Afficher"
                                                style={{
                                                    padding: '0.6rem 0.8rem',
                                                    background: 'rgba(0, 212, 255, 0.1)',
                                                    border: 'none',
                                                    borderRadius: '0.6rem',
                                                    cursor: 'pointer',
                                                    color: '#00d4ff',
                                                    fontSize: '0.9rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.3rem'
                                                }}
                                            >
                                                👁️ Voir
                                            </button>
                                        )}

                                        {/* Download button */}
                                        {(resource.hasFile || resource.lienExterne) && (
                                            <button
                                                onClick={() => handleDownload(resource)}
                                                disabled={downloading === resource.id}
                                                style={{
                                                    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                                                    border: 'none',
                                                    borderRadius: '0.6rem',
                                                    padding: '0.6rem 1rem',
                                                    color: 'white',
                                                    fontWeight: '600',
                                                    fontSize: '0.8rem',
                                                    cursor: downloading === resource.id ? 'wait' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    boxShadow: '0 2px 10px rgba(0, 212, 255, 0.3)',
                                                    transition: 'all 0.2s ease',
                                                    opacity: downloading === resource.id ? 0.7 : 1
                                                }}
                                            >
                                                {downloading === resource.id ? (
                                                    <>
                                                        <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                                                        Téléchargement...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>📥</span> Télécharger
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer info */}
                    {ressources.length > 0 && (
                        <div style={{
                            marginTop: '2rem',
                            paddingTop: '1.5rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center'
                        }}>
                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                                {ressources.length} ressource{ressources.length > 1 ? 's' : ''} disponible{ressources.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    )}

                    <style>{`
                        .resource-item-hover:hover {
                            background: rgba(255, 255, 255, 0.05) !important;
                            border-color: rgba(0, 212, 255, 0.2) !important;
                        }
                    `}</style>
                </div>
            </div>

            {/* View File Modal */}
            {showViewModal && (
                <div className="modal-overlay" onClick={() => setShowViewModal(null)} style={{ zIndex: 1300 }}>
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
                                    onClick={() => handleDownload(showViewModal)}
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
                                        onClick={() => handleDownload(showViewModal)}
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
        </>
    );
};

export default RessourceViewer;
