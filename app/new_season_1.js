const { remote, ipcRenderer } = require('electron');
const fs = require('fs');


const button_evaluate = document.getElementById('button_evaluate');
const button_cancel = document.getElementById('button_cancel');

// JSON variable
var last_season = null;
var players = null;



/////////////////////////////////////////////
//////////    Loading panels   //////////////
/////////////////////////////////////////////


// <tr> season
function new_create_season(pl) {
    var tr_player = document.createElement("tr");
    tr_player.setAttribute("id", "season")
    tr_player.setAttribute("class", pl.team);
    var tr_player_str = "<td><b>" + pl.name + "</b></td>";
    tr_player_str += "<td><textarea class=\"gold\"></textarea></td>";
    tr_player_str += "<td><textarea class=\"crops\"></textarea></td>";
    tr_player_str += "<td><textarea class=\"shield\"></textarea></td>";
    tr_player_str += "<td><textarea class=\"kills\"></textarea></td>";
    tr_player_str += "<td><textarea class=\"live\">" + pl.lives + "</textarea></td>";
    tr_player.innerHTML = tr_player_str;
    return tr_player;
}

// <tr> season
function create_season(pl) {
    var tr_player = document.createElement("tr");
    tr_player.setAttribute("id", "season")
    tr_player.setAttribute("class", search_player(players, pl.name).team);
    var tr_player_str = "<td><b>" + pl.name + "</b></td>";
    tr_player_str += "<td><textarea class=\"gold\">" + pl.gold + "</textarea></td>";
    tr_player_str += "<td><textarea class=\"crops\">" + pl.food + "</textarea></td>";
    tr_player_str += "<td><textarea class=\"shield\">" + pl.shield_bonus + "</textarea></td>";
    tr_player_str += "<td><textarea class=\"kills\">" + pl.kills + "</textarea></td>";
    tr_player_str += "<td><textarea class=\"live\">" + pl.lives + "</textarea></td>";
    tr_player.innerHTML = tr_player_str;
    return tr_player;
}

function loading_panels() {
    players = JSON.parse(fs.readFileSync('./app/players.json').toString());
    last_season = JSON.parse(fs.readFileSync('./app/last_season_temp.json').toString());


    if (actual == "new") {
        //// loading season panel
        players.sort(compare_players);
        players.forEach((pl) => {
            if (pl.lives > 0)
                table_season.appendChild(new_create_season(pl));
        });
    } else
    {
        last_season.forEach((pl) => {
            table_season.appendChild(create_season(pl));
        });
    }

}

/////////////////////////////////////////////
/////////     Button  Events    /////////////
/////////////////////////////////////////////
function switch_off_panel() {
    if (actual != "none") {
        document.getElementById(actual).style.display = "none";
    }
}

button_cancel.addEventListener('click', () => {
    last_season = JSON.parse(fs.readFileSync('./app/last_season.json').toString());
    fs.writeFileSync('./app/last_season_temp.json', JSON.stringify(last_season), function (err) {
        if (err) throw err;
    });
    window.location.replace("./index.html?actual=panel_season_view");
});

///////////////////////////////////////
///////// Main panel reactions ////////
///////////////////////////////////////

///////////////////// Season computation
button_evaluate.addEventListener('click', () => {
    var ts = document.querySelectorAll("#season");
    var validation_alert = false;
    //console.log(ts);
    last_season = [];
    ts.forEach((pl) => {
        var lives = pl.childNodes[5].firstChild.value;
        if (typeof lives === "undefined" || Number(lives) < 0 || Number(lives) > 20 || lives.trim() == "") {
            alert('The lives value has to be in the range 0 - 20');
            validation_alert = true;
            return false;
        }
        last_season.push({
            "name": pl.firstChild.firstChild.innerHTML,
            "gold": Number(pl.childNodes[1].firstChild.value),
            "food": Number(pl.childNodes[2].firstChild.value),
            "shield_bonus": Number(pl.childNodes[3].firstChild.value),
            "kills": Number(pl.childNodes[4].firstChild.value),
            "lives": Number(lives),
            "fame" : 0
        });
    });
    if (!validation_alert) {
        last_season.sort((s1, s2) => {
            return s1.gold > s2.gold ? -1 : 1;
        });
        var i = 4;
        var prev = -1;
        last_season.every((s) => {
            if (prev != s.gold) i = i - 1;
            if (i == 0 || s.gold == 0 || s.gold == null) return false;      
            prev = s.gold;
            s.fame = i; 
            return true;
        });
        last_season.sort((s1, s2) => {
            return s1.food > s2.food ? -1 : 1;
        });        
        i = 4;
        prev = -1;
        last_season.every((s) => {
            if (prev != s.food) i = i - 1;
            if (i == 0 || s.food == 0 || s.food == null) return false;                         
            prev = s.food;
            s.fame = i; 
            return true;
        });
        last_season.sort((s1, s2) => {
            return s1.shield_bonus > s2.shield_bonus ? -1 : 1;
        });        
        i = 4;
        prev = -1;
        last_season.every((s) => {
            if (prev != s.shield_bonus) i = i - 1;
            if (i == 0 || s.shield_bonus == 0 || s.shield_bonus == null) return false;         
            prev = s.shield_bonus;
            s.fame = i; 
            return true;
        });    
        last_season.sort((s1, s2) => {
            return s1.kills > s2.kills ? -1 : 1;
        });        
        i = 4;
        prev = -1;
        last_season.every((s) => {
            if (prev != s.kills) i = i - 1;
            if (i == 0 || s.kills == 0 || s.kills == null) return false;         
            prev = s.kills;
            s.fame = i; 
            return true;
        });     

        fs.writeFileSync('./app/last_season_temp.json', JSON.stringify(last_season), function (err) {
            if (err) throw err;
        });
        window.location.replace("./new_season_2.html");
    }
});


///////////////////////////////////////
/////////        Init          ////////
///////////////////////////////////////

// loading parameters
const urlParams = new URLSearchParams(window.location.search);
var actual = urlParams.get('actual');

// loading panels
loading_panels();
