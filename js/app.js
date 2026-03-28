// app.js
document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const blackjackView = document.getElementById('blackjack-view');
    const launchBlackjack = document.getElementById('launch-blackjack');
    const exitBlackjack = document.getElementById('exit-blackjack');

    // Navigation
    launchBlackjack.addEventListener('click', () => {
        homeScreen.style.display = 'none';
        blackjackView.style.display = 'flex';
        // Initialize or Reset Blackjack Game
        if (window.blackjack) {
            window.blackjack.reset();
        } else {
            window.blackjack = new BlackjackGame();
        }
    });

    exitBlackjack.addEventListener('click', () => {
        blackjackView.style.display = 'none';
        homeScreen.style.display = 'flex';
    });

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW Registered', reg))
            .catch(err => console.error('SW Registration Failed', err));
    }
});
