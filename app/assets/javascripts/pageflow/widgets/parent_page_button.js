(function($) {
  $.widget('pageflow.parentPageButton', {
    _create: function() {
      var element = this.element;

      element.click(function(event) {
        pageflow.slides.goToParentPage();
        return false;
      });

      pageflow.slides.on('pageactivate', function(e, ui) {
        update();
      });

      update();

      function update() {
        var pagePermaId = parseInt(pageflow.slides.currentPage().attr('id'), 10);
        var chapterId = pageflow.entryData.getChapterIdByPagePermaId(pagePermaId);
        var chapterConfiguration = pageflow.entryData.getChapterConfiguration(chapterId);

        element.toggle(pageflow.slides.parentPageExists() &&
                       chapterConfiguration.display_parent_page_button);
      }
    }
  });
}(jQuery));