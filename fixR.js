var imagesCT={};
var redirectRequests={};
var cleanUpInterval=1000*60*60*24;
setInterval(function(){
    for (var k in imagesCT) 
        if (imagesCT.hasOwnProperty(k))
            if(((new Date().getTime())-imagesCT[k].creationTS)>cleanUpInterval){
                delete imagesCT[k]
                delete redirectRequests[k]
            }
},cleanUpInterval)


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "getImagesCT") {
            setTimeout(function(){
                sendResponse({"imagesCT":imagesCT})
            },1000);
            return true;
        }
    }
);
chrome.webRequest.onBeforeRedirect.addListener(function(details) {
    if (details.initiator === location.origin) {
        redirectRequests[details.redirectUrl]=details.url;
    }
}, {
    urls: ['<all_urls>']
}, ['responseHeaders']);

chrome.webRequest.onCompleted.addListener(function(details) {
    if (details.initiator === location.origin) {
        var imgUrl=redirectRequests[details.url] || details.url
        imagesCT[imgUrl]={
            mimeType:getHeaderFromHeaders(details.responseHeaders, 'content-type'),
            contentLength:getHeaderFromHeaders(details.responseHeaders, 'content-length'),
            creationTS:new Date().getTime()
        };
    }
}, {
    urls: ['<all_urls>']
}, ['responseHeaders']);
function getHeaderFromHeaders(headers, headerName) {
    for (var i = 0; i < headers.length; ++i) {
        var header = headers[i];
        if (header.name.toLowerCase() === headerName) {
            return header.value;
        }
    }
}