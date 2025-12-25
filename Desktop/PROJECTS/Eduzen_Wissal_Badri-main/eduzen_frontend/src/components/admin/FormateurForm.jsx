import React, { useState } from "react";
import FormateurService from "../../services/formateur.service";

const FormateurForm = ({ onSuccess, formateurToEdit }) => {
    const isEdit = !!formateurToEdit;

    const [formateur, setFormateur] = useState({
        username: formateurToEdit?.user?.username || "",
        password: "",
        email: formateurToEdit?.user?.email || "",
        competences: formateurToEdit?.competences || "",
        remarques: formateurToEdit?.remarques || ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormateur(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const payload = {
            username: formateur.username ? formateur.username.trim() : "",
            email: formateur.email ? formateur.email.trim() : "",
            password: formateur.password,
            competences: formateur.competences ? formateur.competences.trim() : "",
            remarques: formateur.remarques ? formateur.remarques.trim() : ""
        };

        const apiCall = isEdit 
            ? FormateurService.updateFormateur(formateurToEdit.id, payload)
            : FormateurService.createFormateur(payload);

        apiCall.then(
            () => {
                setLoading(false);
                if (!isEdit) {
                    setFormateur({
                        username: "",
                        password: "",
                        email: "",
                        competences: "",
                        remarques: ""
                    });
                }
                onSuccess();
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
        <div className="glass card" style={{ maxWidth: '800px', margin: '2rem auto', padding: '3rem' }}>
            <h2 className="text-gradient font-black" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                {isEdit ? "Modifier le Formateur" : "Ajouter un Formateur"}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="input-group">
                        <label className="input-label">Nom d'utilisateur</label>
                        <input
                            type="text"
                            name="username"
                            className="input-field"
                            value={formateur.username}
                            onChange={handleChange}
                            placeholder="Ex: jdoe"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="input-field"
                            value={formateur.email}
                            onChange={handleChange}
                            placeholder="Ex: jdoe@example.com"
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Mot de passe {isEdit && "(Laissez vide pour conserver l'actuel)"}</label>
                    <input
                        type="password"
                        name="password"
                        className="input-field"
                        value={formateur.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required={!isEdit}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Compétences (Mots-clés)</label>
                    <input
                        type="text"
                        name="competences"
                        className="input-field"
                        value={formateur.competences}
                        onChange={handleChange}
                        placeholder="Ex: Java, React, SQL, DevOps"
                        required
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Remarques</label>
                    <textarea
                        name="remarques"
                        className="input-field"
                        rows="3"
                        value={formateur.remarques}
                        onChange={handleChange}
                        placeholder="Notes internes sur le formateur..."
                    />
                </div>

                {error && <div className="text-error" style={{ marginBottom: '1.5rem', color: 'var(--error)' }}>{error}</div>}

                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
                    {loading ? (isEdit ? "Mise à jour..." : "Ajout en cours...") : (isEdit ? "Mettre à jour le Formateur" : "Enregistrer le Formateur")}
                </button>
            </form>
        </div>
    );
};

export default FormateurForm;
