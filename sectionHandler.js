
$(".createSecBtn").on("click", function(){
    $(".statSec").removeClass("d-flex").addClass("d-none");
    $(".createSec").removeClass("d-none").addClass("d-flex");
    $(".showPlaylist").addClass("d-none");
});

$(".statSecBtn").on("click", function(){
    $(".createSec").removeClass("d-flex").addClass("d-none");
    $(".statSec").removeClass("d-none").addClass("d-flex");
    $(".showPlaylist").addClass("d-none");
});


