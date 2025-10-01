const API_BASE_URL = 'https://nks-backend-mou5.onrender.com/api';

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    phone: string;
    name: string;
    role: string;
  };
  message?: string;
}

export class AuthService {
  private static TOKEN_KEY = 'nks_auth_token';
  private static USER_KEY = 'nks_user_data';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        this.setToken(data.token);
        if (data.user) {
          this.setUser(data.user);
        }
        return { success: true, token: data.token, user: data.user };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.location.href = '/login';
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getUser(): any {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      ...options.headers,
      ...this.getAuthHeaders(),
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      this.logout();
      throw new Error('Session expired. Please login again.');
    }

    return response;
  }
}