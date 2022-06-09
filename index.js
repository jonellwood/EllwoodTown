console.log('This project is based in part on a tutorial from ChrisCourses.com with artwork from itch.io')
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024
canvas.height = 576

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './images/EllwoodCity.png';
// lets add a player image
const playerImage = new Image();
playerImage.src = './images/playerDown.png'
// draw image inside of the onload method so the image is loaded from assets before its called to be rendered
image.onload = () => {
    ctx.drawImage(image, -585, -450);
    ctx.drawImage(
        playerImage,
        // image cropping args
        0,
        0,
        playerImage.width / 4,
        playerImage.height,
        canvas.width / 2 - playerImage.width / 4 / 2, 
        canvas.height / 2 - playerImage.height / 2,
        playerImage.width / 4,
        playerImage.height, 
        );
}



console.log("Welcome to Ellwood City");
// console.log(ctx);