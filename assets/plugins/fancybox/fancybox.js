$(document).ready(function () {
    // add all to same gallery
    $(".gallery .a-link").attr("data-fancybox", "mygallery");
    // assign captions and title from alt-attributes of images:
    $(".gallery .a-link").each(function () {
        $(this).attr("data-caption", $(this).find("img").attr("alt"));
        $(this).attr("title", $(this).find("img").attr("alt"));
    });
    // start fancybox:
    $(".gallery .a-link").fancybox();
});