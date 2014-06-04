var speech_rec = {

    recognize: function(cb_ok) {
                var maxMatches = 1;
                var promptString = "Habler ahora"; // optional
                var language = "es-AR";                     // optional
                window.plugins.speechrecognizer.startRecognize(cb_fail, function(errorMessage){
                    console.log("Error de reconicimiento de audio: " + errorMessage);
                }, maxMatches, promptString, language);
    },

     // Show the list of the supported languages
    getSupportedLanguages: function() {
                window.plugins.speechrecognizer.getSupportedLanguages(function(languages){
                    // display the json array
                    app.showAlert(languages);
                }, function(error){
                    app.showAlert("Could not retrieve the supported languages : " + error);
                });
    },
}