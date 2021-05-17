    var active_figure_id="figure17",previous_figure_id="figure17",player_name = "Pirate",game_id="",game_dif;
    let moves = [];
/*This function transform i into 4-digit id*/
function i_to_binary(r){
    r=r.toString(2);
    while(r.length<4) r="0"+r;
    return r;
}

function human_translate(cell){
    
    if(cell[1] == 0) cell="a"+(Number(cell[0])+1)
    else if(cell[1] == 1) cell="b"+(Number(cell[0])+1)
    else if(cell[1] == 2) cell="c"+(Number(cell[0])+1)
    else if(cell[1] == 3) cell="d"+(Number(cell[0])+1)
    return cell
}

/*This function set all images to figure's cells and set to all TD's them functions*/
function set_figures(game_difficulty){
    game_dif=game_difficulty;
    document.getElementsByClassName("game_board")[0].style.display="block";
    document.getElementsByClassName("choose__intro")[0].style.display="none";
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
    for(var i=0;i<chess_cells.length;i++) {
        chess_cells[i].onclick = function(){make_move(this.id, true)}
    }
    start_game(game_difficulty);
}

async function start_game(game_difficulty){
    var url = "http://localhost:8080/game/new"
    const data = {single: {player : player_name, level: game_difficulty}}
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
      if(commits.firstPlayer){
            console.log( commits.firstPlayer + " moves first");
            document.getElementById("first_turn").innerHTML=player_name;
            document.getElementById("second_turn").innerHTML=game_difficulty;
      }
      else {
        console.log("Computer moves first");
        document.getElementById("first_turn").innerHTML=game_difficulty;
        document.getElementById("second_turn").innerHTML=player_name;
          active_figure_id="figure"+commits.nextMove.piece;
          make_move("cell"+commits.nextMove.row+commits.nextMove.column, false)     
}
}

/* This function give clicked cell green color and set active id for make_move function */
function give_figure(given_figure_id){
    if(active_figure_id.replace(/[^0-9]/g,'')!=17) previous_figure_id=active_figure_id;
    if(previous_figure_id.replace(/[^0-9]/g,'')<8) document.getElementById(previous_figure_id).style.backgroundColor="#6786b8";
    else if(previous_figure_id.replace(/[^0-9]/g,'')<16) document.getElementById(previous_figure_id).style.backgroundColor="#d1dced";

    active_figure_id=given_figure_id;
    document.getElementById(given_figure_id).style.backgroundColor="#6dff7b";
}
/* This function makes move by setting figure as background image */
function make_move(cell_id, player_turn){
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
        refresh_status(cell_id,active_figure_id)
    }

    if(player_turn){
        computer_move(active_figure_id, cell_id);
    }
    active_figure_id="figure17";
}

  function rules(){
       var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        span.onclick=function() {  modal.style.display = "none";}
        window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
    }
}
}

async function computer_move(piece, cell){
    var url = "http://localhost:8080/game/"+game_id+"/makemove"
    cell_id = cell.replace(/[^0-9]/g,'');
    piece_id = piece.replace(/[^0-9]/g,'');
    const data = {
        "player": player_name,
        "move" : { "row" : Number(cell_id[0]) , "column" : Number(cell_id[1]), "piece" : Number(piece_id)}
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
      if(commits.gameResult){
        end_game(commits);
      }
      else{
        active_figure_id="figure"+commits.nextMove.piece;
        make_move("cell"+commits.nextMove.row+commits.nextMove.column)   
      }
}

function watch_history(){
    document.getElementsByClassName("chess")[0].style.display="none"
    document.getElementById("moves_menu").style.display="block"
    for(i=0;i<(moves.length/2);i++){
         document.getElementById("move"+(i+1)).textContent=""+moves[i*2]+" to "+moves[i*2+1]
         document.getElementById("move"+(i+1)).onclick=function(){show_move(this.id)}
    }
    for(i=moves.length/2;i<16;i++) {
        document.getElementById("move"+(i+1)).style.display="none"
    }
}

function open_menu(condition){
    document.getElementById("menu_win").innerHTML=condition;
    document.getElementsByClassName("chess")[2].style.display="none"
    document.getElementById("modal_menu").style.display="block"
}

function end_game(commits){
    if(commits.gameResult.isDraw) open_menu("Draw!")
    else if(commits.gameResult.winner) open_menu("You win!")
    else {
        active_figure_id="figure"+commits.nextMove.piece;
        make_move("cell"+commits.nextMove.row+commits.nextMove.column,false)   
        open_menu("You lose")
    }
    if(commits.gameResult.winningLine){
    if(commits.gameResult.winningLine=="leftDiagonal") for(i=0;i<4;i++) document.getElementById("cell"+i+i).style.backgroundColor="green";
    else if(commits.gameResult.winningLine=="rightDiagonal") for(i=0;i<4;i++) document.getElementById("cell"+(3-i)+i).style.backgroundColor="green";
    else if(commits.gameResult.winningLine.row>-1) for(i=0;i<4;i++) document.getElementById(("cell"+commits.gameResult.winningLine.row)+i).style.backgroundColor="green";
    else if(commits.gameResult.winningLine.column>-1) for(i=0;i<4;i++) document.getElementById("cell"+i+commits.gameResult.winningLine.column).style.backgroundColor="green";
    }
    document.getElementsByClassName("chess")[0].style.pointerEvents="none";
    document.getElementsByClassName("chess")[1].style.pointerEvents="none";
    document.getElementById("status").innerHTML="Good Game, Well Played!"
}

function refresh_status(cell_id,figure_id){
    cell_id = human_translate(String(cell_id.replace(/[^0-9]/g,'')));
    figure_id = i_to_binary(Number(figure_id.replace(/[^0-9]/g,'')));
    moves.push(figure_id,cell_id)
    document.getElementById("status").innerHTML="Computer plays "+figure_id+" to "+cell_id;
}

function show_move(move_id){
    var chess_cells = document.getElementById('chess_board').getElementsByTagName('TD');
    for(var i=0;i<chess_cells.length;i++){
        chess_cells[i].style.backgroundImage="";
        if(chess_cells[i].className=="black") chess_cells[i].style.backgroundColor="#6786b8";
        else chess_cells[i].style.backgroundColor="#d1dced"
    }
}

function play_again(){
    document.getElementsByClassName("chess")[0].style.pointerEvents="auto";
    document.getElementsByClassName("chess")[1].style.pointerEvents="auto";
    var chess_cells = document.getElementsByTagName('TD');
    for(var i=0;i<chess_cells.length;i++){
        chess_cells[i].style.backgroundImage="";
        chess_cells[i].style.pointerEvents="auto";
        
        if(chess_cells[i].className=="black") chess_cells[i].style.backgroundColor="#6786b8";
        else chess_cells[i].style.backgroundColor="#d1dced"
    }
    for(var i=0;i<16;i++){
        figure_id="figure"+i;
        pic_link="url('assets/images/" + figure_id;
        pic_link+=".png')"
        figure=document.getElementById(figure_id);
        figure.style.backgroundImage=pic_link;
        figure.onclick = function(){give_figure(this.id)};
        document.getElementById("modal_menu").style.display="none";
        document.getElementById("moves_menu").style.display="none";
        document.getElementsByClassName("chess")[0].style.display="block"
        document.getElementsByClassName("chess")[2].style.display="block"

    }
    moves=[];
    start_game(game_dif)
}