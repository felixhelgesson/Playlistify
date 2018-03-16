
$(document).ready(function () {
    Playlistify.init();
    console.log("ready");

    //console.log(document.referrer);
    //console.log(Playlistify.getUrlVars());
})



var Playlistify = {
    oauthURI: "https://accounts.spotify.com/authorize?client_id=7f034be8c85340a9a3179b195bfa343f&redirect_uri=http://webshare.mah.se/af8654/redirectIndex.html&scope=user-top-read&response_type=token",

    access_token: "",

    loggedInId: "",

    topArtistsId: [],
    topTracksId: [],
    checkedArray: [],
    

    init: function () {
        $("#redirectBtn").click(function () {
            Playlistify.oauth();
        });

        $(".createPlaylist").click(function () {
            Playlistify.getChecked();
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
                    $('#createText').append('<p class = "listItem m-2 pb-1 text-danger">' + result.items[i].name +
                        "</p><br>");
                    Playlistify.topArtistsId.push(result.items[i].id);
                }

                $(".listItem").each(function () {
                    $(this).append('<br><input type="checkbox" value="' + indexNr + '" class = "checkbox ml-2 " id = "checkboxOneInput">');
                    indexNr++;
                })

                $(".listItem").addClass("p-3").css("background-color", "#f97575");
                
                // console.log(result);
                // console.log(Playlistify.topArtistsId);

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
                    $('#statText').append('<p class = "statListItem m-2">• ' + result.items[i].name +
                        "</p>");
                    Playlistify.topTracksId.push(result.items[i].id);
                }

                $(".statListItem").addClass("p-1");
                console.log(result);
                console.log(Playlistify.topTracksId);

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

    getChecked: function () {
        $("input:checked").each(function () {
            Playlistify.checkedArray.push($(this).val());
        });

        console.log(Playlistify.checkedArray);
    }
}

