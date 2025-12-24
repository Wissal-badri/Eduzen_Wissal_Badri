import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8096/api/formateurs';

const getAllFormateurs = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

const createFormateur = (formateurData) => {
    return axios.post(API_URL, formateurData, { headers: authHeader() });
};

const FormateurService = {
    getAllFormateurs,
    createFormateur,
};

export default FormateurService;
