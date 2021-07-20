(function () {
    window.QuillFunctions = {        
        createQuill: function (
            dotnet, quillElement, toolBar, readOnly,
            placeholder, theme, debugLevel, onContentChanged) {  

            Quill.register('modules/blotFormatter', QuillBlotFormatter.default);
            Quill.register("modules/imageCompressor", imageCompressor);

            var options = {
                debug: debugLevel,
                modules: {
                    toolbar: toolBar,
                    blotFormatter: {},
                    imageCompressor: {
                        quality: 0.7,
                        maxWidth: 1000, // default
                        maxHeight: 1000, // default
                        imageType: 'image/jpeg'
                    }
                },
                placeholder: placeholder,
                readOnly: readOnly,
                theme: theme
            };

            var quill = new Quill(quillElement, options);
            quill.on("text-change",
                (_dx, _dy, source) => {
                    if (source === "user") {
                        dotnet.invokeMethodAsync(onContentChanged);
                    }
                });
        },
        getQuillContent: function(quillElement) {
            return JSON.stringify(quillElement.__quill.getContents());
        },
        getQuillText: function(quillElement) {
            return quillElement.__quill.getText();
        },
        getQuillHTML: function(quillElement) {
            return quillElement.__quill.root.innerHTML;
        },
        loadQuillContent: function(quillElement, quillContent) {
            content = JSON.parse(quillContent);
            return quillElement.__quill.setContents(content, 'api');
        },
        loadQuillHTMLContent: function (quillElement, quillHTMLContent) {
            return quillElement.__quill.root.innerHTML = quillHTMLContent;
        },
        enableQuillEditor: function (quillElement, mode) {
            quillElement.__quill.enable(mode);
        },
        insertQuillImage: function (quillElement, imageURL) {
            var Delta = Quill.import('delta');
            editorIndex = 0;

            if (quillElement.__quill.getSelection() !== null) {
                editorIndex = quillElement.__quill.getSelection().index;
            }

            return quillElement.__quill.updateContents(
                new Delta()
                    .retain(editorIndex)
                    .insert({ image: imageURL },
                        { alt: imageURL }));
        }
    };
})();