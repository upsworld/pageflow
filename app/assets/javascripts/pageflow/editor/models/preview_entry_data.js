pageflow.PreviewEntryData = pageflow.EntryData.extend({
  initialize: function(options) {
    this.chapters = options.chapters;
    this.pages = options.pages;
    this.theming = options.theming;
  },

  getThemingOption: function(name) {
    return this.theming.get(name);
  },

  getChapterConfiguration: function(id) {
    var chapter = this.chapters.get(id);
    return chapter ? chapter.configuration.attributes : {};
  },

  getChapterPagePermaIds: function(id) {
    var chapter = this.chapters.get(id);
    return chapter ? chapter.pages.pluck('perma_id') : [];
  },

  getChapterIdByPagePermaId: function(permaId) {
    var page = this.pages.getByPermaId(permaId);
    return page && page.get('chapter_id');
  },

  getPageConfiguration: function(permaId) {
    var page = this.pages.getByPermaId(permaId);
    return page ? page.configuration.attributes : {};
  }
});
