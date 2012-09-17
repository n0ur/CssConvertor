$(document).ready(function () {
  var fileSelector = $("#file_selector"),
    readFile = function (file) {
      var reader = new FileReader();
      $(reader).load(function (e) {
        var fileContent = e.target.result,
          newCss = CssConvertor.scanAndReplace(fileContent);
        $('#cssBefore').text(fileContent);
        if (newCss) {
          $('#cssAfter').text(newCss);
          $('code').each(function (i, e) {hljs.highlightBlock(e); });
          $('#msgs').text("Finished!").removeClass().addClass('alert alert-success');
        } else {
          $('#msgs').text("There was an error!").removeClass().addClass('alert alert-error');
        }
      });
      reader.readAsBinaryString(file);
    },
    loadExample = (function () {
      var exampleText = "p {\n\tfloat: right;\n\tpadding: 1px 2px 3px 4px;\n}";
      $('#cssBefore').text(exampleText);
      $('#cssAfter').text(CssConvertor.scanAndReplace(exampleText));
      $('#cssMustAdd').text("body {\n\tdirection: rtl;\n}");
      $('code').each(function (i, e) {hljs.highlightBlock(e); });
    }());

  fileSelector.change(function () {
    var lastAddedFile = this.files[this.files.length - 1];
    if (lastAddedFile.type.match(/css/)) {
      $('#msgs').text("Converting..").removeClass().addClass('alert');
      readFile(lastAddedFile);
    } else {
      $('#msgs').text("Please add CSS files only").removeClass().addClass('alert alert-error');
    }
  });
});