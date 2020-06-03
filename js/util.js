function tryTo(description, callback){
    for(let timeout=1000;timeout>0;timeout--){
        if(callback()){
            return;
        }
    }
    throw 'Timeout while trying to '+description;
}


function randomRange(min, max){
    return Math.floor(Math.random()*(max-min+1))+min;
} // makes sure we start on a floor tile but also not get stuck in a loop finding one

function shuffle(arr){
    let temp, r;
    for (let i = 1; i < arr.length; i++) {
        r = randomRange(0,i);
        temp = arr[i];
        arr[i] = arr[r];
        arr[r] = temp;
    }
    return arr;
} // a "fisher-yates shuffle", a random swap in the tiles to get a perfectly shuffled array

// displays the scoreboard in a table
function rightPad(textArray){
    let finalText = "";
    textArray.forEach(text => {
        text+="";
        for(let i=text.length;i<15;i++){ // table spacing
            text+=" ";
        }
        finalText += text;
    });
    return finalText;
}
// end of scoreboard