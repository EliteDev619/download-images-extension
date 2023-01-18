var imageManager = {
    imageType:{
        IMG: "IMG",
        TEXT: "TEXT",
        LINK: "LINK",
        INPUT_IMG: "INPUT_IMG",
        BACKGROUND: "BACKGROUND"
    },
    imgList: [],
    getImages: function() {
        this.imgList = [];
        var imgs = document.getElementsByTagName("img");
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            var newImg = new Image();
            newImg.src = img.src;
            var width = 0
              , height = 0;
            width = parseInt(img.naturalWidth);
            height = parseInt(img.naturalHeight);
            nwidth = parseInt(newImg.width);
            nheight = parseInt(newImg.height);
            width = nwidth > width ? nwidth : width;
            height = nheight > height ? nheight : height;
            this.addImg(imageManager.imageType.IMG, img.src, width, height)
        }
        imgs = document.images;
        if(imgs && imgs.length>0){
            for (var i = 0; i < imgs.length; i++) {
                try{var img = imgs[i];
                    var newImg = new Image();
                    newImg.src = img.currentSrc;
                    var width = 0
                      , height = 0;
                    width = parseInt(img.naturalWidth);
                    height = parseInt(img.naturalHeight);
                    nwidth = parseInt(newImg.width);
                    nheight = parseInt(newImg.height);
                    width = nwidth > width ? nwidth : width;
                    height = nheight > height ? nheight : height;
                    newImg = null ;
                    this.addImg(imageManager.imageType.IMG, img.currentSrc, width, height)
                }catch(e){}
            }
        }
        try{
            imgs = imageManager.querySelectorAllShadows("img");
            if(imgs && imgs.length>0){
                for (var i = 0; i < imgs.length; i++) {
                    try{var img = imgs[i];
                        var newImg = new Image();
                        newImg.src = img.currentSrc;
                        var width = 0
                          , height = 0;
                        width = parseInt(img.naturalWidth);
                        height = parseInt(img.naturalHeight);
                        nwidth = parseInt(newImg.width);
                        nheight = parseInt(newImg.height);
                        width = nwidth > width ? nwidth : width;
                        height = nheight > height ? nheight : height;
                        newImg = null ;
                        this.addImg(imageManager.imageType.IMG, img.currentSrc, width, height)
                    }catch(e){}
                }
            }
        }catch(e){
            //experimental feature lets catch everything
        }
        var sources = document.getElementsByTagName("source");
        if(sources && sources.length>0){
            for (var i = 0; i < sources.length; i++) {
                try{
                    var source = sources[i];
                    if(!source.srcset)
                        continue;
                    var newImg = new Image();
                    newImg.src = source.srcset;
                    var width = parseInt(newImg.naturalWidth);
                    var height = parseInt(newImg.naturalHeight);
                    nwidth = parseInt(newImg.width);
                    nheight = parseInt(newImg.height);
                    width = nwidth > width ? nwidth : width;
                    height = nheight > height ? nheight : height;
                    this.addImg(imageManager.imageType.IMG, newImg.src, width, height)
                    newImg = null ;
                }catch(e){}
            }
        }
        
        var srcsets = document.querySelectorAll("img[srcset]");
        if(srcsets && srcsets.length>0){
            for (var i = 0; i < srcsets.length; i++) {
                try{
                    var img = srcsets[i];
                    if(!img.srcset)
                        continue;
                    var srcset=img.srcset.split(",");
                    for(var j=0;j<srcset.length;j++){
                        try{
                            var src=srcset[j];
                            src=src.substring(0,src.indexOf(" ")!=-1?src.indexOf(" "):src.length);
                            var newImg = new Image();
                            newImg.src = src;
                            src=newImg.src;
                            var width = parseInt(newImg.naturalWidth);
                            var height = parseInt(newImg.naturalHeight);
                            nwidth = parseInt(newImg.width);
                            nheight = parseInt(newImg.height);
                            width = nwidth > width ? nwidth : width;
                            height = nheight > height ? nheight : height;
                            newImg = null ;
                            console.log("adding img from srcset: "+src+" w: "+width+" h:"+height);
                            this.addImg(imageManager.imageType.IMG, src, width, height)
                        }catch(e){
                            console.error("cannot add image of srcset: ");
                        }
                    }
                }catch(e){}
            }
        }
        
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var type = input.type;
            if (type.toUpperCase() == "IMAGE") {
                var src = input.src;
                this.addImg(imageManager.imageType.INPUT_IMG, src, 0, 0)
            }
        }
        var links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var href = link.href;
            if (href.endsWith(".jpg") || href.endsWith(".jpeg") || href.endsWith(".bmp") || href.endsWith(".ico") || href.endsWith(".gif") || href.endsWith(".png")) {
                this.addImg(imageManager.imageType.LINK, href, 0, 0)
            }
        }
        var url, B= [], A= document.getElementsByTagName('*');
        A= B.slice.call(A, 0, A.length);
        while(A.length){
            url= imageManager.deepCss(A.shift(),'background-image');
            try{
                if(url && url!="none") {
                    var re = /url\(['"]?([^")]+)/g;
                    var matches;
                    while ((matches = re.exec(url)) != null) {
                        var src=matches[1];
                        if(src && imageManager.arrayIndexOf(B,src)== -1) {
                            var newImg = new Image();
                            newImg.src = src;
                            src=newImg.src;
                            this.addImg(imageManager.imageType.BACKGROUND,src,0,0);
                        }
                    }
                }
            }catch(e){
                console.error("cannot add image background-image");
            }
        }
        
        url, B= [], A= document.getElementsByTagName('*');
        A= B.slice.call(A, 0, A.length);
        while(A.length){
            url= imageManager.deepCss(A.shift(),'background');
            try{
                if(url && url!="none") {
                    var re = /url\(['"]?([^")]+)/g;
                    var matches;
                    while ((matches = re.exec(url)) != null) {
                        var src=matches[1];
                        if(src && imageManager.arrayIndexOf(B,src)== -1) {
                            var newImg = new Image();
                            newImg.src = src;
                            src=newImg.src;
                            this.addImg(imageManager.imageType.BACKGROUND,src,0,0);
                        }
                    }
                }
            }catch(e){
                console.error("cannot add image background-image");
            }
        }
        try{
            var urls=document.body.innerHTML.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?//=]*)/gi).filter(function(itm, i, a) {
                return i == a.indexOf(itm);
            });
            for(var i=0;i<urls.length;i++)
                if(urls[i].match(/.*(\.png|\.svg|\.jpg|\.gif|\.jpeg|\.bmp|\.ico|\.webp|\.tif|\.apng|\.jfif|\.pjpeg|\.pjp).*/i)!=null)
                    this.addImg(imageManager.imageType.LINK, urls[i], 0, 0)
        }catch(e){
            console.log("getImages error retreiving images by url: "+e);
        }
        //move popup into html of the page
        /*https://github.com/mitchas/Keyframes.app/tree/master/Keyframes.app%20(Extension)/js
        $.get(chrome.extension.getURL('popup.html'), function (data) {
            debugger;
            $("body").append(data);
        });
        */
        return this.imgList
    },
    addImg: function(d, f, c, a) {
        this.imgList.push({
            type: d,
            src: f,
            width: c,
            height: a
        })
    },
    getUniqueImagesSrcs:function(){
        var images=imageManager.getImages();
        var imagesStrArray=new Array();
        for(var i=0;i<images.length;i++){
            imagesStrArray[imagesStrArray.length]=images[i].src;
        }
        var uniques = imagesStrArray.reverse().filter(function (e, i, arr) {
            return arr.indexOf(e, i+1) === -1;
        }).reverse();
        return uniques;
    },
    deepCss:function(who, css){
        if(!who || !who.style) return '';
        var sty= css.replace(/\-([a-z])/g, function(a, b){
            return b.toUpperCase();
        });
        if(who.currentStyle){
            return who.style[sty] || who.currentStyle[sty] || '';
        }
        var dv= document.defaultView || window;
        return who.style[sty] || dv.getComputedStyle(who,"").getPropertyValue(css) || '';
    },
    arrayIndexOf:function(array,what, index){
        index= index || 0;
        var L= array.length;
        while(index< L){
            if(array[index]=== what) return index;
            ++index;
        }
        return -1;
    },
    querySelectorAllShadows: function(selector, el = document.body) {
        // recurse on childShadows
        const childShadows = Array.from(el.querySelectorAll('*')).
        map(el => el.shadowRoot).filter(Boolean);

        // console.log('[querySelectorAllShadows]', selector, el, `(${childShadows.length} shadowRoots)`);

        const childResults = childShadows.map(child => imageManager.querySelectorAllShadows(selector, child));

        // fuse all results into singular, flat array
        const result = Array.from(el.querySelectorAll(selector));
        return result.concat(childResults).flat();
    }
};
/*chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case "getImages":
                var images=imageManager.getUniqueImagesSrcs();
                console.log("getImages: found "+images.length+" images");
                sendResponse(images);
                break;
            default:
                console.error("Unrecognised message: ", message);
        }
    }
);*/
var result={
    images:imageManager.getUniqueImagesSrcs(),
    title:document.title,
    isTop:window.top == window.self,
    origin:window.location.origin
}
result