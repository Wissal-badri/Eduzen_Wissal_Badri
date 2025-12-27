import React, { useState, useEffect } from "react";
import EntrepriseService from "../../services/entreprise.service";

const EntrepriseForm = ({ onSuccess, entrepriseToEdit }) => {
    const isEdit = !!entrepriseToEdit;

    const [entreprise, setEntreprise] = useState({
        nom: "",
        adresse: "",
        telephone: "",
        url: "",
        email: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (entrepriseToEdit) {
            setEntreprise({
                nom: entrepriseToEdit.nom || "",
                adresse: entrepriseToEdit.adresse || "",
                telephone: entrepriseToEdit.telephone || "",
                url: entrepriseToEdit.url || "",
                email: entrepriseToEdit.email || ""
            });
        }
    }, [entrepriseToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEntreprise(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const apiCall = isEdit 
            ? EntrepriseService.updateEntreprise(entrepriseToEdit.id, entreprise)
            : EntrepriseService.createEntreprise(entreprise);

        apiCall.then(
            () => {
                setLoading(false);
                onSuccess();
            },
            (err) => {
                const msg = err.response?.data?.message || err.message || "Erreur inconnue";
                setError(msg);
                setLoading(false);
            }
        );
    };

    return (
        <div className="glass card" style={{ maxWidth: '800px', margin: '2rem auto', padding: '3rem' }}>
            <h2 className="text-gradient font-black" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                {isEdit ? "Modifier l'entreprise" : "Nouvelle Entreprise"}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="input-label">Nom de l'entreprise</label>
                    <input
                        type="text"
                        name="nom"
                        className="input-field"
                        value={entreprise.nom}
                        onChange={handleChange}
                        placeholder="Ex: EduZen Tech"
                        required
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Adresse</label>
                    <input
                        type="text"
                        name="adresse"
                        className="input-field"
                        value={entreprise.adresse}
                        onChange={handleChange}
                        placeholder="Ex: 123 Rue de la Liberté, Casablanca"
                    />
                </div>

                <div className="form-row">
                    <div className="input-group">
                        <label className="input-label">Téléphone</label>
                        <input
                            type="text"
                            name="telephone"
                            className="input-field"
                            value={entreprise.telephone}
                            onChange={handleChange}
                            placeholder="Ex: +212 600 000 000"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Email Professionnel</label>
                        <input
                            type="email"
                            name="email"
                            className="input-field"
                            value={entreprise.email}
                            onChange={handleChange}
                            placeholder="Ex: contact@entreprise.com"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Site Web (URL)</label>
                    <input
                        type="url"
                        name="url"
                        className="input-field"
                        value={entreprise.url}
                        onChange={handleChange}
                        placeholder="Ex: https://www.entreprise.com"
                    />
                </div>

                {error && <div className="text-error" style={{ marginBottom: '1.5rem', color: 'var(--error)' }}>{error}</div>}

                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
                    {loading ? "Enregistrement..." : (isEdit ? "Mettre à jour" : "Enregistrer l'entreprise")}
                </button>
            </form>
        </div>
    );
};

export default EntrepriseForm;
