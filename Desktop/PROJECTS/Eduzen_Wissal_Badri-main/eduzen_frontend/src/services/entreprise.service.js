import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8096/api/entreprises';

const getAllEntreprises = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

const createEntreprise = (data) => {
    return axios.post(API_URL, data, { headers: authHeader() });
};

const updateEntreprise = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data, { headers: authHeader() });
};

const deleteEntreprise = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const EntrepriseService = {
    getAllEntreprises,
    createEntreprise,
    updateEntreprise,
    deleteEntreprise
};

export default EntrepriseService;
