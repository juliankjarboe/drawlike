function generateLevel(){
    tryTo('generate map', function(){
    return generateTiles() == randomPassableTile().getConnectedTiles().length;
    }); // makes sure the floor tiles are all connected
    
    generateMonsters(); // triggers generating our monsters
    
        for(let i=0;i<3;i++){ // If a tile has treasure, the treasure sprite will be drawn on top - the 0 here is to reset to 0 every game; the 3 is the maximum per level           
        randomPassableTile().treasure = true;                            
    }
}

function generateTiles(){
    let passableTiles=0;
    tiles = [];
    for(let i=0;i<numTiles;i++){
        tiles[i] = [];
        for(let j=0;j<numTiles;j++){
            if(Math.random() < 0.3 || !inBounds(i,j)){ // inbounds adds an outer wall
                tiles[i][j] = new Wall(i,j);
            }else{
                tiles[i][j] = new Floor(i,j);
                passableTiles++;
            }
        }
    }
    return passableTiles;
} // makes a 2D array called tiles and populates it with about 30% walls and 70% floors.

function inBounds(x,y){
    return x>0 && y>0 && x<numTiles-1 && y<numTiles-1;
}


function getTile(x, y){
    if(inBounds(x,y)){
        return tiles[x][y];
    }else{
        return new Wall(x,y);
    }
}

// makes sure we start on a floor tile, defined in util.js
function randomPassableTile(){
    let tile;
    tryTo('get random passable tile', function(){
        let x = randomRange(0,numTiles-1);
        let y = randomRange(0,numTiles-1);
        tile = getTile(x, y);
        return tile.passable && !tile.monster;
    });
    return tile;
}

// two new functions: one to spawn a single monster and another to create an bunch of monsters by repeatedly calling the first
function generateMonsters(){
    monsters = [];
    let numMonsters = level+1;
    for(let i=0;i<numMonsters;i++){
        spawnMonster();
    }
}

function spawnMonster(){
    let monsterType = shuffle([Slime, Ghost, Jelly, Imp, Slug])[0];
    let monster = new monsterType(randomPassableTile());
    monsters.push(monster);
}