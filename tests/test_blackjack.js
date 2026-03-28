const { BlackjackGame } = require('./blackjack_logic_node.js');

const game = new BlackjackGame();

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
    } catch (e) {
        console.error(`❌ ${name}: ${e.message}`);
    }
}

test('Card Values', () => {
    if (game.getCardValue({value: 'A'}) !== 11) throw new Error('Ace should be 11');
    if (game.getCardValue({value: 'K'}) !== 10) throw new Error('King should be 10');
    if (game.getCardValue({value: '5'}) !== 5) throw new Error('5 should be 5');
});

test('Hand Calculation - Basic', () => {
    const hand = [{value: '10'}, {value: '7'}];
    if (game.calculateScore(hand) !== 17) throw new Error('Should be 17');
});

test('Hand Calculation - Soft Ace', () => {
    const hand = [{value: 'A'}, {value: '6'}];
    if (game.calculateScore(hand) !== 17) throw new Error('Should be 17 (Soft)');
});

test('Hand Calculation - Hard Ace', () => {
    const hand = [{value: 'A'}, {value: '10'}, {value: '5'}];
    if (game.calculateScore(hand) !== 16) throw new Error('Should be 16 (Hard)');
});

test('Hand Calculation - Double Ace', () => {
    const hand = [{value: 'A'}, {value: 'A'}, {value: '9'}];
    if (game.calculateScore(hand) !== 21) throw new Error('Should be 21');
});
