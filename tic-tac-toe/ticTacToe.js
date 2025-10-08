let currentPlayer = "";
let arr = Array(9).fill(null);

let grid = document.getElementById("grid")
let gridContainer = document.getElementById("gridContainer")
let startGame = document.getElementById("start")
let playAgain = document.getElementById("playAgain")
let cancel = document.getElementById("cancel")
let winnerContainer = document.getElementById("winner_container")
let drawContainer = document.getElementById("matchDraw_container")
let line = document.getElementById("line")

let redMoveAudio = new Audio("./audio/redMove.mp3")
let blueMoveAudio = new Audio("./audio/blueMove.mp3")
let lineAudio = new Audio("./audio/line.mp3")
let vidtoryAudio = new Audio("./audio/victory.mp3");

function selectPlayer() {
    const options = ["Player One", "Player Two"]
    const randerPlayer = Math.floor(Math.random() * 2)
    return options[randerPlayer]
}

function handleStartGame() {
    window.location.href="./ticTacToe.html"
    selectPlayer()
}

function updateBackground() {
    grid.classList.remove("red", "blue");
    if(currentPlayer === "X") {
        grid.classList.add("red")
    } else {
        grid.classList.add("blue")
    }
}

const initializeGame = () => {
    const selectedPlayer = selectPlayer();
    if(selectedPlayer === "Player One") {
        currentPlayer = "X"

    } else {
        currentPlayer = "O"
    }
    updateBackground()
}

initializeGame();

function showWinningLine() {
    // Check horizontal lines
    if(arr[0] !== null && arr[0] == arr[1] && arr[1] == arr[2]) {
        line.classList.add("show");
        document.getElementById("line1").classList.add("show");
        return;
    }
    if(arr[3] !== null && arr[3] == arr[4] && arr[4] == arr[5]) {
        line.classList.add("show");
        document.getElementById("line2").classList.add("show");
        return;
    }
    if(arr[6] !== null && arr[6] == arr[7] && arr[7] == arr[8]) {
        line.classList.add("show");
        document.getElementById("line3").classList.add("show");
        return;
    }
    
    // Check vertical lines
    if(arr[0] !== null && arr[0] == arr[3] && arr[3] == arr[6]) {
        line.classList.add("show");
        document.getElementById("line4").classList.add("show");
        return;
    }
    if(arr[1] !== null && arr[1] == arr[4] && arr[4] == arr[7]) {
        line.classList.add("show");
        document.getElementById("line5").classList.add("show");
        return;
    }
    if(arr[2] !== null && arr[2] == arr[5] && arr[5] == arr[8]) {
        line.classList.add("show");
        document.getElementById("line6").classList.add("show");
        return;
    }
    
    // Check diagonal lines
    if(arr[0] !== null && arr[0] == arr[4] && arr[4] == arr[8]) {
        line.classList.add("show");
        document.getElementById("line7").classList.add("show");
        return;
    }
    if(arr[2] !== null && arr[2] == arr[4] && arr[4] == arr[6]) {
        line.classList.add("show");
        document.getElementById("line8").classList.add("show");
        return;
    }
}

function checkWinner() {
    if( 
        (arr[0] !== null && arr[0] == arr[1] && arr[1] == arr[2]) ||
        (arr[3] !== null && arr[3] == arr[4] && arr[4] == arr[5]) ||
        (arr[6] !== null && arr[6] == arr[7] && arr[7] == arr[8]) ||
        (arr[0] !== null && arr[0] == arr[3] && arr[3] == arr[6]) ||
        (arr[1] !== null && arr[1] == arr[4] && arr[4] == arr[7]) ||
        (arr[2] !== null && arr[2] == arr[5] && arr[5] == arr[8]) ||
        (arr[0] !== null && arr[0] == arr[4] && arr[4] == arr[8]) ||
        (arr[2] !== null && arr[2] == arr[4] && arr[4] == arr[6])
    ) {
        const winner = currentPlayer;

        showWinningLine();
        lineAudio.play();
        
        setTimeout(() => {
            line.classList.remove("show");
            document.getElementById("line1").classList.remove("show");
            document.getElementById("line2").classList.remove("show");
            document.getElementById("line3").classList.remove("show");
            document.getElementById("line4").classList.remove("show");
            document.getElementById("line5").classList.remove("show");
            document.getElementById("line6").classList.remove("show");
            document.getElementById("line7").classList.remove("show");
            document.getElementById("line8").classList.remove("show");
            
            grid.classList.add("hide");

            if(winner === "X") {
                document.getElementById("winner").innerText = "Player One Wins!";
                winnerContainer.classList.remove("blue");
                winnerContainer.classList.add("redGradient");
            } else {
                document.getElementById("winner").innerText = "Player Two Wins!";
                winnerContainer.classList.remove("red");
                winnerContainer.classList.add("blueGradient");
            }
            setTimeout(() => {
                window.location.href = "./start.html"
            }, 1500);
            vidtoryAudio.play(); 
        }, 1000);
        return;
    }

    if(!arr.some(e => e === null)) {
        setTimeout(() => {
            grid.classList.add("hide");
            drawContainer.classList.add("show");
            document.getElementById("matchDraw").innerText = "Match Draw!";
            drawContainer.classList.add("darkGradient");

            setTimeout(() => {
                window.location.href = "./start.html"
            }, 1000);
        }, 1000);
        return;
    }
}

function handleClick(el) {
    const id = Number(el.id);
    if(arr[id] !== null) {
        return
    }
    arr[id] = currentPlayer;
    el.innerText = currentPlayer;
    checkWinner();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if(currentPlayer === "X") {
        redMoveAudio.play();
    } else {
        blueMoveAudio.play()
    }
    updateBackground()
}