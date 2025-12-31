import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8096/api/evaluations";

const submitEvaluation = (formationId, evaluationData) => {
    return axios.post(`${API_URL}/formation/${formationId}`, evaluationData, { headers: authHeader() });
};

const getEvaluationsByFormation = (formationId) => {
    return axios.get(`${API_URL}/formation/${formationId}`, { headers: authHeader() });
};

const EvaluationService = {
    submitEvaluation,
    getEvaluationsByFormation,
};

export default EvaluationService;
