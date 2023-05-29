const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw(){

        context.fillStyle = this.color;
        context.shadowColor = '#00f';
        context.shadowBlur = 10;

        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
    }

    update(){
        if(this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }else if(this.y > canvas.height || this.y < 0){
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

const particle1 = new Particle(10, 10, 50, 55, 2, '#f1f1f1');

let particlesArray;

function init(){
    particlesArray = [];

    const numberOfParticles = (canvas.height * canvas.width) / 7000;

    for(let i = 0; i < numberOfParticles; i++){
        // taille : [1, 3[
        const size = (((Math.random() * 2) + 1) * 1.2);
        //on met -10 ici pour éviter que les particiles soient trop
        //près du bord
        //Le innerwidth - 10 c'est pour simuler un padding
        //a l'apparition des particles
        const x = Math.random() * ((innerWidth - 10) - 10 + 1) + 10;
        const y = Math.random() * ((innerWidth - 10) - 10 + 1) + 10;

        const directionX = cleanDirection();
        const directionY = cleanDirection();

        particlesArray.push(new Particle(x, y, directionX, directionY, size, "#f1f1f1"));

    }


}

init();

function cleanDirection(){
    //0 ou 1
    const random = Math.trunc(Math.random() * 2)

    if(random){
        //de 0.5 à 1.5 non inclu, non trunc [0.5, 1.5[
        return (Math.random() * 1) + 0.5;
    }else {
        //de -0.5 à -1.5 non inclu, non trunc ]-1.5, -.5]
        return (Math.random() * -1) - 0.5;
    }
}

function animate(){

    context.clearRect(0, 0, innerWidth, innerHeight);

    for(let i = 0; i < particlesArray.length; i++){
        particlesArray[i].update();
    }
    connect();

    requestAnimationFrame(animate);
}
animate();

function connect(){
    for(let i = 0; i < particlesArray.length; i++){

        for(let j = i + 1; j < particlesArray.length; j++){

            const squaredDistanceX =
                (particlesArray[i].x - particlesArray[j].x) *
                (particlesArray[i].x - particlesArray[j].x)

            const squaredDistanceY =
                (particlesArray[i].y - particlesArray[j].y) *
                (particlesArray[i].y - particlesArray[j].y)

            const hypothenuse = squaredDistanceX + squaredDistanceY;

            if(hypothenuse < (135 * 135)){
                context.strokeStyle = `rgba(59,101,204, ${1 - hypothenuse/ (135*135)}`
                context.lineWidth = 1.2;
                context.beginPath();
                context.moveTo(particlesArray[i].x, particlesArray[i].y);
                context.lineTo(particlesArray[j].x, particlesArray[j].y);
                context.stroke();

            }
        }
    }
}