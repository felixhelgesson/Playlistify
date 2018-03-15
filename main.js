$(document).ready(function () {
    Playlistify.init();
    console.log("ready");
    //console.log(document.referrer);
    //console.log(Playlistify.getUrlVars());
})



var Playlistify = {
    oauthURI: "https://accounts.spotify.com/authorize?client_id=7f034be8c85340a9a3179b195bfa343f&redirect_uri=http://WebShare.mah.se/af5392&response_type=token",
    
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
            url:"https://api.spotify.com/v1/search?q=kendrick&type=artist",
            type: "GET",
            headers: {"Authorization": "Bearer " + Playlistify.access_token},
            success: function(result){
                $("#createText").append(result);
                console.log(result);
            }
        })
    }
}
