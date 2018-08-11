
var playlist = { title: "Ad Test", kind: "MANUAL", playlist: [] };
var accessToken = '8aeb6aa949835168b5d8c1b863227828';
var clientId = '5b2edc639552e6c9b16335e31c1b0e86';
var userId = 46710998;

function addImage(imgScr) {
    var doc = document.getElementById("image");
    var x = document.createElement("IMG");
    x.setAttribute("src", imgScr);
    x.setAttribute("width", "100%");
    doc.appendChild(x);
}

function getAlbum(data) {
    var albumId = data.albumId;
    var vimeoUrl = 'https://api.vimeo.com/users/46710998/albums/'+albumId+'/videos?client_id=5b2edc639552e6c9b16335e31c1b0e86';
    var e = new XMLHttpRequest;
    if(data.firstImg){
        // addImage(data.firstImg);
        setTimeout(function(){
            document.getElementById("loading-image").style.display = "block";
        }, 1);
    }
    e.onreadystatechange = function() {
        if(4 === e.readyState && e.status >= 200){
            var firstVid = null;
            var firstVidIndex = null;
            var count = 0;

            var playJson = JSON.parse(e.responseText);
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
        }
    };
    e.open("GET", vimeoUrl );
    e.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.4");
    e.setRequestHeader("Content-Type", "application/vnd.vimeo.*+json");
    e.setRequestHeader("Authorization", "Bearer "+accessToken);
    e.send();
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

