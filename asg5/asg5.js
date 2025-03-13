import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/MTLLoader.js';

const canvas = document.querySelector('#c');
const scene = new THREE.Scene();
//perspective
//https://threejs.org/manual/#en/rendertargets
//https://poly.pizza/
//https://free3d.com/
//https://threejs.org/manual/#en/fundamentals
//https://threejs.org/manual/#en/cameras
const camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight, 0.1, 500);
camera.position.z = 17;
camera.position.y = 10;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
document.body.appendChild(renderer.domElement);

//orbit
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();
//https://threejs.org/manual/#en/shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//https://threejs.org/manual/#en/textures
const loader = new THREE.TextureLoader();
const DG = new THREE.SphereGeometry(5, 32, 32);
const text1 = loader.load('DeathStar.jpg');
const DM = new THREE.MeshBasicMaterial({map: text1,});
let DeathSTar = new THREE.Mesh(DG, DM);
DeathSTar.position.set(5, 7, -30);
DeathSTar.rotation.y =-9; 
scene.add(DeathSTar);

//tattoine+2moons
const loader2 = new THREE.TextureLoader();
const tatoo = new THREE.SphereGeometry(2, 32, 32);
const ttext1 = loader.load('TATOOINE.jpeg');
const tDM = new THREE.MeshBasicMaterial({ map: ttext1 });
let tatooine = new THREE.Mesh(tatoo, tDM);
tatooine.position.set(-15, 2, -30);
scene.add(tatooine);

const moonPivot = new THREE.Object3D();
scene.add(moonPivot);
moonPivot.position.copy(tatooine.position); 

const moonPivot2 = new THREE.Object3D();
scene.add(moonPivot2);
moonPivot2.position.copy(tatooine.position); 

const moon = new THREE.SphereGeometry(0.5, 32, 32);
const moonMaterial1 = new THREE.MeshBasicMaterial({ color: "rgba(219, 225, 95, 0.98)" });
const moonMesh1 = new THREE.Mesh(moon, moonMaterial1);
moonMesh1.position.set(3, 1.4, 0);
moonPivot2.add(moonMesh1);

const moon22 = new THREE.SphereGeometry(0.35, 32, 32);
const moonMaterial2 = new THREE.MeshBasicMaterial({ color: "rgba(225, 186, 95, 0.98)" });
const moonMesh2 = new THREE.Mesh(moon22, moonMaterial2);
moonMesh2.position.set(2.5, 1.7, 0); 
moonPivot.add(moonMesh2);

//machine
const mach = new THREE.SphereGeometry(0.5, 10, 10);
const mach1 = new THREE.MeshBasicMaterial({color: "rgba(57, 100, 72, 0.15)"});
const mach2 = new THREE.Mesh(mach, mach1);
mach2.position.set(3.1, -4.2, 5);
//DeathSTar.rotation.y =-9; 
scene.add(mach2);
//hyperdrive
//https://threejs.org/manual/#en/textures
const hp = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const text2 = loader.load('hyperdrive.jpg');
const hd = new THREE.MeshBasicMaterial({map: text2,});
let hpd = new THREE.Mesh(hp, hd);
hpd.position.set(9.3, -3.5, 4.7);
hpd.scale.set(1, 1.3, 1)
hpd.rotateZ(1.5);
hpd.rotateX(3.7);
scene.add(hpd);
const sp = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
//const sedge = new THREE.MeshBasicMaterial({color: rgba(61, 53, 53, 0.5)}); use hex
const sedge = new THREE.MeshBasicMaterial({color: "rgba(61, 53, 53, 0.5)"});
const spd = new THREE.Mesh(sp, sedge);
spd.position.set(8.8, -3.5, 4.45);
spd.scale.set(1, 0.3, 1.4)
spd.rotateZ(1.6);
spd.rotateX(2.65);
scene.add(spd);
const s2sp = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const s2sedge = new THREE.MeshBasicMaterial({color: "rgba(61, 53, 53, 0.5)"});
const s2spd = new THREE.Mesh(s2sp, s2sedge);
s2spd.position.set(9.8, -3.5, 5);
s2spd.scale.set(1.2, 0.3, 1.4)
s2spd.rotateZ(1.6);
s2spd.rotateX(2.65);
scene.add(s2spd);


const hpa = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const text2a = loader.load('hyperdrive.jpg');
const hda = new THREE.MeshBasicMaterial({map: text2a,});
let hpda = new THREE.Mesh(hpa, hda);
hpda.position.set(-4.7, -3.7, 6);
hpda.scale.set(0.6, 3.35, 0.6)
hpda.rotateZ(1.6);
hpda.rotateX(3.7);
scene.add(hpda);
const spa = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
//const sedge = new THREE.MeshBasicMaterial({color: rgba(61, 53, 53, 0.5)}); use hex
const sedgea = new THREE.MeshBasicMaterial({color: "rgba(61, 53, 53, 0.5)"});
const spda = new THREE.Mesh(spa, sedgea);
spda.position.set(-6.1, -3.7, 7);
spda.scale.set(1.2, 0.3, 0.9)
spda.rotateZ(1.6);
spda.rotateX(0.7);
scene.add(spda);
const s2spa = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const s2sedgea = new THREE.MeshBasicMaterial({color: "rgba(61, 53, 53, 0.5)"});
const s2spda = new THREE.Mesh(s2spa, s2sedgea);
s2spda.position.set(-3.4, -3.7, 5.2);
s2spda.scale.set(1.2, 0.4, 0.9)
s2spda.rotateZ(1.5);
s2spda.rotateX(0.7);
scene.add(s2spda);
//referenced
//https://threejs.org/manual/#en/billboards
//https://discourse.threejs.org/t/how-to-implement-a-horizontal-billboard/33331/6
//https://github.com/MasatoMakino/threejs-billboard
//billboard extra 1
function createBillboard(text, x, y, z) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256; //dont touch messes proportions
    canvas.height = 64;
    //https://discourse.threejs.org/t/canvas-filter-on-threejs-canvas/68042/2
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 10);
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const appearance = new THREE.Sprite(material);
    appearance.scale.set(2.4, 0.5, 1); 
    appearance.position.set(x, y, z);
    return appearance;
}

//chairs made of cubes
const GeoCube = new THREE.BoxGeometry(.5, .7, .3);
const Leather = loader.load('Leather.jpg');
const MatCube = new THREE.MeshBasicMaterial({
    map: Leather,
});
const cube = new THREE.Mesh(GeoCube, MatCube);
cube.position.set(-2, -3.8, -1.6);
scene.add(cube);
const GeoCube1 = new THREE.BoxGeometry(.55, 1, .48);
const FalconMetal = loader.load('FalconMetal.jpg');
const MatCube1 = new THREE.MeshBasicMaterial({
    map: FalconMetal,
});
const cube1 = new THREE.Mesh(GeoCube1, MatCube1);
cube1.position.set(-2, -3.5, -2.);
scene.add(cube1);
const GeoCube2 = new THREE.BoxGeometry(.5, .5, .5);
const MatCube2 = new THREE.MeshBasicMaterial({
    map: Leather,
});
const cube2 = new THREE.Mesh(GeoCube2, MatCube2);
cube2.position.set(-2, -3.2, -1.9);
scene.add(cube2);
cube.scale.x = 3
cube1.scale.x = 3
cube2.scale.x = 3
const cube3 = new THREE.Mesh(GeoCube, MatCube);
cube3.position.set(-1.2, -3.8, -.9);
const cube4 = new THREE.Mesh(GeoCube1, MatCube1);
cube4.position.set(-.9, -3.5, -1);
const cube5 = new THREE.Mesh(GeoCube2, MatCube2);
cube5.position.set(-1, -3.2, -1);
cube3.rotation.y = -1.5
cube4.rotation.y = -1.5
cube5.rotation.y = -1.5
cube3.scale.x = 3
cube4.scale.x = 3
cube5.scale.x = 3
scene.add(cube3);
scene.add(cube4);
scene.add(cube5);

//chairs in pit
const cube6 = new THREE.Mesh(GeoCube, MatCube);
cube6.position.set(11.5, -3.8, -4.4+.4);
const cube7 = new THREE.Mesh(GeoCube1, MatCube1);
cube7.position.set(11.5, -3.5, -4+.4);
const cube8 = new THREE.Mesh(GeoCube2, MatCube2);
cube8.position.set(11.5, -3.2, -4.1+.4);
scene.add(cube6);
scene.add(cube7);
scene.add(cube8);
const cube9 = new THREE.Mesh(GeoCube, MatCube);
cube9.position.set(12.5, -3.8, -4.4+.4);
const cube10 = new THREE.Mesh(GeoCube1, MatCube1);
cube10.position.set(12.5, -3.5, -4+.4);
const cube11 = new THREE.Mesh(GeoCube2, MatCube2);
cube11.position.set(12.5, -3.2, -4.1+.4);
scene.add(cube9);
scene.add(cube10);
scene.add(cube11);
const cube12 = new THREE.Mesh(GeoCube, MatCube);
cube12.position.set(13, -3.8, -4.4+.7);
const cube13 = new THREE.Mesh(GeoCube1, MatCube1);
cube13.position.set(13, -3.5, -4+.7);
const cube14 = new THREE.Mesh(GeoCube2, MatCube2);
cube14.position.set(13, -3.2, -4.1+.7);
scene.add(cube12);
scene.add(cube13);
scene.add(cube14);
const cube15 = new THREE.Mesh(GeoCube, MatCube);
cube15.position.set(11, -3.8, -4.4+.7);
const cube16 = new THREE.Mesh(GeoCube1, MatCube1);
cube16.position.set(11, -3.5, -4+.7);
const cube17 = new THREE.Mesh(GeoCube2, MatCube2);
cube17.position.set(11, -3.2, -4.1+.7);
scene.add(cube15);
scene.add(cube16);
scene.add(cube17);


//checker table
const GeoTop = new THREE.CylinderGeometry(.5, .1, .1);
const MatTop = loader.load('checkers.jpg');
const temp = new THREE.MeshBasicMaterial({map: MatTop,});
const Top = new THREE.Mesh(GeoTop, temp);
Top.position.set(-2.5, -3, -1);
scene.add(Top);
const GeoStem1 = new THREE.CylinderGeometry(0.5, 0.5, -.4);
const MatStem1 = new THREE.MeshBasicMaterial({color: "rgba(61, 53, 53, 0.5)"});
const Stem1 = new THREE.Mesh(GeoStem1, MatStem1);
Stem1.position.set(-2.5, -3, -1);
scene.add(Stem1);
const GeoStem = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
const MatStem = new THREE.MeshBasicMaterial({color: "rgba(61, 53, 53, 0.5)"});
const Stem = new THREE.Mesh(GeoStem, MatStem);
Stem.position.set(-2.5, -3.5, -1);
scene.add(Stem);

//platform
const falc = loader.load('Falcon.jpg', function(texture)
{
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
});
falc.wrapS = THREE.RepeatWrapping;
falc.wrapT = THREE.RepeatWrapping;
const planeGeo = new THREE.PlaneGeometry(30, 20);
const planeMat = new THREE.MeshBasicMaterial({ map: falc });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI/2;
plane.position.y =-4; 
scene.add(plane);

//rotating cube
const GeoCube12 = new THREE.BoxGeometry(0.2, 0.8, 0.8);
const hyperdrive = loader.load('hyperdrive.jpg');
const MatCube12 = new THREE.MeshBasicMaterial({
    map: hyperdrive,
});
let cube25 = new THREE.Mesh(GeoCube12, MatCube12);
cube25.position.set(-2.3, -3.8, 6);
cube25.rotateY(1.15);
scene.add(cube25);
cube25.scale.x = 4
const c1 = new THREE.BoxGeometry(1.3, 0.5, 1.3);
const c12 = new THREE.MeshBasicMaterial({ color: "rgba(61, 53, 53, 0.5)"});
let c123 = new THREE.Mesh(c1, c12);
c123.position.set(-2.3, -3.8, 6);
//123.scale.set(1.2, 0.3, 1.4)
c123.rotateY(1.15);
//c123.rotateX(2.65);
scene.add(c123);

//skybox
//https://threejs.org/manual/#en/backgrounds
//https://threejs.org/manual/#en/textures
    const texture = loader.load('stars.jpg', () => 
    {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
    });

//3d obj 
//https://threejs.org/manual/#en/textures
let r2d21, c3po, jjb;
const mtlLoader = new MTLLoader();
mtlLoader.load('resources/models/R2D2/materials.mtl', function(materials) {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('resources/models/R2D2/model.obj', function(object) {
        object.position.set(7.7, -3.2, 5.5);
        object.scale.set(-1.2, 1.2, 1.2);
        object.rotateY(Math.PI / 8);
        const r2d2Billboard = createBillboard("BEEPBEEPBEEP", 7.7, -1.5, 5.5);
        object.castShadow = true;  
        object.receiveShadow = true; 
        r2d21 = object;
        scene.add(r2d2Billboard);
        scene.add(object);
    });
});

const objLoader3 = new OBJLoader();
const textureLoader = new THREE.TextureLoader();
objLoader3.load('resources/models/jjbink/Darth Jar Jar Low Poly Mesh.obj', function(object) {
    const skinTexture = textureLoader.load('resources/models/jjbink/Low PolyDiffuseMap Jar Jar.bmp');
    const eyeTexture = textureLoader.load('resources/models/jjbink/Eye Diffuse.bmp');
    const frillTexture = textureLoader.load('resources/models/jjbink/Jar Jar Fril Diffuse.bmp');
    const teethTexture = textureLoader.load('resources/models/jjbink/Jar Jar Teeth Diffuse.bmp');
    object.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            //I looked up just jar jar's applying skin texture section because he did not have a mtl file and i did not know how to link bmp's to the obj
            if (child.name.toLowerCase().includes("eye")) {
                child.material = new THREE.MeshBasicMaterial({ map: eyeTexture });
            } else if (child.name.toLowerCase().includes("frill")) {
                child.material = new THREE.MeshBasicMaterial({ map: frillTexture });
            } else if (child.name.toLowerCase().includes("teeth")) {
                child.material = new THREE.MeshBasicMaterial({ map: teethTexture });
            } else {
                child.material = new THREE.MeshBasicMaterial({ map: skinTexture });
            }
        }
    });
    object.position.set(-15, -3.9, 2.5);
    object.scale.set(0.007, 0.007, 0.007);
    object.rotateX(1.5);
    object.rotateZ(5);
    jjb = object;
    scene.add(object);
    //const jjbBillboard = createBillboard("mesa darkside", 1, 1.5, 5.5);
    //const jjbBillboard2 = createBillboard("no likey light", 1, 0.5, 5.5);
    //https://threejs.org/manual/#en/shadows
        object.castShadow = true;  
        object.receiveShadow = true; 
      //  scene.add(jjbBillboard);
  //      scene.add(jjbBillboard2);
});
  //https://threejs.org/manual/#en/load-obj
    // 3d obj 
    const mtlLoader1 = new MTLLoader();
    mtlLoader1.load('resources/models/C3PO/C3PO.mtl', function(materials) {
    materials.preload();
    const objLoader1 = new OBJLoader();
    objLoader1.setMaterials(materials);
    objLoader1.load('resources/models/C3PO/C3PO.obj', function(object) {
        object.position.set(11.5, -3.7, 5.2);
        object.scale.set(0.06, 0.06, 0.06);
        object.rotateY(Math.PI / 2);
        object.rotateZ(Math.PI / 10);
        //billboard extra 3
        const c3poBillboard = createBillboard("This is ALL", 5.5, -.1, 5.2);
        const c3poBillboard2 = createBillboard("your fault", 5.5, -.6, 5.2);
        //shadows extra 2
        object.castShadow = true;  
        object.receiveShadow = true; 
        c3po = object;
        scene.add(object);
        scene.add(c3poBillboard);
        scene.add(c3poBillboard2);

    });
});
//https://threejs.org/manual/#en/lights
//https://threejs.org/manual/#en/fundamentals
    function Light() {
    //ambient
    const AmbLight = new THREE.AmbientLight(0xFFFFFF, 0.3); //hex using rgba darkens shadows too much //white
    scene.add(AmbLight);
    //directional
    const directionalLight = new THREE.DirectionalLight(0x1E90FF, 2); //blue
    directionalLight.position.set(9.3, -3.5, 4.7); 
    scene.add(directionalLight);
    //point (2) 
    const mrlightbulb = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const mrlightbulbs = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); //red
    const mrlightbulbss = new THREE.Mesh(mrlightbulb, mrlightbulbs);
    mrlightbulbss.position.set(4.7, 0.3, 4.8);
    //123.scale.set(1.2, 0.3, 1.4)
    mrlightbulbss.rotateY(1.15);
    //c123.rotateX(2.65);
    scene.add(mrlightbulbss);
    const mrlightbulb1 = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const mrlightbulbs1 = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    const mrlightbulbss1 = new THREE.Mesh(mrlightbulb1, mrlightbulbs1);
    mrlightbulbss1.position.set(5.4, 0.3, 5.5);
    mrlightbulbss1.rotateY(1.15);
    scene.add(mrlightbulbss1);
    
    //https://threejs.org/manual/#en/shadows
    const Light = new THREE.PointLight(0xFF0000, 0.2);
    Light.castShadow = true;
    Light.position.set(4.7, 0.3, 4.8);
    scene.add(Light);
    let on = true;
    const Light1 = new THREE.PointLight(0xFF0000, 0.2);
    Light1.castShadow = true;
    Light1.position.set(4.7, 0.3, 4.8);
    scene.add(Light1);

    let flash = 400; 
    setInterval(() => {
        on = !on;
        const x = on ? 0.3 : 0; 
        Light.intensity = x; 
        Light1.intensity = x; 
    }, flash); }
    Light();
    //https://threejs.org/manual/#en/fog
    //fog extra 3
    scene.fog = new THREE.Fog(0x00000, 10, 100);

    //animating (spinning 3d models and shapes)
    //https://threejs.org/manual/#en/fundamentals
    function rendering(time) {
        time = time * 0.007;
        if (r2d21) {
            r2d21.rotation.y = Math.sin(time) * (Math.PI / 7);
        }
        if (c3po) {
            c3po.rotation.x = Math.sin(time) * (Math.PI / 100);
        }
        if (DeathSTar) { 
            DeathSTar.rotation.y += 0.004;
        }
        if (cube25) { 
            cube25.rotation.y += 0.5;
        }
        if (hpd) { 
            hpd.rotation.x = Math.sin(time*100) * (Math.PI / 25);
            cube25.rotation.z -= 0.1;
        }
        if (hpda) { 
            hpda.rotation.x = -10 + Math.sin(time*10) * (Math.PI / 30);
            hpda.rotation.z = 1.3;
        }
        if (jjb) {
            jjb.position.x = -6 + Math.sin(time/2) * (Math.PI / 1.4);
            jjb.rotation.z = Math.sin(time/2) * (Math.PI / 2);
        }
        if (moonPivot) {
            moonPivot.rotation.y += 0.006;
        }
        if (moonPivot2) {
            moonPivot2.rotation.y += 0.01;
        }
        requestAnimationFrame(rendering);
        controls.update();
        renderer.render(scene, camera); }
rendering();