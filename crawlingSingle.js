var webPage = require('webpage');
var page = webPage.create();

var esUrl = escape("http://gmoma.ggcf.kr/archives/artwork/검은풍경");

console.log(esUrl);

page.open("http://gmoma.ggcf.kr/archives/artwork/%EA%B2%80%EC%9D%80%ED%92%8D%EA%B2%BD", function(status) {
    if(status !== 'success') {
        console.log("FAILED to load the page");
    } else {
        console.log("Success");
        var result = page.evaluate(function() {
            return document.querySelector("html").innerHTML;
        });
        console.log(result);
    }
    
    phantom.exit();
});