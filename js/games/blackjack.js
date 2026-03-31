class BlackjackGame {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.balance = 1000;
        this.currentBet = 0;
        this.gameState = 'betting'; // betting, playing, resolved

        this.initElements();

        // Trainer counts
        this.runningCount = 0;
        this.plusOneCount = 0;
        this.zeroCount = 0;
        this.minusOneCount = 0;
        this.deck = this.createDeck();

        this.addEventListeners();
        this.updateUI();
        this.updateTrainerUI();
    }

    initElements() {
        this.playerHandEl = document.getElementById('player-hand');
        this.dealerHandEl = document.getElementById('dealer-hand');
        this.playerScoreEl = document.getElementById('player-score');
        this.dealerScoreEl = document.getElementById('dealer-score');
        this.balanceEl = document.getElementById('balance-val');
        this.betInput = document.getElementById('bet-input');
        this.dealBtn = document.getElementById('deal-btn');
        this.hitBtn = document.getElementById('hit-btn');
        this.standBtn = document.getElementById('stand-btn');
        this.doubleBtn = document.getElementById('double-btn');
        this.bettingControls = document.getElementById('betting-controls');
        this.gameControls = document.getElementById('game-controls');
        this.statusOverlay = document.getElementById('status-overlay');
        this.statusMsg = document.getElementById('status-msg');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.dealerSection = document.querySelector('.dealer-section');
        this.playerSection = document.querySelector('.player-section');
        this.dealerScoreOverlay = document.getElementById('dealer-score-overlay');
        this.playerScoreOverlay = document.getElementById('player-score-overlay');

        // Trainer elements
        this.expertModeToggle = document.getElementById('expert-mode-toggle');
        this.trainerOverlay = document.getElementById('trainer-overlay');
        this.countPlusOneEl = document.getElementById('count-plus-one');
        this.countZeroEl = document.getElementById('count-zero');
        this.countMinusOneEl = document.getElementById('count-minus-one');
        this.runningCountEl = document.getElementById('running-count');
        this.handStatusEl = document.getElementById('hand-status');
        this.deckSizeEl = document.getElementById('deck-size');
        this.showSumToggle = document.getElementById('show-sum-toggle');
        
        // Info Modal elements
        this.infoBtn = document.getElementById('info-btn');
        this.infoModal = document.getElementById('info-modal');
        this.closeInfoBtn = document.getElementById('close-info-btn');
    }

    addEventListeners() {
        this.dealBtn.onclick = () => this.startRound();
        this.hitBtn.onclick = () => this.playerHit();
        this.standBtn.onclick = () => this.playerStand();
        this.doubleBtn.onclick = () => this.playerDouble();
        this.playAgainBtn.onclick = () => this.reset();

        this.expertModeToggle.onchange = (e) => {
            this.trainerOverlay.style.display = e.target.checked ? 'block' : 'none';
        };
        this.showSumToggle.onchange = () => this.updateUI();

        if (this.infoBtn) this.infoBtn.onclick = () => this.infoModal.style.display = 'block';
        if (this.closeInfoBtn) this.closeInfoBtn.onclick = () => this.infoModal.style.display = 'none';
    }

    createDeck() {
        const suits = ['♠', '♥', '♣', '♦'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const numDecks = 6;
        let deck = [];

        for (let i = 0; i < numDecks; i++) {
            for (const suit of suits) {
                for (const value of values) {
                    deck.push({ suit, value });
                }
            }
        }
        return this.shuffle(deck);
    }

    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    getCardValue(card) {
        if (['J', 'Q', 'K'].includes(card.value)) return 10;
        if (card.value === 'A') return 11;
        return parseInt(card.value);
    }

    calculateScore(hand) {
        let score = 0;
        let aces = 0;

        for (const card of hand) {
            score += this.getCardValue(card);
            if (card.value === 'A') aces++;
        }

        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }

        return score;
    }
    resetCounts() {
        this.runningCount = 0;
        this.plusOneCount = 0;
        this.zeroCount = 0;
        this.minusOneCount = 0;
        this.updateTrainerUI();
    }

    countCard(card) {
        if (!card) return;
        const val = this.getCardValue(card);
        if (val >= 2 && val <= 6) {
            this.plusOneCount++;
            this.runningCount += 1;
        } else if (val >= 7 && val <= 9) {
            this.zeroCount++;
        } else if (val >= 10) {
            this.minusOneCount++;
            this.runningCount -= 1;
        }
        this.updateTrainerUI();
    }

    updateTrainerUI() {
        if (!this.countPlusOneEl) return;
        this.countPlusOneEl.innerText = this.plusOneCount;
        this.countZeroEl.innerText = this.zeroCount;
        this.countMinusOneEl.innerText = this.minusOneCount;
        this.runningCountEl.innerText = (this.runningCount > 0 ? '+' : '') + this.runningCount;
        this.deckSizeEl.innerText = this.deck.length;

        const decksRemaining = Math.max(1, this.deck.length / 52);
        const trueCount = this.runningCount / decksRemaining;
        
        let status = "Neutral";
        let color = "var(--text-secondary)";
        if (trueCount >= 1) {
            status = "Hot";
            color = "var(--danger)";
        } else if (trueCount <= -1) {
            status = "Cold";
            color = "#3498db";
        }
        
        this.handStatusEl.innerText = status;
        this.handStatusEl.style.color = color;
    }


    startRound() {
        const bet = parseInt(this.betInput.value);
        if (bet > this.balance || bet <= 0) return alert('Invalid bet');

        this.currentBet = bet;
        this.balance -= bet;

        if (this.deck.length < 75) {
            this.deck = this.createDeck();
            this.resetCounts();
        }

        this.playerHand = [this.drawCard(), this.drawCard()];
        this.dealerHand = [this.drawCard(), this.drawCard()];
        this.gameState = 'playing';

        // Count initial visible cards
        this.countCard(this.playerHand[0]);
        this.countCard(this.playerHand[1]);
        this.countCard(this.dealerHand[1]); // Dealer's upcard
        this.updateUI();

        if (this.calculateScore(this.playerHand) === 21) {
            this.playerStand(); // Blackjack check
        }
    }

    drawCard() {
        return this.deck.pop();
    }

    playerHit() {
        const card = this.drawCard();
        this.playerHand.push(card);
        this.countCard(card);
        if (this.calculateScore(this.playerHand) >= 21) {
            this.playerStand();
        }
        this.updateUI();
    }

    playerDouble() {
        if (this.balance < this.currentBet) return alert('Not enough balance');
        this.balance -= this.currentBet;
        this.currentBet *= 2;
        const card = this.drawCard();
        this.playerHand.push(card);
        this.countCard(card);
        this.playerStand();
    }

    async playerStand() {
        this.gameState = 'resolved';
        this.updateUI();

        // Count dealer's hole card now that it's revealed
        if (this.dealerHand.length > 0) {
            this.countCard(this.dealerHand[0]);
        }

        const playerScore = this.calculateScore(this.playerHand);

        if (playerScore <= 21) {
            // Dealer's turn
            while (this.calculateScore(this.dealerHand) < 17) {
                const card = this.drawCard();
                this.dealerHand.push(card);
                this.countCard(card);
                this.updateUI();
                await new Promise(r => setTimeout(r, 600));
            }
        }

        this.resolveRound();
    }

    async resolveRound() {
        const pScore = this.calculateScore(this.playerHand);
        const dScore = this.calculateScore(this.dealerHand);
        let result = '';

        if (pScore > 21) {
            result = 'BUST!';
        } else if (dScore > 21) {
            result = 'DEALER BUSTS! YOU WIN';
            this.balance += this.currentBet * 2;
        } else if (pScore > dScore) {
            if (pScore === 21 && this.playerHand.length === 2) {
                result = 'BLACKJACK!';
                this.balance += Math.floor(this.currentBet * 2.5);
            } else {
                result = 'YOU WIN!';
                this.balance += this.currentBet * 2;
            }
        } else if (pScore < dScore) {
            result = 'DEALER WINS';
        } else {
            result = 'PUSH';
            this.balance += this.currentBet;
        }

        this.updateUI();

        // --- PHASE 1: Show Large Score Overlays ---
        this.playerScoreOverlay.innerText = pScore;
        this.dealerScoreOverlay.innerText = dScore;
        this.playerScoreOverlay.classList.toggle('bust', pScore > 21);
        this.dealerScoreOverlay.classList.toggle('bust', dScore > 21);
        this.playerScoreOverlay.classList.add('show');
        this.dealerScoreOverlay.classList.add('show');

        // Wait for player to see scores
        await new Promise(r => setTimeout(r, 800));

        // --- PHASE 2: Apply Hand Animations (Slide/Swipe) ---
        if (result.startsWith('YOU WIN') || result === 'BLACKJACK!' || result.includes('DEALER BUSTS')) {
            this.playerSection.classList.add('win-slide');
            this.dealerSection.classList.add('lose-swipe');
        } else if (result.startsWith('DEALER WINS') || result === 'BUST!') {
            this.dealerSection.classList.add('win-slide');
            this.playerSection.classList.add('lose-swipe');
        }

        // Wait for animations to complete/sink in
        await new Promise(r => setTimeout(r, 300));

        // --- PHASE 3: Show Result Modal ---
        this.statusMsg.innerText = result;
        this.statusOverlay.style.display = 'block';
    }

    reset() {
        this.playerHand = [];
        this.dealerHand = [];
        this.gameState = 'betting';
        this.statusOverlay.style.display = 'none';

        // Reset animations and overlays
        this.playerSection.classList.remove('win-slide', 'lose-swipe');
        this.dealerSection.classList.remove('win-slide', 'lose-swipe');
        this.playerScoreOverlay.classList.remove('show', 'bust');
        this.dealerScoreOverlay.classList.remove('show', 'bust');

        this.updateUI();
    }

    updateUI() {
        this.balanceEl.innerText = this.balance;
        this.renderHand(this.playerHandEl, this.playerHand, false);
        this.renderHand(this.dealerHandEl, this.dealerHand, this.gameState === 'playing');

        const showPlayerScore = this.showSumToggle && this.showSumToggle.checked || this.gameState === 'resolved';
        this.playerScoreEl.innerText = (this.playerHand.length && showPlayerScore) ? this.calculateScore(this.playerHand) : '';
        this.dealerScoreEl.innerText = (this.gameState === 'resolved' && this.dealerHand.length) ? this.calculateScore(this.dealerHand) : '';

        if (this.gameState === 'betting') {
            this.bettingControls.style.display = 'flex';
            this.gameControls.style.display = 'none';
        } else if (this.gameState === 'playing') {
            this.bettingControls.style.display = 'none';
            this.gameControls.style.display = 'flex';
            this.doubleBtn.disabled = this.playerHand.length > 2;
        } else {
            this.bettingControls.style.display = 'none';
            this.gameControls.style.display = 'none';
        }
    }

    renderHand(container, hand, hideFirst) {
        // Remove extra cards if hand size decreased (e.g. on reset)
        while (container.children.length > hand.length) {
            container.removeChild(container.lastChild);
        }

        hand.forEach((card, index) => {
            let cardEl = container.children[index];
            const isRed = ['♥', '♦'].includes(card.suit);
            const isFaceDown = hideFirst && index === 0;

            if (!cardEl) {
                cardEl = document.createElement('div');
                cardEl.classList.add('card-animate');
                cardEl.addEventListener('animationend', () => {
                    cardEl.classList.remove('card-animate');
                }, { once: true });

                cardEl.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front"></div>
                        <div class="card-back"></div>
                    </div>
                `;
                container.appendChild(cardEl);
            }

            // Update classes
            cardEl.className = `card ${isRed ? 'red' : ''} ${isFaceDown ? 'face-down' : ''} ${cardEl.classList.contains('card-animate') ? 'card-animate' : ''}`;

            // Only update content if face-up
            const frontEl = cardEl.querySelector('.card-front');
            if (frontEl.innerHTML === '') {
                frontEl.innerHTML = `
                    <span>${card.suit} ${card.value}</span>
                    <div class="suit">${card.suit}</div>
                    <span>${card.suit} ${card.value}</span>
                `;
            }
        });
    }
}
