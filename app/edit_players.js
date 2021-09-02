const { remote, ipcRenderer } = require('electron');
const fs = require('fs');


const div_players = document.getElementById('div_players');
const button_players = document.getElementById('button_players');
const button_add_players = document.getElementById('button_add_players');
const button_cancel_players = document.getElementById('button_cancel_players');


// JSON variable
var players = null;
var teams = null;
var roles = null;


/////////////////////////////////////////////
//////////    Loading panels   //////////////
/////////////////////////////////////////////
// <div id='player'>
function create_player(pl, teams, roles) {
  var div_player = document.createElement("div");
  div_player.setAttribute("id", "player");
  div_player.setAttribute("class", pl.team);
  var div_html_string = "<textarea class=\'divedit_str\'>" + pl.name + "</textarea>"
  div_html_string += "<select name = \"teams\">";
  teams.forEach((team) => {
    div_html_string += "<option value = \'" + team.id + "\' ";
    if (team.id == pl.team) div_html_string += " selected";
    div_html_string += ">" + team.name + "</option>";
  });
  div_html_string += "</select>"
  div_html_string += "<select name = \"roles\">";
  roles.forEach((role) => {
    div_html_string += "<option value = \'" + role.id + "\' ";
    if (role.id == pl.role) div_html_string += " selected";
    div_html_string += ">" + role.name + "</option>";
  });
  div_html_string += "</select>";
  div_html_string += "<textarea class=\'divedit\'>" + pl.lives + "</textarea>";
  div_html_string += "<textarea class=\'divedit\'>" + pl.fame + "</textarea>";
  div_player.innerHTML = div_html_string;
  var remove_button = document.createElement("button");
  remove_button.setAttribute("class", "remove")
  remove_button.innerHTML = "Remove";
  remove_button.addEventListener("click", (e) => {
    e.target.parentElement.remove();
  })
  div_player.appendChild(remove_button)
  return div_player;
}


function loading_panels() {
  players = JSON.parse(fs.readFileSync('./app/players.json').toString());
  teams = JSON.parse(fs.readFileSync('./app/teams.json').toString());
  roles = JSON.parse(fs.readFileSync('./app/roles.json').toString());
  players.sort(compare_players);

  //// loading edit players panel
  players.forEach((pl) => {
    div_players.appendChild(create_player(pl, teams, roles));
  });

}


///////////////////////////////////////
///////// Main panel reactions ////////
///////////////////////////////////////

///////////////////// Players
button_players.addEventListener('click', () => {
  var players_div = document.querySelectorAll("div#player");
  var json_players = [];
  players_div.forEach((pl) => {
    json_players.push({ "name": pl.children[0].value, "team": pl.children[1].value, "role": pl.children[2].value, "lives": Number(pl.children[3].value), "fame": Number(pl.children[4].value) });
  });
  //console.log(json_players);
  fs.writeFileSync('./app/players.json',
    JSON.stringify(json_players),
    function (err) {
      if (err) throw err;
    });
  window.location.replace("./index.html?actual=panel_view_players");
});

button_cancel_players.addEventListener('click', () => {
  window.location.replace("./index.html?actual=panel_view_players");
});

button_add_players.addEventListener('click', () => {
  div_players.appendChild(create_player({ name: "", team: "", role: "", lives: 3, fame: 0 }, teams, roles));
});



///////////////////////////////////////
/////////        Init          ////////
///////////////////////////////////////

// loading panels
loading_panels();
