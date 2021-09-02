const { remote, ipcRenderer } = require('electron');
const fs = require('fs');


const panel_season_confirm = document.getElementById('panel_season_confirm');

const button_confirm = document.getElementById('button_confirm');
const button_back = document.getElementById('button_back');

const table_season_deaths = document.getElementById('table_season_deaths');
const table_season_gold = document.getElementById('table_season_gold');
const table_season_food = document.getElementById('table_season_food');
const table_season_shield = document.getElementById('table_season_shield');
const table_season_kills = document.getElementById('table_season_kills');

// JSON variable
var last_season = null;



/////////////////////////////////////////////
//////////    Loading panels   //////////////
/////////////////////////////////////////////


function load_seasons() {
  // deaths
  last_season.sort((s1, s2) => {
    return s1.lives < s2.lives ? -1 : 1;
  });
  last_season.every((p) => {
    if (p.lives > 0) return false;
    var tr_deaths = document.createElement("tr");
    tr_deaths.setAttribute('id', 'death');
    tr_deaths.innerHTML = "<td>" + p.name + "</td>";
    table_season_deaths.appendChild(tr_deaths);
    return true;
  });
  // gold
  last_season.sort((s1, s2) => {
    return s1.gold > s2.gold ? -1 : 1;
  });
  last_season.every((p) => {
    if (p.gold == 0) return false;
    var tr_gold = document.createElement("tr");
    tr_gold.setAttribute("class", search_player(players, p.name).team);
    tr_gold.setAttribute('id', 'gold');
    tr_gold.innerHTML = "<td>" + p.name + "</td><td>" + p.gold + "</td><td><textarea class=\'divedit\'>" + p.fame + "</textarea></td>";
    table_season_gold.appendChild(tr_gold);
    return true;
  });
  // food
  last_season.sort((s1, s2) => {
    return s1.food > s2.food ? -1 : 1;
  });
  last_season.every((p) => {
    if (p.food == 0) return false;
    var tr_food = document.createElement("tr");
    tr_food.setAttribute("class", search_player(players, p.name).team);
    tr_food.setAttribute('id', 'food');
    tr_food.innerHTML = "<td>" + p.name + "</td><td>" + p.food + "</td><td><textarea class=\'divedit\'>" + p.fame + "</textarea></td>";
    table_season_food.appendChild(tr_food);
    return true;
  });
  // shield
  last_season.sort((s1, s2) => {
    return s1.shield_bonus > s2.shield_bonus ? -1 : 1;
  });
  last_season.every((p) => {
    if (p.shield_bonus == 0) return false;
    var tr_shield = document.createElement("tr");
    tr_shield.setAttribute("class", search_player(players, p.name).team);
    tr_shield.setAttribute('id', 'shield');
    tr_shield.innerHTML = "<td>" + p.name + "</td><td>" + p.shield_bonus + "</td><td><textarea class=\'divedit\'>" + p.fame + "</textarea></td>";
    table_season_shield.appendChild(tr_shield);
    return true;
  });
  // kills
  last_season.sort((s1, s2) => {
    return s1.kills > s2.kills ? -1 : 1;
  });
  last_season.every((p) => {
    if (p.kills == 0) return false;
    var tr_shield = document.createElement("tr");
    tr_shield.setAttribute("class", search_player(players, p.name).team);
    tr_shield.setAttribute('id', 'kills');
    tr_shield.innerHTML = "<td>" + p.name + "</td><td>" + p.kills + "</td><td><textarea class=\'divedit\'>" + p.fame + "</textarea></td>";
    table_season_kills.appendChild(tr_shield);
    return true;
  });
}


function loading_panels() {
  players = JSON.parse(fs.readFileSync('./app/players.json').toString());
  last_season = JSON.parse(fs.readFileSync('./app/last_season_temp.json').toString());

  //// loading season panel
  load_seasons();

}

/////////////////////////////////////////////
/////////     Button  Events    /////////////
/////////////////////////////////////////////

button_back.addEventListener('click', () => {
  window.location.replace("./new_season_1.html?actual=back");
});

///////////////////////////////////////
///////// Main panel reactions ////////
///////////////////////////////////////


///////////////////// Season computation
button_confirm.addEventListener('click', () => {
  players = JSON.parse(fs.readFileSync('./app/players.json').toString());
  teams = JSON.parse(fs.readFileSync('./app/teams.json').toString());

  // gold
  tr_golds = document.querySelectorAll('tr#gold')
  tr_golds.forEach((tr) => {
    var player_name = tr.children[0].innerHTML;
    var player_gold = Number(tr.children[1].innerHTML);
    var player_fame = Number(tr.children[2].firstChild.value);
    var player = search_player(players, player_name);
    player.fame = player.fame + player_fame;
    var team = search_team(teams, player.team);
    team.gold = team.gold + player_gold;
  });

  // food
  tr_golds = document.querySelectorAll('tr#food')
  tr_golds.forEach((tr) => {
    var player_name = tr.children[0].innerHTML;
    var player_food = Number(tr.children[1].innerHTML);
    var player_fame = Number(tr.children[2].firstChild.value);
    var player = search_player(players, player_name);
    player.fame = player.fame + player_fame;
    var team = search_team(teams, player.team);
    team.food = team.food + player_food;
  });

  // shield
  tr_golds = document.querySelectorAll('tr#shield')
  tr_golds.forEach((tr) => {
    var player_name = tr.children[0].innerHTML;
    var player_shield = Number(tr.children[1].innerHTML);
    var player_fame = Number(tr.children[2].firstChild.value);
    var player = search_player(players, player_name);
    player.fame = player.fame + player_fame;
    var team = search_team(teams, player.team);
    team.shield_bonus = team.shield_bonus + player_shield;
  });

  // kills
  tr_kills = document.querySelectorAll('tr#kills')
  tr_kills.forEach((tr) => {
    var player_name = tr.children[0].innerHTML;
    var player_kills = Number(tr.children[1].innerHTML);
    var player_fame = Number(tr.children[2].firstChild.value);
    var player = search_player(players, player_name);
    player.fame = player.fame + player_fame;
    var team = search_team(teams, player.team);
    team.shield_bonus = team.shield_bonus + player_kills;
  });

  // lives
  last_season.forEach((p) => {
    var player = search_player(players, p.name);
    if (p.lives == 0) {
      var team = search_team(teams, player.team);
      team.fame = team.fame + player.fame;
    }
    player.lives = p.lives;
  });

  fs.writeFileSync('./app/players_temp.json', JSON.stringify(players), function (err) {
    if (err) throw err;
  });
  fs.writeFileSync('./app/teams_temp.json', JSON.stringify(teams), function (err) {
    if (err) throw err;
  });
  fs.writeFileSync('./app/last_season_temp.json', JSON.stringify(last_season), function (err) {
    if (err) throw err;
  });
  fs.writeFileSync('./app/last_season.json', JSON.stringify(last_season), function (err) {
    if (err) throw err;
  });
  window.location.replace("./new_season_3.html");
});

// Priklad IP komunikace
// button_load.addEventListener('click', () => {
//   const players = JSON.parse(fs.readFileSync('./app/players.json').toString());
//   ipcRenderer.invoke('file-read', './app/players.json').then((players) => {
//     // creating content of the table
//     players.forEach((pl) => {
//       // TODO
//     });
//   });
// });


///////////////////////////////////////
/////////        Init          ////////
///////////////////////////////////////

// loading panels
loading_panels();
