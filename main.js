
$(document).ready(function () {
    Playlistify.init();
    console.log("ready");

    //console.log(document.referrer);
    //console.log(Playlistify.getUrlVars());
})



var Playlistify = {
    oauthURI: "https://accounts.spotify.com/authorize?client_id=7f034be8c85340a9a3179b195bfa343f&redirect_uri=http://webshare.mah.se/af8654/redirectIndex.html&scope=user-top-read+playlist-modify-private+&response_type=token",

    access_token: "",

    loggedInId: "",

    topArtistsId: [],
    topTracksId: [],
    checkedArray: [],
    checkedArtistId: [],
    trackURI: [],
    URI: [],

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

    getTimePeriod: function () {
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
            url: "https://api.spotify.com/v1/me/top/tracks?time_range=" + timePeriod,
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
                //console.log(result);
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

    createPlaylist: function () {
        Playlistify.getCheckedArtistId();
        if (Playlistify.checkedArtistId.length != 0 ) {
            $(".loader").removeClass("d-none");
            var numberOfTracks = 50 / Playlistify.checkedArtistId.length;
            for (var i = 0; i < Playlistify.checkedArtistId.length; i++) {
                Playlistify.getAlbums(Playlistify.checkedArtistId[i], numberOfTracks, function () {
                    Playlistify.createPlaylistApiCall();
                });
            }
        }
        else {
            alert("You have to choose at least one artist!")
        }
    },

    createPlaylistApiCall: function () {
        if (!$(".playlistName").val() == "") {

            $(".createSec").removeClass("d-flex").addClass("d-none");
            $(".showPlaylist").removeClass("d-none").addClass("d-flex");
            var playlistName = $(".playlistName").val();
            $.ajax({
                url: "https://api.spotify.com/v1/users/" + Playlistify.loggedInId + "/playlists",
                type: "POST",
                headers: { "Authorization": "Bearer " + Playlistify.access_token },
                contentType: "application/json",
                data: JSON.stringify({ name: playlistName, public: false }),
                success: function (result) {
                    $(".loader").addClass("d-none");
                    Playlistify.addTracksToPlaylist(result.id); // result.uri = är spellistans uri
                    Playlistify.createEmbeddedPlaylist(result.id);
                    $(".playlistName").empty();
                }
            })
        }
        else {
            alert("Choose a name for the playlist!");
        }
    },

    addTracksToPlaylist: function (id) {
        $.ajax({
            url: "https://api.spotify.com/v1/users/" + Playlistify.loggedInId + "/playlists/" + id + "/tracks",
            type: "POST",
            headers: { "Authorization": "Bearer " + Playlistify.access_token },
            contentType: "application/json",
            data: JSON.stringify({ uris: Playlistify.trackURI }),
            success: function (result) {
                console.log("success")
                //Använd denna funktionen.
            }
        })
    },

    getAlbums: function (artistId, nrOfTracks, cb) {
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
                    if (result.items.length == albumId.length) {
                        Playlistify.getTracks(albumId, nrOfTracks, cb);
                    }
                }
            }
        })
    },

    getTracks: function (albumId, nrOfTracks, cb) {
        var successes = 0;
        for (var i = 0; i < albumId.length; i++) {
            $.ajax({
                url: "https://api.spotify.com/v1/albums/" + albumId[i] + "/tracks",
                type: "GET",
                headers: { "Authorization": "Bearer " + Playlistify.access_token },
                success: function (result) {
                    successes++;
                    for (var i = 0; i < result.items.length; i++) {
                        Playlistify.URI.push(result.items[i].uri);
                    }
                    if (successes == albumId.length) {
                        Playlistify.getRandomTrack(nrOfTracks, cb);
                    }
                }
            });
        }
    },

    getRandomTrack: function (nrOfTracks, cb) {
        for (var i = 0; i < nrOfTracks; i++) {
            Playlistify.trackURI.push(Playlistify.URI[Math.floor(Math.random() * Playlistify.URI.length)])
        }
        if (Playlistify.trackURI.length >= 50) {
            cb();
        }
    },

    createEmbeddedPlaylist: function (uri) {
        $('.embeddedPlaylist').attr("src", "https://open.spotify.com/embed/user/" +
            Playlistify.loggedInId + "/playlist/" + uri);
    }


}


