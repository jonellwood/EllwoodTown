// const embyImage = new Image();
// embyImage.src = "./images/embySprite.png";

// const draggleImage = new Image();
// draggleImage.src = "./images/draggleSprite.png";

const monsters = {
  Emby: {
    position: {
      x: 275,
      y: 350,
    },
    image: {
      src: "./images/embySprite.png",
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    name: "Emby",
    respects: [respects.Admire, respects.Compliment, respects.WarmFuzzy],
  },
  Draggle: {
    position: {
      x: 800,
      y: 100,
    },
    image: {
      src: "./images/draggleSprite.png",
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: "Draggle",
    // respects: [respects.Blessings, respects.Admire],
    respects: [respects.Compliment], // delete this line after testing
  },
};
