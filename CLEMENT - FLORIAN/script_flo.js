// Variables globals
var renderer, scene, camera, sphGeo, material, sphere;

init();

function init () {
    renderer = new THREE.CanvasRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("sphere").appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera  = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 4);
    scene.add(camera);

    sphGeo = new THREE.SphereGeometry(1 ,100 ,100);
    material = [
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    ];

    sphere = new THREE.Mesh(sphGeo, material);
    scene.add(sphere);

    // Ajout des événements
    window.addEventListener("resize", onWindowResize, false);

    renderer.render(scene, camera);
}

function onWindowResize () {
    console.log("resize");
    console.log(window.innerWidth/window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}