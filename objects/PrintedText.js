import { PRINTER_SLOT } from './Printer.js';

export class PrintedText {
    constructor(text, color, font) {
        this.text = text;
        this.color = color;
        this.font = font;

        this.geo = new THREE.TextBufferGeometry(this.text, {
            font: this.font,
            size: 1,
            height: 0.5,
            bevelThickness: 2,
            bevelSize: 1.5,
            bevelEnabled: false
        });
        this.mat = new THREE.MeshPhongMaterial({
            color: this.color
        });
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        this.setAngledStance();

        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
    }
    setText(text) {
        this.text = text;
        this.geo = new THREE.TextBufferGeometry(this.text, {
            font: this.font,
            size: 1,
            height: 0.5,
            bevelThickness: 2,
            bevelSize: 1.5,
            bevelEnabled: false
        });
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        this.setAngledStance();
    }
    setAngledStance() {
        this.mesh.position.x += PRINTER_SLOT.x;
        this.mesh.position.y += PRINTER_SLOT.y;
        this.mesh.position.z += PRINTER_SLOT.z;
        this.mesh.rotation.x -= 1.3;
    }
    print() {
        // this.mesh.position.x += 0.001;
        this.interval = setInterval(() => {
            this.mesh.position.x += 1;
            if(this.mesh.position.x > 5) {
                clearInterval(this.interval);
            }
        }, 500);
    }
    gravity() {
        2
    }
}