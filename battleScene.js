const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./images/battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

let draggle;
let emby;
let renderedSprites;
let queue;
// populate respect buttons based on character / monster

// console.log(emby.respects);
// console.log(Object.entries(emby));

let battleAnimationId;

function initBattle() {
  document.querySelector("#userInterface").style.display = "block";
  document.querySelector("#wordBox").style.display = "none";
  document.querySelector("#enemyHealthBar").style.width = "20%";
  document.querySelector("#playerHealthBar").style.width = "20%";
  document.querySelector("#respectsBox").replaceChildren();

  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);
  renderedSprites = [draggle, emby];
  queue = [];

  emby.respects.forEach((respect) => {
    const button = document.createElement("button");
    button.innerHTML = respect.name;
    document.querySelector("#respectsBox").append(button);
  });
  // Event listeners for buttons
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedRespect = respects[e.currentTarget.innerHTML];
      emby.respect({
        respect: selectedRespect,
        recipient: draggle,
        renderedSprites,
      });
      if (draggle.health >= 100) {
        queue.push(() => {
          draggle.faint();
        });
        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              window.cancelAnimationFrame(battleAnimationId);
              animate();
              document.querySelector("#userInterface").style.display = "none";
              gsap.to("#overlappingDiv", {
                opacity: 0,
              });
              battle.initiated = false;
            },
          });
        });
      }
      // draggle or enemy "attacks" right here - but with love
      const randomRespect =
        draggle.respects[Math.floor(Math.random() * draggle.respects.length)];

      queue.push(() => {
        draggle.respect({
          respect: randomRespect,
          recipient: emby,
          renderedSprites,
        });

        if (emby.health >= 100) {
          queue.push(() => {
            emby.faint();
          });
          queue.push(() => {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              onComplete: () => {
                window.cancelAnimationFrame(battleAnimationId);
                animate();
                document.querySelector("#userInterface").style.display = "none";
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                });
                battle.initiated = false;
              },
            });
          });
        }
      });
    });
    button.addEventListener("mouseenter", (e) => {
      const selectedRespect = respects[e.currentTarget.innerHTML];
      document.querySelector("#respectTypeBox").innerHTML =
        selectedRespect.type;
      document.querySelector("#respectTypeBox").style.color =
        selectedRespect.color;
    });
  });
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  //   console.log(battleAnimationId);

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

animate();
// initBattle();
// animateBattle();

document.querySelector("#wordBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});
