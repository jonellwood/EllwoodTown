class Sprite {
  constructor({
    position,

    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    isEnemy = false,
    name,
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.health = 0;
    this.isEnemy = isEnemy;
    this.name = name;
  }

  draw() {
    c.save(); // save and restore allows access to global canvas property but contains it to what it is called on
    c.globalAlpha = this.opacity;
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
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
  respect({ respect, recipient, renderedSprites }) {
    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) healthBar = "#playerHealthBar";

    this.health += respect.healing;

    switch (respect.name) {
      case "Admire":
        const heartImage = new Image();
        heartImage.src = "./images/heart.png";
        const heart = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: heartImage,
        });

        renderedSprites.push(heart);

        gsap.to(heart.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          duration: 1.5,
          onComplete: () => {
            gsap.to(recipient.healthBar, {
              width: this.health + "%",
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
            renderedSprites.pop();
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
              gsap.to(healthBar, {
                width: this.health + "%",
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

    document.querySelector("#wordBox").style.display = "block";
    document.querySelector("#wordBox").innerHTML =
      this.name + " used " + respect.name;
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
