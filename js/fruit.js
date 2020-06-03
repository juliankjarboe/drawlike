// README: the point of this very weird "fruit" aspect is that I'm trying to build a framework for dialogue in the broughlike-- right now commentary is updated BOTH any time you pick up a gem AND any time you interact with a monster.

// Everything here is meant to "talk" to my HTML

// defines an array of things to pick from
// TODO: figure out how to grab a VERY big array from a CSV file so I can cleanly have a LOT of possible text
// https://www.w3schools.com/js/js_json_arrays.asp
// basically this - https://www.w3schools.com/js/tryit.asp?filename=tryjs_json_parse

let myFruits = ['apples', 'bananas', 'grapes', 'peaches', 
'cherries', 'oranges', 'kiwi', 'dates', 'mangoes', 'figs', 'tomatoes', 'cucumbers', 'pumpkins', 'watermelons'];

// creates a function where the array is run through random math
function updateFruit(){
    fruit = myFruits[Math.floor(Math.random() * myFruits.length)];
    document.getElementById("demo").innerHTML =
        "You found some " + fruit + "!";
    replyGuy();
}

// a special reply for apples - it works!
function replyGuy(){
    if(fruit=='apples'){ // oh shit I got it to work just by having the double = instead, ok JS
        (document.getElementById("demo_reply").innerHTML =
        "Your favorite!");
    }else{
        (document.getElementById("demo_reply").innerHTML =
        "But you want apples...");
    }
}

// now for some very, very rudimentary dialogue
let myChatter = ['I\'m too sleepy for this...', 'I\'m gonna eat all your fruit!', '<em>*rawr*</em>', '*hiccup*'];

function updateChatter(){
    chatter = myChatter[Math.floor(Math.random() * myChatter.length)];
    document.getElementById("dialogue").innerHTML =
        "\"" + chatter + "\"";
}

// sending scores and things to HTML
function updateLevel(){
    document.getElementById("level").innerHTML =
        "Level: " + level;
}

function updateScore(){
    document.getElementById("score").innerHTML =
        "Score: " + score;
}

function updateSpell(){
    let spellText = "";
    for(let i=0; i<player.spells.length; i++){
            spellText += (i+1) + ": " + (player.spells[i] || "") + "<br>";
            // let spellText += (i+1) + ": " + (player.spells[i] || "") + "<br>";
            // for some reason the + sign breaks the whole game at the title screen???
            document.getElementById("powers").innerHTML =
            spellText + "<br>"; // inside the loop, it's replacing the whole thing
        }
    // outside the loop it would be genuinely adding each instance
}

function updateDead(){
    document.getElementById("score").innerHTML = "Score: X";// reset the score
    document.getElementById("level").innerHTML = "Level: ?"; // reset the level
    document.getElementById("powers").innerHTML = "xxx"; // reset the spells
    document.getElementById("demo").innerHTML = "Oh no, my fruits!!!";
    document.getElementById("demo_reply").innerHTML = "ablublublublubbbbuuu...";
    document.getElementById("dialogue").innerHTML = "<em>*gutteral shriek*</em>"
}

function updateReplay(){
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("level").innerHTML = "Level: " + level;
    document.getElementById("powers").innerHTML = "...";
    document.getElementById("demo").innerHTML = "Fruitless...";
    document.getElementById("demo_reply").innerHTML = "";
    document.getElementById("dialogue").innerHTML = "";
}