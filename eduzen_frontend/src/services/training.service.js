import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8096/api/trainings';

const getAllTrainings = () => {
    return axios.get(API_URL);
};

const createTraining = (training) => {
    return axios.post(API_URL, training, { headers: authHeader() });
};

const deleteTraining = (id) => {
    return axios.delete(API_URL + '/' + id, { headers: authHeader() });
};

const TrainingService = {
    getAllTrainings,
    createTraining,
    deleteTraining,
};

export default TrainingService;
