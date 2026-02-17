const runner = document.getElementById("runner");
const runner_wrapper = document.getElementById("runner-wrapper");
let obstacle = document.querySelector(".obstacle");
let CurrentStats = document.getElementById("stats");
let Stats = document.getElementById("game-Over-Screen");
let startText = document.getElementById("Starting-Text");
let isGameStarted = false;
let RunnerX = 0;
let time = 0;
let lastTime = 0;
let timeAccumulator = 0;
let score = 0;
let spawnDelay = 500 + Math.random() * 1500;
let duration = 8000; //speed
let moveLeft;
let moveRight;
let obstacles = [];
let isJumping = false;
let collision = false;
let spawner;

//Game running
function runGame() {
  startText.style.display = "none";
  isGameStarted = true;
  spawnObstacles();
  requestAnimationFrame(CollisionCheck);
  lastTime = performance.now();
  requestAnimationFrame(Update);
  Score();
}

//jumping function
function SpaceHandler(
  /**
   *
   * @type {KeyboardEvent} event
   */ event
) {
  if (event.code !== "Space") return;
  {
    if (collision) {
      location.reload();
      return;
    }
    if (!isGameStarted) {
      runGame(event);
      return;
    }
    if (!isJumping) {
      isJumping = true;
      runner.classList.add("jump");

      runner.addEventListener(
        "animationend",
        () => {
          runner.classList.remove("jump");
          isJumping = false;
        },
        { once: true }
      );
    }
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code === "KeyA" && isGameStarted) {
    moveLeft = true;
  }
  if (e.code === "KeyD" && isGameStarted) {
    moveRight = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "KeyA" && isGameStarted) {
    moveLeft = false;
  }
  if (e.code === "KeyD" && isGameStarted) {
    moveRight = false;
  }
});

function Update(timestamp) {
  if (moveLeft) {
    RunnerX -= 5;
  }
  if (moveRight) {
    RunnerX += 5;
  }
  runner_wrapper.style.transform = `translate(${Math.max(
    Math.min(RunnerX, window.innerWidth),
    0
  )}px, 0px)`;

  let DeltaTime = timestamp - lastTime;
  lastTime = timestamp;

  timeAccumulator += DeltaTime;

  if (timeAccumulator >= 100) {
    time += 0.1;
    timeAccumulator -= 100;
  }
  if (!collision) {
    score++;
    CurrentStats.innerHTML =
      "Score: " + score + " points " + "time: " + time.toFixed(1) + " seconds";
    requestAnimationFrame(Update);
  }
}

function spawnObstacles() {
  let targetWidth = 20 + Math.random() * 60 + "px";
  let targetHeight = 20 + Math.random() * 60 + "px";

  let clone = obstacle.cloneNode(true);
  clone.id = "obstacle" + Date.now();
  clone.style.display = "block";
  obstacles.push(clone);
  document.getElementById("game").appendChild(clone);
  /** @type {Animation} */
  let animation = clone.animate(
    [
      { transform: "translateX(100vw)", width: "20px", height: "20px" }, // Startläge
      {
        transform: "translateX(-100vw)",
        width: targetWidth,
        height: targetHeight,
      }, // Slutläge
    ],
    {
      duration: Math.max(1000, duration - time * 10), // Tid i millisekunder
    }
  );
  animation.onfinish = () => {
    clone.remove();
    obstacles = obstacles.filter((h) => h !== clone);
  };

  if (!collision) {
    spawner = setTimeout(spawnObstacles, spawnDelay);
  }
}

function CollisionCheck() {
  let isInsideX = false;
  let isInsideY = false;
  let runnerRect = runner.getBoundingClientRect();
  obstacles.forEach((/**@type {HTMLElement} */ obs) => {
    let obsRect = obs.getBoundingClientRect();

    isInsideX =
      runnerRect.right > obsRect.left && runnerRect.left < obsRect.right;

    isInsideY =
      runnerRect.bottom > obsRect.top && runnerRect.top < obsRect.bottom;
    if (isInsideX && isInsideY) {
      collision = true;
      EndGame();
    }
  });
  if (!collision) {
    requestAnimationFrame(CollisionCheck);
  }
}

function EndGame() {
  obstacles.forEach((/**@type {HTMLElement} */ obs) => {
    obs.getAnimations().forEach((animation) => {
      animation.pause();
    });
  });
  isGameStarted = false;
  runner.getAnimations().forEach((anim) => anim.pause());
  window.clearTimeout(spawner);
  Stats.innerHTML =
    " <h1>Game Over!</h1><p>Score: " +
    score +
    " <br> Time: " +
    time.toFixed(1) +
    " second(s) <br><br>Press SPACE to continue</p>";
  Stats.style.display = "block";
  startText.style.display = "none";
}
document.addEventListener("keydown", SpaceHandler);
