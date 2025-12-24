import React, { useState } from "react";
import FormateurService from "../../services/formateur.service";

const FormateurForm = ({ onSuccess }) => {
    const [formateur, setFormateur] = useState({
        username: "",
        password: "",
        email: "",
        competences: "",
        remarques: ""
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

        // Prepare payload with sanitized data
        const payload = {
            username: formateur.username ? formateur.username.trim() : "",
            email: formateur.email ? formateur.email.trim() : "",
            password: formateur.password, // Don't trim password usually, but context dependent.
            competences: formateur.competences ? formateur.competences.trim() : "",
            remarques: formateur.remarques ? formateur.remarques.trim() : ""
        };

        // Log payload for debugging
        console.log("Sending formateur payload:", payload);

        FormateurService.createFormateur(payload).then(
            () => {
                setLoading(false);
                setFormateur({
                    username: "",
                    password: "",
                    email: "",
                    competences: "",
                    remarques: ""
                });
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
                Ajouter un Formateur
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
                    <label className="input-label">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        className="input-field"
                        value={formateur.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
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
                    {loading ? "Ajout en cours..." : "Enregistrer le Formateur"}
                </button>
            </form>
        </div>
    );
};

export default FormateurForm;
