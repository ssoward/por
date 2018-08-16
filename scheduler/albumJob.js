//Run this script to update all Vimeo albums
//To run: npm albumJob.js
//all updates saved to albums/*.json

var playlist = { title: "Ad Test", kind: "MANUAL", playlist: [] };
var accessToken = '8aeb6aa949835168b5d8c1b863227828';
var clientId = '5b2edc639552e6c9b16335e31c1b0e86';
var userId = 46710998;

var fs = require('fs');
const url = require('url');
var request = require('request');

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

var albumMap = [];
function callbackAlbum(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        if(info.paging.next){
            var url = 'https://api.vimeo.com'+ info.paging.next
            options.url = url;
            request(options, callbackAlbum);
        }
        console.log('--------------------------------------------------------')
        // console.log(info)
        var id = getAlbumId(info.paging.first);

        if(albumMap.hasOwnProperty(id)){
            console.log(id)
            info.data = info.data.concat(albumMap[id]);
        }
        albumMap[id] = info.data;
        console.log(info.data.length);

        fs.writeFile('albums/'+id+'.json', JSON.stringify(info), function (err) {
            if (err) throw err;
            console.log('Replaced: '+ id);
        });
        console.log('--------------------------------------------------------')
    }
}

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        if(info.data){
            info.data.forEach(function(albumURI){
                var url = 'https://api.vimeo.com'+ albumURI.uri+'/videos';
                options.url = url;
                // if(options.url.indexOf('5299853')!==-1) {
                    request(options, callbackAlbum);
                // }
            })
        }
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
            console.log(file);
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



