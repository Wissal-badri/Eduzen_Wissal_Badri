import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8096/api/ressources";

const getResourcesByFormation = (formationId) => {
    return axios.get(`${API_URL}/formation/${formationId}`, { headers: authHeader() });
};

const getMyResources = (includeArchived = false) => {
    return axios.get(`${API_URL}/mes-ressources?includeArchived=${includeArchived}`, { headers: authHeader() });
};

const addResource = (resourceData) => {
    return axios.post(API_URL, resourceData, {
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        }
    });
};

const addResourceWithFile = (formData) => {
    // Don't set Content-Type manually for FormData - axios will set it with the correct boundary
    return axios.post(API_URL, formData, {
        headers: authHeader()
    });
};

const updateResource = (id, resourceData) => {
    return axios.put(`${API_URL}/${id}`, resourceData, {
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        }
    });
};

const updateResourceWithFile = (id, formData) => {
    // Don't set Content-Type manually for FormData - axios will set it with the correct boundary
    return axios.put(`${API_URL}/${id}`, formData, {
        headers: authHeader()
    });
};

const deleteResource = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const archiveResource = (id) => {
    return axios.put(`${API_URL}/${id}/archive`, {}, { headers: authHeader() });
};

const unarchiveResource = (id) => {
    return axios.put(`${API_URL}/${id}/unarchive`, {}, { headers: authHeader() });
};

const incrementDownload = (id) => {
    return axios.post(`${API_URL}/${id}/download`, {}, { headers: authHeader() });
};

const downloadFile = async (id, fileName) => {
    try {
        const response = await axios.get(`${API_URL}/${id}/download`, {
            headers: authHeader(),
            responseType: 'blob'
        });

        // Create a download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName || 'download');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return response;
    } catch (error) {
        throw error;
    }
};

const getFileViewUrl = (id) => {
    return `${API_URL}/${id}/view`;
};

const getResourceFile = (id) => {
    return axios.get(`${API_URL}/${id}/view`, {
        headers: authHeader(),
        responseType: 'blob'
    });
};

const RessourceService = {
    getResourcesByFormation,
    getMyResources,
    addResource,
    addResourceWithFile,
    updateResource,
    updateResourceWithFile,
    deleteResource,
    archiveResource,
    unarchiveResource,
    incrementDownload,
    downloadFile,
    getFileViewUrl,
    getResourceFile
};

export default RessourceService;
