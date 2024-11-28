// 勝敗の記録を保存する変数
let moves = [];
let history = [];
let win = 0;
let lose = 0;
let draw = 0;
let games = 0; // 試合回数
let scoreHistory = [];

// コンピュータの手をランダムに選ぶ関数
function randomMove() {
    const moves = ["グー", "チョキ", "パー"];
    return moves[Math.floor(Math.random() * moves.length)];
}

// マルコフ連鎖と頻度分析を利用したコンピュータの手を決める関数
function decideComputerMove(moves, order = 5) {
    if (moves.length < order) {
        return randomMove();
    }
    const counterMoves = { "グー": "パー", "チョキ": "グー", "パー": "チョキ" };
    return counterMoves[randomMove()];
}

// 勝敗を判定する関数
function judge(player, computer) {
    if (player === computer) {
        return "draw";
    } else if (
        (player === "グー" && computer === "チョキ") ||
        (player === "チョキ" && computer === "パー") ||
        (player === "パー" && computer === "グー")
    ) {
        return "win";
    } else {
        return "lose";
    }
}

// ゲームをプレイする関数
function playGame(playerMove) {
    const computerMove = decideComputerMove(moves);
    const result = judge(playerMove, computerMove);

    moves.push(playerMove);
    history.push(result);
    games++;

    if (result === "win") {
        win++;
    } else if (result === "lose") {
        lose++;
    } else {
        draw++;
    }

    // スコアを100回ごとに記録
    if (games % 100 === 0) {
        scoreHistory.push({ games, win, lose, draw });
        updateScoreHistory();
    }

    document.getElementById("player-move").textContent = playerMove;
    document.getElementById("computer-move").textContent = computerMove;
    document.getElementById("result").textContent = result;
    document.getElementById("win-count").textContent = win;
    document.getElementById("lose-count").textContent = lose;
    document.getElementById("draw-count").textContent = draw;
    document.getElementById("games-count").textContent = games;
}

// スコア履歴を更新する関数
function updateScoreHistory() {
    const scoreList = document.getElementById("score-history");
    scoreList.innerHTML = "";
    scoreHistory.forEach(score => {
        const li = document.createElement("li");
        li.textContent = `試合数: ${score.games}, 勝ち: ${score.win}, 負け: ${score.lose}, 引き分け: ${score.draw}`;
        scoreList.appendChild(li);
    });
}

// ゲームをリセットする関数
function resetGame() {
    moves = [];
    history = [];
    win = 0;
    lose = 0;
    draw = 0;
    games = 0;
    scoreHistory = [];

    document.getElementById("player-move").textContent = "";
    document.getElementById("computer-move").textContent = "";
    document.getElementById("result").textContent = "";
    document.getElementById("win-count").textContent = win;
    document.getElementById("lose-count").textContent = lose;
    document.getElementById("draw-count").textContent = draw;
    document.getElementById("games-count").textContent = games;
    document.getElementById("score-history").innerHTML = "";
}

// イベントリスナーを設定
document.getElementById("rock").addEventListener("click", () => playGame("グー"));
document.getElementById("scissors").addEventListener("click", () => playGame("チョキ"));
document.getElementById("paper").addEventListener("click", () => playGame("パー"));
document.getElementById("reset").addEventListener("click", resetGame);
