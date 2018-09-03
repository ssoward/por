//Run this script to update all Vimeo albums
//To run: node albumJob.js
//all updates saved to albums/*.json

var playlist = { title: "Ad Test", kind: "MANUAL", playlist: [] };
var accessToken = '8aeb6aa949835168b5d8c1b863227828';
// var accessToken = '6d9e10dd242b50511b1a2f7aa920cb78';
// var accessToken = 'c25a2dcaf09f8625bada29935179926d';
var userId = 46710998;

var fs = require('fs');
const url = require('url');
var request = require('request');
var figlet = require('figlet');

function getAlbumId(adr) {
    var q = url.parse(adr, true);
    var r = q.pathname.split('/');
    var id = r[4];
    return id;
}

var options = {
    url: 'https://api.github.com/repos/request/request',
    headers: {
        'User-Agent': 'request',
        'Accept': 'application/vnd.vimeo.*+json;version=3.4',
        'Content-Type': 'application/vnd.vimeo.*+json',
        'Authorization': 'Bearer '+accessToken
    }
};

function logError(error, response, body) {
    console.log('ERROR --------------------------------------------------------');
    console.log('Body:');
    console.log(body);
    console.log(response);
    console.log('Error:');
    console.log(error);
    console.log('ERROR --------------------------------------------------------');
}

var albumMap = [];
function callbackAlbum(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        var id = getAlbumId(info.paging.first);
        if(info.paging.next){
            var url = 'https://api.vimeo.com'+ info.paging.next
            console.log('Fetching next page for album ID: '+ id);
            options.url = url;
            request(options, callbackAlbum);
        }

        //Add previous pages to this list of videos for album ID
        if(albumMap.hasOwnProperty(id)){
            // info.data = info.data.concat(albumMap[id]);
            info.data = albumMap[id].concat(info.data);
        }
        albumMap[id] = info.data;

        fs.writeFile('albums/'+id+'.json', JSON.stringify(info), function (err) {
            if (err) console.log(err);
            console.log('Created albumId: ' + id +' video count: '+ info.data.length);
        });
    }
    else{
        console.log('67 ERROR --------------------------------------------------------');
        logError(error, response, body);
    }
}

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        if(info.data){
            info.data.forEach(function(albumURI){
                // if(albumURI.uri.indexOf('5299853')>-1) {
                var url = 'https://api.vimeo.com' + albumURI.uri + '/videos?sort=manual';
                console.log('--------------------------------------------------------');
                console.log('Fetching Album: ' + albumURI.name);
                options.url = url;
                request(options, callbackAlbum);
                // }
            })
        }
    }

    else if (!error && response.statusCode == 429) {
        console.log('--------------------------------------------------------');
        console.log(figlet.textSync('TOO MANY REQUEST'));
        console.log('To Vimeo server. You\'ll need to wait 24 hours or toggle users.');
        console.log('--------------------------------------------------------');
    }else{
        console.log('92 ERROR --------------------------------------------------------');
        logError(error, response, body);
    }
}

function fetchJSON() {
    clearJSONFiles();
    var url = 'https://api.vimeo.com/users/46710998/albums';
    options.url = url;
    request(options, callback);
}


function clearJSONFiles() {
    const testFolder = './albums/';
    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            console.log('Deleting file: '+file);
            var filePath = testFolder + file;
            fs.unlinkSync(filePath);
        });
    });
}

fetchJSON();

//web jobs.html below
// function loadLocalJSON(vimeoUrl, callback) {
//     var xobj = new XMLHttpRequest();
//     xobj.overrideMimeType("application/json");
//     xobj.open('GET', vimeoUrl, true); // Replace 'my_data' with the path to your file
//     xobj.onreadystatechange = function () {
//         if (xobj.readyState == 4 && xobj.status == "200") {
//             callback(xobj.responseText);
//         }
//     };
//
//     xobj.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.4");
//     xobj.setRequestHeader("Content-Type", "application/vnd.vimeo.*+json");
//     xobj.setRequestHeader("Authorization", "Bearer "+accessToken);
//
//     xobj.send(null);
// }
//
// function getAlbum() {
//     var url = 'https://api.vimeo.com/users/46710998/albums';
//     loadLocalJSON(url, function(response) {
//         var albumJSON = JSON.parse(response);
//         albumJSON.data.forEach(function(al){
//
//             loadLocalJSON('https://api.vimeo.com'+al.uri+'/videos', function(res) {
//                 var alJson = JSON.parse(res);
//                 console.log(alJson);
//
//                 // fs.writeFile('mynewfile3.txt', 'This is my text', function (err) {
//                 //     if (err) throw err;
//                 //     console.log('Replaced!');
//                 // });
//
//             });
//
//         })
//
//     });
// };
// getAlbum();



