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
        this.endx = endx;
        this.endy = endy;
        this.ctx = ctx;
        this.deltax = endx - x;
        this.deltay = endy - y;
        this.vx = 0;
        this.vy = 0; 
        this.mass = 1;
        this.time = 0;
        this.out = false;
        this.speed = .2;
        let randomColor = Math.floor(Math.random() * 1);
        switch(randomColor){
            case 0:
            this.color = `rgba(90, 90, 90, ${Math.random() * 0.5 + 0.2})`;
            break;
            case 1:
            this.color = `rgba(169, 169, 0, ${Math.random() * 0.5 + 0.2})`;
            break;
            case 2:
            this.color = `rgba(0, 169, 169, ${Math.random() * 0.5 + 0.2})`;
            break;
            
        } 
        this.size = Math.floor(Math.random() * 20) + 10;
        this.draw();
    }

    move(){
        this.time++;

        //constant force
        this.deltax = this.endx - this.x;
        this.deltay = this.endy - this.y;
        let distanceToCenter = Math.sqrt((this.deltax* this.deltax) + (this.deltay * this.deltay));
        const forcex = (this.deltax/distanceToCenter) * .05;
        const forcey = (this.deltay/distanceToCenter) * .05;

        this.vx += (forcex / this.mass) * (this.time/120);
        this.vy += (forcey / this.mass) * (this.time/120);

        //force exerted by mouse
        let distanceX = mouse.x - this.x;
        let distanceY = mouse.y - this.y;
        let distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

        if(distance < mouse.r){
            let force = (-mouse.r / distance) * .5;
            let angle = Math.atan2(distanceY, distanceX);
            this.vx += (force/this.mass) * Math.cos(angle);
            this.vy += (force/this.mass) * Math.sin(angle);
        }
        this.x += this.vx * .2;
        this.y += this.vy * .2; 

        if(this.time/120 > 12)
            this.out = true;

        if(((this.x + this.size).between((center.x - center.r), (center.x + center.r), true)) && ((this.y + this.size).between((center.y - center.r), (center.y + center.r), true)))
            this.out = true;
        else
            this.draw();
    }

    draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
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
        effect.add(4);
}, 100);

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