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

const approveFormateur = (id) => {
    return axios.put(`${API_URL}/${id}/approve`, {}, { headers: authHeader() });
};

const getFormateurRating = (id) => {
    return axios.get(`${API_URL}/${id}/rating`, { headers: authHeader() });
};

const getFormateurRatingByUserId = (userId) => {
    return axios.get(`${API_URL}/user/${userId}/rating`, { headers: authHeader() });
};

const getPublicCount = () => {
    return axios.get(`${API_URL}/public/count`);
};

const FormateurService = {
    getAllFormateurs,
    createFormateur,
    updateFormateur,
    deleteFormateur,
    approveFormateur,
    getFormateurRating,
    getFormateurRatingByUserId,
    getPublicCount
}; // Don't forget to export it default

export default FormateurService;
