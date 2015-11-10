var ZeroClipboard = require('zeroclipboard');

(function() {
    var outputTextArea = document.getElementById('outputcode');
    var copyButton = new ZeroClipboard(document.getElementById('copy-button'));

    copyButton.on('ready', function(readyEvent) {
        copyButton.on('copy', function (event) {
            var clipboard = event.clipboardData;

            clipboard.setData('text/plain', outputTextArea.value);
        });
    });

    // select on focus
    outputTextArea.onclick = function() {
        this.select();
    };
})();
