pageflow.Storyline = Backbone.Model.extend({
  modelName: 'storyline',
  paramRoot: 'storyline',
  i18nKey: 'pageflow/storyline',

  mixins: [pageflow.failureTracking, pageflow.delayedDestroying],

  initialize: function(attributes, options) {
    this.chapters = new pageflow.StorylineChaptersCollection({
      chapters: options.chapters || pageflow.chapters,
      storyline: this
    });

    this.configuration = new pageflow.StorylineConfiguration(this.get('configuration') || {});

    this.listenTo(this.configuration, 'change', function() {
      this.save();
      this.trigger('change:configuration', this);
    });

    this.listenTo(this.configuration, 'change:main', function(model, value) {
      this.trigger('change:main', this, value);
    });
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/storylines';
  },

  title: function() {
    return _([
      this.configuration.get('title') ||
        (!this.isMain() && I18n.t('pageflow.storylines.untitled')),
      this.isMain() && I18n.t('pageflow.storylines.main')
    ]).compact().join(' - ');
  },

  isMain: function() {
    return !!this.configuration.get('main');
  },

  lane: function() {
    return this.configuration.get('lane');
  },

  row: function() {
    return this.configuration.get('row');
  },

  parentPagePermaId: function() {
    return this.configuration.get('parent_page_perma_id');
  },

  parentPage: function() {
    return pageflow.pages.getByPermaId(this.parentPagePermaId());
  },

  addChapter: function(params) {
    var defaults = {
      storyline_id: this.id,
      title: '',
      position: this.chapters.length
    };
    return this.chapters.create(_.extend(defaults, params));
  },

  toJSON: function() {
    return {
      configuration: this.configuration.toJSON()
    };
  },

  destroy: function() {
    this.destroyWithDelay();
  }
});