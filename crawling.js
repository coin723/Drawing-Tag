function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};

var webPage = require('webpage');
var page = webPage.create();

var fs = require('fs');

//page.open('http://gmoma.ggcf.kr/archives/artwork/%ED%8C%8C%EB%A6%AC%EC%9D%98-%EB%B2%A0%EB%91%90%EC%9D%B8%EC%A1%B1-2', function(status) {
//    console.log("Status: " + status);
//    
//    if(status === "success") {
//        var fs = require('fs');
//        var imgUrl = page.evaluate(function() {
//            return document.querySelector("div.gallery-one img").getAttribute("src") + "\n";
//        });
//        
//        fs.write('example.txt', imgUrl, 'w');
//    };
//});

var content = fs.read('drawing-tag-fetch.csv', 'utf-8');

var lines = content.split("\n");
    
//    for(var i = 0; i < lines.length; i++) {
//        console.log(i);
//    };
    
var addingColumn = [
    "imgUrl",
    "year",
    "artist",
    "material",
    "scale"
];

addingColumn.forEach(function(element) {
    lines[0] += "," + element;
});

var collectionSelector = "div.collection-title-wrap div.collection-info";

function getInfo(header) {
    var index = addingColumn.indexOf(header) - 1;
    return document.querySelectorAll(collectionSelector)[index];
};

//function injectInfo(line) {
//    var elements = line.split(",");
//    
//    var result = page.open(elements[3], function(status) {
////        function getInfo(header) {
////            var index = addingColumn.indexOf(header) - 1;
////            
////            return document.querySelectorAll(collectionSelector)[index];
////        };
//        
//        return waitFor(function() {
//            return page.evaluate(function() {
//                return document.querySelector(collectionSelector);
//            });
//        }, function() {
//            var imgUrl = page.evaluate(function() {
//                return document.querySelector("div.gallery-one img").getAttribute("src") + "\n";
//            }),
//                year = getInfo("year"),
//                artist = getInfo("artist"),
//                material = getInfo("material"),
//                scale = getInfo("scale");
//            return imgUrl + "," + year + "," + artist + "," + material + "," + scale;
//        });
//    });
//    
//    console.log(result);
//    
//    setTimeout(next_line, 500);
//};

//for(var i = 1; i < lines.length; i++) {
////    lines[i] += injectInfo(i);
////    console.log(lines[i]);
//    
//    var line = lines[i];
//    var elements = line.split(",");
//    
//    
//    
//    if(i === lines.length - 1){
//        phantom.exit();
//    };
//};

var count = 0;
//
function injectInfo(line) {
//    element += injectInfo(index);
    var column = line.split(",");
    
    var result = return page.open(column[3], function(status) {
        if(status !== 'success') {
            console.log("FAILED to load the address");
        } else {
            var imgUrl = page.evaluate(function() {
                return document.querySelector("div.gallery-one img").getAttribute("src") + "\n";
            }),
                year = getInfo("year"),
                artist = getInfo("artist"),
                material = getInfo("material"),
                scale = getInfo("scale");
            return imgUrl + "," + year + "," + artist + "," + material + "," + scale;
        }
    });
    
    waitFor(result, function() {
        console.log(result);
        console.log("This is for debugging\n");
    });
    
    
};

function next_line() {
    console.log("count: " + count++);
    var line = lines.shift();
    if(!line) {
        phantom.exit();
    }
    injectInfo(line);
};

next_line();