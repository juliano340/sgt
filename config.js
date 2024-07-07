// config.js
window.CONFIG = {
    development: {
        apiBaseUrl: "http://localhost:3000"
    },
    production: {
        apiBaseUrl: "https://api.juliano340.com" // Remova a barra final
    },
    ENVIRONMENT: "production" // Altere para "production" ou "development" conforme necessário
};

window.API_BASE_URL = window.CONFIG[window.CONFIG.ENVIRONMENT].apiBaseUrl;
