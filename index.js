    var active_figure_id,previous_figure_id=0;

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
        figure_id=i_to_binary(i);
        pic_link="url('assets/images/" + figure_id;
        pic_link+=".png')"
        figure=document.getElementById(figure_id);
        figure.style.backgroundImage=pic_link;
        figure.onclick = function(){give_figure(this.id)};
    }

    var chess_cells = document.getElementById('chess_board').getElementsByTagName('TD');
    for(var i=0;i<chess_cells.length;i++) chess_cells[i].onclick = function(){make_move(this.id)}
}
/* This function give clicked cell green color and set active id for make_move function */
function give_figure(given_figure_id){
    if(active_figure_id!==0) previous_figure_id=active_figure_id;
    if(previous_figure_id/1000 <1) document.getElementById(previous_figure_id).style.backgroundColor="#6786b8";
    else if(previous_figure_id) document.getElementById(previous_figure_id).style.backgroundColor="#d1dced";

    active_figure_id=given_figure_id;
    document.getElementById(given_figure_id).style.backgroundColor="#6dff7b";
}
/* This function makes move by setting figure as background image */
function make_move(cell_id){
    if(active_figure_id!==0){
        var picture_path="url('assets/images/" + active_figure_id;
        picture_path+=".png')"
        active_figure=document.getElementById(active_figure_id);
        active_cell=document.getElementById(cell_id);
        active_cell.style.backgroundImage=picture_path;
        active_figure.style.backgroundImage="";
        active_cell.style.pointerEvents="none";
        active_figure.style.pointerEvents="none";
        active_figure.style.backgroundColor="#2e3b51";
        active_figure_id=0;
    }
}

function rules(){
    //window.open("")
}