$(document).ready(function(){

    var promise = new Promise(function(resolve) {
        setTimeout(function() {
            resolve("result");
        }, 1000);
    });
    
    promise.then(function(result) {
        alert("Success");
    }, function(error) {
        alert("Fail");
    });

});
