export interface User {
    id: string;
    email: string;
    role: string;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    role: string;
    token: string | null;
}