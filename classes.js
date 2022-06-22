class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    scale = 1,
  }) {
    this.position = position;
    this.image = new Image();
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = (this.image.width / this.frames.max) * scale;
      this.height = this.image.height * scale;
    };
    this.image.src = image.src;
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.rotation = rotation;
    this.scale = scale;
  }

  draw() {
    c.save(); // save and restore allows access to global canvas property but contains it to what it is called on
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation); // default is zero
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    c.globalAlpha = this.opacity;

    const crop = {
      position: {
        x: this.frames.val * (this.width / this.scale),
        y: 0,
      },
      width: this.image.width / this.frames.max,
      height: this.image.height,
    };

    const image = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: this.image.width / this.frames.max,
      height: this.image.height,
    };

    c.drawImage(
      this.image,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      image.position.x,
      image.position.y,
      image.width * this.scale,
      image.height * this.scale
    );
    c.restore();
    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

class Monster extends Sprite {
  constructor({
    isEnemy = false,
    name,
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    respects,
  }) {
    super({
      //assigned from the parent so only pass in the properties - no values
      position,
      image,
      frames,
      sprites,
      animate,
      rotation,
    });
    this.health = 0;
    this.isEnemy = isEnemy;
    this.name = name;
    this.respects = respects;
  }

  faint() {
    document.querySelector("#wordBox").innerHTML =
      this.name + " is full of love";
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
    audio.battle.stop();
    audio.faint.play();
  }

  respect({ respect, recipient, renderedSprites }) {
    document.querySelector("#wordBox").style.display = "block";
    document.querySelector("#wordBox").innerHTML =
      this.name + " used " + respect.name;

    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) healthBar = "#playerHealthBar";

    let rotation = 1;
    if (this.isEnemy) rotation = -2;

    recipient.health += respect.healing;

    switch (respect.name) {
      // name for case is the respect.name that is rendered on the button = not the obj name
      case "WarmFuzzy":
        audio.initWarm.play();
        const warmImage = new Image();
        warmImage.src = "./images/fireball.png";
        const warm = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: warmImage,
          frames: {
            max: 4,
          },
          rotation,
        });

        // renderedSprites.push(heart);
        renderedSprites.splice(1, 0, warm);

        gsap.to(warm.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          duration: 1.5,
          onComplete: () => {
            // enemy is struck
            audio.warmHit.play();
            gsap.to(recipient.healthBar, {
              width: recipient.health + "%",
            });
            gsap.to(recipient.position, {
              y: recipient.position.y + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });

            gsap.to(recipient, {
              opacity: 0,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });
            renderedSprites.splice(1, 1);
          },
        });

        break;
      case "Admire":
        const heartImage = new Image();
        heartImage.src = "./images/heart.png";
        const heart = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: heartImage,
          // rotation,
        });

        // renderedSprites.push(heart);
        renderedSprites.splice(1, 0, heart);

        gsap.to(heart.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          duration: 1.5,
          onComplete: () => {
            gsap.to(recipient.healthBar, {
              width: recipient.health + "%",
            });
            gsap.to(recipient.position, {
              y: recipient.position.y + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });

            gsap.to(recipient, {
              opacity: 0,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });
            renderedSprites.splice(1, 1);
          },
        });

        break;

      case "Compliment":
        const tl = gsap.timeline();

        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              // enemy gets hit with respect
              audio.compHit.play();
              gsap.to(healthBar, {
                width: recipient.health + "%",
              });
              gsap.to(recipient.position, {
                y: recipient.position.y + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });

              gsap.to(recipient, {
                opacity: 0,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;
    }
  }
}

class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0.0 )";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
