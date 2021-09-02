const fs = require('fs');


const panel_season_lives = document.getElementById('panel_season_lives');

const button_confirm = document.getElementById('button_confirm');
const button_back = document.getElementById('button_back');


// JSON variable
var last_season = null;
var players = null;
var teams = null;
var abilities = null;


/////////////////////////////////////////////
//////////    Loading panels   //////////////
/////////////////////////////////////////////


function load_seasons() {
  var prev_team = '';
  var team_table = null;
  var div = null;
  var food_sum = 0;
  players.forEach(p => {
    if (prev_team != p.team) {
      if (food_sum > 0)    
      {
        div.lastChild.lastChild.innerHTML = food_sum;
        food_sum = 0;
      }
      var h3 = document.createElement('h3');
      t = search_team(teams, p.team);
      h3.setAttribute('class', t.id);
      h3.innerHTML = t.name;      
      panel_season_lives.appendChild(h3);
      div = document.createElement('div');
      div.setAttribute('class', t.id);
      div.setAttribute('id', 'team');
      panel_season_lives.appendChild(div);
      team_table = document.createElement('table');
      team_table.innerHTML = "<tr><th>Name</th><th>Season food</th><th>Feed</th><th>Lives</th></tr>";      
      div.appendChild(team_table);
      var team_summary = document.createElement('div');
      team_summary.setAttribute("class", "panel")
      team_summary.innerHTML = "<label>Actual team food: </label><label>" + t.food + "</label><br/><label>Season food: </label><label>0</label>";
      div.appendChild(team_summary);
    }
    if (p.lives > 0) {
      if (p.fame == 0)
        food_sum = food_sum + 1;
      else
        food_sum = food_sum + p.fame;
      var tr = document.createElement('tr');
      tr.setAttribute("id", "values");
      tr.innerHTML = "<td>" + p.name + "</td><td>" + p.fame + 
        "</td><td><input id=\"live_check\" type=\"checkbox\" name=\"lives\" value=\"1\" checked></td><td>" + p.lives + "</td>";
    } else
    {
      food_sum = food_sum + 1;
      var tr = document.createElement('tr');
      tr.innerHTML = "<td>" + p.name + "</td><td>" + 1 + "</td><td>Resurection</td>";
    }
    tr.lastChild.previousSibling.lastChild.addEventListener("change", (e) => {
      var team_fame_sum_element = e.target.parentElement.parentElement.parentElement.parentElement.lastChild.lastChild;
      //log.console(team_fame_sum_element.innerHTML);
      var fame = e.target.parentElement.previousElementSibling.innerHTML;
      if (fame == 0) fame = 1;
      if (e.target.checked) {
        team_fame_sum_element.innerHTML = Number(team_fame_sum_element.innerHTML) + Number(fame);
      } else {
        team_fame_sum_element.innerHTML = Number(team_fame_sum_element.innerHTML) - Number(fame);
      }
    });
    team_table.appendChild(tr);
    prev_team = p.team;
  });
  if (food_sum > 0)    
  {
    div.lastChild.lastChild.innerHTML = food_sum;
    food_sum = 0;
  }  
}


function loading_panels() {
  players = JSON.parse(fs.readFileSync('./app/players_temp.json').toString());
  teams = JSON.parse(fs.readFileSync('./app/teams_temp.json').toString());
  last_season = JSON.parse(fs.readFileSync('./app/last_season_temp.json').toString());
  abilities = JSON.parse(fs.readFileSync('./app/abilities.json').toString());

  players.sort(compare_players);
  //// loading season panel
  load_seasons();
}

/////////////////////////////////////////////
/////////     Button  Events    /////////////
/////////////////////////////////////////////

button_back.addEventListener('click', () => {
  window.location.replace("./new_season_2.html?actual=back");
});

///////////////////////////////////////
///////// Main panel reactions ////////
///////////////////////////////////////


///////////////////// Season computation
button_confirm.addEventListener('click', () => {
  var team_array = document.querySelectorAll("div#team");
  team_array.forEach(t => {
    players_array = t.firstChild.querySelectorAll("tr#values");
    players_array.forEach(p => {;
      jp = search_player(players, p.firstChild.innerHTML);
      if (p.children[2].innerHTML != "Resurection" && !p.children[2].firstChild.checked)
      {
        jp.lives = jp.lives - 1;
      }
    });
    jt = search_team(teams, t.getAttribute("class"));
    console.log(t.lastChild.children[4].innerHTML);
    jt.food = jt.food - Number(t.lastChild.children[4].innerHTML);
  });

  fs.writeFileSync('./app/players.json', JSON.stringify(players), function (err) {
    if (err) throw err;
  });
  fs.writeFileSync('./app/teams.json', JSON.stringify(teams), function (err) {
    if (err) throw err;
  });
  fs.writeFileSync('./app/last_season_temp.json', JSON.stringify(last_season), function (err) {
    if (err) throw err;
  });
  fs.writeFileSync('./app/last_season.json', JSON.stringify(last_season), function (err) {
    if (err) throw err;
  });
  window.location.replace("./index.html?actual=panel_season_view");
});


///////////////////////////////////////
/////////        Init          ////////
///////////////////////////////////////

// loading panels
loading_panels();
