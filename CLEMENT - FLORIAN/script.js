var chrono=new THREE.Clock();
var temps;
var vAng=3;
var keys={left:0,right:0, up:0, down:0}

window.addEventListener('keydown',function(event){
if (event.keyCode==37){
keys.left=1;
}
if (event.keyCode==39){
keys.right=1;
}
if (event.keyCode==38){
keys.up=1;
}
if (event.keyCode==40){
keys.down=1;
}
});
window.addEventListener('keyup',function(event){
if (event.keyCode==37){
keys.left=0;
}
if (event.keyCode==39){
keys.right=0;
}
if (event.keyCode==38){
keys.up=0;
}
if (event.keyCode==40){
keys.down=0;
}
});

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.z=5;
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
var sphGeo= new THREE.SphereGeometry(1,100,100);
//var sphMat=new THREE.MeshBasicMaterial({color: 0xff0000});

var textureLoader = new THREE.TextureLoader();
var texture0 = textureLoader.load( 'texture.jpg' );
var texture1 = textureLoader.load( 'texture_rouge.jpg' );
var texture2 = textureLoader.load( 'texture_bleu.jpg' );

 var materials = [
                    new THREE.MeshBasicMaterial( { map: texture1 } ),
                    new THREE.MeshBasicMaterial( { map: texture2 } ),
                ];
                var faceMaterial = new THREE.MeshFaceMaterial( materials );
//var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
var sphMat = new THREE.MeshFaceMaterial(new THREE.MeshBasicMaterial({map: texture0 }));
  

//var sphMat=new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('texture.jpg',THREE.SphericalRefractionMapping) } );
var sph = new THREE.Mesh(sphGeo, new THREE.MeshFaceMaterial( materials ) );
scene.add(sph);
chrono.start();
animation=function(){
deltatemps=chrono.getDelta();
if (keys.left==1){
sph.rotation.y=sph.rotation.y-vAng*deltatemps;
}
if (keys.right==1){
sph.rotation.y=sph.rotation.y+vAng*deltatemps;
}
if (keys.up==1){
sph.rotation.x=sph.rotation.x-vAng*deltatemps;
}
if (keys.down==1){
sph.rotation.x=sph.rotation.x+vAng*deltatemps;
}
}
function render() {
requestAnimationFrame(render);
animation();
renderer.render(scene, camera);
}
render();