$(document).ready(function() {
    $('article img').each(function() {
        var href = $(this).attr('src');
        var title = $(this).attr('alt');
        $(this).wrap('<a class="fancybox" href="' + href + '" title="' + title + '"></a>');
    });
    $('.fancybox').fancybox();
});