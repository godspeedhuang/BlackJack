// 定義基本牌組
const deck = [
	{ suit:'', name: 'A', value: 11 },
	{ suit:'', name: '2', value: 2 },
	{ suit:'', name: '3', value: 3 },
	{ suit:'', name: '4', value: 4 },
	{ suit:'', name: '5', value: 5 },
	{ suit:'', name: '6', value: 6 },
	{ suit:'', name: '7', value: 7 },
	{ suit:'', name: '8', value: 8 },
	{ suit:'', name: '9', value: 9 },
	{ suit:'', name: '10', value: 10 },
	{ suit:'', name: 'J', value: 10 },
	{ suit:'', name: 'Q', value: 10 },
	{ suit:'', name: 'K', value: 10 }
];

const suits = ['Spades','Hearts','Diamonds','Clubs'];

// 在全域定義畫面中的按鈕
const splitButton = document.getElementById('split');
const doubleButton = document.getElementById('double');
const hitButton = document.getElementById('hit');
const standButton = document.getElementById('stand');
const startButton = document.getElementById('start');
const dealButton = document.getElementById('deal');
const surrenderButton = document.getElementById('surrender');


// 在全域定義畫面中的顯示畫面
const result = document.getElementById('result');
const dealerScore = document.getElementById('dealerScore');
const playerScore = document.getElementById('playerScore');
const bank = document.getElementById('bank');
const bet = document.getElementById('bet');
const instruction = document.getElementById('instruction');

// recordTable
const recordTable = document.getElementById('record');
recordTable.style.display = 'none';

// result
result.style.display = 'none';

// chips setting
const chip5 = document.getElementsByClassName('chip')[0];
const chip10 = document.getElementsByClassName('chip')[1];
const chip50 = document.getElementsByClassName('chip')[2];
const chip100 = document.getElementsByClassName('chip')[3];
chip5.style.display = 'none';
chip10.style.display = 'none';
chip50.style.display = 'none';
chip100.style.display = 'none';


class BlackJack{
    constructor(){
        this.newCard = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.playerScore = 0;
        this.dealerScore = 0;
        this.bank = 1000;
        this.bet = 0;
    }

    // 初始化
    initialize(){
        // result消失
        result.style.display = 'none';

        // 牌組卡牌分數初始化
        this.newCard = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.playerScore = 0;
        this.dealerScore = 0;
        this.bet = 0;
        
        // 按鈕狀態初始化
        startButton.disabled = false;
        splitButton.disabled = true;
        doubleButton.disabled = true;
        hitButton.disabled = true;
        standButton.disabled = true;
        surrenderButton.disabled = true;

        // 遊戲數據初始化
        result.innerHTML = '';
        dealerScore.innerHTML = '';
        playerScore.innerHTML = '';
    }

    // 生成一個新的牌組
    createDeck() {

        this.newCard = [];
        // 將花色(suit)加入array中的object裡
        for (let suit of suits){
            // 實現deck array的deep copy
            let deckCopy = JSON.parse(JSON.stringify(deck));
            for (let index of deckCopy){
                index.suit = suit;   
            }
            this.newCard = this.newCard.concat(deckCopy);
        }
        this.shuffleDeck();
    }

    // 洗牌
    shuffleDeck(){
        // Fisher-Yates shuffle algorithm
        for (let i = this.newCard.length-1; i>0;i--){
            const j = Math.floor(Math.random()*(i+1));
            [this.newCard[i],this.newCard[j]] = [this.newCard[j],this.newCard[i]];
        }
    }

    // 抽牌
    drawCard(){
        return this.newCard.pop();
    }

    // 發牌
    deal(){
        this.playerHand = [this.drawCard(), this.drawCard()];
	    this.dealerHand = [this.drawCard(), this.drawCard()];
    }

    // 計算分數
    calculateScore(hand){
        let score = 0;
        let aceCount = 0;
        for(let i=0;i<hand.length;i++){
            if (hand[i].value===11){
                aceCount++;
            } 
            score+=hand[i].value;
        }
        if(score>21 && aceCount>0){
            score-=10;
            aceCount--;
        }
        return score;
    }

    // 玩家回合
    // playerTurn(){
    //     hitButton.disabled = false;
    //     standButton.disabled = false;
    //     splitButton.disabled = true;
    //     doubleButton.disabled = true;
        
        // hit 
        // hitButton.addEventListener('click', ()=>{
        //     this.playerHand.push(this.newCard.pop());
        //     this.renderPlayerCards(this.playerHand);
        //     this.playerScore = this.calculateScore(this.playerHand);
        //     if (this.playerScore>21){
        //         hitButton.disabled = true;
        //         standButton.disabled = true;
        //         this.renderResult();
        //     }
        // });

        // stand
        // standButton.addEventListener('click',()=>{
        //     hitButton.disabled = true;
        //     standButton.disabled = true;
        //     this.dealerTurn();
        // })
    // }

    // 莊家回合
    dealerTurn(){
        this.renderDealerCards(this.dealerHand);
        let handValue = this.calculateScore(this.dealerHand);
        // 莊家小於17 抽牌
        while(handValue<17){
            this.dealerHand.push(this.drawCard());
            this.renderDealerCards(this.dealerHand);
            handValue = this.calculateScore(this.dealerHand);
        }
        this.dealerScore = handValue;

        // 顯示dealer分數
        game.dealerScore = game.calculateScore(game.dealerHand);
        dealerScore.innerText = `SCORE : ${game.dealerScore}`;
        
        // 獲得最終結果
        let resultContent = game.renderResult();
        result.innerHTML = resultContent;

    }

    // 顯示莊家牌面
    renderDealerCards(hand,firstTime=false){
        const cardsElement = document.getElementById('dealerCards');
        cardsElement.innerText = '';
        for(let i=0;i<hand.length;i++){
            const cardElement = document.createElement('img');
            cardElement.className = `card card${i+1}`;
            cardElement.src = `assets\\cards\\card${hand[i]['suit']}${hand[i]['name']}.png`;
            cardsElement.append(cardElement);
        }
        if (firstTime){
            const secondCard = document.getElementsByClassName('card2')[0];
            secondCard.src = "assets\\cards\\cardBack_red5.png";
        }
    }

    // 顯示玩家牌面
    renderPlayerCards(hand){
        const cardsElement = document.getElementById('playerCards');
        cardsElement.innerText = '';
        // 新增卡牌圖面
        for (let i=0; i<hand.length;i++){
            const cardElement = document.createElement('img');
            cardElement.className = 'card';
            cardElement.src = `assets\\cards\\card${hand[i]['suit']}${hand[i]['name']}.png`;
            cardsElement.append(cardElement);
        }
    }

    // 顯示分數
    // renderScore(hand){
    //     const scoreElement = document.getElementById('score');
    //     const score = this.calculateScore(hand);
    //     scoreElement.innerText = `score:${score}`;
    // }

    // 回傳結果
    renderResult(surrender=false){
        // const resultContent = document.createElement('h2');
        // resultContent.innerText = '';
        recordTable.style.display = 'table';
        recordTable.style.width = '100%';
        
        result.style.display = 'block';
        
        let status = '';
        let dealer = '';
        let player = '';
        let bankStatus = '';
        
        if(surrender){
            this.bank+= (this.bet*0.5);
            player = 'Surrender';
            dealer = 'Win';
            status = 'You Surrender! Dealer wins!';
        }else if (this.playerScore > 21){
            status =  'You busted! Dealer wins!';
            player = 'Lose';
            dealer = 'Win';
        }else if (this.dealerScore > 21){
            this.bank+=this.bet*2;
            status = 'Dealer busted! You win!';
            player = 'Win';
            dealer = 'Lose';
        } else if (this.dealerScore > this.playerScore){
            status = 'Dealer wins!';
            player = 'Lose';
            dealer = 'Win';
        } else if (this.dealerScore < this.playerScore){
            this.bank+=this.bet*2;
            status = 'You win!';
            player = 'Win';
            dealer = 'Lose';
        } else {
            this.bank+=this.bet;
            status = 'Tie game';
            player = 'Tie';
            dealer = 'Tie';
        }

        // 更新instruction
        instruction.innerText = "Click 'PLAY' to restart the game."


        let playerhands = "";
        for (let i=0;i<this.playerHand.length;i++){
            playerhands += `${this.playerHand[i]['suit']} ${this.playerHand[i]['name']}, `;
        }
        let dealerhands = "";
        for (let i=0;i<this.dealerHand.length;i++){
            dealerhands += `${this.dealerHand[i]['suit']} ${this.dealerHand[i]['name']}, `;
        }

        // 如果銀行存款不足
        if (this.bank<=0){
            alert('Game over!');
            startButton.disabled = true;
            surrenderButton.disabled = true;
            return 'You go bankrupt. <br> Please Reload the Page (press F5) to Start a New Game.';
        } else {
            let row = recordTable.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            let cell5 = row.insertCell(4);
            let cell6 = row.insertCell(5);
            let cell7 = row.insertCell(6);
            let cell8 = row.insertCell(7);
            
            cell1.innerText = dealer;
            cell2.innerText = this.dealerScore;
            cell3.innerText = dealerhands;
            cell4.innerText = player;
            cell5.innerText = this.playerScore;
            cell6.innerText = playerhands;
            cell7.innerText = `$ ${this.bet}`;
            cell8.innerText = `$ ${this.bank}`;

            return status;
        }
    }

}

// 創建遊戲
let game = new BlackJack();
dealButton.disabled = true;
hitButton.disabled = true;
standButton.disabled = true;
splitButton.disabled = true;
doubleButton.disabled = true;
surrenderButton.disabled = true;

// 玩家按下Play鍵
startButton.addEventListener('click',()=>{
    // 每一局一開始都先初始化
    game.initialize();
    game.renderDealerCards(game.dealerHand);
    game.renderPlayerCards(game.playerHand);
    bank.innerText = `BANK  $ ${game.bank}`;
    bet.innerText = `BET  $ ${game.bet}`;
    instruction.innerHTML = "Click Chips' icon to set your BET. <br>Then Click 'DEAL' to deal the cards."
    
    // 調整按鈕狀態
    startButton.disabled = true;

    // 設定chips出現
    chip5.style.display = 'inline';
    chip10.style.display = 'inline';
    chip50.style.display = 'inline';
    chip100.style.display = 'inline';
})

// 玩家設定Bet
chip5.addEventListener('click',()=>{
    if (game.bank-game.bet>=5){
        game.bet +=5;
        bet.innerText = `BET  $ ${game.bet}`;
    } else{
        alert('exceeding your bank money');
    }
    dealButton.disabled = false;
})
chip10.addEventListener('click',()=>{
    if (game.bank-game.bet>=10){
        game.bet +=10;
        bet.innerText = `BET  $ ${game.bet}`;
    } else{
        alert('exceeding your bank money');
    }
    dealButton.disabled = false;
})
chip50.addEventListener('click',()=>{
    if (game.bank-game.bet>=50){
        game.bet +=50;
        bet.innerText = `BET  $ ${game.bet}`;
    } else{
        alert('exceeding your bank money');
    }
    dealButton.disabled = false;
})
chip100.addEventListener('click',()=>{
    if (game.bank-game.bet>=100){
        game.bet +=100;
        bet.innerText = `BET  $ ${game.bet}`;
    } else{
        alert('exceeding your bank money');
    }
    dealButton.disabled = false;
})

// 玩家按下deal鍵
dealButton.addEventListener('click',()=>{
    // 如果沒設置bet
    if (!game.bet){
        alert('You need to set the bet by pressing chips.');
        return;
    }
    
    // 更新銀行金額
    game.bank-=game.bet;
    bank.innerText = `BANK  $ ${game.bank}`;
    instruction.innerHTML = '';
    // 洗牌後生成新的卡牌
    game.createDeck();
    // 發牌
    game.deal();
    // 插入卡牌圖片
    game.renderDealerCards(game.dealerHand,true);
    game.renderPlayerCards(game.playerHand);
    // 計算玩家分數
    game.playerScore = game.calculateScore(game.playerHand);
    playerScore.innerText = `SCORE : ${game.playerScore}`;
    
    // 調整按鈕狀態
    dealButton.disabled = true;
    hitButton.disabled = false;
    standButton.disabled = false;
    doubleButton.disabled = false;
    surrenderButton.disabled = false;

    if(game.playerHand[0]['name']==game.playerHand[1]['name']){
        splitButton.disabled = false;
    }

    // 設定chips消失
    chip5.style.display = 'none';
    chip10.style.display = 'none';
    chip50.style.display = 'none';
    chip100.style.display = 'none';
})

// 玩家按下double鍵
doubleButton.addEventListener('click',()=>{    
    // double
    game.bank-=game.bet;
    // 判斷double完錢夠不夠
    if (game.bank<0){
        game.bank+=game.bet;
        alert("Insufficient balance. You can't double your bet.");
        return;
    } else{
        game.playerHand.push(game.drawCard());
        game.renderPlayerCards(game.playerHand);
        game.playerScore = game.calculateScore(game.playerHand);
        playerScore.innerText = `SCORE : ${game.playerScore}`;

        // double
        game.bet = game.bet*2;

        if (game.playerScore>21){
            // game.bank-=(game.bet/2);
            // bank.innerText = `Bank:${game.bank}`;
            result.innerHTML = game.renderResult();
            
        } else{
            game.dealerTurn();

            // 更新銀行及賭注
            // bank.innerText = `Bank:${game.bank}`;
            // bet.innerText = `Bet:0`;
        }
        
        // 更新頁面顯示
        bank.innerText = `BANK  $ ${game.bank}`;
        bet.innerText = `BET  $ ${game.bet}`;

        // 按鍵狀態
        doubleButton.disabled = true;
        hitButton.disabled = true;
        standButton.disabled=true;
        startButton.disabled = false;
        splitButton.disabled = true;
        surrenderButton.disabled = true;
    }

})


// 玩家按下hit鍵
hitButton.addEventListener('click',()=>{
    game.playerHand.push(game.drawCard());
    game.renderPlayerCards(game.playerHand);
    game.playerScore = game.calculateScore(game.playerHand);
    playerScore.innerText = `SCORE : ${game.playerScore}`;
    if (game.playerScore>21){
        result.innerHTML = game.renderResult();
        
        // 按鍵狀態
        doubleButton.disabled = true;
        hitButton.disabled = true;
        standButton.disabled=true;
        startButton.disabled = false;
        surrenderButton.disabled = true;
        splitButton.disabled = true;
    }
})

// 玩家按下stand鍵
standButton.addEventListener('click',()=>{
    game.dealerTurn();

    // 更新銀行及賭注
    bank.innerText = `BANK  $ ${game.bank}`;
    bet.innerText = `BET  $ 0`;

    // 設定按鈕狀態
    doubleButton.disabled = true;
    hitButton.disabled = true;
    standButton.disabled = true;
    startButton.disabled = false;
    splitButton.disabled = true;
    surrender.disabled = true;
})

// 玩家按下surrender鍵
surrenderButton.addEventListener('click',()=>{
    result.innerHTML = game.renderResult(true);
    // game.initialize();

    // 設定按鈕狀態
    surrenderButton.disabled = true;
    doubleButton.disabled = true;
    hitButton.disabled = true;
    standButton.disabled = true;
    startButton.disabled = false;
})


// 遊戲開始
// startGame(){
//     this.initialize();
//     startButton.addEventListener('click',()=>{
//         this.initialize();
//         this.deal();
//         this.renderDealerCards(this.dealerHand,true);
//         this.renderPlayerCards(this.playerHand);
//         this.playerTurn();
//         startButton.disabled = true;
//     })
// }

// 發牌
// function deal() {
// 	const deck = getNewDeck();
// 	playerHand = [deck.pop(), deck.pop()];
// 	dealerHand = [deck.pop(), deck.pop()];
// }

// 計算分數
// function calculateScore(hand) {
// 	let score = 0;
// 	let aces = 0;
// 	for (let i = 0; i < hand.length; i++) {
// 		score += hand[i].value;
// 		if (hand[i].name === 'Ace') {
// 			aces++;
// 		}
// 	}
// 	while (aces > 0 && score > 21) {
// 		score -= 10;
// 		aces--;
// 	}
// 	return score;
// }

// 顯示牌面和分數
// function render() {
// 	const cardsElement = document.getElementById('cards');
// 	cardsElement.innerHTML = '';
// 	// 新增卡牌圖面
//     for (let i = 0; i < playerHand.length; i++) {
// 		const cardElement = document.createElement('img');
// 		cardElement.className = 'card';
// 		cardElement.src = `assets\\cards\\card${playerHand[i]['suit']}${playerHand[i]['name']}.png`
// 		cardsElement.appendChild(cardElement);
// 	}
// 	const scoreElement = document.getElementById('score');
// 	// 計算分數
//     playerScore = calculateScore(playerHand);
// 	scoreElement.innerText = `Score: ${playerScore}`;
// }

// 玩家
// function playerTurn() {
// 	const hitButton = document.getElementById('hit');
// 	const standButton = document.getElementById('stand');
// 	hitButton.disabled = false;
// 	standButton.disabled = false;
// 	hitButton.addEventListener('click', () => {
// 		const deck = getNewDeck();
// 		playerHand.push(deck.pop());
// 		render();
// 		playerScore = calculateScore(playerHand);
// 		if (playerScore > 21) {
// 			hitButton.disabled = true;
// 			standButton.disabled = true;
// 			alert('You busted!');
// 		}
// 	});
// 	standButton.addEventListener('click', () => {
// 		hitButton.disabled = true;
// 		standButton.disabled = true;
// 		dealerTurn();
// 	});
// }

// 莊家回合
// function dealerTurn() {
// 	while (calculateScore(dealerHand) < 17) {
// 		const deck = getNewDeck();
// 		dealerHand.push(deck.pop());
// 	}
// 	dealerScore = calculateScore(dealerHand);
// 	render();
// 	if (dealerScore > 21) {
// 		alert('Dealer busted! You win!');
// 	} else if (dealerScore > playerScore) {
// 		alert('Dealer wins!');
// 	} else if (dealerScore < playerScore) {
// 		alert('You win!');
// 	} else {
// 		alert('It\'s a tie!');
// 	}
// }

// // 遊戲開始
// function startGame() {
//     playerHand = [];
//     dealerHand = [];
//     playerScore = 0;
//     dealerScore = 0;
// 	const startButton = document.getElementById('start');
// 	startButton.addEventListener('click', () => {
// 		deal();
// 		render();
// 		playerTurn();
//         startButton.innerText = 'Restart';
// 		// startButton.disabled = true;
// 	});
// }

// startGame();