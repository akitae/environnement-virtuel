// Variables globals
var renderer, scene, camera, sphGeo, material, sphere;
var texture, texture_bleu;
var controls;
var isDragging;
var previousMousePosition = {
    x: 0,
    y: 0
};

init();
animate();

function init () {
    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("sphere").appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera  = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 5);
    scene.add(camera);

    controls = new THREE.OrbitControls(camera);

    texture = new THREE.TextureLoader().load(
        "texture.jpg"
    );

    texture_bleu = new THREE.TextureLoader().load(
        "texture_bleu.jpg"
    );



    sphGeo = new THREE.SphereGeometry(1 ,100 ,100);
    material = [
        new THREE.MeshBasicMaterial({ map: texture_bleu }),
        new THREE.MeshBasicMaterial({ map: texture })
    ];

    sphere = new THREE.Mesh(sphGeo, material);
    sphere.position.y = 0;
    sphere.position.x = 0;
    sphere.position.z = 0;
    scene.add(sphere);

    var latitude = 0;
    var longitude = 0;
    var radius = 1;

    var littleSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var littleSphereGeo = new THREE.SphereGeometry(0.002);

    while (longitude < 360) {

        var phi = (latitude / 180) * Math.PI;
        var theta = (longitude / 180) * Math.PI;

        var gridPosition = {
            x: radius * Math.cos(theta) * Math.sin(phi),
            y: radius * Math.sin(theta) * Math.sin(phi),
            z: radius * Math.cos(phi)
        };

        var sphero = new THREE.Mesh(littleSphereGeo, littleSphereMaterial);
        sphero.position.set(gridPosition.x, gridPosition.y, gridPosition.z);
        scene.add(sphero);

        latitude += 5;
        if (latitude > 360) {
            latitude = 0;
            longitude += 5;
        }
    }


    // Ajout des événements
    window.addEventListener('resize', onWindowResize, false);
    /*window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('DOMMouseScroll', onMouseZoom, false);*/
}

/**
 * Avant l'utilisation de OrbitControls
 */
function onMouseZoom (e) {
    if (e.detail > 0) {
        camera.position.z += 0.1;
    } else {
        camera.position.z -= 0.1;
    }
}

function onMouseDown () {
    isDragging = true;
}

function onMouseMove (e) {

    if (isDragging) {
        var deltaMove = {
          x: e.offsetX - previousMousePosition.x,
          y: e.offsetY - previousMousePosition.y
        };

        var deltaRotation = new THREE.Quaternion();
        deltaRotation.setFromEuler(new THREE.Euler(
            toRadians(deltaMove.y),
            toRadians(deltaMove.x),
            0,
            'XYZ'
        ));

        sphere.quaternion.multiplyQuaternions(deltaRotation, sphere.quaternion);
    }

    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    }

}

function onMouseUp () {
    isDragging = false;
}

/**
 * ========================================
 */

/**
 * Resize de la fenêtre.
 */
function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render () {
    renderer.render(scene, camera);
}

function animate () {
    requestAnimationFrame(animate);

    render();
}

/**
 * Function
 */
function toRadians (angle) {
    return angle * (Math.PI / 180);
}