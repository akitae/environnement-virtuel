$(function () {
    // Objets Three JS.
    let camera, scene, renderer;
    // Rotation, zoom.
    let controls;
    // Tous les objets images.
    let objects = [];
    // Différentes formes.
    let targets = {
        sphere: [],
        helix: [],
        grid: []
    };
    // Id de la forme en cours.
    let formeInDisplay = "sphere";
    // Temps d'animation entre les formes.
    let duration = 2000;


    // Taille maximum des images.
    let maxWidth = 300;
    let maxHeight = 300;
    // Répertoire des images.
    let directory = {
        SUD: "./img/Env-Virt-Sud",
        KTD: "./img/Env-Virt-KTD",
        TOU: "./img/Env-Virtuels-Tou"
    };

    // Récupération des chemins des images.
    getImagePath(directory.KTD).then(function (tableImagePath) {
        // Création des objets images.
        createObject(tableImagePath).then(function (tableImage) {
            initScene();
            init(tableImage);
            animate();
        });

    });

    // Changement de répertoire des images.
    $("input[name=image]:radio").change(function () {
        $('#wait').addClass("d-block");
        // On supprime toutes les images de la scène.
        for (let index = 0; index < objects.length; index++) {
            scene.remove(objects[index]);
        }
        // On réinitialise les formes.
        targets = {
            sphere: [],
            helix: [],
            grid: []
        };

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
        console.info("Changement du dossier des images : "+this.value);

        getImagePath(pathDirectory).then(function (tableImagePath) {

            createObject(tableImagePath).then(function (tableImage) {
               updateScene(tableImage);
            });

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
            let tableImagePath = [];

            // Requête ajax pour récupérer les différentes extensions des images.
            $.ajax({
                url: directory
            }).done(function (data) {
                console.info("Recupération des chemins des images.");

                let nbImage = 0;
                extensions.forEach(function (extension) {
                    console.log("data : ",data);
                    $(data).find("a:contains("+extension+")").each(function () {
                        let filename = directory+this.pathname;
                        console.log("filename : ",filename );
                        console.log("pathName : ",this.pathname);
                        console.log(" Le ficher: ",this.href);

                        tableImagePath.push(filename);
                        nbImage++;
                    });
                });

                console.info(nbImage+" images ont été récupérées.");

                resolve(tableImagePath);
            }).fail(function (error) {
                console.error("Erreur dans la récupération des chemins des images.");
                reject(error);
            });
        });

    }

    /**
     * Création de toutes les images du DOM.
     * @param tableImagePath
     * @returns {Promise<any>}
     */
    function createObject (tableImagePath) {
        return new Promise(function (resolve) {
            let tablePromise = [];

            // On crée pour toutes les images le composant du DOM.
            for (let index = 0; index < tableImagePath.length; index++) {
                let promise = new Promise(function (resolve) {
                    let image = new Image();
                    image.src = tableImagePath[index];
                    image.onload = function () {
                        resolve(this);
                    }
                });

                tablePromise.push(promise);
            }

            console.info("Chargement des images en cours.");

            Promise.all(tablePromise).then(function(tableImage) {
                console.info("Chargement terminés !");
                resolve(tableImage);
            });
        });
    }

    /**
     * Initialisation de la scène.
     */
    function initScene () {
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 6000;
        scene = new THREE.Scene();
    }

    /**
     * Initialisation de tout les composants de la scène.
     * @param tableImage
     */
    function init(tableImage) {

        initObject(tableImage);
        createSphere();
        createChemin();
        createTableau();

        createRenderer();
        createControls();
        addListeners();

        hideWait();

        transform(targets.sphere, duration);

        window.addEventListener('resize', onWindowResize, false);
    }

    /**
     * Initialisation des objets images.
     */
    function initObject (tableImage) {

        objects = [];
        // Initialisation des images et des positions.
        for (let index = 0; index < tableImage.length; index++) {
            let element = document.createElement("div");
            element.className = 'element';

            let image = tableImage[index];

            size = scaleImage(image, maxWidth, maxHeight);
            image.width = size.width;
            image.height = size.height;

            element.appendChild(image);

            let object = new THREE.CSS3DObject(element);
            object.position.x = Math.random() * 4000 - 2000;
            object.position.y = Math.random() * 4000 - 2000;
            object.position.z = Math.random() * 4000 - 2000;

            scene.add(object);
            objects.push(object);
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
            targets.sphere.push(object);
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

            object.lookAt(vector);
            targets.helix.push(object);
        }
    }

    /**
     * Création du tableau.
     */
    function createTableau () {

        for (let index = 0; index < objects.length; index++) {
            let object = new THREE.Object3D();
            object.position.x = ((index % 5) * 400) - 800;
            object.position.y = ( -(Math.floor(index/5) % 5) * 400) + 800;
            object.position.z = (Math.floor( index/25)) * 1000 - 2000;

            targets.grid.push(object);
        }
    }

    /**
     * Ajout des évènements pour changer de forme.
     */
    function addListeners () {

        /**
         * Sphère
         */
        $('#sphere').on("click", function () {
            transform(targets.sphere, duration);
            formeInDisplay = this.id;
            activeButton(this.id);
        });

        /**
         * Chemin
         */
        $('#helix').on("click", function () {
            transform(targets.helix, duration);
            formeInDisplay = this.id;
            activeButton(this.id);
        });

        /**
         * Tableau
         */
        $('#grid').on("click", function () {
            transform(targets.grid, duration);
            formeInDisplay = this.id;
            activeButton(this.id);
        });

        /**
         * Active le bouton de la forme sélectionné.
         * @param id
         */
        function activeButton (id) {
            $('#btn-forme').find('button').each(function () {
               $(this).removeClass("active");
            });

            $("#"+id).addClass("active");
        }
    }

    /**
     * Mise à jour de la scène avec les nouvelles images.
     */
    function updateScene (tableImage) {
        initObject(tableImage);
        createSphere();
        createChemin();
        createTableau();

        hideWait();

        transform(returnTarget(formeInDisplay), duration);
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

    /**
     * Retourne la forme suivant l'id de l'objet souhaité.
     */
    function returnTarget (id) {
        switch (id) {
            case "sphere":
                return targets.sphere;
            case "helix":
                return targets.helix;
            case "grid":
                return targets.grid;
        }
    }

    /**
     * Cache la div d'information de chargement des images.
     */
    function hideWait () {
        $('#wait').removeClass("d-block");
    }

    /**
     * Permet de passer en animation d'une forme à l'autre.
     * @param targets
     * @param duration
     */
    function transform(targets, duration) {
        TWEEN.removeAll();

        for (let index = 0; index < objects.length; index++) {
            let object = objects[index];
            let target = targets[index];

            new TWEEN.Tween(object.position)
                .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

            new TWEEN.Tween(object.rotation)
                .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        }

        new TWEEN.Tween(this)
            .to({}, duration * 2)
            .onUpdate(render)
            .start();
    }

    /**
     * Méthode de base pour l'affichage de la scène en 3D.
     */

    function createRenderer () {
        renderer = new THREE.CSS3DRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById('container').appendChild(renderer.domElement);
    }

    function createControls () {
        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 0.5;
        controls.minDistance = 500;
        controls.maxDistance = 7000;
        controls.addEventListener('change', render);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
        controls.update();
    }

    function render() {
        renderer.render(scene, camera);
    }

});