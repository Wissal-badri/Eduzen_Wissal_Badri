import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8096/api/formateurs';

const getAllFormateurs = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

const createFormateur = (formateurData) => {
    return axios.post(API_URL, formateurData, { headers: authHeader() });
};

const updateFormateur = (id, formateurData) => {
    return axios.put(`${API_URL}/${id}`, formateurData, { headers: authHeader() });
};

const deleteFormateur = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const FormateurService = {
    getAllFormateurs,
    createFormateur,
    updateFormateur,
    deleteFormateur
};

export default FormateurService;
