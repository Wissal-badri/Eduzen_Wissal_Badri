import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8096/api/plannings';

const getAllPlannings = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

const createPlanning = (data) => {
    return axios.post(API_URL, data, { headers: authHeader() });
};

const updatePlanning = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data, { headers: authHeader() });
};

const deletePlanning = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const PlanningService = {
    getAllPlannings,
    createPlanning,
    updatePlanning,
    deletePlanning
};

export default PlanningService;
