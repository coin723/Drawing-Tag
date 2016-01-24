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
//                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};

console.log("hi");

var webPage = require('webpage');
var page = webPage.create();

var fs = require('fs');

var content = fs.read('drawing-tag-fetch.csv', 'utf-8');

var lines = content.split("\n");
    
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

//function getInfo(header) {
//    var index = addingColumn.indexOf(header) - 1;
//    
//    var collectionSelector = "div.collection-title-wrap div.collection-info";
//    
//    return page.evaluate(function(sel, i) {
//        return document.querySelectorAll(sel)[i].innerHTML;
//    }, 'collectionSelector', 'index');
//};

var count = 0;

var collectionSelector = "div.collection-title-wrap div.collection-info";

function injectInfo(line) {
    var column = line.split(",");
    var address = column[2];
    
    var result = new String();
    result = page.open(address, function(status) {
        if(status !== 'success') {
            console.log("FAILED to load the address: " + address);
        } else {
            return waitFor(function() {
                return page.evaluate(function(sel) {
                    return document.querySelector(sel);
                }, 'collectionSelector');
            }, function() {
                var imgUrl = page.evaluate(function() {
                return document.querySelector("div.gallery-one img").getAttribute("src") + "\n";
            }),
                year = page.evaluate(function(sel, i) {
                    return document.querySelectorAll(sel)[i].innerHTML;
                }, 'collectionSelector', addingColumn.indexOf("year") - 1),
                artist = page.evaluate(function(sel, i) {
                    return document.querySelectorAll(sel)[i].innerHTML;
                }, 'collectionSelector', addingColumn.indexOf("artist") - 1),
                material = page.evaluate(function(sel, i) {
                    return document.querySelectorAll(sel)[i].innerHTML;
                }, 'collectionSelector', addingColumn.indexOf("material") - 1),
                scale = page.evaluate(function(sel, i) {
                    return document.querySelectorAll(sel)[i].innerHTML;
                }, 'collectionSelector', addingColumn.indexOf("scale") - 1);
            
            console.log(imgUrl);
            return imgUrl + "," + year + "," + artist + "," + material + "," + scale;
            });
            
//            var imgUrl = page.evaluate(function() {
//                return document.querySelector("div.gallery-one img").getAttribute("src") + "\n";
//            }),
//                year = page.evaluate(function(sel, i) {
//                    return document.querySelectorAll(sel)[i].innerHTML;
//                }, 'collectionSelector', addingColumn.indexOf("year") - 1),
//                artist = page.evaluate(function(sel, i) {
//                    return document.querySelectorAll(sel)[i].innerHTML;
//                }, 'collectionSelector', addingColumn.indexOf("artist") - 1),
//                material = page.evaluate(function(sel, i) {
//                    return document.querySelectorAll(sel)[i].innerHTML;
//                }, 'collectionSelector', addingColumn.indexOf("material") - 1),
//                scale = page.evaluate(function(sel, i) {
//                    return document.querySelectorAll(sel)[i].innerHTML;
//                }, 'collectionSelector', addingColumn.indexOf("scale") - 1);
//            
//            console.log(imgUrl);
//            return imgUrl + "," + year + "," + artist + "," + material + "," + scale;
        }
    });
    
//    waitFor(result, function() {
//        console.log(result);
//        console.log("This is for debugging\n");
//    });
    
    return result;
    
//    waitFor(function() {
//        return page.open(address, function(status) {
//            if(status !== 'success') {
//                console.log("FAILED to load the address: " + address);
//            } else {
//                var imgUrl = page.evaluate(function() {
//                    return document.querySelector("div.gallery-one img").getAttribute("src") + "\n";
//                }),
//                    year = getInfo("year"),
//                    artist = getInfo("artist"),
//                    material = getInfo("material"),
//                    scale = getInfo("scale");
//                return imgUrl + "," + year + "," + artist + "," + material + "," + scale;
//            }
//        });
//    }, console.log("succeeded to load elements"));
    
//    setTimeout(next_line, 5000);
};

function next_line() {
    console.log("count: " + count++);
    var line = lines.shift();
    if(!line) {
        phantom.exit();
    }
    var output = injectInfo(line);
    console.log(output);
    
    setTimeout(next_line, 3000);
};

lines.shift();

next_line();