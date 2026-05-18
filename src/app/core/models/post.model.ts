export interface UserSummary {
    id: number;
    username: string;
    email: string;
}

export interface Post {
    id?: number;
    title: string;
    content: string;
    userId?: number;        // utilisé uniquement pour les envois (create/update)
    user?: UserSummary;     // présent dans les réponses du serveur
    createdAt?: string;
    updatedAt?: string;
}