class SpaceX {
    constructor() {
        this.url = 'https://lldev.thespacedevs.com/2.2.0/launch/?search=SpaceX&limit=100'
    }
    launches(){
        return fetch(this.url)
            .then(response=>response.json())
    }
    pads() {
        return this.launches().then(data => {
            return data.results.map(launch => launch.pad);
        });
    }
    getPadCoordinates(padName){
        return this.pads().then(pads => {
            const foundPad = pads.find(pad =>pad.name.includes(padName));
            if (foundPad){
                return {
                    latitude: foundPad.latitude,
                    longitude: foundPad.longitude,
                    name: foundPad.name
                }
            }
        })
    }

}

export {SpaceX}