$(function () {
    // Objets Three JS.
    let camera, scene, renderer;
    // Rotation, zoom.
    let controls;
    // Tableau des liens des images.
    let table = [];
    // Tous les objets images.
    let objects = [];
    var targets = {  sphere: [], helix: [], grid: []};


    // Taille maximum des images.
    let maxWidth = 300;
    let maxHeight = 300;
    // Répertoire des images.
    let directory = {
        SUD: "./img/Env-Virt-Sud",
        KTD: "./img/Env-Virt-KTD",
        TOU: "./img/Env-Virtuels-Tou"
    };

    getImagePath(directory.KTD).then(function (tableImage) {
        table = tableImage;

        initScene();
        init();
        animate();
    });

    // Changement de répertoire des images.
    $("input[name=image]:radio").change(function () {
        // On supprime toutes les images de la scène.
        for (let index = 0; index < objects.length; index++) {
            scene.remove(objects[index]);
        }
        targets = {  sphere: [], helix: [], grid: []};


        // On sélectionne le path suivant la sélection.
        let pathDirectory;
        switch (this.value) {
            case "KTD":
                pathDirectory = directory.KTD;
                break;
            case "SUD":
                pathDirectory = directory.SUD;
                break;
            case "TOU":
                pathDirectory = directory.TOU;
                break;
        }

        getImagePath(pathDirectory).then(function (tableImage) {
            table = tableImage;

            updateScene();
        });

    });

    /**
     * Retourne le chemin des images du dossier passé en paramètre.
     * @param directory
     * @returns {Promise<any>}
     */
    function getImagePath(directory) {
        return new Promise(function (resolve, reject) {
            // Tableau des différentes extensions des images.
            let extensions = ['.JPG', ".PNG"];
            let tableImage = [];

            // Requête ajax pour récupérer les différentes extensions des images.
            $.ajax({
                url: directory
            }).done(function (data) {
                console.info("Recupération des chemins des images.");

                let nbImage = 0;
                extensions.forEach(function (extension) {
                    $(data).find("a:contains("+extension+")").each(function () {
                        let filename = directory+this.pathname;
                        tableImage.push(filename);
                        nbImage++;
                    });
                });

                console.info(nbImage+" images ont été récupérées.");

                resolve(tableImage);
            }).fail(function (error) {
                console.error("Erreur dans la récupération des chemins des images.");
                reject(error);
            });
        });

    }

    /**
     * Initialisation de la scène.
     */
    function initScene () {
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 4000;
        scene = new THREE.Scene();
    }

    /**
     * Initialisation des objets images.
     */
    function initObject () {

        objects = [];
        // Initialisation des images et des positions.
        for (let index = 0; index < table.length; index++) {
            let element = document.createElement("div");
            element.className = 'element';

            let image = new Image();
            image.src = table[index];

            size = scaleImage(image, maxWidth, maxHeight);
            image.width = size.width;
            image.height = size.height;

            element.appendChild(image);

            let object = new THREE.CSS3DObject(element);
            object.position.x = Math.random() * 4000 - 2000;
            object.position.y = Math.random() * 4000 - 2000;
            object.position.z = Math.random() * 4000 - 2000;

            scene.add( object );
            objects.push( object );
        }
    }

    /**
     * Création de la sphère.
     */
    function createSphere () {
        let vector = new THREE.Vector3();
        let spherical = new THREE.Spherical();

        let size = objects.length;
        for (let index = 0; index < size; index++) {
            let phi = Math.acos( -1 + ( 2 * index) / size);
            let theta = Math.sqrt(size * Math.PI) * phi;
            let object = new THREE.Object3D();

            spherical.set(1600, phi, theta);
            object.position.setFromSpherical(spherical);
            vector.copy(object.position).multiplyScalar(2);

            object.lookAt(vector);
            targets.sphere.push( object );
        }
    }

    /**
     * Création du chemin.
     */
    function createChemin () {
        let vector = new THREE.Vector3();
        let cylindrical = new THREE.Cylindrical();

        for (let index = 0; index < objects.length; index++) {
            let theta = index * 0.175 + Math.PI;
            let y = - (index * 8) + 450;
            let object = new THREE.Object3D();

            cylindrical.set(2000, theta, y);
            object.position.setFromCylindrical(cylindrical);

            vector.x = object.position.x * 2;
            vector.y = object.position.y;
            vector.z = object.position.z * 2;

            object.lookAt( vector );
            targets.helix.push( object );
        }
    }

    /**
     * Mise à jour de la scène.
     */
    function updateScene () {
        initObject();
        createSphere();
        createChemin();

        transform( targets.sphere, 2000 );
    }

    function init() {

        initObject();

        createSphere();

        createChemin();

        // grid
        for ( var i = 0; i < objects.length; i ++ ) {
            var object = new THREE.Object3D();
            object.position.x = ( ( i % 5 ) * 400 ) - 800;
            object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
            object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;
            targets.grid.push( object );
        }

        renderer = new THREE.CSS3DRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById( 'container' ).appendChild( renderer.domElement );

        controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 0.5;
        controls.minDistance = 500;
        controls.maxDistance = 6000;
        controls.addEventListener( 'change', render );

        var button = document.getElementById( 'sphere' );
        button.addEventListener( 'click', function ( event ) {
            transform( targets.sphere, 2000 );

        }, false );
        var button = document.getElementById( 'helix' );
        button.addEventListener( 'click', function ( event ) {
            transform( targets.helix, 2000 );
            // location.href = location.href + '?choice=32'; //mettre la valeur ckecked TODO: Recharger la page si on change les images ?
        }, false );
        var button = document.getElementById( 'grid' );
        button.addEventListener( 'click', function ( event ) {
            transform( targets.grid, 2000 );
        }, false );


        transform( targets.helix, 2000 );

        window.addEventListener( 'resize', onWindowResize, false );
    }

    /**
     * Permet de modifier la taille de l'image en gardant les proportions et suivant une taille maximal prédéfinie.
     * @param image
     * @param maxWidth
     * @param maxHeight
     * @returns {{width: number, height: number}}
     */
    function scaleImage(image, maxWidth, maxHeight) {
        let size = {
            width: 0,
            height: 0
        };

        let ratioX = maxWidth / image.width;
        let ratioY = maxHeight / image.height;
        let ratio = Math.min(ratioX, ratioY);

        size.width = image.width * ratio;
        size.height = image.height * ratio;

        return size;
    }


    function transform( targets, duration ) {
        TWEEN.removeAll();
        for ( var i = 0; i < objects.length; i ++ ) {
            var object = objects[ i ];
            var target = targets[ i ];
            new TWEEN.Tween( object.position )
                .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
                .easing( TWEEN.Easing.Exponential.InOut )
                .start();
            new TWEEN.Tween( object.rotation )
                .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
                .easing( TWEEN.Easing.Exponential.InOut )
                .start();
        }
        new TWEEN.Tween( this )
            .to( {}, duration * 2 )
            .onUpdate( render )
            .start();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        render();
    }

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        controls.update();
    }

    function render() {
        renderer.render( scene, camera );
    }

});


