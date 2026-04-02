$(document).ready(function() {
    $('.gallery').mauGallery({
        columns: {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 3
        },
        lightBox: true,
        lightboxId: 'myAwesomeLightbox',
        showTags: true,
        tagsPosition: 'top'
    });
});
// Gestion de la classe active pour les boutons de filtrage
$(document).on("click", ".tags-bar .nav-link", function () {
    // Retire la classe active de tous les boutons
    $(".tags-bar .nav-link").removeClass("active");

    // Ajoute la classe active au bouton cliqué
    $(this).addClass("active");
});

$(document).on("click", ".tags-bar .nav-link", function () {
    // Gestion visuelle
    $(".tags-bar .nav-link").removeClass("active");
    $(this).addClass("active");

    // Synchronisation avec le plugin
    $(".tags-bar .nav-link").removeClass("active-tag");
    $(this).addClass("active-tag");
});

$('#galleryLightbox').on('shown.bs.modal', function () {
    $('.lightboxImage').trigger('focus');
});

