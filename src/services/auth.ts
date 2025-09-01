const API_BASE_URL = 'https://nks-backend-mou5.onrender.com/api';

export interface LoginCredentials {
  phone: string;   // ✅ changed from email
  password: string;
}


export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    phone: string;  // ✅ should match backend
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
        // Store token securely in localStorage
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
}