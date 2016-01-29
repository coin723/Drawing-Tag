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

var webPage = require('webpage');
var page = webPage.create();

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

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
//            page.evaluate(function() {
//                var dom = document.querySelector("html").innerHTML;
//                console.log("dom is " + dom);
//            });
            return waitFor(function() {
                return page.evaluate(function(sel) {
                    return document.querySelector(sel);
                }, collectionSelector);
            }, function() {
                console.log("Evaluating onReady");
                var imgUrl = page.evaluate(function() {
                    return document.querySelector("div.gallery-one img").getAttribute("src") + "\n";
                }),
                year = page.evaluate(function(sel, i) {
                    return document.querySelectorAll(sel)[i].innerHTML;
                }, collectionSelector, addingColumn.indexOf("year") - 1),
                artist = page.evaluate(function(sel, i) {
                    return document.querySelectorAll(sel)[i].innerHTML;
                }, collectionSelector, addingColumn.indexOf("artist") - 1),
                material = page.evaluate(function(sel, i) {
                    return document.querySelectorAll(sel)[i].innerHTML;
                }, collectionSelector, addingColumn.indexOf("material") - 1),
                scale = page.evaluate(function(sel, i) {
                    return document.querySelectorAll(sel)[i].innerHTML;
                }, collectionSelector, addingColumn.indexOf("scale") - 1);
                
                console.log(imgUrl);
                
                var newData = imgUrl + "," + year + "," + artist + "," + material + "," + scale;
                
                return newData;
            }, 10000);
        }
    });
    
    return result;
};

function next_line() {
    console.log("count: " + count++);
    var line = lines.shift();
    if(!line) {
        phantom.exit();
    } else {
//        setTimeout(function() {
//            var output = injectInfo(line);
//            console.log(output);
//        }, 10000);
//        var output = injectInfo(line);
    
//        setTimeout(next_line, 10000);
//        waitFor(function() {
//            if(output !== undefined) {
//                return output.length;
//            }
//        }, function() {
//            console.log(output);
//            setTimeout(next_line, 10000);
//        }, 20000);
        
        var column = line.split(",");
        var address = column[2];
    
//        var result = new String();
        page.open(address, function(status) {
            if(status !== 'success') {
                console.log("FAILED to load the address: " + address);
            } else {
    //            page.evaluate(function() {
    //                var dom = document.querySelector("html").innerHTML;
    //                console.log("dom is " + dom);
    //            });
                waitFor(function() {
                    return page.evaluate(function(sel) {
                        return document.querySelector(sel);
                    }, collectionSelector);
                }, function() {
                    console.log("Evaluating onReady");
                    var imgUrl = page.evaluate(function() {
                        return document.querySelector("div.gallery-one img").getAttribute("src") + "\n";
                    }),
                    year = page.evaluate(function(sel, i) {
                        return document.querySelectorAll(sel)[i].innerHTML;
                    }, collectionSelector, addingColumn.indexOf("year") - 1),
                    artist = page.evaluate(function(sel, i) {
                        return document.querySelectorAll(sel)[i].innerHTML;
                    }, collectionSelector, addingColumn.indexOf("artist") - 1),
                    material = page.evaluate(function(sel, i) {
                        return document.querySelectorAll(sel)[i].innerHTML;
                    }, collectionSelector, addingColumn.indexOf("material") - 1),
                    scale = page.evaluate(function(sel, i) {
                        return document.querySelectorAll(sel)[i].innerHTML;
                    }, collectionSelector, addingColumn.indexOf("scale") - 1);

//                    console.log(imgUrl);

                    var newData = imgUrl + "," + year + "," + artist + "," + material + "," + scale;

//                    return newData;
                    console.log(newData);
                    
//                    setTimeout(next_line, 10000);
                    next_line();
                }, 10000);
            }
        });
    }
};

lines.shift();

next_line();