/**
 * @file
 * Defines initializing/attaching the Book Reader to the
 * defined element.
 */

// noConflict is here to allow for compatibility between jQuery 1.5 and jquery 1.7.
// JS loaded prior to this point in the bookreader requires jQuery 1.5, and further
// execution requires jQuery 1.7 or higher. 
// TODO: Figure out what library is the culprate.
//alert(jQuery().jquery);
//Drupal.settings.islandoraInternetArchiveBookReader_jQuery = jQuery.noConflict(true);
//alert(jQuery().jquery);
(function ($) {
  Drupal.behaviors.flvcInternetArchiveBookReader = {
    attach: function(context, settings) {
      $('.flvc-internet-archive-bookreader', context).once('flvc-bookreader', function () {
        var bookReader = null;
        // Initialize and Render the BookReader.
        if (settings.islandoraInternetArchiveBookReader.pageSource === 'djatoka') {
          bookReader = new IslandoraDjatokaBookReader(settings.islandoraInternetArchiveBookReader);
        }
        else if (settings.islandoraInternetArchiveBookReader.pageSource === 'iiif') {
          bookReader = new IslandoraIiifBookReader(settings.islandoraInternetArchiveBookReader);
        }
        bookReader.init();
        // Handle page resize, required for full screen.
        $(window).resize(function() {
          bookReader.windowResize();
        });
        // We currently don't support read-aloud.
        $('#BRtoolbar').find('.read').hide();
        if (!bookReader.searchEnabled()) {
          $('#textSrch').hide();
          $('#btnSrch').hide();
        }
        if (bookReader.settings.tocFound == 'true') {
            bookReader.updateTOC(bookReader.settings.tocEntries['table_of_contents']);
        }
        if ($.browser.mobile && settings.islandoraInternetArchiveBookReader.mobilize) {
          bookReader.goFullScreen();
        }
      });
    }
  };
})(jQuery);
