import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8096/api/formations';

const getAllFormations = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

const createFormation = (formation) => {
    return axios.post(API_URL, formation, { headers: authHeader() });
};

const updateFormation = (id, formation) => {
    return axios.put(API_URL + '/' + id, formation, { headers: authHeader() });
};

const deleteFormation = (id) => {
    return axios.delete(API_URL + '/' + id, { headers: authHeader() });
};

const getAllFormationsPublic = () => {
    // Public endpoint - no authentication required
    return axios.get(API_URL + '/public');
};

const FormationService = {
    getAllFormations,
    createFormation,
    updateFormation,
    deleteFormation,
    getAllFormationsPublic,
};

export default FormationService;
