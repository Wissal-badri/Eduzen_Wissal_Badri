import React, { useState, useEffect } from "react";
import FormationService from "../../services/formation.service";

const FormationForm = ({ onSuccess, formationToEdit, formateurs }) => {
    const [formation, setFormation] = useState({
        titre: "",
        nombreHeures: "",
        cout: "",
        objectifs: "",
        programmeDetaille: "",
        categorie: "",
        ville: "",
        formateurId: "",
        pourIndividus: false,
        statut: 'OUVERTE',
        dateDebut: '',
        dateFin: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Helper to format date to YYYY-MM-DD for input type="date"
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (formationToEdit) {
            setFormation({
                ...formationToEdit,
                formateurId: formationToEdit.formateur ? formationToEdit.formateur.id : "",
                dateDebut: formatDateForInput(formationToEdit.dateDebut),
                dateFin: formatDateForInput(formationToEdit.dateFin)
            });
        }
    }, [formationToEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormation(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Prepare payload with correct data types
        const payload = {
            ...formation,
            titre: formation.titre ? formation.titre.trim() : "",
            nombreHeures: formation.nombreHeures ? parseInt(formation.nombreHeures, 10) : 0,
            cout: formation.cout ? parseFloat(formation.cout) : 0,
            objectifs: formation.objectifs ? formation.objectifs.trim() : "",
            programmeDetaille: formation.programmeDetaille ? formation.programmeDetaille.trim() : "",
            categorie: formation.categorie ? formation.categorie.trim() : "",
            ville: formation.ville ? formation.ville.trim() : "",
            formateur: formation.formateurId ? { id: parseInt(formation.formateurId, 10) } : null,
            pourIndividus: formation.pourIndividus,
            statut: formation.statut,
            dateDebut: formation.dateDebut ? new Date(formation.dateDebut).toISOString() : null,
            dateFin: formation.dateFin ? new Date(formation.dateFin).toISOString() : null,
        };

        // Log payload for debugging
        console.log("Sending payload:", payload);

        const apiCall = formationToEdit
            ? FormationService.updateFormation(formationToEdit.id, payload)
            : FormationService.createFormation(payload);

        apiCall.then(
            () => {
                setLoading(false);
                setShowSuccessModal(true);
                // onSuccess will be called when user clicks button in modal
            },
            (err) => {
                console.error("Save error:", err);
                const msg = (err.response && err.response.data && err.response.data.message)
                    ? err.response.data.message
                    : (err.message || "Erreur inconnue");
                setError("Erreur serveur: " + msg);
                setLoading(false);
            }
        );
    };

    return (
        <>
            {/* Success Details Pop-up */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="success-icon">✓</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Formation Enregistrée !</h3>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                            La formation a été {formationToEdit ? "modifiée" : "créée"} avec succès.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={onSuccess}
                            style={{ width: '100%', padding: '0.8rem' }}
                        >
                            Continuer
                        </button>
                    </div>
                </div>
            )}

            <div className="glass card" style={{ maxWidth: '800px', margin: '2rem auto', padding: '3rem' }}>
                <h2 className="text-gradient font-black" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                    {formationToEdit ? "Modifier la Formation" : "Ajouter une Nouvelle Formation"}
                </h2>

                <form onSubmit={handleSubmit} className="training-form">
                    <div className="input-group">
                        <label className="input-label">Titre de la Formation</label>
                        <input
                            type="text"
                            name="titre"
                            className="input-field"
                            value={formation.titre}
                            onChange={handleChange}
                            placeholder="Ex: Master React & Node.js"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label className="input-label">Nombre d'Heures</label>
                            <input
                                type="number"
                                name="nombreHeures"
                                className="input-field"
                                value={formation.nombreHeures}
                                onChange={handleChange}
                                placeholder="Ex: 40"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Coût (MAD)</label>
                            <input
                                type="number"
                                name="cout"
                                className="input-field"
                                value={formation.cout}
                                onChange={handleChange}
                                placeholder="Ex: 1500"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label className="input-label">Catégorie</label>
                            <input
                                type="text"
                                name="categorie"
                                className="input-field"
                                value={formation.categorie}
                                onChange={handleChange}
                                placeholder="Ex: Développement Web"
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Ville</label>
                            <input
                                type="text"
                                name="ville"
                                className="input-field"
                                value={formation.ville}
                                onChange={handleChange}
                                placeholder="Ex: Tunis"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Formateur Assigné</label>
                        <select
                            name="formateurId"
                            className="input-field"
                            value={formation.formateurId}
                            onChange={handleChange}
                            style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: '#fff' }}
                        >
                            <option value="" style={{ background: '#1e293b' }}>-- Choisir un formateur --</option>
                            {formateurs && formateurs.map(f => (
                                <option key={f.id} value={f.id} style={{ background: '#1e293b' }}>
                                    {f.user.username} ({f.competences})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px' }}>
                        <input
                            type="checkbox"
                            name="pourIndividus"
                            id="pourIndividus"
                            checked={formation.pourIndividus}
                            onChange={handleChange}
                            style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                        />
                        <label htmlFor="pourIndividus" style={{ cursor: 'pointer', margin: 0, fontWeight: 600 }}>Formation ouverte aux individus (Inscription publique)</label>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label className="input-label">Statut</label>
                            <select
                                name="statut"
                                className="input-field"
                                value={formation.statut}
                                onChange={handleChange}
                            >
                                <option value="OUVERTE">Ouverte</option>
                                <option value="FERMEE">Fermée / Terminée</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label className="input-label">Date de Début</label>
                            <input
                                type="date"
                                name="dateDebut"
                                className="input-field"
                                value={formation.dateDebut}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Date de Fin</label>
                            <input
                                type="date"
                                name="dateFin"
                                className="input-field"
                                value={formation.dateFin}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Objectifs</label>
                        <textarea
                            name="objectifs"
                            className="input-field"
                            rows="3"
                            value={formation.objectifs}
                            onChange={handleChange}
                            placeholder="Qu'est-ce que les individus vont apprendre ?"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Programme Détaillé</label>
                        <textarea
                            name="programmeDetaille"
                            className="input-field"
                            rows="5"
                            value={formation.programmeDetaille}
                            onChange={handleChange}
                            placeholder="Module 1: ... Module 2: ..."
                        />
                    </div>

                    {error && <div className="text-error" style={{ marginBottom: '1.5rem', color: 'var(--error)' }}>{error}</div>}

                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
                        {loading ? (formationToEdit ? "Modification en cours..." : "Création en cours...") : (formationToEdit ? "Modifier la Formation" : "Enregistrer la Formation")}
                    </button>
                </form>
            </div>
        </>
    );
};

export default FormationForm;
