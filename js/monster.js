class Monster{
	constructor(tile, sprite, hp){
        this.move(tile);
        this.sprite = sprite;
        this.hp = hp;
        this.teleportCounter = 2;
        this.offsetX = 0; // movement animation                                                  
        this.offsetY = 0; // movement animation
        this.lastMove = [-1,0]; // 
        this.bonusAttack = 0; // for the POWER spell
	}
    
    heal(damage){
        this.hp = Math.min(maxHp, this.hp+damage);
    }
    
    update(){
        this.teleportCounter--;
        if(this.stunned || this.teleportCounter > 0){
            this.stunned = false;
            return;
        }
        
    this.doStuff();
    }

    doStuff(){
       let neighbors = this.tile.getAdjacentPassableNeighbors();
       
       neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);

       if(neighbors.length){
           neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
           let newTile = neighbors[0];
           this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
       }
    } // try to get closer every turn even if it gets them trapped

    // the visual offset for movement
    getDisplayX(){                     
        return this.tile.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.tile.y + this.offsetY;
    }
    //
    
	draw(){
        if(this.teleportCounter > 0){ // draws the teleport counter
            drawSprite(10, this.getDisplayX(),  this.getDisplayY());                     
        }else{
            drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY());
            this.drawHp(); // adds the HP bubbles
        }
        this.offsetX -= Math.sign(this.offsetX)*(1/8); // the actual animation magic    
        this.offsetY -= Math.sign(this.offsetY)*(1/8); // basically connects keyframes
        // note: floating point numbers can only be represented precisely if they are powers of two (e.g. 1/2, 1/4, 1/8) - so I can't put JUST any division in here without more code
	}
    
    drawHp(){
        for(let i=0; i<this.hp; i++){
            drawSprite(
                9, // location of the HP sprite
                this.getDisplayX() + (i%3)*(5/16), // 5/16 - Since drawSprite operates on a sprite index we normally pass in whole numbers representing 16 pixel sprites; i%3 - this resets to 0 every 3 pips
                this.getDisplayY() - Math.floor(i/3)*(5/16) // mathfloor - this increases by one every 3 pips
                // getDisplay returns apparent position, ie the illusion of movement
            );
        }
    }	

    tryMove(dx, dy){
    let newTile = this.tile.getNeighbor(dx,dy);
    if(newTile.passable){
        this.lastMove = [dx,dy];
        if(!newTile.monster){
            this.move(newTile);
        }else{
            if(this.isPlayer != newTile.monster.isPlayer){
                this.attackedThisTurn = true;
                newTile.monster.stunned = true;
                newTile.monster.hit(1 + this.bonusAttack);
                    this.bonusAttack = 0;

                // THIS IS THE SPOT WHERE STUFF HAPPENS AS A RESULT OF INTERACTION
                
                shakeAmount = 5; // screenshake
                
                //
                
                this.offsetX = (newTile.x - this.tile.x)/2; // bump animation        
                this.offsetY = (newTile.y - this.tile.y)/2; // bump animation
            } // boops you if you run into em
        }
        return true;
        } // allows monsters to move if neighboring tile is empty of walls and other critters
    }
    
    hit(damage){
        // for the spell BRAVERY
        if(this.shield>0){           
            return;                                                             
        }
        //
        
        this.hp -= damage;
        if(this.hp <= 0){
            this.die();
        }
        
        updateChatter(); // updates dialogue when you interact
        // TODO: copy the SFX if-else to have different things if you get hurt or not
        
        // plays sounds for either hit
        if(this.isPlayer){                                                     
            playSound("hit1");                                              
        }else{                                                       
            playSound("hit2");                                              
        }  
    }

    die(){
        this.dead = true;
        this.tile.monster = null;
        this.sprite = 1;
    }

    move(tile){
        if(this.tile){
            this.tile.monster = null;
            this.offsetX = this.tile.x - tile.x; // movement animation    
            this.offsetY = this.tile.y - tile.y; // movement animation
        }
        this.tile = tile;
        tile.monster = this;
        tile.stepOn(this);
    }
} // creates our monster spites :D

class Player extends Monster{
    constructor(tile){
        super(tile, 0, 3); // We're passing a tile that we live on, a sprite index of 0, and a maximum HP of 3 - mess with this last number to alter HP
        this.isPlayer = true; // an extra flag called to dintinguish from other monsters
        this.teleportCounter = 0; // the player doesn't have a teleport thingy
        this.spells = shuffle(Object.keys(spells)).splice(0,numSpells); // spells
    }
    
    // for the spell BRAVERY
    update(){          
        this.shield--;                                                      
    } 
    //
    
    tryMove(dx, dy){
        if(super.tryMove(dx,dy)){
            tick();
        }
    }
    
    // adds and subtracts (casts) spells
    addSpell(){                                                       
        let newSpell = shuffle(Object.keys(spells))[0];
        this.spells.push(newSpell);
        updateSpell(); // sending to HTML via fruit.js?? not working yet
    }

    castSpell(index){                                                   
        let spellName = this.spells[index];
        if(spellName){
            delete this.spells[index];
            spells[spellName]();
            playSound("spell"); // SFX
            tick();
            updateSpell(); // sending to HTML 
        }
    }
    
} // ah yes, the player is the first true monster of this world...

// a very basic monster with no special characteristics:
class Slime extends Monster{
    constructor(tile){
        super(tile, 4, 3); // the numbers here are location in spritesheet followed by HP
    }
}

// can move twice, move and attack, but not attack twice
class Ghost extends Monster{
    constructor(tile){
        super(tile, 5, 1);
    }
        doStuff(){
        this.attackedThisTurn = false;
        super.doStuff();

        if(!this.attackedThisTurn){
            super.doStuff();
        }
    }
}

// stuns itself if it wasn't already stunned, this results in action only every other turn.
class Jelly extends Monster{
    constructor(tile){
        super(tile, 6, 2);
    }
    
    update(){
        let startedStunned = this.stunned;
        super.update();
        if(!startedStunned){
            this.stunned = true;
        }
    }
}

// Before doing normal monster behavior, this guy is going to check for any nearby walls and eat them for health! Each wall will grant half a health point (our drawHp method only draws whole points though)
class Imp extends Monster{
    constructor(tile){
        super(tile, 7, 1);
    }
    doStuff(){
        let neighbors = this.tile.getAdjacentNeighbors().filter(t => !t.passable && inBounds(t.x,t.y));
        if(neighbors.length){
            neighbors[0].replace(Floor);
            this.heal(0.5);
        }else{
            super.doStuff();
        }
    }
}

// moves randomly
class Slug extends Monster{
    constructor(tile){
        super(tile, 8, 2);
    }
    doStuff(){
        let neighbors = this.tile.getAdjacentPassableNeighbors();
        if(neighbors.length){
            this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
        }
    }
}