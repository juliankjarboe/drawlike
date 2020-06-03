function setupCanvas(){ // literally just defines the size of the canvas area
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    
    canvas.width = tileSize*(numTiles+uiWidth);
    canvas.height = tileSize*numTiles;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    ctx.imageSmoothingEnabled = false; // this makes sure our sprites scale nicely!
}

function drawSprite(sprite, x, y){ // grabbing one sprite at a time instead of the whole sheet
    ctx.drawImage(
        spritesheet,
        sprite*16,
        0,
        16,
        16,
        x*tileSize + shakeX,
        y*tileSize + shakeY,
        tileSize,
        tileSize
    );
}

function draw(){
    
    if(gameState == "running" || gameState == "dead"){
        
    ctx.clearRect(0,0,canvas.width,canvas.height); // draws the game space
    
        screenshake();
        
        for(let i=0;i<numTiles;i++){
        for(let j=0;j<numTiles;j++){
            getTile(i,j).draw();
        }
    } // draws the floor and wall tiles
    
    for(let i=0;i<monsters.length;i++){
        monsters[i].draw();
    } // draws our monsters
    
    player.draw(); // draws our sprite
    
    // all of the following is redundant since now these stats are in HTML
    // drawText("Level: "+level, 15, false, 40, "yellow"); // status text
    // drawText("Score: "+score, 15, false, 70, "violet"); // treasure score
    // drawText("Fruit: "+fruit, 15, false, 100, "white"); // grab a fruit    
    // for(let i=0; i<player.spells.length; i++){ // here's a fancy way of adding spells...
            // let spellText = (i+1) + ": " + (player.spells[i] || "");
            // drawText(spellText, 15, false, 130+i*40, "aqua");        
        // }
    }
}

// In game dev, the code to update the world and the monsters in it is commonly called a "tick"
function tick(){
    for(let k=monsters.length-1;k>=0;k--){
        if(!monsters[k].dead){
            monsters[k].update();
        }else{
            monsters.splice(k,1);
        }
    }
    
    player.update();
    
    if(player.dead){   
        addScore(score, false); // adds to score board when you die
        gameState = "dead";
        updateDead(); // all the death-state html updates
    }
    
    spawnCounter--;
    if(spawnCounter <= 0){  
        spawnMonster();
        spawnCounter = spawnRate;
        spawnRate--;
    }
}

function showTitle(){                                          
    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    gameState = "title";
    
    drawText("Drawlike", 50, true, canvas.height/2 - 150, "pink");
    drawText("by Julian", 30, true, canvas.height/2 - 50, "pink");
    
    drawScores(); // calls the function named drawScores
}

function startGame(){                                           
    level = 1; // current level - also defined in index.html - redundant???
    score = 0; // amount of treasure
    numSpells = 0; // start with 0 spells, originally started with 1 - kinda avoiding the fact that i don't have a working spell update at the start of the game
    updateReplay(); // resets the HTML
    startLevel(startingHp);

    gameState = "running";
}

function startLevel(playerHp, playerSpells){                          
    spawnRate = 36; //  how often monsters will get spawned             
    spawnCounter = spawnRate;
    
    generateLevel();

    player = new Player(randomPassableTile());
    player.hp = playerHp;
    
    if(playerSpells){
        player.spells = playerSpells;
    }
    
    randomPassableTile().replace(Exit); // randomly creates exits
}

// TODO: how to change color of the title screen?
function drawText(text, size, centered, textY, color){ // drawing the title screen
    ctx.fillStyle = color;
    ctx.font = size + "px pixie"; // the size + the font
    let textX;
    if(centered){
        textX = (canvas.width-ctx.measureText(text).width)/2;
    }else{
        textX = canvas.width-uiWidth*tileSize+25; // this is the right-side text
    }

    ctx.fillText(text, textX, textY);
}

// creates a high score board stored locally
function getScores(){
    if(localStorage["scores"]){
        return JSON.parse(localStorage["scores"]);
    }else{
        return [];
    }
}

function addScore(score, won){
    let scores = getScores();
    let scoreObject = {score: score, run: 1, totalScore: score, active: won};
    let lastScore = scores.pop();

    if(lastScore){
        if(lastScore.active){
            scoreObject.run = lastScore.run+1;
            scoreObject.totalScore += lastScore.totalScore;
        }else{
            scores.push(lastScore);
        }
    }
    scores.push(scoreObject);

    localStorage["scores"] = JSON.stringify(scores);
}

// a very elaborate way to display a scoreboard, might make more sense as html
function drawScores(){
    let scores = getScores();
    if(scores.length){
        drawText(
            rightPad(["!","$","="]),
            20,
            true,
            canvas.height/2,
            "white"
        );

        let newestScore = scores.pop();
        scores.sort(function(a,b){
            return b.totalScore - a.totalScore;
        });
        scores.unshift(newestScore);

        for(let i=0;i<Math.min(8,scores.length);i++){ // the 8 here is the number of lines
            let scoreText = rightPad([scores[i].run, scores[i].score, scores[i].totalScore]);
            drawText(
                scoreText,
                18, // font size
                true,
                canvas.height/2 + 30+i*30, // line heights should match here
                i == 0 ? "aqua" : "deeppink"
            );
        }
    }
}
// end of scoreboard

// the screenshake
function screenshake(){
    if(shakeAmount){
        shakeAmount--;
    }
    let shakeAngle = Math.random()*Math.PI*2;
    shakeX = Math.round(Math.cos(shakeAngle)*shakeAmount);
    shakeY = Math.round(Math.sin(shakeAngle)*shakeAmount);
}

// audio!!! can add a bunch more
function initSounds(){          
    sounds = {
        hit1: new Audio('audio/bump07.wav'),
        hit2: new Audio('audio/bump08.wav'),
        treasure: new Audio('audio/posi04.wav'),
        newLevel: new Audio('audio/teleport04.wav'),
        spell: new Audio('audio/bubbly.wav'),
        music: new Audio('audio/bumpinandbloopin.mp3'),
    };
}

function playSound(soundName){                       
    sounds[soundName].currentTime = 0;  
    sounds[soundName].play();
}