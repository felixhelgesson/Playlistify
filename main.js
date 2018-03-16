
$(document).ready(function () {
    Playlistify.init();
    console.log("ready");

    //console.log(document.referrer);
    //console.log(Playlistify.getUrlVars());
})



var Playlistify = {
    oauthURI: "https://accounts.spotify.com/authorize?client_id=7f034be8c85340a9a3179b195bfa343f&redirect_uri=http://webshare.mah.se/af5392/redirectIndex.html&scope=user-top-read+playlist-modify-private+&response_type=token",

    access_token: "",

    loggedInId: "",

    topArtistsId: [],
    topTracksId: [],
    checkedArray: [],
    checkedArtistId: [],
    trackURI: [],

    init: function () {
        $("#redirectBtn").click(function () {
            Playlistify.oauth();
        });

        $(".createPlaylist").click(function () {
            Playlistify.createPlaylist();
        });

        $(".radio").click(function () {
            Playlistify.getTimePeriod();
        });



        var s = window.location.hash.split('=');
        var key = s[1].split('&');
        Playlistify.access_token = key[0];
        Playlistify.getPersonId();
        Playlistify.getTopArtists();
    },

    oauth: function () {
        window.location.replace(Playlistify.oauthURI);
    },

    getTopArtists: function () {
        var indexNr = 0;
        $.ajax({
            url: "https://api.spotify.com/v1/me/top/artists",
            type: "GET",
            headers: { "Authorization": "Bearer " + Playlistify.access_token },
            success: function (result) {
                // document.getElementById("createText").innerHTML = result.items[0].name;
                for (let i = 0; i < result.items.length; i++) {
                    $('#createText').append('<p class = "listItem">' + result.items[i].name +
                        "</p><br>");
                    Playlistify.topArtistsId.push(result.items[i].id);
                }

                $(".listItem").each(function () {
                    $(this).append('<input type="checkbox" value="' + indexNr + '" class = "checkbox ml-3">');
                    indexNr++;
                })

            }
        })
    },

    getTimePeriod: function(){
        var timePeriod = "";
        $('#statText').empty();

        $("input:checked").each(function () {
            
            if ($(this).val() == "short_term") {
                timePeriod = "short_term";
            }
            else if ($(this).val() == "medium_term") {
                timePeriod = "medium_term";
            }
            else if ($(this).val() == "long_term") {
                timePeriod = "long_term";
            }
        })
        Playlistify.getTopTracks(timePeriod);
    },

    getTopTracks: function (timePeriod) {
        var indexNr = 0;
        $.ajax({
            url: "https://api.spotify.com/v1/me/top/tracks?time_range="+timePeriod,
            type: "GET",
            headers: { "Authorization": "Bearer " + Playlistify.access_token },
            success: function (result) {
                // document.getElementById("createText").innerHTML = result.items[0].name;
                for (let i = 0; i < result.items.length; i++) {
                    $('#statText').append('<p class = "listItem">' + result.items[i].name +
                        "</p><br>");
                    Playlistify.topTracksId.push(result.items[i].id);
                }
            }
        })
    },

    getPersonId: function () {
        $.ajax({
            url: "https://api.spotify.com/v1/me",
            type: "GET",
            headers: { "Authorization": "Bearer " + Playlistify.access_token },
            success: function (result) {
                Playlistify.loggedInId = result.id;
            }
        })
    },

    getCheckedArtistId: function () {
        $("input:checked").each(function () {
            Playlistify.checkedArray.push($(this).val());
        });

        for (var i = 0; i < Playlistify.checkedArray.length; i++) {
            Playlistify.checkedArtistId.push(Playlistify.topArtistsId[Playlistify.checkedArray[i]])       
        }
    },

    createPlaylist: function(){
        Playlistify.getCheckedArtistId();
        var numberOfTracks = 25/ Playlistify.checkedArtistId.length;
        for (var i = 0; i < Playlistify.checkedArtistId.length; i++) {
            Playlistify.getAlbums(Playlistify.checkedArtistId[i], numberOfTracks, function(){
                Playlistify.createPlaylistApiCall();
            });           
        }
    },

    createPlaylistApiCall: function(){
        $.ajax({
            url: "https://api.spotify.com/v1/users/" + Playlistify.loggedInId + "/playlists",
            type: "POST",
            headers: { "Authorization": "Bearer " + Playlistify.access_token },
            contentType: "application/json",
            data: JSON.stringify({name: "Playlistify", public: false}),
            success: function (result) {
                Playlistify.addTracksToPlaylist(result.id);
            }
        })
    },

    addTracksToPlaylist: function(id){
        $.ajax({
            url: "https://api.spotify.com/v1/users/"+ Playlistify.loggedInId +"/playlists/" + id + "/tracks",
            type: "POST",
            headers: { "Authorization": "Bearer " + Playlistify.access_token },
            contentType: "application/json",
            data: JSON.stringify({uris: Playlistify.trackURI}),
            success: function (result) {
                console.log("success")
            }
        })
    },

    getAlbums: function(artistId, nrOfTracks, cb){
        $.ajax({
            url: "https://api.spotify.com/v1/artists/" + artistId + "/albums",
            type: "GET",
            headers: { "Authorization": "Bearer " + Playlistify.access_token },
            data: {
                album_type: 'album',
            },
            success: function (result) {
                var albumId = [];
                for (var i = 0; i < result.items.length; i++) {
                    albumId.push(result.items[i].id)
                }
                Playlistify.getTracks(albumId, nrOfTracks, cb);
            }
        })
    },

    getTracks: function(albumId, nrOfTracks, cb){
        var URI = [];
        var successes = 0;
        for (var i = 0; i < albumId.length; i++) {
            $.ajax({
                url: "https://api.spotify.com/v1/albums/" + albumId[i] + "/tracks",
                type: "GET",
                headers: { "Authorization": "Bearer " + Playlistify.access_token },
                success: function (result) {
                    successes ++;
                    URI = [];
                    for (var i = 0; i < result.items.length; i++) {
                        URI.push(result.items[i].uri);
                    }
                    if(successes == albumId.length){
                        Playlistify.getRandomTrack(URI, nrOfTracks);
                    }                   
                }
            });
        }  
        console.log("Callback här?")
    },

    getRandomTrack: function(URI, nrOfTracks){
        for (var i = 0; i < nrOfTracks; i++) {
            Playlistify.trackURI.push(URI[Math.floor(Math.random() * URI.length)])
        }       
    }
}

