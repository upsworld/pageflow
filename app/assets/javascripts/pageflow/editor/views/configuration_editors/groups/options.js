pageflow.ConfigurationEditorTabView.groups.define('options', function() {
  this.input('display_in_navigation', pageflow.CheckBoxInputView);
  this.group('page_transitions');
  this.input('description', pageflow.TextAreaInputView, {size: 'short'});

  if (pageflow.features.isEnabled('atmo')) {
    this.input('atmo_audio_file_id', pageflow.FileInputView, {
      collection: pageflow.audioFiles
    });
  }
});