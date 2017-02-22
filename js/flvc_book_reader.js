/**
 * @file
 * FLVCBookReader is based on IslandoraBookReader and derived from the Internet Archive BookReader class.
 */

(function ($) {

  /**
   * Constructor
   */
  FLVCBookReader = function(settings) {
    BookReader.call(this);
    this.settings = settings;
    this.dimensions = {};
    this.numLeafs = settings.pageCount;
    this.bookTitle = settings.label.substring(0,97) + '...';
    this.bookUrl = document.location.toString();
    this.imagesBaseURL = settings.imagesFolderUri;
    this.logoURL = '';
    this.pageNums = settings.pageNumbers;
    this.mode = settings.mode
    this.fullscreen = false;
    this.content_type = settings.content_type;
    this.pageProgression = settings.pageProgression;
  }

  // Inherit from Internet Archive BookReader class.
  jQuery.extend(FLVCBookReader.prototype, IslandoraBookReader.prototype);

  /**
   * For a given "accessible page index" return the page number in the book.
   *
   * For example, index 5 might correspond to "Page 1" if there is front matter such
   * as a title page and table of contents.
   * for now we just show the image number
   *
   * @param int index
   *   The index of the page.
   */
  FLVCBookReader.prototype.getPageNum = function(index) {
    //return index + 1;
    var pageNum = this.pageNums[index];
    if (pageNum) {
        return pageNum;
    } else {
        return 'n' + index;
    }
  }

  /**
   * Update the location hash only change it when it actually changes, as some
   * browsers can't handle that stuff.
   */
  FLVCBookReader.prototype.updateLocationHash = function() {
    // Updated with fix to recent bug found in the Archive Viewer that
    // prevents the last page from displaying the correct transcriptions
    // or hash links.
/* commenting out bug fix for now */

    // Get the current page, from elements text.
    var page_string = $('#pagenum .currentpage').text();
    if (page_string) {
      var p_arr = page_string.split(" ");
      var p_index = p_arr[1];
      index = p_index;
    }
    else {
      index = 1;
    }

    //var newHash = '#' + this.fragmentFromParams(this.paramsFromCurrent());
    if (page_string != this.currentIndex() && page_string) {
      var param_data = this.fragmentFromParams(this.paramsFromCurrent()).split("/");
      param_data[1] = index;
      //newHash = '#' + replaceAll(',','/',param_data.toString());
    }

    // End bug fix.


    var newHash = '#' + this.fragmentFromParams(this.paramsFromCurrent());

    if (this.oldLocationHash != newHash) {
      window.location.hash = newHash;
    }

    // This is the variable checked in the timer.  Only user-generated changes
    // to the URL will trigger the event.
    this.oldLocationHash = newHash;
  }

/* FLVC - Overriding following functions to remove leading "Page " from displays */

FLVCBookReader.prototype.getPageName = function(index) {
    return this.getPageNum(index);
}

FLVCBookReader.prototype.addSearchResult = function(queryString, pageIndex) {
    var pageNumber = this.getPageNum(pageIndex);
    var uiStringSearch = "Search result"; // i18n
    var uiStringPage = "Page"; // i18n
    
    var percentThrough = BookReader.util.cssPercentage(pageIndex, this.numLeafs - 1);
    var pageDisplayString = '';
    if (pageNumber) {
        pageDisplayString = pageNumber;
    }
    
    var re = new RegExp('{{{(.+?)}}}', 'g');    
    queryString = queryString.replace(re, '<a href="#" onclick="br.jumpToIndex('+pageIndex+'); return false;">$1</a>')

    var marker = $('<div class="search" style="top:'+(-$('#BRcontainer').height())+'px; left:' + percentThrough + ';" title="' + uiStringSearch + '"><div class="query">'
        + queryString + '<span>' + pageNumber + '</span></div>')
    .data({'self': this, 'pageIndex': pageIndex })
    .appendTo('#BRnavline').bt({
        contentSelector: '$(this).find(".query")',
        trigger: 'hover',
        closeWhenOthersOpen: true,
        cssStyles: {
            padding: '12px 14px',
            backgroundColor: '#fff',
            border: '4px solid #e2dcc5',
            fontFamily: '"Lucida Grande","Arial",sans-serif',
            fontSize: '13px',
            //lineHeight: '18px',
            color: '#615132'
        },
        shrinkToFit: false,
        width: '230px',
        padding: 0,
        spikeGirth: 0,
        spikeLength: 0,
        overlap: '22px',
        overlay: false,
        killTitle: false, 
        textzIndex: 9999,
        boxzIndex: 9998,
        wrapperzIndex: 9997,
        offsetParent: null,
        positions: ['top'],
        fill: 'white',
        windowMargin: 10,
        strokeWidth: 0,
        cornerRadius: 0,
        centerPointX: 0,
        centerPointY: 0,
        shadow: false
    })
    .hover( function() {
                // remove from other markers then turn on just for this
                // XXX should be done when nav slider moves
                $('.search,.chapter').removeClass('front');
                $(this).addClass('front');
            }, function() {
                $(this).removeClass('front');
            }
    )
    .bind('click', function() {
        $(this).data('self').jumpToIndex($(this).data('pageIndex'));
    });
    
    $(marker).animate({top:'-25px'}, 'slow');

}

FLVCBookReader.prototype.addChapter = function(chapterTitle, pageNumber, pageIndex) {
    var uiStringPage = 'Page'; // i18n

    var percentThrough = BookReader.util.cssPercentage(pageIndex, this.numLeafs - 1);
    
    $('<div class="chapter" style="left:' + percentThrough + ';"><div class="title">'
        + chapterTitle + '<span>|</span> ' + pageNumber + '</div></div>')
    .appendTo('#BRnavline')
    .data({'self': this, 'pageIndex': pageIndex })
    .bt({
        contentSelector: '$(this).find(".title")',
        trigger: 'hover',
        closeWhenOthersOpen: true,
        cssStyles: {
            padding: '12px 14px',
            backgroundColor: '#000',
            border: '4px solid #e2dcc5',
            //borderBottom: 'none',
            fontFamily: '"Arial", sans-serif',
            fontSize: '12px',
            fontWeight: '700',
            color: '#fff',
            whiteSpace: 'nowrap'
        },
        shrinkToFit: true,
        width: '200px',
        padding: 0,
        spikeGirth: 0,
        spikeLength: 0,
        overlap: '21px',
        overlay: false,
        killTitle: true, 
        textzIndex: 9999,
        boxzIndex: 9998,
        wrapperzIndex: 9997,
        offsetParent: null,
        positions: ['top'],
        fill: 'black',
        windowMargin: 10,
        strokeWidth: 0,
        cornerRadius: 0,
        centerPointX: 0,
        centerPointY: 0,
        shadow: false
    })
    .hover( function() {
            // remove hover effect from other markers then turn on just for this
            $('.search,.chapter').removeClass('front');
                $(this).addClass('front');
            }, function() {
                $(this).removeClass('front');
            }
    )
    .bind('click', function() {
        $(this).data('self').jumpToIndex($(this).data('pageIndex'));
    });
}

FLVCBookReader.prototype.updateNavPageNum = function(index) {
    var pageNum = this.getPageNum(index);
    var pageStr;
    if (pageNum[0] == 'n') { // funny index
        pageStr = index + 1 + ' / ' + this.numLeafs; // Accessible index starts at 0 (alas) so we add 1 to make human
    } else {
        pageStr = pageNum;
    }
    
    $('#pagenum .currentpage').text(pageStr);
}

/*
* Update the table of contents based on array of TOC entries.
*/
FLVCBookReader.prototype.updateTOC = function(tocEntries) {
    this.removeChapters();
    for (var i = tocEntries.length - 1; i >= 0; i--) {
        this.addChapterFromEntry(tocEntries[i]);
    }
}

  /**
   * Override the autoToggle function to reset back to the zero index.
   *
   * Overridden because IAV sets the index back to 1 when it should be 0.
   */
  FLVCBookReader.prototype.autoToggle = function() {
    this.ttsStop();

    var bComingFrom1up = false;
    if (2 != this.mode) {
      bComingFrom1up = true;
      this.switchMode(2);
    }

    // Change to autofit if book is too large
    if (this.reduce < this.twoPageGetAutofitReduce()) {
      this.zoom2up('auto');
    }

    var self = this;
    if (null == this.autoTimer) {
      this.flipSpeed = 2000;

      // $$$ Draw events currently cause layout problems when they occur during animation.
      //     There is a specific problem when changing from 1-up immediately to autoplay in RTL so
      //     we workaround for now by not triggering immediate animation in that case.
      //     See https://bugs.launchpad.net/gnubook/+bug/328327
      if (('rl' == this.pageProgression) && bComingFrom1up) {
          // don't flip immediately -- wait until timer fires
      } else {
          // flip immediately
          this.flipFwdToIndex();
      }

      $('#BRtoolbar .play').hide();
      $('#BRtoolbar .pause').show();
      this.autoTimer=setInterval(function(){
        if (self.animating) {return;}

          if (Math.max(self.twoPage.currentIndexL, self.twoPage.currentIndexR) >= self.lastDisplayableIndex()) {
            self.flipBackToIndex(0); // $$$ really what we want?
          } else {
            self.flipFwdToIndex();
          }
      },5000);
    } else {
        this.autoStop();
    }
  }
})(jQuery);
