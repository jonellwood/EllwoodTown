const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./images/battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

const draggleImage = new Image();
draggleImage.src = "./images/draggleSprite.png";
const draggle = new Sprite({
  position: {
    x: 800,
    y: 100,
  },
  image: draggleImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
  isEnemy: true,
  name: "Draggle",
});

const embyImage = new Image();
embyImage.src = "./images/embySprite.png";
const emby = new Sprite({
  position: {
    x: 275,
    y: 350,
  },
  image: embyImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
  name: "Emby",
});

const renderedSprites = [];

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  // console.log("battle animation starting. Hold ON!! ");
  battleBackground.draw();
  draggle.draw();
  emby.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

// animate();
animateBattle();

const queue = [];
// Event listeners for buttons
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedRespect = respects[e.currentTarget.innerHTML];
    emby.respect({
      respect: selectedRespect,
      recipient: draggle,
      renderedSprites,
    });
    queue.push(() => {
      draggle.respect({
        respect: respects.Admire,
        recipient: emby,
        renderedSprites,
      });
    });
    queue.push(() => {
      draggle.respect({
        respect: respects.Compliment,
        recipient: emby,
        renderedSprites,
      });
    });
  });
});

document.querySelector("#wordBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});
