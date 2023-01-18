var conf={
    defaults:{
        minwidth:0,
        minheight:0,
        downloadseparatefolder:false,
        downloadfolderpref:"basedonurl",
        savefoldername:"imageye",
        donotbother:false,
        numviews:0,
        allframes:false,
        biggerview:true,
        web2jpg:false,
        twocols:true,
        newshown1:false,
        hidetools:false,
        savesize:false,
        sizetype:"any"
    },
    minwidth:0,
    minheight:0,
    urlpattern:"",
    downloadseparatefolder:false,
    downloadfolderpref:"basedonurl",
    savefoldername:"imageye",
    donotbother:false,
    changed:false,
    allframes:false,
    biggerview:true,
    web2jpg:false,
    twocols:true,
    newshown1:false,
    hidetools:false,
    savesize:false,
    sizetype:"any"
}
var imageye={
    darkmode:window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    imageCT:new Object(),
    selection:new Object(),
    allimages:new Object(),
    stats:{
        types:{},
        sizes:{}
    },
    getImages:function(onlyTopFrame){
        chrome.runtime.sendMessage({msg: "getImagesCT"}, function(response) {
            //dummy call for waking the bg service worker
        });
        imageye.initiated=false;
        var allFrames=conf.allframes;
        if(allFrames)
            allFrames=!onlyTopFrame;
        imageye.allimages=new Object();
        imageye.monitorStatus(onlyTopFrame);
        //reset old results
        var ihtml='<div id="spinner" class="spinner"><span id="processedImages" style="position: absolute;top: -38px;left: 50%;transform:translateX(-50%);white-space:nowrap;"></span><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
        if($("#imgsContainer")[0].innerHTML.trim()!=ihtml){
            $("#imgsContainer")[0].innerHTML=ihtml;
        }
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            imageye.currUrl=tabs[0].url;
            chrome.scripting.executeScript({target:{tabId:tabs[0].id,allFrames: allFrames}, files:['app.js']}, (res) => {imageye.getImagesCallback(res);})
        })
    },
    getImagesCallback: async function(results){
        if(imageye.initiated)
            return
        console.log(results);
        imageye.initiated=true;
        if(chrome.extension.lastError || !results){
            var message=chrome.extension.lastError?chrome.extension.lastError.message:"Cannot access images in this page."
            if(message.indexOf("The extensions gallery cannot be scripted")!=-1 || message.indexOf("Missing host permission for the tab")!=-1){
                //$("#imgsContainer")[0].style.background="linear-gradient(#31388d,#753fa9,#ff0762,#f25632)";
                //$("#imgsContainer")[0].style.color="#fff";
                $("#imgsContainer")[0].style.padding="0px 20px";
                $("#imgsContainer")[0].style.position="relative";
                message='<div style="width:387px;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 201.526 201.526" style="enable-background:new 0 0 512 512;width: 65px;height: 65px;float: left;" xml:space="preserve" class=""><g><path d="M191.125,11.403H10.4C4.666,11.403,0,16.068,0,21.805v59.108c0,5.738,4.666,10.404,10.4,10.404h180.726     c5.734,0,10.4-4.666,10.4-10.403V21.805C201.525,16.068,196.86,11.403,191.125,11.403z M194.577,80.914h-0.001     c0,1.903-1.547,3.454-3.451,3.454H10.4c-1.904,0-3.451-1.551-3.451-3.454V21.805c0-1.903,1.547-3.454,3.451-3.454h180.726     c1.903,0,3.451,1.551,3.451,3.454V80.914z" fill="#333333" data-original="#000000" style="" class=""></path><path d="M63.924,35.968c-1.751-0.801-3.807-0.027-4.605,1.714L48.821,60.606l-3.19-6.696l6.109-13.338     c0.797-1.744,0.034-3.807-1.714-4.605c-1.751-0.801-3.811-0.027-4.605,1.714l-3.687,8.051l-3.859-8.099     c-0.825-1.734-2.888-2.477-4.628-1.642c-1.734,0.825-2.47,2.898-1.642,4.628l6.358,13.347l-3.04,6.638l-10.947-22.97     c-0.821-1.734-2.888-2.477-4.628-1.642c-1.734,0.825-2.47,2.898-1.642,4.628l14.143,29.686c0.573,1.211,1.795,1.982,3.135,1.982     c0.01,0,0.017,0,0.027,0c1.347-0.01,2.569-0.801,3.132-2.029l3.716-8.113l3.888,8.161c0.573,1.211,1.795,1.982,3.135,1.982     c0.01,0,0.017,0,0.027,0c1.347-0.01,2.569-0.801,3.132-2.029l13.596-29.686C66.434,38.83,65.671,36.766,63.924,35.968z" fill="#333333" data-original="#000000" style="" class=""></path><path d="M122.991,35.968c-1.754-0.801-3.807-0.027-4.605,1.714l-10.498,22.924l-3.19-6.696l6.109-13.338     c0.797-1.744,0.034-3.807-1.714-4.605c-1.751-0.801-3.807-0.027-4.604,1.714l-3.687,8.051l-3.859-8.099     c-0.821-1.734-2.891-2.477-4.628-1.642c-1.734,0.825-2.47,2.898-1.642,4.628l6.358,13.347l-3.04,6.638l-10.947-22.97     c-0.821-1.734-2.891-2.477-4.628-1.642c-1.734,0.825-2.47,2.898-1.642,4.628l14.143,29.686c0.573,1.211,1.795,1.982,3.135,1.982     c0.01,0,0.017,0,0.027,0c1.347-0.01,2.569-0.801,3.132-2.029l3.716-8.113l3.888,8.161c0.573,1.211,1.795,1.982,3.135,1.982     c0.01,0,0.017,0,0.027,0c1.347-0.01,2.569-0.801,3.132-2.029l13.596-29.686C125.502,38.83,124.739,36.766,122.991,35.968z" fill="#333333" data-original="#000000" style="" class=""></path><path d="M182.059,35.968c-1.751-0.801-3.807-0.027-4.605,1.714l-10.498,22.924l-3.19-6.696l6.109-13.338     c0.797-1.744,0.034-3.807-1.714-4.605c-1.751-0.801-3.807-0.027-4.605,1.714l-3.687,8.051l-3.859-8.099     c-0.821-1.734-2.888-2.477-4.628-1.642c-1.734,0.825-2.47,2.898-1.642,4.628l6.358,13.347l-3.04,6.638l-10.946-22.971     c-0.821-1.734-2.888-2.477-4.628-1.642c-1.734,0.825-2.47,2.898-1.642,4.628l14.143,29.686c0.573,1.211,1.795,1.982,3.135,1.982     c0.01,0,0.017,0,0.027,0c1.347-0.01,2.569-0.801,3.132-2.029l3.716-8.113l3.888,8.161c0.573,1.211,1.795,1.982,3.135,1.982     c0.01,0,0.017,0,0.027,0c1.347-0.01,2.569-0.801,3.132-2.029l13.596-29.686C184.57,38.83,183.806,36.766,182.059,35.968z" fill="#333333" data-original="#000000" style="" class=""></path><path d="M183.461,140.316L130.3,97.208c-1.065-0.865-2.545-1.018-3.766-0.397c-1.222,0.621-1.965,1.907-1.893,3.278l3.627,68.345     c0.078,1.455,1.055,2.708,2.45,3.139c1.384,0.421,2.904-0.061,3.787-1.222c0.065-0.081,5.398-7.075,11.231-12.901l15.68,30.776     c0.417,0.821,1.143,1.442,2.022,1.727c0.35,0.112,0.713,0.17,1.072,0.17c0.543,0,1.086-0.129,1.578-0.38l12.385-6.311     c0.821-0.417,1.442-1.143,1.727-2.022c0.285-0.876,0.21-1.829-0.21-2.65l-15.68-30.772c8.14-1.293,16.932-1.5,17.037-1.5     c1.455-0.034,2.742-0.97,3.213-2.348C185.031,142.759,184.594,141.232,183.461,140.316z M158.337,142.055     c-1.045,0.238-1.92,0.943-2.375,1.914c-0.451,0.97-0.434,2.097,0.054,3.05l16.206,31.8l-6.192,3.156l-16.206-31.804     c-0.485-0.953-1.384-1.632-2.436-1.832c-0.217-0.044-0.438-0.065-0.658-0.065c-0.831,0-1.646,0.298-2.283,0.859     c-3.444,3.003-6.926,6.756-9.715,9.972l-2.734-51.576l40.117,32.53C167.876,140.426,162.793,141.037,158.337,142.055z" fill="#333333" data-original="#000000" style="" class=""></path></g></svg><div style="float: left;padding-left: 15px;width:300px;">Visit a website and you will be able to find and download all the images...</div></div>'
            }
            var errordiv=document.createElement("div");
            errordiv.innerHTML="<div style='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);'>"+message+"</center>";
            errordiv.style.width="100%";
            errordiv.style.height="100%";
            $("#imgsContainer")[0].appendChild(errordiv);
            document.getElementById("spinner").style.display="none";
            document.getElementById("searchingimages").style.display="none";
            var numImagesFoundDiv=document.getElementById("numimagesfound")
            numImagesFoundDiv.origMessage=numImagesFoundDiv.origMessage||numImagesFoundDiv.innerHTML;
            numImagesFoundDiv.innerHTML=numImagesFoundDiv.origMessage.replace("%n",document.querySelectorAll(".imgContainer").length);
            document.getElementById("numimagesfound").style.display="";
            document.getElementById("selectalla").style.visibility="visible";
        }else{
            //console.log("results length: "+results.length);
            var processedImages=0;
            var totalImages=0;
            for(var r=0;r<results.length;r++){
                if(results[r]!=null && results[r].result.images!=null && results[r].result.images.length>0){
                    totalImages+=results[r].result.images.length;
                }
            }
            if(totalImages==0){
                imageye.foundlastimage();
                return;
            }
            
            $("#processedImages")[0].innerHTML="analyzing 0 of "+totalImages+" images";
            
            for(var r=0;r<results.length;r++){
                if(results[r]==null || results[r].result.images==null)
                    continue
                localStorage.active_tab_origin = results[r].result.origin;
                var images=results[r].result.images;
                console.log("images length: "+images.length);
                if(results[r].result.isTop)
                    imageye.title=results[r].result.title;
                var fixRefererRules=[];
                var deleteOldRefererRules=[];
                for(var i=0;i<images.length;i++){
                    var ruleId=i+1;
                    if(images[i] && images[i].indexOf("http")==0){
                        fixRefererRules[fixRefererRules.length]={
                            "id": ruleId,
                            "priority": 1,
                            "action": { 
                                "type": "modifyHeaders",
                                "requestHeaders": [
                                    { "header": "Referer", "operation": "set", "value":localStorage.active_tab_origin }
                                ]
                            },
                            "condition": {"urlFilter": images[i], "resourceTypes": ["image"] }
                        }
                        deleteOldRefererRules[deleteOldRefererRules.length]=ruleId;
                    }
                    
                }
                await chrome.declarativeNetRequest.updateSessionRules({
                    addRules:fixRefererRules,
                    removeRuleIds: deleteOldRefererRules
                })
                for(var i=0;i<images.length;i++){
                    try{
                        console.log("going to inject img: "+images[i]);
                        if(imageye.allimages[images[i]]){
                            processedImages++;
                            continue;
                        }
                        imageye.allimages[images[i]]=images[i];
                        var img=document.createElement("img");
                        img.src=images[i];
                        img.style.maxWidth="600px";
                        function errorHandler(){
                            processedImages++;
                            $("#processedImages")[0].innerHTML="analyzing "+processedImages+" of "+totalImages+" images";
                            if(processedImages==totalImages){
                                imageye.foundlastimage();
                            }
                        }
                        var timeout=setTimeout(function(img){
                            img.setAttribute("timeoutExpired",true);
                            errorHandler()
                        },Math.min(Math.max((totalImages/10*1000),5000),60000),img);
                        img.setAttribute("timeout",timeout);
                        
                        img.onerror = function(){
                            if(this.getAttribute("timeoutExpired"))
                                return;
                            clearTimeout(this.getAttribute("timeout"));
                            errorHandler()
                        }
                        img.onload = async function() {
                            if(this.getAttribute("timeoutExpired"))
                                return;
                            clearTimeout(this.getAttribute("timeout"));
                            processedImages++;
                            $("#processedImages")[0].innerHTML="analyzing "+processedImages+" of "+totalImages+" images";
                            
                            var imgSrc=this.src;
                            var div=document.createElement("div");
                            div.className="imgContainer";
                            
                            var width = this.width;    // Current image width
                            var height = this.height;  // Current image height
                            var pixels=width*height;
                            div.setAttribute("pixels",pixels);
                            div.setAttribute("width",width);
                            div.setAttribute("height",height);
                            
                            if(pixels<200*200)
                                div.setAttribute("sizeType","small");
                            if(pixels>=200*200)
                                div.setAttribute("sizeType","medium");
                            if(pixels>=800*600)
                                div.setAttribute("sizeType","large");
                                
                            if(width>=(height*1.2))
                                div.setAttribute("layout","wide");
                            else if(height>=(width*1.2))
                                div.setAttribute("layout","tall");
                            else
                                div.setAttribute("layout","square");
                                
                            var style="style='wwidth:" + width + "px;hheight:" + height + "px'";
                            div.innerHTML="<img class='origImg' id='"+imgSrc+"' src='"+imgSrc+"' "+style+"><br><input class='imgInput' value='"+this.src+"'><div class='imgInfo'><div class='imgSize imgDimension' style='margin-left:5px;'>-</div><div class='imgSize'>"+this.width+"x"+this.height+"</div><div class='imgSize imgType' style='margin-right:5px;'>other</div><div class='imgActions'><input type='checkbox'><img class='zoomIcon' title='"+chrome.i18n.getMessage("openinnewtab")+"' src='/newtab.png' /><img class='zoomIcon downloadIcon' title='"+chrome.i18n.getMessage("download")+"' src='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI5Ljk3OCAyOS45NzgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI5Ljk3OCAyOS45Nzg7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4Ij4KPGc+Cgk8cGF0aCBkPSJNMjUuNDYyLDE5LjEwNXY2Ljg0OEg0LjUxNXYtNi44NDhIMC40ODl2OC44NjFjMCwxLjExMSwwLjksMi4wMTIsMi4wMTYsMi4wMTJoMjQuOTY3YzEuMTE1LDAsMi4wMTYtMC45LDIuMDE2LTIuMDEyICAgdi04Ljg2MUgyNS40NjJ6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNMTQuNjIsMTguNDI2bC01Ljc2NC02Ljk2NWMwLDAtMC44NzctMC44MjgsMC4wNzQtMC44MjhzMy4yNDgsMCwzLjI0OCwwczAtMC41NTcsMC0xLjQxNmMwLTIuNDQ5LDAtNi45MDYsMC04LjcyMyAgIGMwLDAtMC4xMjktMC40OTQsMC42MTUtMC40OTRjMC43NSwwLDQuMDM1LDAsNC41NzIsMGMwLjUzNiwwLDAuNTI0LDAuNDE2LDAuNTI0LDAuNDE2YzAsMS43NjIsMCw2LjM3MywwLDguNzQyICAgYzAsMC43NjgsMCwxLjI2NiwwLDEuMjY2czEuODQyLDAsMi45OTgsMGMxLjE1NCwwLDAuMjg1LDAuODY3LDAuMjg1LDAuODY3cy00LjkwNCw2LjUxLTUuNTg4LDcuMTkzICAgQzE1LjA5MiwxOC45NzksMTQuNjIsMTguNDI2LDE0LjYyLDE4LjQyNnoiIGZpbGw9IiMwMDAwMDAiLz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K' />"+(imgSrc.toLowerCase().indexOf("http")==-1?"":("<img class='zoomIcon searchsimilarimgs' title='"+chrome.i18n.getMessage("searchsimilarimgs")+"' src='/searchsimilarimgs.png' />"))+"</div></div>";
                            div.setAttribute("imgsrc",imgSrc);
                            
                            /*find the right place for appending based on pixels*/
                            var currentImagesDivs=document.getElementsByClassName("imgContainer");
                            var appended=false;
                            for(var i=0;i<currentImagesDivs.length;i++){
                                if(pixels>currentImagesDivs[i].getAttribute("pixels")){
                                    $(currentImagesDivs[i]).before( div );
                                    appended=true;
                                    break;
                                }
                            }
                            if(!appended)
                                document.getElementById("imgsContainer").appendChild(div);
                            
                            div.onclick = function(event) {
                                if(event.target.className=="imgInput"){
                                    return;
                                }
                                if(event.target.className=="zoomIcon"){
                                    //chrome.tabs.create({ url: imgSrc, active: !event.metaKey && !event.ctrlKey  });
                                    chrome.tabs.create({ url: imgSrc, active: false});
                                    return;
                                }
                                if(event.target.className=="zoomIcon searchsimilarimgs"){
                                    chrome.tabs.create({ url: " https://lens.google.com/uploadbyurl?url="+encodeURIComponent(imgSrc), active: true});
                                    return;
                                }
                                
                                if(event.target.className=="zoomIcon downloadIcon"){
                                    chrome.downloads.download({
                                        url: (conf.web2jpg && this.getAttribute("convertedimgsrc"))? this.getAttribute("convertedimgsrc") : this.getAttribute("imgsrc")
                                    });
                                    return;
                                }
                                
                                imageye.selectImg(this);
                            }
                            if(processedImages==totalImages)
                                imageye.foundlastimage();
                        }
                    }catch(e){
                        console.log(e);
                    }
                }
            }
        }
    },
    selectImg:function(div,force,forceValue){
        var src=conf.web2jpg && div.getAttribute("convertedimgsrc")?div.getAttribute("convertedimgsrc") : div.getAttribute("imgsrc")
        var checkbox=div.querySelector('input[type="checkbox"]');
        
        var toSelect=force?forceValue:!imageye.selection[src];
        if(toSelect){
            checkbox.checked="checked";
            imageye.selection[src]=src;
            div.classList.add("imgSelected");
        }else{
            checkbox.checked="";
            delete imageye.selection[src];
            div.classList.remove("imgSelected");
        }
        var selectionLength=0;
        for (var k in imageye.selection) {
            if (imageye.selection.hasOwnProperty(k)) 
                selectionLength++;
        }
        if(selectionLength==0){
            $("#downloadButton")[0].style.display="none";
            $("#foundimagesinnerdiv")[0].style.display="";
        }else{
            $("#downloadButton")[0].innerHTML="<img src='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDUyLjc1NiA1Mi43NTciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUyLjc1NiA1Mi43NTc7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZD0iTTI2LjEwNiwyOS4wNTlsMTAuNTIzLTEwLjUyM2MxLjA0Ny0xLjAyNCwwLjgxMy0xLjc0Ni0wLjY0OS0xLjc0NmgtNS44NzNMMzAuMTA4LDRjMC0yLjIwOS0xLjc5LTQtNC00bDAsMCAgICAgYy0yLjIwOSwwLTQsMS43OTEtNCw0bC0wLjAwMSwxMi43ODloLTUuODc2Yy0xLjQ2Mi0wLjAwMS0xLjY5MywwLjcyMy0wLjY0NiwxLjc0N0wyNi4xMDYsMjkuMDU5eiIgZmlsbD0iI0ZGRkZGRiIvPgoJCQk8cGF0aCBkPSJNNDkuMDI3LDI1Ljc3aC02LjA0OWMtMC41NTQsMC0xLDAuNDQ3LTEsMXYxNy45MzlIMTAuNzhWMjYuNzdjMC0wLjU1My0wLjQ0Ny0xLTEtMUgzLjczMWMtMC41NTMsMC0xLDAuNDQ3LTEsMXYyMC40NjQgICAgIGMwLDMuMDQ1LDIuNDc5LDUuNTIyLDUuNTI0LDUuNTIyaDM2LjI0OGMzLjA0NiwwLDUuNTIzLTIuNDc5LDUuNTIzLTUuNTIyVjI2Ljc3QzUwLjAyNywyNi4yMTcsNDkuNTgxLDI1Ljc3LDQ5LjAyNywyNS43N3oiIGZpbGw9IiNGRkZGRkYiLz4KCQk8L2c+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==' />"+chrome.i18n.getMessage("manyfilesnum").replace("%n",selectionLength);
            $("#downloadButton")[0].style.display="";
            $("#foundimagesinnerdiv")[0].style.display="none";
        }
        var allimages=document.getElementsByClassName("imgContainer");
        
        $("#selectalla")[0].innerHTML=allimages.length==selectionLength?chrome.i18n.getMessage("deselectall"):chrome.i18n.getMessage("selectall");
    },
    monitorStatus:function(onlyTopFrame){
        setTimeout(function(){
            if(imageye.initiated)
                return
            if(!onlyTopFrame){
                imageye.getImages(true)
                return;
            }
            //var img=document.createElement("img");
            //img.src="https://www.marenauta.com/imageyeerror?url="+imageye.currUrl;
            var message="Something went wrong, Please refresh this page."
            $("#imgsContainer")[0].innerHTML="<br><br><br><br><br><br><br><br><br><br><br><br><br><br><center>"+message+"<br><br><a href='#' id='reloada'>Refresh</a></center><br><br><br><br>";
            $("#reloada")[0].onclick = function() {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
                });
            };
            document.getElementById("searchingimages").style.display="none";
            var numImagesFoundDiv=document.getElementById("numimagesfound")
            numImagesFoundDiv.origMessage=numImagesFoundDiv.origMessage||numImagesFoundDiv.innerHTML;
            numImagesFoundDiv.innerHTML=numImagesFoundDiv.origMessage.replace("%n",document.querySelectorAll(".imgContainer").length);
            document.getElementById("numimagesfound").style.display="";
            document.getElementById("selectalla").style.visibility="visible";
        },10000);
    },
    showPrefs:function(){
        if(document.body.classList.contains("showPrefs")){
            document.body.classList.remove("showPrefs");
        }else{
            if(!chrome.downloads.onDeterminingFilename)
                $("#downloadseparatefoldercont")[0].style.display="none"
            $("#downloadocationcontainer")[0].style.display=conf.downloadseparatefolder?"block":"none";
            $("#downloadseparatefolder")[0].checked=conf.downloadseparatefolder?true:false;
            $("input[name='downloadfolderpref']").val([conf.downloadfolderpref]);
            $("#savefoldername").val(conf.savefoldername||conf.defaults.savefoldername);
            $("#donotbother")[0].checked=conf.donotbother?true:false;
            $("#allframes")[0].checked=conf.allframes?true:false;
            $("#biggerview")[0].checked=conf.biggerview?true:false;
            $("#web2jpg")[0].checked=conf.web2jpg?true:false;
            $("#twocols")[0].checked=conf.twocols?true:false;
            document.body.classList.add("showPrefs");
            chrome.storage.sync.set({
                newshown1: true
            });
        }
    },
    savePrefs:function(){
        conf.downloadseparatefolder=$("#downloadseparatefolder")[0].checked
        conf.downloadfolderpref=$("input[name='downloadfolderpref']:checked").val()
        conf.savefoldername=$("#savefoldername").val();
        conf.donotbother=$("#donotbother")[0].checked
        conf.biggerview=$("#biggerview")[0].checked
        conf.web2jpg=$("#web2jpg")[0].checked
        conf.twocols=$("#twocols")[0].checked
        conf.allframes=$("#allframes")[0].checked
        chrome.storage.sync.set({
            downloadseparatefolder: conf.downloadseparatefolder,
            downloadfolderpref: conf.downloadfolderpref, 
            savefoldername: conf.savefoldername,
            donotbother: conf.donotbother,
            biggerview: conf.biggerview,
            web2jpg: conf.web2jpg,
            twocols: conf.twocols,
            allframes: conf.allframes
        });
        document.body.classList.remove("showPrefs");
    },
    showRating:function(){
        if(document.body.classList.contains("showRating")){
            document.body.classList.remove("showRating");
        }else{
            document.body.classList.add("showRating");
        }
    },
    openRatingTab: function(){
        window.open("https://chrome.google.com/webstore/detail/imageye-image-downloader/agionbommeaifngbhincahgmoflcikhm/reviews");
    },
    downloadImages:async function(){
        //39sec 204 immagini - con 300ms
        //41sec 206 immagini - con 1000ms
        //2:16  774/780 immagini - con 300ms
        //2:24  /780 immagini - con 1000ms
        var urls=[];
        for (var k in imageye.selection) 
            if (imageye.selection.hasOwnProperty(k)) 
                urls[urls.length]=k;
        
        var progressBack=document.createElement("div");
        progressBack.className="disableBackround";
        var progress=document.createElement("progress");
        var progressText=document.createElement("div");
        progressText.className="progressText";
        progressBack.appendChild(progress);
        progressBack.appendChild(progressText);
        document.body.appendChild(progressBack);
        
        progress.max=urls.length;
        for (var i=0;i<urls.length;i++) {
            await Promise.race([
                chrome.downloads.download({
                    "url": urls[i]
                }), 
                new Promise((_r, rej) => setTimeout(_r, 1000))
            ]);
            progress.value=i+1;
            progressText.innerHTML=("downloading image "+(i+1)+" of "+urls.length);
        }
        progressBack.remove();
    },
    downloadImagesMah:async function(){
        //33sec 205 immagini con 100ms
        //90sec 290/296 immagini - con 300ms
        //4:00 774/780 immagini - con 300ms
        //FAILED ??/780 immagini - con 100ms 
        var urls=[];
        for (var k in imageye.selection) 
            if (imageye.selection.hasOwnProperty(k)) 
                urls[urls.length]=k;
        
        var progressBack=document.createElement("div");
        progressBack.className="disableBackround";
        var progress=document.createElement("progress");
        var progressText=document.createElement("div");
        progressText.className="progressText";
        progressBack.appendChild(progress);
        progressBack.appendChild(progressText);
        document.body.appendChild(progressBack);
        progress.value=0;
        progress.max=urls.length;
        for (var i=0;i<urls.length;i++) {
            chrome.downloads.download({
                "url": urls[i]
            })
            progress.value=i+1;
            progressText.innerHTML=("downloading image "+(i+1)+" of "+urls.length);
            await new Promise(_r => setTimeout(_r, 100));
        }
        progressBack.remove();
    },
    suggestFileName:function(item,suggest){
        var title="Imageye - " + imageye.title;
        if(conf.downloadfolderpref=="usefixedfoldername")
            title=conf.savefoldername || conf.defaults.savefoldername;
        title=title.replace(new RegExp('[^0-9a-zA-Z-_ ]', 'g'), "_")
        
        var filename=item.filename;
        try{
            filename=filename.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
        }catch(e){}
        if(conf.downloadseparatefolder)
            filename = title + '/' + filename;
        console.log(filename)
        suggest({
            filename: filename
        });
    },
    init:function(){
        $("#container").height($(window).height()-1);
        if(conf.biggerview)
            $("#container").addClass("bigger")
        if(conf.newshown1)
            $("body").addClass("newshown1")
        if(conf.twocols)
            $("#container").addClass("twocols")
        if(conf.hidetools)
            imageye.showTools(false);
        setTimeout(function(){
            $("#container")[0].style.maxWidth=document.body.offsetWidth+"px";
        },100);
        
        imageye.localize();
        imageye.initSizeMenu();
        imageye.getImages();
        
        if(chrome.downloads.onDeterminingFilename)
            chrome.downloads.onDeterminingFilename.addListener(imageye.suggestFileName);
        
        $("#toolsButton")[0].onclick = function(){
            imageye.showTools();
        }
        $("#showPrefs")[0].onclick = imageye.showPrefs;
        
        $("#saveprefscancel")[0].onclick=imageye.showPrefs
        $("#saveprefs")[0].onclick=imageye.savePrefs       
        
        $("#downloadseparatefolder")[0].onclick=function(){
            $("#downloadocationcontainer")[0].style.display=$("#downloadseparatefolder")[0].checked?"block":"none";
        }
        $("#saveaslink")[0].onclick=function(){
            event.preventDefault();
            chrome.tabs.create({ url: "chrome://settings/downloads", active: true});
        }
        $("#biggerview")[0].onclick=function(){
            $("#container")[0].style.maxWidth="unset";
            if($("#biggerview")[0].checked){
                $("#container").addClass("bigger");
            }else{
                $("#container").removeClass("bigger");
            }
            $("#container")[0].style.maxWidth=document.body.offsetWidth+"px";
        }
        $("#twocols")[0].onclick=function(){
            if($("#twocols")[0].checked)
                $("#container").addClass("twocols");
            else
                $("#container").removeClass("twocols");
        }
        document.querySelector(".twoColsPref").onclick=function(){
            conf.twocols=!conf.twocols;
            if(conf.twocols)
                $("#container").addClass("twocols");
            else
                $("#container").removeClass("twocols");
            
            chrome.storage.sync.set({
                twocols: conf.twocols
            });
        }
        
        
        $("#selectalla")[0].onclick = function(){
            var allimages=$(".imgContainer:not(.excluded)");
            var selectionLength=0;
            for (var k in imageye.selection) {
                if (imageye.selection.hasOwnProperty(k)) 
                    selectionLength++;
            }
            var toSelect=true;
            if(allimages.length==selectionLength){
                toSelect=false;
            }
            allimages.each(function(){
                imageye.selectImg(this,true,toSelect);
            })
        }
        $("#downloadButton")[0].onclick = function(){
            var selectionLength=0;
            for (var k in imageye.selection)
                if (imageye.selection.hasOwnProperty(k)) 
                    selectionLength++;
            if(selectionLength>2 && !conf.donotbother){
                if(navigator.userAgent.indexOf("Firefox") != -1){
                    chromemanyfileswarning.style.display="none";
                    firefoxmanyfileswarning.style.display="block";
                }
                $("#manyfilesnum")[0].innerHTML=$("#manyfilesnum")[0].innerHTML.replace("%n",selectionLength);
                $("#manyfiles")[0].style.display="block";
                $("#manyfilesdownload")[0].onclick=function(){
                    conf.donotbother=$("#donotbotherme")[0].checked;
                    chrome.storage.sync.set({
                        donotbother: conf.donotbother
                    });
                    imageye.downloadImages();
                    $("#manyfiles")[0].style.display="none";
                }
                $("#manyfilescancel")[0].onclick=function(){
                    $("#manyfiles")[0].style.display="none";
                }
                $("#donotbotherme")[0].checked=false;
                return;
            }
            imageye.downloadImages();
        }
        $("#filterbyurlinput").on("input",function(event){
            var inputurl=this.value;
            var menuLabel=$(event.target).closest(".filters > div").find(".menuLabel");
            menuLabel.html("URL");
            menuLabel.removeClass("changedMenu");
            if(inputurl){
                menuLabel.html(inputurl);
                menuLabel.addClass("changedMenu");
            }
            if(event.keyCode === 13) {
                $(event.target).closest(".selectMenu").hide();
            }
            if(imageye.inputtimeout)
                clearTimeout(imageye.inputtimeout)
            imageye.inputtimeout=setTimeout( function(){
                conf.urlpattern=inputurl;
                imageye.foundlastimage();
            },300);
        })
        $("#ratebutton")[0].onclick = imageye.openRatingTab
        $("#rateclose")[0].onclick = imageye.showRating
        $( ".filters > div div[saveSize]" ).on( "click", function(event) {
            var saveSizeEl=$(this);
            if(conf.savesize){
                conf.savesize=false;
                saveSizeEl.removeClass("selected");
                imageye.saveSizeConf(true);
            }else{
                conf.savesize=true;
                saveSizeEl.addClass("selected");
                imageye.saveSizeConf();
            }
            chrome.storage.sync.set({
                savesize: conf.savesize
            });
        });
        $( ".filters > div" ).on( "mousedown", function(event) {
            $(this).find(".selectMenu").show()
        });
        $(document.body).on("click",function(event){
            $( ".filters div" ).each(function(){
                var menuEl=this;
                var clickedOnMenu=menuEl==event.target;
                
                $(event.target).parents().each(function(){
                    if(this==menuEl)
                        clickedOnMenu=true;
                });
                if(clickedOnMenu)
                    return;
                $(menuEl).find(".selectMenu").hide();
            })
        });
        $(".sizeMenu").on("click",function(event){
            var sizeMenu=this;
            var sizeConf=$(event.target).attr("sizeConf");
            if(!sizeConf)
                return;
            conf.sizetype=sizeConf;
            if(sizeConf=="custom")
                return;
            
            $(sizeMenu).find("div[sizeConf]").each(function(){
                $(this).removeClass("selected");
            });
            conf.minwidth=conf.defaults.minwidth;
            conf.minheight=conf.defaults.minheight
            $("#minwidthinput").val(conf.minwidth)
            $("#minheightinput").val(conf.minheight)
            var menuLabel=$(event.target).closest(".filters > div").find(".menuLabel");
            menuLabel.removeClass("changedMenu")
            menuLabel.html("Size")
            if(sizeConf!="any"){
                menuLabel.addClass("changedMenu")
                menuLabel.html(sizeConf.charAt(0).toUpperCase() + sizeConf.slice(1))
            }
            $(event.target).addClass("selected")
            imageye.foundlastimage();
            $(sizeMenu).hide();
        })
        $("#minwidthinput").on("input",function(event) {
            event.preventDefault();
            imageye.setCustomSize()
        })
        $("#minheightinput").on("input",function(event) {
            event.preventDefault();
            imageye.setCustomSize()
        })
        $(".typeMenu").on("click",function(event){
            var typeMenu=this;
            conf.imgtype=$(event.target).attr("typeConf");
            if(conf.imgtype.indexOf("any")==0)
                conf.imgtype=null;
            
            $(typeMenu).find("div[typeConf]").each(function(){
                $(this).removeClass("selected");
            });
            
            var menuLabel=$(event.target).closest(".filters > div").find(".menuLabel");
            menuLabel.removeClass("changedMenu")
            menuLabel.html("Type")
            if(conf.imgtype){
                menuLabel.addClass("changedMenu")
                menuLabel.html(conf.imgtype)
            }
            $(event.target).addClass("selected")
            imageye.foundlastimage();
            $(typeMenu).hide();
        })
        $(".layoutMenu").on("click",function(event){
            var layoutMenu=this;
            conf.layout=$(event.target).attr("layoutConf");
            if(conf.layout.indexOf("any")==0)
                conf.layout=null;
            
            $(layoutMenu).find("div[layoutConf]").each(function(){
                $(this).removeClass("selected");
            });
            
            var menuLabel=$(event.target).closest(".filters > div").find(".menuLabel");
            menuLabel.removeClass("changedMenu")
            menuLabel.html("Layout")
            if(conf.layout){
                menuLabel.addClass("changedMenu")
                menuLabel.html(conf.layout.charAt(0).toUpperCase() + conf.layout.slice(1))
            }
            $(event.target).addClass("selected")
            imageye.foundlastimage();
            $(layoutMenu).hide();
        })
        $(".clearFilters").on("click",function(){
            imageye.saveSizeConf(true);
            document.location.reload()
        });
    },
    setCustomSize:function(){
        conf.sizetype="custom";
        conf.minwidth=parseInt($("#minwidthinput").val()||0);
        conf.minheight=parseInt($("#minheightinput").val()||0);
        var menuLabel=$("#sizeTab").find(".menuLabel");
        menuLabel.html("Size");
        menuLabel.removeClass("changedMenu");
        if(conf.minwidth!=conf.defaults.minwidth || conf.minheight!=conf.defaults.minheight){
            menuLabel.html("> "+conf.minwidth+"&times;"+conf.minheight);
            menuLabel.addClass("changedMenu");
        }
        $("#sizeTab").find("div[sizeConf]").each(function(){
            $(this).removeClass("selected");
        });
        $("#sizeTab").find("div[sizeConf=custom]").addClass("selected");
        imageye.foundlastimage();
    },
    showTools:function(show){
        if(typeof show === 'undefined')
            $("#toolsDiv").toggle();
        else if(show)
            $("#toolsDiv").show();
        else 
            $("#toolsDiv").hide();
        var toolsHidden=!$("#toolsDiv").is(":visible");
        if(toolsHidden){
            $("#toolsButton").addClass("inactive");
        }else{
            $("#toolsButton").removeClass("inactive");
        }
        chrome.storage.sync.set({
            hidetools: toolsHidden
        });
    },
    getConf:function(callback){
        chrome.storage.sync.get({
                minwidth: conf.defaults.minwidth,
                minheight: conf.defaults.minheight,
                downloadseparatefolder:conf.defaults.downloadseparatefolder,
                downloadfolderpref:conf.defaults.downloadfolderpref,
                savefoldername:conf.defaults.savefoldername,
                donotbother:conf.defaults.donotbother,
                numviews:conf.defaults.numviews,
                allframes:conf.defaults.allframes,
                biggerview:conf.defaults.biggerview,
                web2jpg:conf.defaults.web2jpg,
                twocols:conf.defaults.twocols,
                newshown1:conf.defaults.newshown1,
                hidetools:conf.defaults.hidetools,
                savesize:conf.defaults.savesize,
                sizetype:conf.defaults.sizetype
            }, 
            function(items) {
                conf.downloadseparatefolder=items.downloadseparatefolder;
                conf.downloadfolderpref=items.downloadfolderpref;
                conf.savefoldername=items.savefoldername;
                conf.donotbother=items.donotbother;
                conf.biggerview=items.biggerview;
                conf.web2jpg=items.web2jpg;
                conf.twocols=items.twocols;
                conf.allframes=items.allframes;
                conf.newshown1=items.newshown1;
                conf.hidetools=items.hidetools;
                conf.savesize=items.savesize;
                conf.sizetype=items.sizetype;
                conf.minwidth=items.minwidth;
                conf.minheight=items.minheight;
                callback();
                
                imageye.numviews=items.numviews+1;
                var howoftentoshowrating=imageye.numviews>1000?100000:imageye.numviews>100?1000:imageye.numviews>10?100:10;
                if(imageye.numviews%howoftentoshowrating==0){
                    imageye.showRating();
                }
                chrome.storage.sync.set({
                    numviews: imageye.numviews
                });
            }
        );
    },
    foundlastimage:function(){
        if(!$("#loadingBack")[0] && $("#spinner")[0].style.display=="none"){
            var loadingBack=document.createElement("div");
            loadingBack.id="loadingBack";
            loadingBack.className="disableBackround";
            loadingBack.style.top=$("#imgsContainer").offset().top+"px";
            var loadingText=document.createElement("div");
            loadingText.innerHTML="loading...";
            loadingText.className="progressText";
            loadingText.style.width="auto";
            loadingBack.appendChild(loadingText);
            $("#imgsContainer")[0].appendChild(loadingBack);
        }
        
        chrome.runtime.sendMessage({msg: "getImagesCT"}, function(response) {
            if($("#loadingBack")[0])
                $("#loadingBack")[0].remove();
            console.log("getImagesCT response.imagesCT:" +response.imagesCT);
            var imagesCT=response.imagesCT;
            if(conf.savesize)
                imageye.saveSizeConf();
            $(".imgContainer").each(function(){
                var div=$(this);
                imageye.selectImg(this,true,false);//reset old selection
                div[0].className="imgContainer";
                var imgSrc=div.attr("imgsrc");
                var imgWidth=parseInt(div.attr("width"));
                var imgHeight=parseInt(div.attr("height"));
                var imgPixels=parseInt(div.attr("pixels"));
                var sizeType=div.attr("sizeType");
                var layout=div.attr("layout");
                
                var mimeType;
                var imgType;
                var dimension;
                try{
                    var reqDetails=imagesCT[imgSrc];
                    if(reqDetails){
                        mimeType=reqDetails.mimeType;
                        dimension=reqDetails.contentLength;
                    }
                    if(!mimeType){
                        if(imgSrc.indexOf("data:image/")==0){
                            mimeType=imgSrc.substring(5,imgSrc.indexOf(";"));
                        }else{
                            var imgSrcNoParams=imgSrc.split("?")[0].toLowerCase();
                            mimeType=imgSrcNoParams.substring(imgSrcNoParams.lastIndexOf(".")+1,imgSrcNoParams.length).toLowerCase();
                        }
                    } 
                    mimeType=mimeType?mimeType.toLowerCase():"";
                    imgType=mimeType.indexOf("jpg")!=-1?"JPG":
                            mimeType.indexOf("jpeg")!=-1?"JPG":
                            mimeType.indexOf("gif")!=-1?"GIF":
                            mimeType.indexOf("png")!=-1?"PNG":
                            mimeType.indexOf("svg")!=-1?"SVG":
                            mimeType.indexOf("webp")!=-1?"WEBP":
                            mimeType.indexOf("bmp")!=-1?"BMP":
                            mimeType.indexOf("ico")!=-1?"ICO":
                            mimeType.indexOf("tiff")!=-1?"TIFF":
                            "-";
                }catch(e){}
                imgType=imgType||"-";
                var imgTypeDiv=div.find(".imgType");
                imgTypeDiv.html(imgType);
                div.attr("type",imgType);
                
                if(imgType=="WEBP" && conf.web2jpg){
                    var image = new Image();
                    image.onload = function () {
                        var canvas = document.createElement('canvas');
                        canvas.width = this.naturalWidth;
                        canvas.height = this.naturalHeight;
                        canvas.getContext('2d').drawImage(this, 0, 0);
                        div.attr("convertedimgsrc",canvas.toDataURL('image/jpeg'));
                        delete canvas;
                    }
                    image.src=this.getAttribute("imgsrc")
                }
                
                if(dimension)
                    div.find(".imgDimension").html(imageye.formatBytes(dimension,0));
                
                
                if(conf.imgtype && imgType!=conf.imgtype){
                    div.addClass("excluded excludedType");
                }
                if( 
                    (conf.sizetype!="any" && conf.sizetype!="custom" && conf.sizetype != sizeType) 
                    ||
                    !(imgWidth>=conf.minwidth && imgHeight>=conf.minheight) 
                )
                    div.addClass("excluded excludedSize");
                
                if(imgSrc.toLowerCase().indexOf(conf.urlpattern.toLowerCase())==-1)
                    div.addClass("excluded excludedUrl");
                
                if(conf.layout && layout!=conf.layout){
                    div.addClass("excluded excludedLayout");
                }
                
            })
            
            imageye.selection=new Object();//reset old selection
            
            var sizeSelector=".imgContainer:not(.excludedUrl):not(.excludedType):not(.excludedLayout)";
            var typeSelector=".imgContainer:not(.excludedUrl):not(.excludedSize):not(.excludedLayout)";
            var layoSelector=".imgContainer:not(.excludedUrl):not(.excludedSize):not(.excludedType)";
            
            imageye.stats={
                size:{
                    "any":$(sizeSelector).length,
                    "small":$(sizeSelector+"[sizeType='small']").length,
                    "medium":$(sizeSelector+"[sizeType='medium']").length,
                    "large":$(sizeSelector+"[sizeType='large']").length
                },
                types:{
                    "any":$(typeSelector).length,
                    "JPG":$(typeSelector+"[type='JPG']").length,
                    "GIF":$(typeSelector+"[type='GIF']").length,
                    "PNG":$(typeSelector+"[type='PNG']").length,
                    "SVG":$(typeSelector+"[type='SVG']").length,
                    "WEBP":$(typeSelector+"[type='WEBP']").length,
                    "BMP":$(typeSelector+"[type='BMP']").length,
                    "ICO":$(typeSelector+"[type='ICO']").length,
                    "TIFF":$(typeSelector+"[type='TIFF']").length
                },
                layout:{
                    "any":$(layoSelector).length,
                    "square":$(layoSelector+"[layout='square']").length,
                    "wide":$(layoSelector+"[layout='wide']").length,
                    "tall":$(layoSelector+"[layout='tall']").length
                }
            }
                
            //lets put stats in the selects
            //conf.imgtype=$(event.target).attr("typeConf");
            $(".typeMenu").find("div[typeConf]").each(function(){
                var currType=$(this).attr("typeConf");
                var currTypeNum=imageye.stats.types[currType];
                currTypeNum=currTypeNum||0;
                $(this).html(currType.charAt(0).toUpperCase() + currType.slice(1)+" ("+currTypeNum+")");
                this.style.setProperty('color',currTypeNum?"inherit":"lightGray", currTypeNum?"":"important");

            });
            $(".sizeMenu").find("div[sizeConf]").each(function(){
                var currSize=$(this).attr("sizeConf");
                if(currSize=="custom")
                    return
                var currSizeNum=imageye.stats.size[currSize];
                currSizeNum=currSizeNum||0;
                $(this).html(currSize.charAt(0).toUpperCase() + currSize.slice(1)+" ("+currSizeNum+")");
                this.style.setProperty('color',currSizeNum?"inherit":"lightGray", currSizeNum?"":"important");
            });
            $(".layoutMenu").find("div[layoutConf]").each(function(){
                var currLayout=$(this).attr("layoutConf");
                var currLayoutNum=imageye.stats.layout[currLayout];
                currLayoutNum=currLayoutNum||0;
                $(this).html(currLayout.charAt(0).toUpperCase() + currLayout.slice(1)+" ("+currLayoutNum+")");
                this.style.setProperty('color',currLayoutNum?"inherit":"lightGray", currLayoutNum?"":"important");
            });
            
            
            if($(".changedMenu").length>0)
                $(".clearFilters").show();
            else 
                $(".clearFilters").hide();
                
            document.getElementById("spinner").style.display="none";
            document.querySelectorAll(".imgContainer").forEach(function(el){
                el.style.display="-webkit-box";
            })
            var numImagesFoundDiv=document.getElementById("numimagesfound")
            numImagesFoundDiv.origMessage=numImagesFoundDiv.origMessage||numImagesFoundDiv.innerHTML;
            numImagesFoundDiv.innerHTML=numImagesFoundDiv.origMessage.replace("%n",document.querySelectorAll(".imgContainer:not(.excluded)").length);
            document.getElementById("searchingimages").style.display="none";
            document.getElementById("numimagesfound").style.display="";
            document.getElementById("selectalla").style.visibility="visible";
        })
    },
    localize:function(){
        var spans=document.querySelectorAll(".localizedSpan");
        for(var i=0;i<spans.length;i++){
            var message=chrome.i18n.getMessage(spans[i].getAttribute("messagesKey"));
            if(message)
                spans[i].innerHTML=message
        }
        $("#filterbyurlinput")[0].setAttribute("placeholder",chrome.i18n.getMessage("filterbyurlinputplaceholder"));
    },
    formatBytes: function(bytes,decimals) {
        if(bytes == 0) return '0 B';
        var k = 1024,
        dm = decimals,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    saveSizeConf: function(reset){
        chrome.storage.sync.set({
            sizetype: reset?conf.defaults.sizetype:conf.sizetype,
            minwidth: reset?conf.defaults.minwidth:conf.minwidth,
            minheight: reset?conf.defaults.minheight:conf.minheight
        });
    },
    initSizeMenu: function(){
        var menu=$("#sizeTab");
        if(conf.minwidth!=conf.defaults.minwidth || conf.minheight!=conf.defaults.minheight){
            //for users who saved minheight or minwidth before the new version
            conf.savesize=true;
            conf.sizetype="custom"
        }
        if(conf.savesize){
            menu.find("div[sizeConf]").removeClass("selected");
            menu.find("div[sizeConf="+conf.sizetype+"]").addClass("selected");
            $("#minwidthinput").val(conf.minwidth);
            $("#minheightinput").val(conf.minheight);
            menu.find(".savesize").addClass("selected");
            var menuLabel=menu.find(".menuLabel");
            switch(conf.sizetype){
                case "any":
                break;
                case "custom":
                    menuLabel.addClass("changedMenu");
                    menuLabel.html("> "+conf.minwidth+"&times;"+conf.minheight);
                break;
                default:
                    menuLabel.addClass("changedMenu");
                    menuLabel.html(conf.sizetype.charAt(0).toUpperCase() + conf.sizetype.slice(1));
                break;
            }
            if($(".changedMenu").length>0){
                $(".clearFilters").show();
                imageye.showTools(true);
            }
        }
    }
}
imageye.getConf(imageye.init);