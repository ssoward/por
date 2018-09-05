var playlist = { title: "Ad Test", kind: "MANUAL", playlist: [] };
var master = [];
var firstAlbum = "";
var masterData;
var master = {info:{isMulti:false}, playerList:[], playlists:[]};

function loadLocalJSON(data, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/singleplayer/assets/'+data.albumId+'.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText, data);
        }
    };
    xobj.send(null);
}

function getAlbum(data) {
    masterData = data;
    if(data && Array.isArray(data.albumId)){
        loadMultipleCarousel(data);
    }else {
        loadLocalJSON(data, function (response) {
            var albumJSON = JSON.parse(response);
            init(data, albumJSON);
        });
    }
}

function getVid(pl){
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
    return vid;
}
function addJavascript(jsname,pos) {
    var th = document.getElementsByTagName(pos)[0];
    var s = document.createElement('script');
    s.setAttribute('type','text/javascript');
    s.setAttribute('src',jsname);
    th.appendChild(s);
}
addJavascript('https://code.jquery.com/jquery-3.3.1.min.js','head');

// Get playlist video links
function init(data, playJson) {
    var firstVid = null;
    var firstVidIndex = null;
    var count = 0;

    playJson.data.forEach( function(pl){
        var vid = getVid(pl);

        if(pl.link.indexOf(data.firstId)>-1){
            firstVid = vid;
            firstVidIndex = count;
        }
        count = (count+1);
        playlist.playlist.push(vid);
    });
};

function loadPlaylistDisplay(playlist, data, htmlId, albumId, skipLoad){

    var myVar = setInterval(function(){
        if(!jwplayer){
        }else{
            master.playerList[albumId] = jwplayer(htmlId).setup({
                playlist: playlist,
                advertising: {
                    client: "vast",
                    schedule: data.isAds? (data.randomAds ? "/singleplayer/assets/vmap.xml": "/singleplayer/assets/vmap2.xml"):""
                },
                autostart: data.isStart
            });
            if(skipLoad === undefined) {
                loadCarousel(playlist, "swiper-playlist", ".swiper-container", ".swiper-button-next", ".swiper-button-prev", albumId);
            }
            clearInterval(myVar);
        }
    } ,1000);
}

function addVideoToCarousel(html, pl, count, albumId, uniqueId){
    return '<div style="width: 330px;" class="swiper-slide" id="shelf-item-2" class="jw-widget-item">' +
        '    <div style="cursor: pointer" data-albumId="'+albumId+'" data-mediaid="' + count + '" id="gallery-item-' + uniqueId + '" class="jw-content-image">                                    ' +
        '    <img width="100%" src="' + pl.images.sizes[4].link + '"/>         ' +
        ' <span class="swiper-pagination-current">' + pl.title + '</span>' +
        '    </div>                                                            ' +
        '</div>                                                                ';
}

function isMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function loadCarousel(playlist, id001, id002, id003, id004, albumId){

    var doc = document.getElementById(id001);
    var html = '';
    var count = 1;
    var last = null;

    playlist.playlist.forEach(function (pl) {
        var uniqueId = albumId+'_'+count;
        var vid = addVideoToCarousel(html, pl, count, albumId, uniqueId);
        if(count>1) {
            html = html.concat(vid);
        }else{
            last = vid;
        }
        count = count + 1;
    });
    html = html.concat(last);
    doc.innerHTML = html;

    var next = '';
    var swiper = new Swiper(id002, {
        slidesPerView: isMobile() ? 2 : 5,
        spaceBetween: 10,
        pagination: {
            // el: '.swiper-pagination',
            type: 'fraction',
            clickable: true,
        },
        navigation: {nextEl: id003, prevEl: id004},
    });

    for (var i = (1); i < count; i++) {
        var uniqueId = albumId+'_'+i;
        var str = 'gallery-item-' + uniqueId;
        var e3 = document.getElementById(str);

        e3.addEventListener("click", function (w) {

            //hide all players
            var vids = document.getElementsByTagName('video')
            for( var i = 0; i < vids.length; i++ ){
                vids.item(i).src = '';
            }
            master.playerList.forEach( function(value, key){
                var dd = document.getElementById("playerId"+key);
                if(dd){
                    dd.classList.add("hidden");
                }
            });

            //show player
            var playerCurrent = document.getElementById("playerId"+albumId);
            if(playerCurrent) {
                playerCurrent.classList.remove("hidden");
                playerCurrent.classList.add("visible");
                $('html, body').animate({ scrollTop: playerCurrent.offsetTop }, 'slow');
            }

            //get the video index for playlist
            var index = this.dataset.mediaid - 1;
            //get playlist for this album
            var pl = master.playlists[albumId];

            var t = pl[index];
            //get player for this album
            var m = master.playerList[albumId];
            m.load(t);
            m.on("playlistItem", function () {
                m.play();
            })
        });
    }
}

// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// Multi Carousel
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------

function loadMultipleCarousel(data){
    var albums = {list: data.albumId};
    var firstCarousel = data.albumId[0];
    master.info.isMulti = true;

    // add album title
    firstAlbum = firstCarousel.title;

    data.albumId = firstCarousel.id;
    getAlbum(data);

    var matches = document.getElementsByClassName('swiper-container');
    var doc = matches[0];

    // albums.list.splice(0, 1);

    albums.list.forEach( function(pl){

        //load carousel player
        var player = document.createElement("div");
        player.setAttribute("class", "player-padding hidden player"+pl.id);
        player.setAttribute("id", "playerId"+pl.id);
        player.innerHTML = '<div id="player'+pl.id+'" style="position: relative">hello</div>';
        // player.style.display = "none";

        loadPlaylistDisplay(playlist, masterData, 'player'+pl.id, pl.id, true);

        var titleId = 'carousel'+pl.id;
        var newItem = document.createElement("div");
        newItem.setAttribute("id", titleId);
        newItem.setAttribute("class", "carousel001");
        var textnode = document.createTextNode(pl.title);
        newItem.appendChild(textnode);
        doc.parentNode.insertBefore(newItem, doc.nextSibling);
        newItem.parentNode.insertBefore(player, doc.nextSibling);


        //create carousel html
        var car = document.createElement("div");
        car.setAttribute("id", titleId);
        car.setAttribute("class", "swiper-dynamic swiper-container"+pl.id);
        car.innerHTML = '<div id="swiper-playlist'+pl.id+'" class="swiper-wrapper"> </div> <div class="swiper-button-next swiper-button-next'+pl.id+'"></div> <div class="swiper-button-prev swiper-button-prev'+pl.id+'"></div>';
        newItem.parentNode.insertBefore(car, newItem.nextSibling);


        //get album json
        var d = {albumId: pl.id};
        loadLocalJSON(d, function (response, data) {
            var play = { title: "Ad Test", kind: "MANUAL", playlist: [] };
            var albumJSON = JSON.parse(response);
            albumJSON.data.forEach( function(pl){
                var vid = getVid(pl);
                play.playlist.push(vid);
            });
            master.playlists[data.albumId] = play.playlist;

            loadCarousel(play, "swiper-playlist"+data.albumId,
                ".swiper-container"+data.albumId,
                ".swiper-button-next"+data.albumId,
                ".swiper-button-prev"+data.albumId, data.albumId);
        });
    });
}




