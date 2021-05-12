    var active_figure_id,previous_figure_id=0,player_name = "Pirate",game_id="lol";

/*This function transform i into 4-digit id*/
function i_to_binary(r){
    r=r.toString(2);
    while(r.length<4) r="0"+r;
    return r;
}

/*This function set all images to figure's cells and set to all TD's them functions*/
function set_figures(){
    var figure_id,pic_link,figure;
    for(var i=0;i<16;i++){
        figure_id="figure"+i;
        pic_link="url('assets/images/" + figure_id;
        pic_link+=".png')"
        figure=document.getElementById(figure_id);
        figure.style.backgroundImage=pic_link;
        figure.onclick = function(){give_figure(this.id)};
    }

    var chess_cells = document.getElementById('chess_board').getElementsByTagName('TD');
    for(var i=0;i<chess_cells.length;i++) chess_cells[i].onclick = function(){make_move(this.id, true)}
    start_game();
}

async function start_game(){
    var url = "http://localhost:8080/game/new"
    const data = {single: {player : player_name}}
    const response = await fetch(url, {
        method: 'post',
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
        
      })
      
      let commits = await response.json();
      game_id = commits.gameId;
      if(commits.firstPlayer) console.log( commits.firstPlayer + " moves first");
      else {
        console.log("Computer moves first");
          active_figure_id="figure"+commits.nextMove.piece;
          make_move("cell"+commits.nextMove.row+commits.nextMove.column, false)     
}
}

/* This function give clicked cell green color and set active id for make_move function */
function give_figure(given_figure_id){
    if(active_figure_id!==0) previous_figure_id=active_figure_id;
    //if(previous_figure_id/1000 <1) document.getElementById(previous_figure_id).style.backgroundColor="#6786b8";
    //else if(previous_figure_id) document.getElementById(previous_figure_id).style.backgroundColor="#d1dced";

    active_figure_id=given_figure_id;
    document.getElementById(given_figure_id).style.backgroundColor="#6dff7b";
}
/* This function makes move by setting figure as background image */
function make_move(cell_id, player_turn){
    console.log(cell_id);
    if(active_figure_id!==-1){
        var picture_path="url('assets/images/" + active_figure_id;
        picture_path+=".png')"
        active_figure=document.getElementById(active_figure_id);
        active_cell=document.getElementById(cell_id);
        active_cell.style.backgroundImage=picture_path;
        active_figure.style.backgroundImage="";
        active_cell.style.pointerEvents="none";
        active_figure.style.pointerEvents="none";
        active_figure.style.backgroundColor="#2e3b51";   
    }
    if(player_turn){
        computer_move(active_figure_id, cell_id);
    }
    active_figure_id=-1;
}

  function rules(){
            
      }

async function computer_move(piece, cell){
    var url = "http://localhost:8080/game/"+game_id+"/makemove"
    celll_id = cell.replace(/[^0-9]/g,'');
    piecee_id = piece.replace(/[^0-9]/g,'');
    const data = {
        "player": player_name,
        "move" : { "row" : Number(celll_id[0]) , "column" : Number(celll_id[1]), "piece" : Number(piecee_id)}
        }
    const response = await fetch(url, {
        method: 'PUT',
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
        
      })
      
      let commits = await response.json();
          active_figure_id="figure"+commits.nextMove.piece;
          make_move("cell"+commits.nextMove.row+commits.nextMove.column)            
}