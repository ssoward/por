var playlist = { title: "Ad Test", kind: "MANUAL", playlist: [] };

!function () {
    var image = Math.floor(Math.random() * 3)+1;
    var imgSrc = '/singleplayer/assets/loading-'+image+'.jpg';
    var doc = document.getElementById("image");
    var x = document.createElement("IMG");
    x.setAttribute("src", imgSrc);
    x.setAttribute("width", "100%");
    doc.appendChild(x);
}();

window.addEventListener("load", function(){
    document.getElementById("loading-image").src = "/singleplayer/assets/Professor-of-Rock-Footer-Icon.png?cb=125";
    setTimeout(function(){
        document.getElementById("loading-image").style.display = "block";
    }, 1);
});

function loadJSON(data, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/singleplayer/assets/'+data.albumId+'.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function getAlbum(data) {
    loadJSON(data, function(response) {
        var albumJSON = JSON.parse(response);
        getAlbum2(data, albumJSON);
    });
}

function getAlbum2(data, playJson) {
    var firstVid = null;
    var firstVidIndex = null;
    var count = 0;

    playJson.data.forEach( function(pl){
        var vid =  {
            description: pl.description,
            tags: pl.tags,
            title: pl.name,
            image: pl.pictures.sizes[3].link,
            images: pl.pictures,
            sources: [
                {
                    title: pl.name,
                    file: pl.files[4].link
                },
            ]};

        if(pl.link.indexOf(data.firstId)>-1){
            firstVid = vid;
            firstVidIndex = count;
        }
        count = (count+1);
        playlist.playlist.push(vid);
    });

    //Set first song
    if(firstVid){
        playlist.playlist.splice(firstVidIndex, 1);
        playlist.playlist.unshift(firstVid);
    }
    loadPlaylistDisplay(playlist, data);
};

var master = [];

function loadPlaylistDisplay(playlist, data){
    jwplayer("player").setup({
        playlist: playlist,
        advertising: {
            client: "vast",
            schedule: data.isAds? (data.randomAds ? "assets/vmap.xml": "/ad/assets/vmap2.xml"):""
        },
        autostart: data.isStart
    });
}

