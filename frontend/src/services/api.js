/* 🛡️ Service API Sécurisé (Fetch Natif - Zéro Dépendance) */

const API_URL = "http://localhost:8000/api";

const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    // Configuration des Headers (Sécurisé)
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // 🛑 Gestion des erreurs 401 (Zéro Trust)
    // On ne redirige PAS si on est déjà sur la page de login ou si c'est la tentative de login
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
        console.warn("Session expirée. Redirection...");
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Erreur JSON" }));
        throw new Error(errorData.detail || `Erreur Serveur (${response.status})`);
    }

    return response.json();
};

export default apiRequest;
