var THREEx = THREEx || {}

THREEx.Planets	= {}

THREEx.Planets.baseURL	= '../'

// from http://planetpixelemporium.com/


THREEx.Planets.createEarth	= function(){
    var geometry	= new THREE.SphereGeometry(0.5, 32, 32);
    var m1 = new THREE.MeshBasicMaterial( {map:  new THREE.ImageUtils.loadTexture('img/Env-Virt-KTD/IMG_0739.PNG') } );
    var m2 = new THREE.MeshBasicMaterial( { map:  new THREE.ImageUtils.loadTexture('img/Env-Virt-KTD/IMG_0742.PNG') } );
    var m  = new THREE.MeshFaceMaterial( [m1, m2] );
    var material	= new THREE.MeshPhongMaterial({
        map		: THREE.ImageUtils.loadTexture('threex.planets-master/images/earthmap1k.jpg'),
        bumpScale	: 0.05,
    })
    var mesh	= new THREE.Mesh(geometry, material)
    return mesh
}

THREEx.Planets.createStarfield	= function(){
    var texture	= THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL+'images/galaxy_starfield.png')
    var material	= new THREE.MeshBasicMaterial({
        map	: texture,
        side	: THREE.BackSide
    })
    var geometry	= new THREE.SphereGeometry(100, 32, 32)
    var mesh	= new THREE.Mesh(geometry, material)
    return mesh
}



