let runner = document.getElementById("runner");
let isJumping = false;

//jumping function
function jump(event) {
  if (event.code === "Space" && !isJumping) {
    isJumping = true;
    runner.classList.add("jump");

    setTimeout(() => {
      runner.classList.remove("jump");
      isJumping = false;
    }, 1000);
  }
}

document.addEventListener("keydown", jump);
