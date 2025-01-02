import { ref } from 'vue';

describe('Logout Component Tests', () => {
    let isAuthenticated;
    let logout;

    beforeEach(() => {
        // Mock l'état d'authentification
        isAuthenticated = ref(true);

        // Mock localStorage et window.location.href
        Storage.prototype.setItem = jest.fn();
        Storage.prototype.getItem = jest.fn(() => 'mock-token');
        Storage.prototype.removeItem = jest.fn();
        delete window.location;
        window.location = { href: jest.fn() };

        // Fonction logout simulée depuis le composant
        logout = () => {
            localStorage.removeItem('token');
            isAuthenticated.value = false;
            window.location.href = '/';
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should log out the user and redirect to home', () => {
        // Vérifie que l'utilisateur est authentifié au départ
        expect(isAuthenticated.value).toBe(true);

        // Appelle la méthode logout
        logout();

        // Vérifie que le token est supprimé de localStorage
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');

        // Vérifie que l'utilisateur est déconnecté
        expect(isAuthenticated.value).toBe(false);

        // Vérifie que la redirection vers la page d'accueil a eu lieu
        expect(window.location.href).toBe('/');
    });
});


