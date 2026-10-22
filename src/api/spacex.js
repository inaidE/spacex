class SpaceX {
    constructor() {
        this.url = 'https://lldev.thespacedevs.com/2.2.0'
    }
    launches(){
        return fetch(`${this.url}/launch/?search=SpaceX&limit=100`)
            .then(response=>response.json())
    }
    pads() {
        return fetch(`${this.url}/pad/?search=SpaceX&limit=100`)
            .then(response=>response.json())
    }
}

export {SpaceX}
