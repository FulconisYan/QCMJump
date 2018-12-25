function isImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
function isAudio(url) {
    return (url.match(/\.(mp3|ogg|wav)$/) != null);
}
function loadAssets(assetsToBeLoaded) {
    let assetsLoaded = {};
    let nbLoaded = 0;
    let numberOfAssetsToLoad = 0;

    // get num of assets to load
    for (let name in assetsToBeLoaded) 
        numberOfAssetsToLoad++;

    //console.log("Nb assets to load: " + numberOfAssetsToLoad);

    for (name in assetsToBeLoaded) {
        let url = assetsToBeLoaded[name].url;
        //console.log("Loading " + url);
        if (isImage(url)) {
            assetsLoaded[name] = new Image();
            assetsLoaded[name].onload = () => {
				if (++nbLoaded >= numberOfAssetsToLoad)
					loadedAssets = assetsLoaded;
				
				//console.log("Loaded asset " + nbLoaded);
			};
            // will start async loading. 
            assetsLoaded[name].src = url;
        } else {
            // We assume the asset is an audio file
            //console.log("loading " + name + " buffer : " + assetsToBeLoaded[name].loop);
            assetsLoaded[name] = new Howl({
                urls: [url],
                buffer: assetsToBeLoaded[name].buffer,
                loop: assetsToBeLoaded[name].loop,
                autoplay: false,
                volume: assetsToBeLoaded[name].volume,
                onload: () => {
					if (++nbLoaded >= numberOfAssetsToLoad)
						loadedAssets = assetsLoaded;
                    
                    //console.log("Loaded asset " + nbLoaded);
                }
            }); // End of howler.js callback
        } // if

    } // for
}