// app.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Blackjack Game
    window.blackjack = new BlackjackGame();

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW Registered', reg))
            .catch(err => console.error('SW Registration Failed', err));
    }
});
