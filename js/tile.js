class Tile{
	constructor(x, y, sprite, passable){
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.passable = passable;
	}
    
    // makes it so one type of tile can turn into another
    replace(newTileType){
        tiles[this.x][this.y] = new newTileType(this.x, this.y);
        return tiles[this.x][this.y];
    }
    
    //manhattan distance
    dist(other){
        return Math.abs(this.x-other.x)+Math.abs(this.y-other.y);
    }

    // makes sure our floor tiles are all connected
    getNeighbor(dx, dy){
        return getTile(this.x + dx, this.y + dy)
    }

    getAdjacentNeighbors(){
        return shuffle([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0)
        ]);
    }

    getAdjacentPassableNeighbors(){
        return this.getAdjacentNeighbors().filter(t => t.passable);
    }

    getConnectedTiles(){
        let connectedTiles = [this];
        let frontier = [this];
        while(frontier.length){
            let neighbors = frontier.pop()
                                .getAdjacentPassableNeighbors()
                                .filter(t => !connectedTiles.includes(t));
            connectedTiles = connectedTiles.concat(neighbors);
            frontier = frontier.concat(neighbors);
        }
        return connectedTiles;
    }
    
	draw(){
        drawSprite(this.sprite, this.x, this.y);
        
        if(this.treasure){ // if there's treasure, draw it                     
        drawSprite(12, this.x, this.y); // 12 is the location in spritesheet                  
        }
        
        if(this.effectCounter){  // draws spells for 30 frames                  
            this.effectCounter--;
            ctx.globalAlpha = this.effectCounter/30;
            drawSprite(this.effect, this.x, this.y);
            ctx.globalAlpha = 1;
        }
	}
    setEffect(effectSprite){                                  
        this.effect = effectSprite;
        this.effectCounter = 30;
    }
}
// draws floor tiles you can pass thru

class Floor extends Tile{
    constructor(x,y){
        super(x, y, 2, true);
    };
    stepOn(monster){  
        if(monster.isPlayer && this.treasure){   
            score++; // if player meets treasure you get score
            updateScore(); // sends this to the HTML
            
            // gain spell with treasure
            if(score % 2 == 0 && numSpells < 6){ // Every 2 treasures acquired results in a new spell all the way up to 6 slots                     
                numSpells++;                
                player.addSpell();
                updateSpell(); // sends this info to HTML
            } 
            
            playSound("treasure"); // the sound effect
            this.treasure = false;
            // spawnMonster(); // this part spawns monsters if you pick up treasure, which could be optional
            updateFruit(); // grab a new fruit-- working!!!
            select();
        }
    }
}

class Wall extends Tile{
    constructor(x, y){
        super(x, y, 3, false);
    }
} // draws wall tiles you can't pass thru

class Exit extends Tile{ // makes exits
    constructor(x, y){
        super(x, y, 11, true);
    }

    stepOn(monster){
        if(monster.isPlayer){
            playSound("newLevel"); // sound effect
            if(level == numLevels){ // ie if the level is the last one, you win
                addScore(score, true); // adds your score to the scoreboard if you win
                showTitle();
            }else{ // otherwise continue on
                level++;
                updateLevel(); // talks to the html to +1 level
                startLevel(Math.min(maxHp, player.hp+1)); // you gain a life for moving a level
                updateSpell(); // maybe talks to html??????? it works! ok cool
                // this makes sure the spell refresh on level change also updates :D
            }
        }
    }
}