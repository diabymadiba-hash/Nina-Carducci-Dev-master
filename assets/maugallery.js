(function ($) {

  $.fn.mauGallery = function (options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];

    return this.each(function () {

      $.fn.mauGallery.methods.createRowWrapper($(this));

      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox($(this), options.lightboxId, options.navigation);
      }

      $.fn.mauGallery.listeners(options);

      $(this).children(".gallery-item").each(function () {
        $.fn.mauGallery.methods.responsiveImageItem($(this));
        $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
        $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);

        let tag = $(this).data("gallery-tag");
        if (options.showTags && tag && !tagsCollection.includes(tag)) {
          tagsCollection.push(tag);
        }
      });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags($(this), options.tagsPosition, tagsCollection);
      }

      $(this).fadeIn(500);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: "galleryLightbox",
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };

  $.fn.mauGallery.listeners = function (options) {

    $(".gallery-item").on("click", function () {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);

    $(".gallery").on("click", ".mg-prev", function () {
      $.fn.mauGallery.methods.prevImage();
    });

    $(".gallery").on("click", ".mg-next", function () {
      $.fn.mauGallery.methods.nextImage();
    });
  };

  $.fn.mauGallery.methods = {

    createRowWrapper(element) {
      if (!element.children().first().hasClass("row")) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },

    wrapItemInColumn(element, columns) {
      if (typeof columns === "number") {
        element.wrap(`<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`);
      } else {
        let classes = "";
        if (columns.xs) classes += ` col-${Math.ceil(12 / columns.xs)}`;
        if (columns.sm) classes += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        if (columns.md) classes += ` col-md-${Math.ceil(12 / columns.md)}`;
        if (columns.lg) classes += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        if (columns.xl) classes += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        element.wrap(`<div class='item-column mb-4${classes}'></div>`);
      }
    },

    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },

    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },

    openLightBox(element, lightboxId) {
      $("#" + lightboxId).find(".lightboxImage").attr("src", element.attr("src"));
      $("#" + lightboxId).modal("show");
    },

    // 🔥 Fonction unifiée pour récupérer les images filtrées
    getFilteredImages() {
      let activeTag = $(".tags-bar .nav-link.active-tag").data("images-toggle") || "all";
      let images = [];

      $(".item-column img").each(function () {
        if (activeTag === "all" || $(this).data("gallery-tag") === activeTag) {
          images.push($(this));
        }
      });

      return images;
    },

    // 🔥 Fonction pour trouver l’index de l’image active
    getActiveIndex(images) {
      let activeSrc = $(".lightboxImage").attr("src");
      return images.findIndex(img => img.attr("src") === activeSrc);
    },

    // 🔥 Image précédente
    prevImage() {
      let images = $.fn.mauGallery.methods.getFilteredImages();
      if (images.length === 0) return;

      let index = $.fn.mauGallery.methods.getActiveIndex(images);
      let prevIndex = (index - 1 + images.length) % images.length;

      $(".lightboxImage").attr("src", images[prevIndex].attr("src"));
    },

    // 🔥 Image suivante
    nextImage() {
      let images = $.fn.mauGallery.methods.getFilteredImages();
      if (images.length === 0) return;

      let index = $.fn.mauGallery.methods.getActiveIndex(images);
      let nextIndex = (index + 1) % images.length;

      $(".lightboxImage").attr("src", images[nextIndex].attr("src"));
    },

    createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`
        <div class="modal fade" id="${lightboxId}" tabindex="-1" aria-modal="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-body position-relative">

                ${navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;padding:5px;">❮</div>' : ''}

                <img class="lightboxImage img-fluid" alt="Image affichée" tabindex="0"/>

                ${navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;padding:5px;">❯</div>' : ''}

              </div>
            </div>
          </div>
        </div>
      `);
    },

    showItemTags(gallery, position, tags) {
      let html = `
        <ul class="my-4 tags-bar nav nav-pills">
          <li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>
      `;

      tags.forEach(tag => {
        html += `<li class="nav-item"><span class="nav-link" data-images-toggle="${tag}">${tag}</span></li>`;
      });

      html += `</ul>`;

      if (position === "top") gallery.prepend(html);
      else gallery.append(html);
    },

    filterByTag() {
      if ($(this).hasClass("active-tag")) return;

      $(".tags-bar .nav-link").removeClass("active active-tag");
      $(this).addClass("active active-tag");

      let tag = $(this).data("images-toggle");

      $(".gallery-item").each(function () {
        let parent = $(this).parents(".item-column");
        parent.hide();

        if (tag === "all" || $(this).data("gallery-tag") === tag) {
          parent.show(300);
        }
      });
    }
  };

})(jQuery);
