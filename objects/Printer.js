export class Printer {
    constructor(sideLength, color) {
        this.sideLength = sideLength;
        this.color = color;

        this.geo = new THREE.BoxBufferGeometry(this.sideLength, this.sideLength, this.sideLength);
        this.mat = new THREE.MeshPhongMaterial({
            color: this.color
        })
        this.mesh = new THREE.Mesh(this.geo, this.mat);
    }
}

export const PRINTER_SLOT = {
    x: 0,
    y: 0,
    z: 0
};