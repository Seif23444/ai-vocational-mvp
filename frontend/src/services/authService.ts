import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

interface RegisterResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

interface UserProfile {
  id: number;
  email: string;
  name: string;
}

class AuthService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        email,
        password
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      console.log('🚀 Attempting registration to:', `${API_BASE_URL}/api/register`);
      console.log('📝 Data being sent:', { name, email, password: '***' });
      
      const response = await axios.post(`${API_BASE_URL}/api/register`, {
        name,
        email,
        password
      });
      
      console.log('✅ Registration successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration error details:');
      console.error('- Status:', error.response?.status);
      console.error('- Data:', error.response?.data);
      console.error('- Headers:', error.response?.headers);
      console.error('- Full error:', error);
      
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async getProfile(): Promise<UserProfile> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }

  async getProgress() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/progress`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get progress');
    }
  }

  async updateProgress(moduleId: string, stepId: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/progress/${moduleId}/step/${stepId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update progress');
    }
  }

  async getModule(moduleId: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/modules/${moduleId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get module');
    }
  }
}

export const authService = new AuthService();