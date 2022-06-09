const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024
canvas.height = 576

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './images/EllwoodCity.png';
// draw image inside of the onload method so the image is loaded from assets before its called to be rendered
image.onload = () => {
    ctx.drawImage(image, -575, -300);
}



console.log("Welcome to Ellwood City");
// console.log(ctx);