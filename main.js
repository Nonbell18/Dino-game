let runner = document.getElementById("runner");
let obstacle = document.querySelector(".obstacle");
let obstacles = [];
let isJumping = false;

//Game running
function runGame(event) {
  if (event.code === "Space") {
    console.log("Space Pressed!");

    let duration = 10000 * Math.random();

    for (let i = 0; i < 3; i++) {
      let clone = obstacle.cloneNode(true);
      clone.id = "obstacle" + i;
      obstacles.push(clone);
      document.getElementById("game").appendChild(clone);
      /** @type {Animation} */
      let animation = clone.animate(
        [
          { transform: "translateX(100vw)" }, // Startläge
          { transform: "translateX(-100vw)" }, // Slutläge
        ],
        {
          duration: duration, // Tid i millisekunder
          delay: 1000 * i, // Vänta lite innan start
        }
      );
      animation.onfinish = () => {
        console.log(obstacles);
        clone.remove();
        obstacles = obstacles.filter((h) => h !== clone);
      };
    }
  }
}

/**
 *
 * @param {KeyboardEvent} event
 */

//jumping function
function jump(event) {
  if (event.code === "Space" && !isJumping) {
    isJumping = true;
    runner.classList.add("jump");

    //jumps with debounce
    setTimeout(() => {
      runner.classList.remove("jump");
      isJumping = false;
    }, 550);
  }
}

document.addEventListener("keydown", jump);
document.addEventListener("keydown", runGame, { once: true });
