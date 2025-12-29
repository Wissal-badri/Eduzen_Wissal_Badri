import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8096/api/inscriptions';

const registerToFormation = (formationId, data = {}) => {
    return axios.post(`${API_URL}/formation/${formationId}`, data, { headers: authHeader() });
};

const getMyInscriptions = () => {
    return axios.get(`${API_URL}/my`, { headers: authHeader() });
};

const getStats = () => {
    return axios.get(`${API_URL}/stats`, { headers: authHeader() });
};

const getAllInscriptions = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

const assignPlanning = (inscriptionId, planningId) => {
    return axios.put(`${API_URL}/${inscriptionId}/assign-planning?planningId=${planningId}`, {}, { headers: authHeader() });
};

const unregisterFromFormation = (formationId) => {
    return axios.delete(`${API_URL}/formation/${formationId}`, { headers: authHeader() });
};

const InscriptionService = {
    registerToFormation,
    unregisterFromFormation,
    getMyInscriptions,
    getAllInscriptions,
    assignPlanning,
    getStats
};

export default InscriptionService;
