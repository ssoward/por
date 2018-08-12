var playlist = { title: "Ad Test", kind: "MANUAL", playlist: [] };
var master = [];

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

function loadLocalJSON(data, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/singleplayer/assets/'+data.albumId+'.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function getAlbum(data) {
    loadLocalJSON(data, function(response) {
        var albumJSON = JSON.parse(response);
        init(data, albumJSON);
    });
}

function init(data, playJson) {
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
var m;

function loadPlaylistDisplay(playlist, data){
    m = jwplayer("player").setup({
        playlist: playlist,
        advertising: {
            client: "vast",
            schedule: data.isAds? (data.randomAds ? "assets/vmap.xml": "/ad/assets/vmap2.xml"):""
        },
        autostart: data.isStart
    });
    master = playlist;
    loadCarousel(playlist, data);
}

function loadCarousel(playlist, data){
    var doc = document.getElementById("swiper-playlist");
    var html = '';
    var count = 1;

    playlist.playlist.forEach(function (pl) {
        html = html.concat(
            '<div style="width: 330px;" class="swiper-slide" id="shelf-item-2" class="jw-widget-item">' +
            '    <div style="cursor: pointer" data-mediaid="' + count + '" id="gallery-item-' + count + '" class="jw-content-image">                                    ' +
            '    <img width="100%" src="' + pl.images.sizes[4].link + '"/>         '+
            ' <span class="swiper-pagination-current">'+pl.title+'</span>'+
            '    </div>                                                            '+
            '</div>                                                                ');
        count = count + 1;
    });
    doc.innerHTML = html;

    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 2,
        spaceBetween: 10,
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
            clickable: true,
        },
        navigation: {nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev',},
    });

    for (var i = 1; i < count; i++) {
        var str = 'gallery-item-' + i;
        var e3 = document.getElementById(str);
        e3.addEventListener("click", function (w) {
            var index = this.dataset.mediaid - 1;
            var t = master.playlist[index];
            // master.playlist.splice(index, 1);
            // master.playlist.unshift(t);
            m.load(t);
            m.on("playlistItem", function () {
                m.play();
            })
        });
    }
}

