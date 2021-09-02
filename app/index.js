const { remote, ipcRenderer } = require('electron');
const fs = require('fs');



const menu_players = document.getElementById('menu_players');
const menu_season = document.getElementById('menu_season');
const menu_teams = document.getElementById('menu_teams');

const panel_view_players = document.getElementById('panel_view_players');
const button_edit_players = document.getElementById('button_edit_players');
const table_players = document.getElementById('table_players');

const panel_view_teams = document.getElementById('panel_view_teams');
const button_edit_teams = document.getElementById('button_edit_teams');
const table_teams = document.getElementById('table_teams');

const table_season = document.getElementById('table_season');
const button_season = document.getElementById('button_season');
const panel_season_view = document.getElementById('panel_season_view');

const button_season_new = document.getElementById('button_season_new');

const table_season_deaths = document.getElementById('table_season_deaths');
const table_season_gold = document.getElementById('table_season_gold');
const table_season_food = document.getElementById('table_season_food');
const table_season_shield = document.getElementById('table_season_shield');

const panel_test = document.getElementById('panel_test');


// JSON variable
var players = null;
var teams = null;
var roles = null;
var abilities = null;
var last_season = null;





/////////////////////////////////////////////
//////////    Loading panels   //////////////
/////////////////////////////////////////////

// <tr> 
function create_view_player(pl, teams, roles) {
  var tr_player = document.createElement("tr");
  const role = search(roles, pl.role);
  const pl_abilities = search_abilities(abilities[role.id], pl.fame);
  tr_player.setAttribute("class", pl.team);
  if (pl.lives == 0) tr_player.setAttribute("class", pl.team + " dead");
  //pl_abilities.ball_load
  var tr_innerhtml_string = "<td><b>" + pl.name + "</b></td>"
  tr_innerhtml_string += "<td>" + search(teams, pl.team).name + "</td>"
  tr_innerhtml_string += "<td>" + role.name + "</td>"
  tr_innerhtml_string += "<td>" + pl.lives + "</td>";
  tr_innerhtml_string += "<td>" + pl.fame + "</td>";
  // abilities
  tr_innerhtml_string += "<td>" + pl_abilities.level + "</td>";
  tr_innerhtml_string += "<td>";
  if (pl_abilities.throw == 1) tr_innerhtml_string += "Může házet. ";
  if (pl_abilities.ball_load > 0) tr_innerhtml_string += "Může nosit " + pl_abilities.ball_load + " koule. ";
  if (pl_abilities.ball_pick == 1) tr_innerhtml_string += "Může sbírat koule. ";
  if (pl_abilities.shield != "none") tr_innerhtml_string += "Může nosit " + pl_abilities.shield + " štít. ";
  if (pl_abilities.resource_load > 0) tr_innerhtml_string += "Může sbírat suroviny a unese jich " + pl_abilities.resource_load + ".";
  tr_innerhtml_string += "</td>";
  tr_player.innerHTML = tr_innerhtml_string;
  return tr_player;
}

// <tr> team
function create_view_team(team) {
  var tr_team = document.createElement("tr");
  var tr_innerhtml_string = "<td><b>" + team.name + "</b></td>"
  tr_innerhtml_string += "<td>" + team.gold + "</td>";
  tr_innerhtml_string += "<td>" + team.food + "</td>";
  tr_innerhtml_string += "<td>" + team.fame + "</td>";
  tr_team.innerHTML = tr_innerhtml_string;
  return tr_team;
}

function load_seasons() {
  // deaths
  last_season.sort((s1, s2) => {
    return s1.lives < s2.lives ? -1 : 1;
  });
  last_season.every((p) => {
    if (p.lives > 0) return false;
    var tr_deaths = document.createElement("tr");
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
    var pl = search_player(players, p.name);
    if (pl == null) team = "none";
    else team = pl.team;
    var tr_gold = document.createElement("tr");    
    tr_gold.setAttribute("class", team);
    tr_gold.innerHTML = "<td>" + p.name + "</td><td>" + p.gold + "</td><td>" + p.fame + "</td>";
    table_season_gold.appendChild(tr_gold);
    return true;
  });
  // food
  last_season.sort((s1, s2) => {
    return s1.food > s2.food ? -1 : 1;
  });
  last_season.every((p) => {
    if (p.food == 0) return false;
    var pl = search_player(players, p.name);
    if (pl == null) team = "none";
    else team = pl.team;
    var tr_food = document.createElement("tr");
    tr_food.setAttribute("class", team);
    tr_food.innerHTML = "<td>" + p.name + "</td><td>" + p.food + "</td><td>" + p.fame + "</td>";
    table_season_food.appendChild(tr_food);
    return true;
  });
  // shield
  last_season.sort((s1, s2) => {
    return s1.shield_bonus > s2.shield_bonus ? -1 : 1;
  });
  last_season.every((p) => {
    if (p.shield_bonus == 0) return false;
    var pl = search_player(players, p.name);
    if (pl == null) team = "none";
    else team = pl.team;
    var tr_shield = document.createElement("tr");
    tr_shield.setAttribute("class", team);
    tr_shield.innerHTML = "<td>" + p.name + "</td><td>" + p.shield_bonus + "</td><td>" + p.fame + "</td>";
    table_season_shield.appendChild(tr_shield);
    return true;
  });
}

// <tr> season
function create_season(pl) {
  var tr_player = document.createElement("tr");
  tr_player.setAttribute("id", "season")
  tr_player.setAttribute("class", pl.team);
  var tr_player_str = "<td><b>" + pl.name + "</b></td>";
  tr_player_str += "<td><textarea class=\"gold\"></textarea></td>";
  tr_player_str += "<td><textarea class=\"crops\"></textarea></td>";
  tr_player_str += "<td><textarea class=\"shield\"></textarea></td>";
  tr_player_str += "<td><textarea class=\"live\">" + pl.lives + "</textarea></td>";
  tr_player.innerHTML = tr_player_str;
  return tr_player;
}

function loading_panels() {
  players = JSON.parse(fs.readFileSync('./app/players.json').toString());
  teams = JSON.parse(fs.readFileSync('./app/teams.json').toString());
  roles = JSON.parse(fs.readFileSync('./app/roles.json').toString());
  abilities = JSON.parse(fs.readFileSync('./app/abilities.json').toString());
  last_season = JSON.parse(fs.readFileSync('./app/last_season.json').toString());
  players.sort(compare_players);

  //// loading view players panel
  players.forEach((pl) => {
    table_players.appendChild(create_view_player(pl, teams, roles));
  });

  //// loading view team panel
  teams.forEach((team) => {
    table_teams.appendChild(create_view_team(team));
  });

  load_seasons();

}

/////////////////////////////////////////////
/////////     Button  Events    /////////////
/////////////////////////////////////////////
function switch_off_panel() {
  if (actual != "none") {
    document.getElementById(actual).style.display = "none";
  }
}

/////////////////// players
menu_players.addEventListener('click', () => {
  if (actual != "panel_view_players" && actual != "panel_players") {
    switch_off_panel();
    panel_view_players.style.display = 'block';
    actual = "panel_view_players";
  }
});

button_edit_players.addEventListener('click', () => {
  window.location.replace("./edit_players.html");
});

/////////////////// teams
menu_teams.addEventListener('click', () => {
  if (actual != "panel_view_teams" && actual != "panel_teams") {
    switch_off_panel();
    panel_view_teams.style.display = 'block';
    actual = "panel_view_teams";
  }
});

button_edit_teams.addEventListener('click', () => {
  window.location.replace("./edit_teams.html");
});

/////////////////// seasons
menu_season.addEventListener('click', () => {
  if (actual != "panel_season_view") {
    switch_off_panel();
    panel_season_view.style.display = 'block';
    actual = "panel_season_view";
  }
});

button_season_new.addEventListener('click', () => {
  window.location.replace("./new_season_1.html?actual=new");
});

///////////////////////////////////////
///////// Main panel reactions ////////
///////////////////////////////////////


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

// loading parameters
const urlParams = new URLSearchParams(window.location.search);
var actual = urlParams.get('actual');

// loading panels
loading_panels();
// display actual panel
document.getElementById(actual).style.display = 'block';