function initializeLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // 기존 DirectionalLight
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-100, 200, 300);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 700;
    directionalLight.shadow.camera.left = -400;
    directionalLight.shadow.camera.right = 400;
    directionalLight.shadow.camera.top = 400;
    directionalLight.shadow.camera.bottom = -400;
    directionalLight.shadow.radius = 2;
    directionalLight.shadow.bias = -0.005;
    scene.add(directionalLight);

    // 반대쪽 X 좌표에 새로운 DirectionalLight 추가 (그림자 없음)
    const oppositeDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    oppositeDirectionalLight.position.set(100, 200, 300); // X 좌표를 반대로 설정
    oppositeDirectionalLight.castShadow = false; // 그림자를 비추지 않도록 설정
    scene.add(oppositeDirectionalLight);

    // CameraHelper 추가 (주석 처리된 상태로 유지)
    // const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(shadowCameraHelper);
}






// // pointLight
// function initializeLights(scene) {
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
//     scene.add(ambientLight);

//     const pointLight = new THREE.PointLight(0xffffff, 0.5);
//     pointLight.position.set(-100, 300, 400);
//     pointLight.castShadow = true;
//     pointLight.shadow.mapSize.width = 1024;
//     pointLight.shadow.mapSize.height = 1024;
//     pointLight.shadow.camera.near = 0.1;
//     pointLight.shadow.camera.far = 700;
//     pointLight.shadow.radius = 4;
//     pointLight.shadow.bias = -0.005;
//     scene.add(pointLight);

//     // CameraHelper는 PointLight에 사용할 수 없습니다.
// }



// // spotlight

// function initializeLights(scene) {
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
//     scene.add(ambientLight);

//     const spotLight = new THREE.SpotLight(0xffffff, 0.6);
//     spotLight.position.set(-200, 300, 400);
//     spotLight.castShadow = true;
//     spotLight.shadow.mapSize.width = 1024;
//     spotLight.shadow.mapSize.height = 1024;
//     spotLight.shadow.camera.near = 0.1;
//     spotLight.shadow.camera.far = 700;
//     spotLight.shadow.camera.fov = 40;
//     spotLight.shadow.radius = 4;
//     spotLight.shadow.bias = -0.001;
//     scene.add(spotLight);

//     // CameraHelper 추가
//     const shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
//     scene.add(shadowCameraHelper);
// }

