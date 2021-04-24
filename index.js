function i_to_binary(r){
    r=r.toString(2);
    while(r.length<4) r="0"+r;
    return r;
}

function set_figures(){
    var figure_id,pic_link,figure;
    for(var i=0;i<16;i++){
        figure_id=i_to_binary(i);
        pic_link="url('assets/images/" + figure_id;
        pic_link+=".png')"
        figure=document.getElementById(figure_id);
        figure.style.backgroundImage=pic_link;
        figure.onclick = give_figure(figure_id);
    }
}

function give_figure(figure_id){
    var active_figure=figure_id;
}