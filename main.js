$(document).ready(function () {
    Playlistify.oauth();
    console.log("ready");
})



var Playlistify = {
    oauth: function(){
        var oauthURI = "https://accounts.spotify.com/authorize?client_id=7f034be8c85340a9a3179b195bfa343f&redirect_uri=http://WebShare.mah.se/af5392&response_type=token";
        //window.location.replace(oauthURI); // Redirect to Oauth site. Need to hook a button to do it when it's clicked
        
    }
}

