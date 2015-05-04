(function() {
    var outputCode = document.getElementById('outputcode');

    // select on focus
    outputCode.onfocus = function() {
        this.select();

        // TODO: copy to clipboard
        // https://github.com/zeroclipboard/zeroclipboard
    };
})();
