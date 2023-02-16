const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "flappy-mimi.png";

// paramètres
let gamePlaying = false;
const gravity = .5;
let speed = 5;
const size = [157, 62]; /* MIMI size*/

/* const size = [83, 96]; */ /* Albert size*/
const jump = -8.5;
const cTenth = (canvas.width / 10);

let index = 0,
    bestScore = 0,
    flight,
    flyHeight,
    currentScore,
    pipe;

// paramètres tuyaux
const pipeWidth = 78;
let pipeGap = 350;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
    currentScore = 0;
    flight = jump;

    // position initiale (middle of screen - size of the bird)
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    // setup first 3 pipes
    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
    // make the pipe and bird moving 
    index++;

    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background 1
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    // background 2
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);

    // pipe display
    if (gamePlaying) {
        pipes.map(pipe => {
            // pipe moving
            pipe[0] -= speed;

            // top 
            ctx.drawImage(img, 432, 688 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
            // bottom 
            ctx.drawImage(img, 432 + pipeWidth, 200, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

            // score++ et nouveau tuyau
            if (pipe[0] <= -pipeWidth) {
                // ajoute score+1
                currentScore++;

                // rapproche les tuyaux de 1.5px
                pipeGap = pipeGap - 1.5;

                // check si meilleur score
                bestScore = Math.max(bestScore, currentScore);

                // remove & create new tuyau
                pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
                console.log(pipeGap);
            }

            // si touche un tuyau -> gameover
            if ([
                pipe[0] <= cTenth + size[0],
                pipe[0] + pipeWidth >= cTenth,
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
            ].every(elem => elem)) {
                gamePlaying = false;
                pipeGap = 350;
                setup();
            }
        })
    }
    // draw bird
    if (gamePlaying) {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
    } else {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
        flyHeight = (canvas.height / 2) - (size[1] / 2);
        // text accueil
        ctx.fillText(`Best score : ${bestScore}`, 85, 245);
        ctx.fillText('Click to play', 90, 535);
        ctx.font = "bold 30px courier";
    }

    document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
    document.getElementById('currentScore').innerHTML = `Score : ${currentScore}`;

    // requestAnim
    window.requestAnimationFrame(render);
}

// launch setup
setup();
img.onload = render;

// start game
document.addEventListener('click', () => gamePlaying = true);
/* document.addEventListener('mousedown', () => flight = jump); */
document.addEventListener('touchstart', () => flight = jump);
/* window.onclick = () => flight = jump; */
if (window.matchMedia("(min-width: 1100px)").matches) { document.addEventListener('mousedown', () => flight = jump); }


document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        gamePlaying = true;
        flight = jump;
    }
})