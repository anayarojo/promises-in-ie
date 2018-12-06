$(document).ready(function(){

    function trueOrFalse(){
        return Math.random() >= 0.5;
    };

    var promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
            if(trueOrFalse()) {
                resolve("Success");
            } else {
                reject("Fail");
            }
        }, 1000);
    });
    
    promise.then(function(resp){
        alert(resp);
        console.log(resp);
    }).catch(function(resp){
        alert(resp);
        console.error(resp);
    });

});
