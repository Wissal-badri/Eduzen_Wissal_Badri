import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8096/api/inscriptions';

const registerToFormation = (formationId) => {
    return axios.post(`${API_URL}/formation/${formationId}`, {}, { headers: authHeader() });
};

const getMyInscriptions = () => {
    return axios.get(`${API_URL}/my`, { headers: authHeader() });
};

const getStats = () => {
    return axios.get(`${API_URL}/stats`, { headers: authHeader() });
};

const InscriptionService = {
    registerToFormation,
    getMyInscriptions,
    getStats
};

export default InscriptionService;
