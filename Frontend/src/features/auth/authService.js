import api from '../../services/api';

class AuthService {
  async login(credentials) {
    // credentials should be { email, password, role }
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
  
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }
  
  async validateToken() {
    const response = await api.get('/auth/me');
    return Boolean(response?.data?.id);
  }
  
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  async register(payload) {
    // payload: { email, password, full_name, role }
    const response = await api.post('/auth/register', payload);
    return response.data;
  }
}

export default new AuthService();
