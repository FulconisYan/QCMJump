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

    for (let name in assetsToBeLoaded) {
        
        let url = assetsToBeLoaded[name].url;
        if(_info)
            console.info("Loading", url);
        if (isImage(url)) {
            assetsLoaded[name] = new Image();
            assetsLoaded[name].onload = function(){
                loadedAssets[this.name] = assetsLoaded[this.name];
                if(_info)
                    console.info("Loaded asset", this.name);
            };
            assetsLoaded[name].onerror = function(){
                console.error("Error loading asset", this.name);
            };
            assetsLoaded[name].src = url;
            assetsLoaded[name].name = name;
        } else 
            if(isAudio(url)){
                if(_info)
                    console.info("loading", name, " buffer :", assetsToBeLoaded[name].loop);
                assetsLoaded[name] = new Howl({
                    urls: [url],
                    buffer: assetsToBeLoaded[name].buffer,
                    loop: assetsToBeLoaded[name].loop,
                    autoplay: assetsToBeLoaded[name]||false,
                    volume: assetsToBeLoaded[name].volume,
                    onload: function(){
                        loadedAssets[this.name] = assetsLoaded[this.name];
                        if(_info)
                            console.info("Loaded asset", this.name);
                    },
                    onloaderror: function(id, err){
                        console.error("Error loading sound asset ", this.name, err, id);
                    }
                });
                assetsLoaded[name].name = name;
            } else 
                console.error("Can't load asset", name);
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