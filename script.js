let score = 0;
let cross = true;
let gameOverFlag = false;
let isPaused = false;

const audio = new Audio('audio.mp3');
const audiogo = new Audio('gameover.mp3');

window.onload = () => {
    if (localStorage.getItem('loggedIn') === 'true') {
        startGame();
    } else {
        document.getElementById('authContainer').style.display = 'block';
        document.getElementById('registerContainer').style.display = 'block';
    }
};

function showLogin() {
    document.getElementById('registerContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
}

function showRegister() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'block';
}

function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    if (username && password) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        alert('Registration successful! Please log in.');
        showLogin();
    } else {
        alert('Please enter a valid username and password.');
    }
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (username === storedUsername && password === storedPassword) {
        localStorage.setItem('loggedIn', 'true');
        startGame();
    } else {
        alert('Invalid username or password.');
    }
}

function startGame() {
    document.getElementById('authContainer').style.display = 'none';
    document.querySelector('.gameContainer').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'block';
    setTimeout(() => {
        audio.play();
    }, 1000);
}

function logout() {
    localStorage.setItem('loggedIn', 'false');
    window.location.reload();
}

document.onkeydown = function (e) {
    if (gameOverFlag || isPaused) return;

    console.log("Key code is: ", e.keyCode);
    if (e.keyCode === 38) {
        let dino = document.querySelector('.dino');
        if (!dino.classList.contains('animateDino')) {
            dino.classList.add('animateDino');
            setTimeout(() => {
                dino.classList.remove('animateDino');
            }, 700);
        }
    }
    if (e.keyCode === 39) {
        let dino = document.querySelector('.dino');
        let dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
        dino.style.left = (dinoX + 112) + "px";
    }
    if (e.keyCode === 37) {
        let dino = document.querySelector('.dino');
        let dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
        dino.style.left = (dinoX - 112) + "px";
    }
   
};

setInterval(() => {
    
    let dino = document.querySelector('.dino');
    let gameOver = document.querySelector('.gameOver');
    let obstacle = document.querySelector('.obstacle');
    
    let dx = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
    let dy = parseInt(window.getComputedStyle(dino, null).getPropertyValue('top'));
    
    let ox = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
    let oy = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('top'));
    
    let offsetX = Math.abs(dx - ox);
    let offsetY = Math.abs(dy - oy);
    
    if (offsetX < 73 && offsetY < 52) {
        gameOver.innerHTML = "Game Over - Reload to Play Again";
        obstacle.classList.remove('obstacleAni');
        gameOver.classList.add('show');
        gameOver.style.visibility = 'visible';
        audiogo.play();
        gameOverFlag = true;
        setTimeout(() => {
            audiogo.pause();
            audio.pause();
        }, 1000);
    } else if (offsetX < 145 && cross) {
        score += 1;
        updateScore(score);
        cross = false;
        setTimeout(() => {
            cross = true;
        }, 1000);
        setTimeout(() => {
            let aniDur = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'));
            let newDur = aniDur - 0.1;
            obstacle.style.animationDuration = newDur + 's';
        }, 500);
    }
}, 10);

function updateScore(score) {
    document.getElementById('scoreCont').innerHTML = "Your Score: " + score;
}
