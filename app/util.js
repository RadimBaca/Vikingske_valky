
/////////////////////////////////////////////
//////////        Utils        //////////////
/////////////////////////////////////////////
function compare_players(p1, p2) {
    if (p1.team == p2.team) {
      if (p1.name < p2.name) return -1;
      else return 1;
    } else {
      if (p1.team < p2.team) return -1;
      else return 1;
    }
  }
  
  function search(json_array, id) {
    for (var i = 0; i < json_array.length; i++)
      if (json_array[i].id == id) return json_array[i];
  }
  
  function search_player(json_array, name) {
    for (var i = 0; i < json_array.length; i++)
      if (json_array[i].name == name) return json_array[i];
  }
  
  function search_team(json_array, id) {
    for (var i = 0; i < json_array.length; i++)
      if (json_array[i].id == id) return json_array[i];
  }
  
  function search_abilities(json_abilities, fame)
  {
    for (var i = json_abilities.length - 1; i >= 0; i--)
    {
      if (fame > json_abilities[i].fame)
        return json_abilities[i];
    }
    return json_abilities[0];
  }
  