$(document).ready(function(){

    var promise = new Promise(function(resolve) {
        setTimeout(function() {
            resolve("result");
        }, 1000);
    });
    
    promise.then(function(result) {
        alert("Fulfilled: " + result);
    }, function(error) {
        alert("Rejected: " + error);
    });

});
