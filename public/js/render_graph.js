
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, size, color) {

        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
}
document.addEventListener('DOMContentLoaded', function(){

    let dataJSON = document.querySelector(('.data-json'));
    let jsonString = dataJSON.dataset.json;

    let json;

    try {
        json = JSON.parse(jsonString);
    } catch (error) {
        console.error('Erreur lors de l\'analyse de la chaîne JSON :', error);
        return;
    }

    console.log(json)

    const toggleGraph = document.getElementById('toggle-graph')

    toggleGraph.addEventListener('click', () => displayGraph(json))

})


let particlesArray;
function displayGraph(json){

    console.log(json)
    particlesArray = [];
    //(* 10 / 2)
    for(let i = 1; i < json.length; i++){
        const x = (json[i][0] * 10) / 2
        const y = (json[i][1] * 10) / 2

        particlesArray.push(new Particle(x, y,5 , '#f1f1f1'))


    }

    drawParticles();

    console.log(particlesArray)
}



function drawParticles(){

    context.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(particle => {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = particle.color;
        context.fill();
    })

    requestAnimationFrame(drawParticles);
}

function getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    return 'rgb(' +r +', ' +g +', ' +b +')';
}








