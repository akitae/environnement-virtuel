var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

camera.position.z=5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

//Dessine la forme
// var sphGeo= new THREE.SphereGeometry(1,32,32);
var sphGeo= new THREE.CubeGeometry(100,100,100);
var sphMat=new THREE.MeshBasicMaterial({color: 0xff0000});
var sph = new THREE.Mesh(sphGeo,sphMat);
scene.add(sph);

//Ajout d'une image
var map = new THREE.TextureLoader().load( "img/Env-Virt-KTD/IMG_0736.png" );
var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
var sprite = new THREE.Sprite( material );
sprite.scale.set( 3, 3, 3 );
sprite.position.y = 0;
sprite.position.x = 0;
scene.add( sprite );
//Fin ajout d'une image


// var canvas = document.createElement('canvas');
// var context = canvas.getContext('2d');

// load tiles into a canvas
// context.drawImage('img/Env-Virt-KTD/IMG_0736.png', 0, 0, 256, 256);
// context.drawImage("img/Env-Virt-KTD/IMG_0736.png", 256, 0, 256, 256);
// context.drawImage("img/Env-Virt-KTD/IMG_0736.png", 0, 256, 256, 256);
// context.drawImage("img/Env-Virt-KTD/IMG_0736.png", 256, 256, 256, 256);

// tiles merged into a single image attached to texture
// var texture = new THREE.Texture(canvas);

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var myImage = new Image(100, 200);
myImage.src = 'img/Env-Virt-KTD/IMG_0736.png';
myImage.setAttribute("id", "image");
document.body.appendChild(myImage);
// img = new THREE.TextureLoader().load( 'img/Env-Virt-KTD/IMG_0736.png' );
var img = document.getElementById("image");
ctx.drawImage(myImage, 100, 100, 150, 180);

function render() {
    requestAnimationFrame(render); //exécute la fonction en paramètre à un interval régulier
    renderer.render(scene, camera); //donne l'ordre des actions à effectuer
}
render();


