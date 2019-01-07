"use strict";

function isImage(url) {
    return /\.(jpeg|jpg|gif|png)$/.test(url);
}

function isAudio(url) {
    return /\.(mp3|ogg|wav)$/.test(url);
}

let loadedAssets = {};
let assetsAttributed = {};

function loadAssets(assetsToBeLoaded, _info) {
    let assetsLoaded = {};
    for(let a in assetsToLoadURLs) assetsAttributed[a] = false;

    let onload = function(){
        loadedAssets[this.name] = assetsLoaded[this.name];
        if(_info)
            console.info("Loaded asset", this.name);
    };

    for (let name in assetsToBeLoaded) {
        
        let url = assetsToBeLoaded[name].url;
        if (isImage(url)) {
            if(_info)
                console.info("Loading image", name, url);
            assetsLoaded[name] = new Image();
            assetsLoaded[name].onload = onload;
        } else if(isAudio(url)){
            if(_info)
                console.info("Loading audio", name, url);
            assetsLoaded[name] = new Audio();
            assetsLoaded[name].autoplay = assetsToBeLoaded[name].autoplay||false;
            assetsLoaded[name].loop = assetsToBeLoaded[name].loop||false;
            assetsLoaded[name].volume = assetsToBeLoaded[name].volume||1.0;
            assetsLoaded[name].oncanplay = onload;
            assetsLoaded[name].stop = function(){
                this.pause();
                this.currentTime = 0;
            };
        } else {
            console.error("Can't load asset", name);
            continue;
        }
        
        assetsLoaded[name].src = url;
        assetsLoaded[name].name = name;
        assetsLoaded[name].onerror = function(){
            console.error("Error loading asset", this.name);
        };
    }
}

function attributeAsset(name, obj, att){
	if(assetsAttributed[name] === false)
		if(loadedAssets.hasOwnProperty(name)){
            if(obj.forEach)
                obj.forEach(e => e[att] = loadedAssets[name]);
            else
			    obj[att] = loadedAssets[name];
            return assetsAttributed[name] = true;
        }
    return false;
}