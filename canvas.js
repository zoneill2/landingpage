const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
const dimensions = {
    width: window.innerWidth,
    height: window.innerHeight
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
centerX = canvas.width/2;
centerY = canvas.height/2;
const center = {
    x: canvas.width/2,
    y: canvas.height/2,
    r: 45
}

class Effect{
    constructor(ctx) {
        this.ctx = ctx;
        this.blocks = [];
        this.speed = .5; // Speed of asteroids
        this.size = 10; // Size of asteroids
    }

    update(){
        for(let i = 0; i < this.blocks.length; i++){
            let block = this.blocks[i];
            if(block.out)
                this.blocks.splice(i, 1);
            block.move();
        }
    }

    add(number){
        for(let i=0; i < number; i++) {
            const side = Math.floor(Math.random() * 4); // Randomly choose a side (0: top, 1: right, 2: bottom, 3: left)
            let x, y;
            switch (side) {
                case 0: // Top
                    x = Math.random() * dimensions.width;
                    y = -5;
                    break;
                case 1: // Right
                    x = dimensions.width + 5;
                    y = Math.random() * dimensions.height;
                    break;
                case 2: // Bottom
                    x = Math.random() * dimensions.width;
                    y = dimensions.height + 5;
                    break;
                case 3: // Left
                    x = -5;
                    y = Math.random() * dimensions.height;
                    break;
            }
    
            let endX = 0;
            let endY = 0;
            endX = dimensions.width/2;
            endY = dimensions.height/2;
            this.blocks.push(new Block(x, y, endX, endY, this.ctx));
        }
    }
}

class Block {
    constructor(x, y, endx, endy, ctx){
        this.x = x; 
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ctx = ctx;
        this.time = 360;
        this.step = 1/this.time;
        this.elapsed = 0;
        this.out = false;
        this.deltax = endx - this.x;
        this.deltay = endy - this.y;
        this.ax = (2 * this.deltax) / (this.time * this.time);
        this.ay = (2 * this.deltay) / (this.time * this.time);
        let randomColor = Math.floor(Math.random() * 1);
        switch(randomColor){
            case 0:
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
            break;
            case 1:
            this.color = `rgba(169, 169, 0, ${Math.random() * 0.5 + 0.2})`;
            break;
            case 2:
            this.color = `rgba(0, 169, 169, ${Math.random() * 0.5 + 0.2})`;
            break;
            
        } 
        this.size = Math.floor(Math.random() * 20) + 10;
        this.move();
    }

    move(){
        this.vx += this.ax * this.elapsed;
        this.vy += this.ay * this.elapsed;


        const mouseDeltaX = mouse.x - this.x;
        const mouseDeltaY = mouse.y - this.y;
        const mouseDelta = Math.sqrt((mouseDeltaX * mouseDeltaX) + (mouseDeltaY * mouseDeltaY));

        if(mouseDelta < mouse.r){
            let thetaVel = Math.atan2(this.vy, this.vx);
            let thetaD = Math.atan2(mouseDeltaY, mouseDeltaX);
            let thetaReflect = 2 * thetaD - thetaVel;
            let speed = Math.sqrt((this.vx * this.vx) + (this.vy * this.vy))
            this.vx = Math.cos(thetaReflect) * speed;
            this.vy = Math.sin(thetaReflect) * speed;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.elapsed += this.step;

        if(this.elapsed > this.time)
            this.out = true;

        if(((this.x + this.size).between((center.x - center.r), (center.x + center.r), true)) && ((this.y + this.size).between((center.y - center.r), (center.y + center.r), true)))
            this.out = true;
        else
            this.draw();
    }

    draw() {
        ctx.save();
        ctx.lineWidth = 2;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = `rgb(80, 80, 80)`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        ctx.restore();
        }
    
}

Number.prototype.between = function(a, b, inclusive) {
    var min = Math.min(a, b),
      max = Math.max(a, b);
  
    return inclusive ? this >= min && this <= max : this > min && this < max;
  }

const effect = new Effect(canvas.width, canvas.height, ctx);
const mouse = {
    r: 30,
    x: canvas.width/2,
    y: canvas.height/2,
  };

// Animation loop
function update() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    effect.update();
    requestAnimationFrame(update);
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    });

setInterval(() => {
    if(!document.hidden)
        effect.add(5);
}, 500);

document.addEventListener("visibilitychange", function() {
    console.log(document.hidden, document.visibilityState);
  }, false);

window.addEventListener('resize', function(event){
        dimensions.width = event.currentTarget.innerWidth;
        dimensions.height =  event.currentTarget.innerHeight;
        
        //Update canvas
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        center.x = canvas.width/2;
        center.y = canvas.height/2;
    });

update();