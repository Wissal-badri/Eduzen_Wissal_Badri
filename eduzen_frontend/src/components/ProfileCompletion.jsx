import React, { useState } from "react";
import AuthService from "../services/auth.service";
import axios from "axios";
import authHeader from "../services/auth-header";

const ProfileCompletion = ({ user, onComplete }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        entreprise: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        axios.put("http://localhost:8096/api/auth/profile", formData, { headers: authHeader() })
            .then(res => {
                // Update local storage user data
                const currentUser = JSON.parse(localStorage.getItem("user"));
                const updatedUser = { ...currentUser, ...res.data };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setLoading(false);
                onComplete();
                window.location.reload(); // Refresh to update context
            })
            .catch(err => {
                setError("Erreur lors de la mise à jour du profil.");
                setLoading(false);
            });
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
            <div className="modal-content glass" style={{ maxWidth: '500px', padding: '3rem' }}>
                <h2 className="text-gradient font-black" style={{ marginBottom: '1rem', textAlign: 'center' }}>Complétez votre Profil</h2>
                <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    Ces informations sont obligatoires pour accéder aux formations.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div className="form-row">
                        <div className="input-group">
                            <label className="input-label">Prénom</label>
                            <input type="text" name="firstName" className="input-field" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Nom</label>
                            <input type="text" name="lastName" className="input-field" value={formData.lastName} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Téléphone</label>
                        <input type="tel" name="phone" className="input-field" value={formData.phone} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Entreprise / Organisation</label>
                        <input type="text" name="entreprise" className="input-field" value={formData.entreprise} onChange={handleChange} required placeholder="Ex: OCP, Freelance, etc." />
                    </div>

                    {error && <p className="text-error" style={{ textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
                        {loading ? "Mise à jour..." : "Enregistrer et Accéder"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileCompletion;
