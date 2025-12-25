import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8096/api/memos";

const getMemos = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

const addMemo = (content) => {
    return axios.post(API_URL, { content }, { headers: authHeader() });
};

const updateMemo = (id, content) => {
    return axios.put(API_URL + `/${id}`, { content }, { headers: authHeader() });
};

const deleteMemo = (id) => {
    return axios.delete(API_URL + `/${id}`, { headers: authHeader() });
};

const MemoService = {
    getMemos,
    addMemo,
    updateMemo,
    deleteMemo
};

export default MemoService;
