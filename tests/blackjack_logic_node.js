class BlackjackGame {
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
}

module.exports = { BlackjackGame };
