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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        // 🛑 Gestion des erreurs 401 (Zéro Trust)
        // On ne redirige PAS si on est déjà sur la page de login ou si c'est la tentative de login
        if (response.status === 401 && !endpoint.includes('/auth/login')) {
            console.warn("Session expirée. Redirection...");
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "Erreur JSON" }));
            let errMsg = `Erreur Serveur (${response.status})`;
            if (errorData.detail) {
                if (Array.isArray(errorData.detail)) {
                    errMsg = errorData.detail.map(e => e.msg).join(', ');
                } else if (typeof errorData.detail === 'string') {
                    errMsg = errorData.detail;
                } else {
                    errMsg = JSON.stringify(errorData.detail);
                }
            }
            throw new Error(errMsg);
        }

        return response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error("Dépassement du délai de connexion (12s). Veuillez vérifier votre réseau.");
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

export default apiRequest;
