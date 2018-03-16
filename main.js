
$(document).ready(function () {
    Playlistify.init();
    console.log("ready");
    
    //console.log(document.referrer);
    //console.log(Playlistify.getUrlVars());
})



var Playlistify = {
    oauthURI: "https://accounts.spotify.com/authorize?client_id=7f034be8c85340a9a3179b195bfa343f&redirect_uri=http://webshare.mah.se/af8654/redirectIndex.html&scope=user-top-read&response_type=token",
    
    access_token:"",

    init: function(){
        $("#redirectBtn").click(function() {
            Playlistify.oauth();
        });
        var s = window.location.hash.split('=');
        var key = s[1].split('&');
        Playlistify.access_token = key[0];
        Playlistify.getTopArtists();
    },

    oauth: function(){
            window.location.replace(Playlistify.oauthURI);
            //console.log(Playlistify.getUrlVars());
    },

    getTopArtists: function(){
        $.ajax({
            url:"https://api.spotify.com/v1/me/top/artists",
            type: "GET",
            headers: {"Authorization": "Bearer " + Playlistify.access_token},
            success: function(result){
                // document.getElementById("createText").innerHTML = result.items[0].name;
                for (let i = 0; i < result.items.length; i++) {
                    $('#createText').append('<li class = "listItem">' + result.items[i].name + "</li><br>");
                }
                console.log(result);
            }
        })
    }
}
