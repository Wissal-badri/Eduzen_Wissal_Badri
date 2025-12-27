import axios from 'axios';

const API_URL = 'http://localhost:8096/api/individus';

const register = (individu) => {
    return axios.post(API_URL + '/register', individu);
};

const getAllIndividus = (headers) => {
    return axios.get(API_URL, { headers });
};

const deleteIndividu = (id, headers) => {
    return axios.delete(API_URL + '/' + id, { headers });
};

const IndividuService = {
    register,
    getAllIndividus,
    deleteIndividu
};

export default IndividuService;
