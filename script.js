/// <reference path="third_party/three.js" />

function SetScene() {

    let scene = new THREE.Scene();

    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;

    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    const container = document.querySelector('#container');

    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const camera =
        new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );
    camera.position.set(30, 30, 30);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene.add(camera);

    const light =
      new THREE.DirectionalLight(0xFFFFFF, 2);

    light.position.set(-30, 15, 30);
    light.shadow.camera.left = -40;
    light.shadow.camera.right = 40;
    light.shadow.camera.bottom = -40;
    light.shadow.camera.top = 40;
    light.castShadow = true;
    //scene.add(new THREE.CameraHelper(light.shadow.camera));

    scene.add(light);

    resize();

    container.appendChild(renderer.domElement);

    function resize() {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;

        renderer.setSize(WIDTH, HEIGHT);
    }

    window.addEventListener('resize', () => {
        resize();
    }, true);

    function update(timestamp) {
        renderer.render(scene, camera);

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);

    let axisHelper = new THREE.AxisHelper(2);
    scene.add(axisHelper);

    window.scene = scene
    window.THREE = THREE

    return scene;
}

function ResetScene(scene) {
    let to_remove = [];

    scene.traverse(function (child) {
        if (child instanceof THREE.Mesh && !child.userData.keepMe === true) {
            to_remove.push(child);
        }
    });

    for (let i = 0; i < to_remove.length; i++) {
        scene.remove(to_remove[i]);
    }
}