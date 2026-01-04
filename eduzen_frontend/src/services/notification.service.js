import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8096/api/notifications';

const getNotifications = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

const markAsRead = (id) => {
    return axios.put(`${API_URL}/${id}/read`, {}, { headers: authHeader() });
};

const getUnreadCount = () => {
    return axios.get(`${API_URL}/unread/count`, { headers: authHeader() });
};

const clearAllNotifications = () => {
    return axios.delete(API_URL, { headers: authHeader() });
};

const NotificationService = {
    getNotifications,
    markAsRead,
    getUnreadCount,
    clearAllNotifications
};

export default NotificationService;
