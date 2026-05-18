export interface User {
    id?: number;
    username: string;
    email: string;
    password?: string; // jamais renvoyé côté front après création
    createdAt?: string;
}