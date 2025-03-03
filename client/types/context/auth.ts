export interface User {
    _id: string;
    name: string;
    email: string;
  }
  
  export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    logout: () => void;
  }
  