// 勝敗の記録を保存する変数
let moves = [];
let history = [];
let win = 0;
let lose = 0;
let draw = 0;
let games = 0; // 試合回数
let hundredGameStats = []; // 100試合ごとの記録を保存

// ランダムにコンピュータの手を選ぶ関数
function randomMove() {
    const moves = ["グー", "チョキ", "パー"];
    return moves[Math.floor(Math.random() * moves.length)];
}

// コンピュータの手を決定するロジック
function decideComputerMove(moves, order = 5) {
    if (moves.length < order) {
        return randomMove();
    }

    const predictedMove = predictNextMove(moves, order);
    const counterMoves = { "グー": "パー", "チョキ": "グー", "パー": "チョキ" };
    return counterMoves[predictedMove] || randomMove();
}

// マルコフ連鎖で次の手を予測
function predictNextMove(moves, order) {
    const state = moves.slice(-order).join(",");
    const transitionMatrix = buildTransitionMatrix(moves, order);

    if (transitionMatrix[state]) {
        const nextMoves = transitionMatrix[state];
        let maxMove = null;
        let maxCount = -1;

        for (const move in nextMoves) {
            if (nextMoves[move] > maxCount) {
                maxMove = move;
                maxCount = nextMoves[move];
            }
        }

        return maxMove;
    } else {
        return randomMove(); // データが不足している場合はランダム
    }
}

// 遷移行列を構築
function buildTransitionMatrix(moves, order) {
    const transitionMatrix = {};

    for (let i = 0; i < moves.length - order; i++) {
        const state = moves.slice(i, i + order).join(",");
        const nextMove = moves[i + order];

        if (!transitionMatrix[state]) {
            transitionMatrix[state] = { "グー": 0, "チョキ": 0, "パー": 0 };
        }

        transitionMatrix[state][nextMove]++;
    }

    return transitionMatrix;
}

// 勝敗の判定
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

// 履歴の更新
function updateMoveHistory(playerMove, computerMove) {
    const historyList = document.getElementById("history-list");
    const entry = document.createElement("div");
    entry.textContent = `プレイヤー: ${playerMove}, コンピュータ: ${computerMove}`;
    historyList.appendChild(entry);

    // 履歴が多すぎたら古いものを削除
    if (historyList.childNodes.length > 20) {
        historyList.removeChild(historyList.firstChild);
    }
}

// スコアの記録を保存
function saveStatsEvery100Games() {
    if (games % 100 === 0) {
        hundredGameStats.push({
            gameNumber: games,
            win,
            lose,
            draw,
        });
        console.log(`100試合ごとの統計:`, hundredGameStats);
    }
}

// ゲームの進行
function playGame(playerMove) {
    const computerMove = decideComputerMove(moves);
    const result = judge(playerMove, computerMove);

    updateMoveHistory(playerMove, computerMove);

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

    saveStatsEvery100Games();

    // スコアの表示更新
    document.getElementById("player-move").textContent = playerMove;
    document.getElementById("computer-move").textContent = computerMove;
    document.getElementById("result").textContent = result;
    document.getElementById("win-count").textContent = win;
    document.getElementById("lose-count").textContent = lose;
    document.getElementById("draw-count").textContent = draw;
    document.getElementById("games-count").textContent = games;
}

// ゲームのリセット
function resetGame() {
    moves = [];
    history = [];
    win = 0;
    lose = 0;
    draw = 0;
    games = 0;

    document.getElementById("player-move").textContent = "";
    document.getElementById("computer-move").textContent = "";
    document.getElementById("result").textContent = "";
    document.getElementById("win-count").textContent = win;
    document.getElementById("lose-count").textContent = lose;
    document.getElementById("draw-count").textContent = draw;
    document.getElementById("games-count").textContent = games;

    document.getElementById("history-list").innerHTML = "";
}

// イベントリスナーの登録
document.getElementById("rock").addEventListener("click", () => playGame("グー"));
document.getElementById("scissors").addEventListener("click", () => playGame("チョキ"));
document.getElementById("paper").addEventListener("click", () => playGame("パー"));
document.getElementById("reset").addEventListener("click", resetGame);
