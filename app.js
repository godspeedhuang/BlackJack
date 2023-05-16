// F24076182 黃軒柏 第四次作業 5/17
// F24076182 Huang SyuanBo The Fourth Homework 5/17

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
const splitButton = $("#split");
const doubleButton = $("#double");
const hitButton = $("#hit");
const standButton = $("#stand");
const startButton = $("#start");
const dealButton = $("#deal");
const surrenderButton = $("#surrender");


// 在全域定義畫面中的顯示畫面
const result = $("#result");
const dealerScore = $("#dealerScore");
const playerScore = $("#playerScore");
const bank = $("#bank");
const bet = $("#bet");
const instruction = $("#instruction");
const ad = $("#advertisement");
const timeDisplay = $("#gameTime");

// recordTable
let tableData;
const recordTable = $("#record");
recordTable.hide();

// result
result.hide();

// chips setting
const chip5 = $(".chip").eq(0);
const chip10 = $(".chip").eq(1);
const chip50 = $(".chip").eq(2);
const chip100 = $(".chip").eq(3);
chip5.hide();
chip10.hide();
chip50.hide();
chip100.hide();

// setting avdertisements
const adPath = [
        'assets\\advertisements\\001.png',
        'assets\\advertisements\\002.png',
        'assets\\advertisements\\003.png',
        'assets\\advertisements\\004.png',
    ];

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
        result.hide();

        // 牌組卡牌分數初始化
        this.newCard = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.playerScore = 0;
        this.dealerScore = 0;
        this.bet = 0;
        
        // 按鈕狀態初始化
        startButton.attr("disabled",true);
        splitButton.attr("disabled",true);
        doubleButton.attr("disabled",true);
        hitButton.attr("disabled",true);
        standButton.attr("disabled",true);
        surrenderButton.attr("disabled",true);

        // 遊戲數據初始化
        result.html('');
        dealerScore.html('');
        playerScore.html('');
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
        dealerScore.text(`SCORE : ${game.dealerScore}`);
        
        // 獲得最終結果
        let resultContent = game.renderResult();
        result.html(resultContent);

    }

    // 顯示莊家牌面
    renderDealerCards(hand,firstTime=false){
        const cardsElement = $('#dealerCards');
        cardsElement.text('');
        for(let i=0;i<hand.length;i++){
            const cardElement = $("<img>",{
                class:`card card${i+1}`,
                src:`assets\\cards\\card${hand[i]['suit']}${hand[i]['name']}.png`
            });
            cardsElement.append(cardElement);
        }
        if (firstTime){
            const secondCard = $('.card2').eq(0);
            secondCard.attr("src","assets\\cards\\cardBack_red5.png");
        }
    }

    // 顯示玩家牌面
    renderPlayerCards(hand){
        const cardsElement = $('#playerCards');
        cardsElement.text('');
        // 新增卡牌圖面
        for (let i=0; i<hand.length;i++){
            const cardElement = $('<img>',{
                class:'card',
                src:`assets\\cards\\card${hand[i]['suit']}${hand[i]['name']}.png`
            });
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
        recordTable.show().css({
            "display":"table",
            "width":"100%"
        });
        result.css("display","block");
        
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
        instruction.text("Click 'PLAY' to restart the game.");


        let playerhands = "";
        for (let i=0;i<this.playerHand.length;i++){
            playerhands += `${this.playerHand[i]['suit']} ${this.playerHand[i]['name']}, `;
        }
        let dealerhands = "";
        for (let i=0;i<this.dealerHand.length;i++){
            dealerhands += `${this.dealerHand[i]['suit']} ${this.dealerHand[i]['name']}, `;
        }
        
        // 將表格資料儲存成object
        const oneGameRecord = {
            'DEALER':dealer,
            'DEALER SCORE':this.dealerScore,
            'DEALER HAND':dealerhands,
            'PLAYER':player,
            'PLAYER SCORE':this.playerScore,
            'PLAYER HAND':playerhands,
            'BET':this.bet,
            'BANK BALANCE':this.bank,
        }

        updateTableData(oneGameRecord);

        // 如果銀行存款不足
        if (this.bank<=0){
            alert('Game over!');
            startButton.attr("disabled",true);
            surrenderButton.attr("disabled",true);
            return 'You go bankrupt. <br> Please Reload the Page (press F5) to Start a New Game.';
        } else {
            let row = $("<tr>");
            let cell1 = $("<td>").text(oneGameRecord['DEALER']);
            let cell2 = $("<td>").text(oneGameRecord['DEALER SCORE']);
            let cell3 = $("<td>").text(oneGameRecord['DEALER HAND']);
            let cell4 = $("<td>").text(oneGameRecord['PLAYER']);
            let cell5 = $("<td>").text(oneGameRecord['PLAYER SCORE']);
            let cell6 = $("<td>").text(oneGameRecord['PLAYER HAND']);
            let cell7 = $("<td>").text(oneGameRecord['BET']);
            let cell8 = $("<td>").text(oneGameRecord['BANK BALANCE']);
            
            row.append(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8);
            recordTable.append(row);

            return status;
        }
    }

}

// 創建遊戲
let game = new BlackJack();
dealButton.attr("disabled",true);
hitButton.attr("disabled",true);
standButton.attr("disabled",true);
splitButton.attr("disabled",true);
doubleButton.attr("disabled",true);
surrenderButton.attr("disabled",true);

// 玩家按下Play鍵
startButton.click(()=>{
    // 每一局一開始都先初始化
    game.initialize();
    game.renderDealerCards(game.dealerHand);
    game.renderPlayerCards(game.playerHand);
    bank.text(`BANK  $ ${game.bank}`);
    bet.text(`BET  $ ${game.bet}`);
    instruction.html("Click Chips' icon to set your BET. <br>Then Click 'DEAL' to deal the cards.");
    
    // 調整按鈕狀態
    startButton.attr("disabled",true);

    // 設定chips出現
    chip5.show().css("display","inline");
    chip10.show().css("display","inline");
    chip50.show().css("display","inline");
    chip100.show().css("display","inline");
})

// 玩家設定Bet
chip5.click(()=>{
    if (game.bank-game.bet>=5){
        game.bet +=5;
        bet.text(`BET  $ ${game.bet}`);
    } else{
        alert('exceeding your bank money');
    }
    dealButton.attr("disabled",false);
})
chip10.click(()=>{
    if (game.bank-game.bet>=10){
        game.bet +=10;
        bet.text(`BET  $ ${game.bet}`);
    } else{
        alert('exceeding your bank money');
    }
    dealButton.attr("disabled",false);
})
chip50.click(()=>{
    if (game.bank-game.bet>=50){
        game.bet +=50;
        bet.text(`BET  $ ${game.bet}`);
    } else{
        alert('exceeding your bank money');
    }
    dealButton.attr("disabled",false);
})
chip100.click(()=>{
    if (game.bank-game.bet>=100){
        game.bet +=100;
        bet.text(`BET  $ ${game.bet}`);
    } else{
        alert('exceeding your bank money');
    }
    dealButton.attr("disabled",false);
})

// 玩家按下deal鍵
dealButton.click(()=>{
    // 如果沒設置bet
    if (!game.bet){
        alert('You need to set the bet by pressing chips.');
        return;
    }
    
    // 更新銀行金額
    game.bank-=game.bet;
    bank.text(`BANK  $ ${game.bank}`);
    instruction.html('');
    // 洗牌後生成新的卡牌
    game.createDeck();
    // 發牌
    game.deal();
    // 插入卡牌圖片
    game.renderDealerCards(game.dealerHand,true);
    game.renderPlayerCards(game.playerHand);
    // 計算玩家分數
    game.playerScore = game.calculateScore(game.playerHand);
    playerScore.text(`SCORE : ${game.playerScore}`);
    
    // 調整按鈕狀態
    dealButton.attr("disabled",true);
    hitButton.attr("disabled",false);
    standButton.attr("disabled",false);
    doubleButton.attr("disabled",false);
    surrenderButton.attr("disabled",false);

    if(game.playerHand[0]['name']==game.playerHand[1]['name']){
        splitButton.attr("disabled",false);;
    }

    // 設定chips消失
    chip5.hide();
    chip10.hide();
    chip50.hide();
    chip100.hide();
})

// 玩家按下double鍵
doubleButton.click(()=>{    
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
        playerScore.text(`SCORE : ${game.playerScore}`);

        // double
        game.bet = game.bet*2;

        if (game.playerScore>21){
            // game.bank-=(game.bet/2);
            // bank.innerText = `Bank:${game.bank}`;
            result.html(game.renderResult());
            
        } else{
            game.dealerTurn();

            // 更新銀行及賭注
            // bank.innerText = `Bank:${game.bank}`;
            // bet.innerText = `Bet:0`;
        }
        
        // 更新頁面顯示
        bank.text(`BANK  $ ${game.bank}`);
        bet.text(`BET  $ ${game.bet}`);

        // 按鍵狀態
        doubleButton.attr("disabled",true);
        hitButton.attr("disabled",true);
        standButton.attr("disabled",true);
        startButton.attr("disabled",false);
        splitButton.attr("disabled",true);
        surrenderButton.attr("disabled",true);
    }

})


// 玩家按下hit鍵
hitButton.click(()=>{
    game.playerHand.push(game.drawCard());
    game.renderPlayerCards(game.playerHand);
    game.playerScore = game.calculateScore(game.playerHand);
    playerScore.text(`SCORE : ${game.playerScore}`);
    if (game.playerScore>21){
        result.html(game.renderResult());
        
        // 按鍵狀態
        doubleButton.attr("disabled",true);
        hitButton.attr("disabled",true);
        standButton.attr("disabled",true);
        startButton.attr("disabled",false);
        surrenderButton.attr("disabled",true);
        splitButton.attr("disabled",true);
    }
})

// 玩家按下stand鍵
standButton.click(()=>{
    game.dealerTurn();

    // 更新銀行及賭注
    bank.text(`BANK  $ ${game.bank}`);
    bet.text(`BET  $ 0`);

    // 設定按鈕狀態
    doubleButton.attr("disabled",true);
    hitButton.attr("disabled",true);
    standButton.attr("disabled",true);
    startButton.attr("disabled",false);
    splitButton.attr("disabled",true);
    surrenderButton.attr("disabled",true);
})

// 玩家按下surrender鍵
surrenderButton.click(()=>{
    result.html(game.renderResult(true));
    // game.initialize();

    // 設定按鈕狀態
    surrenderButton.attr("disabled",true);
    doubleButton.attr("disabled",true);
    hitButton.attr("disabled",true);
    standButton.attr("disabled",true);
    startButton.attr("disabled",false);
})

// 隨機顯示廣告
function adDisplay(){
    let randomIndex = Math.floor(Math.random()*adPath.length);
    let randomAd = adPath[randomIndex];
    let interval = 3000;

    let adElement = $('<img>',{
        src:randomAd,
        alt:"Floating Advertisement"
    });
    adElement.css({
        position:'fixed',
        right:'10px',
        top:'10px',
        width:'450px',
        textAlign:'center',
        zIndex:'999',
    })
    ad.append(adElement);

    function randomShowImage(){
        let randomIndex = Math.floor(Math.random()*adPath.length);
        let randomAd = adPath[randomIndex];
        adElement.attr('src',randomAd);
    };
    setInterval(randomShowImage,interval);
}

// 提醒user太久沒有操作
function remindUser(){
    let idleTime = 0;
    let idleInterval = 5000; // 每5秒檢查一次
    let maxIdleTime = 30000; // 30秒是閒置最大值
    
    // 重置計時器
    function resetTime(){
        idleTime=0;
    };

    // 監聽user行為
    $(document).on('mousemove keydown',()=>{
        resetTime();
    });

    setInterval(()=>{
        idleTime += idleInterval;
        if (idleTime>maxIdleTime){
            alert("You have idled for a while, please press the button.");
            resetTime();
        }
    }, idleInterval);
}

// sort table
const getCellValue = (tr,idx) => tr.children[idx].innerText || tr.children[idx].textContent;
const comparer = function(idx,asc){
    return function(a,b){
        return function(v1,v2){
            return (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v1))
                ? v1-v2
                : v1.toString().localeCompare(v2);
        }(getCellValue(asc ? a:b, idx), getCellValue(asc?b:a,idx));
    }
};

// 計算遊戲時間並儲存進sessionStorage
let gameTime;
function startGameTime(){
    if (sessionStorage.getItem('gameTime')){
        gameTime = sessionStorage.getItem('gameTime');
    } else {
        gameTime=0;
    }
    let timer;
    timer = setInterval(updateGameTime,1000);
    // sessionStorage.setItem('gameTime',gameTime);
}
function updateGameTime(){
    gameTime++; // 遊戲時間增加1秒
    sessionStorage.setItem('gameTime',gameTime);
    displayGameTime(); // 更新顯示
}
function displayGameTime(){
    const minutes = Math.floor(gameTime/60);
    const seconds = gameTime % 60;
    timeDisplay.html(`Play time <br>${minutes} min ${seconds} sec`);
}

// 遊戲record資訊存進localStroage
function importTableData(){
    const localData = localStorage.getItem('tableData');
    if (localData){
        tableData = JSON.parse(localData);
        // render table content
        tableData.forEach((oneGameRecord)=>{
            let row = $("<tr>");
            let cell1 = $("<td>").text(oneGameRecord['DEALER']);
            let cell2 = $("<td>").text(oneGameRecord['DEALER SCORE']);
            let cell3 = $("<td>").text(oneGameRecord['DEALER HAND']);
            let cell4 = $("<td>").text(oneGameRecord['PLAYER']);
            let cell5 = $("<td>").text(oneGameRecord['PLAYER SCORE']);
            let cell6 = $("<td>").text(oneGameRecord['PLAYER HAND']);
            let cell7 = $("<td>").text(oneGameRecord['BET']);
            let cell8 = $("<td>").text(oneGameRecord['BANK BALANCE']);
            
            row.append(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8);
            recordTable.append(row);
        })
        recordTable.show().css({
            "display":"table",
            "width":"100%"
        });
    }
}

// 更新record資訊
function updateTableData(oneGameRecord){
    tableData.push(oneGameRecord);
    localStorage.setItem('tableData',JSON.stringify(tableData));
}

// DOM載入後就執行
$(document).ready(function(){
    // 從sessionStorage中載入遊戲時間
    startGameTime();
    // 從localStorage中載入遊戲紀錄
    importTableData();
    // 隨機撥放廣告
    adDisplay();
    // 遊戲閒置提示
    remindUser();
    // 表格排序
    document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
        const table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr) );
    })));
});


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