
$(document).ready(function () {
    Playlistify.init();
    console.log("ready");

    //console.log(document.referrer);
    //console.log(Playlistify.getUrlVars());
})



var Playlistify = {
    oauthURI: "https://accounts.spotify.com/authorize?client_id=7f034be8c85340a9a3179b195bfa343f&redirect_uri=http://webshare.mah.se/af5392/redirectIndex.html&scope=user-top-read&response_type=token",

    access_token: "",

    loggedInId:"",

    topArtistsId: [],
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


        var s = window.location.hash.split('=');
        var key = s[1].split('&');
        Playlistify.access_token = key[0];
        Playlistify.getPersonId();
        Playlistify.getTopArtists();
    },

    oauth: function () {
        window.location.replace(Playlistify.oauthURI);
        //console.log(Playlistify.getUrlVars());
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
                    $(this).append('<input type="checkbox" value="' + indexNr + '" class = "ml-3">');
                    indexNr++;
                })
                console.log(result);
                console.log(Playlistify.topArtistsId);

            }
        })
    },

    getPersonId: function(){
        $.ajax({
            url: "https://api.spotify.com/v1/me",
            type: "GET",
            headers: {"Authorization": "Bearer " + Playlistify.access_token},
            success: function(result){
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
        var numberOfTracks = 50/ Playlistify.checkedArtistId.length;
        for (var i = 0; i < Playlistify.checkedArtistId.length; i++) {
            Playlistify.randomizeTracks(i, numberOfTracks);           
        }
    },

    randomizeTracks: function(artistId, nrOfTracks){

    }
}

