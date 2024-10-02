// function createBackground(shelfWidth, shelfHeight, shelfDepth) {
//     // 이전 바닥 평면과 벽 평면 제거
//     if (floorPlane) {
//         scene.remove(floorPlane);
//         floorPlane.geometry.dispose();
//         floorPlane.material.dispose();
//     }
//     if (wallPlane) {
//         scene.remove(wallPlane);
//         wallPlane.geometry.dispose();
//         wallPlane.material.dispose();
//     }

//     // 배경 크기 계산 (가구 크기에 약간의 여유를 둠)
//     const bgWidth = shelfWidth + 60;  // 양쪽에 30씩 추가
//     const bgHeight = shelfHeight + 30;  // 위에 30 추가
//     const bgDepth = shelfDepth + 30;  // 앞쪽에 30 추가

//     // 바닥 평면 생성
//     const floorGeometry = new THREE.PlaneGeometry(bgWidth, bgDepth);
//     const floorMaterial = new THREE.MeshStandardMaterial({
//         color: 0xffffff,
//         emissive: new THREE.Color(0xffffff),  // 발광 색상 설정
//         emissiveIntensity: 0.4,               // 발광 강도 설정
//         side: THREE.FrontSide,
//         roughness: 1.0,
//         metalness: 0.0
//     });
    
//     floorPlane = new THREE.Mesh(floorGeometry, floorMaterial);
//     floorPlane.rotation.x = -Math.PI / 2;  // 바닥을 수평으로 만듦
//     floorPlane.position.y = 0;  // 바닥 위치
//     floorPlane.position.z = bgDepth / 2;  // 가구 앞쪽으로 약간 이동
//     floorPlane.receiveShadow = true;  // 그림자 받기 설정
//     scene.add(floorPlane);

//     // 벽 평면 생성
//     const wallGeometry = new THREE.PlaneGeometry(bgWidth, bgHeight);
//     const wallMaterial = new THREE.MeshStandardMaterial({
//         color: 0xffffff,
//         emissive: new THREE.Color(0xffffff),  // 발광 색상 설정
//         emissiveIntensity: 0.15,               // 발광 강도 설정
//         side: THREE.FrontSide,
//         roughness: 1.0,
//         metalness: 0.0
//     });
//     wallPlane = new THREE.Mesh(wallGeometry, wallMaterial);
//     wallPlane.position.y = bgHeight / 2;  // 벽면 중앙 높이
//     wallPlane.position.z = 0;  // 가구 뒤쪽에 약간 간격을 둠
//     wallPlane.receiveShadow = true;  // 그림자 받기 설정
//     scene.add(wallPlane);
// }


function createBackground(shelfWidth, shelfHeight, shelfDepth) {
    // 이전 바닥 평면과 벽 평면 제거
    if (floorPlane) {
        scene.remove(floorPlane);
        floorPlane.geometry.dispose();
        floorPlane.material.dispose();
    }
    if (wallPlane) {
        scene.remove(wallPlane);
        wallPlane.geometry.dispose();
        wallPlane.material.dispose();
    }

    // 배경 크기 계산 (가구 크기에 약간의 여유를 둠)
    const bgWidth = shelfWidth * 1.8;  
    const bgHeight = shelfHeight * 1.1;  
    const bgDepth = shelfDepth *1.1;  

    // 바닥 평면 생성
    const floorGeometry = new THREE.PlaneGeometry(bgWidth, bgDepth);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: new THREE.Color(0xffffff),  // 발광 색상 설정
        emissiveIntensity: 0.3,               // 발광 강도 설정
        side: THREE.FrontSide,
        roughness: 1.0,
        metalness: 0.0
    });
    
    floorPlane = new THREE.Mesh(floorGeometry, floorMaterial);
    floorPlane.rotation.x = -Math.PI / 2;  // 바닥을 수평으로 만듦
    floorPlane.position.y = 0;  // 바닥 위치
    floorPlane.position.z = bgDepth / 2;  // 가구 앞쪽으로 약간 이동
    floorPlane.receiveShadow = true;  // 그림자 받기 설정
    scene.add(floorPlane);

    // 벽 평면 생성
    const wallGeometry = new THREE.PlaneGeometry(bgWidth, bgHeight);
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: new THREE.Color(0xffffff),  // 발광 색상 설정
        emissiveIntensity: 0.25,               // 발광 강도 설정
        side: THREE.FrontSide,
        roughness: 1.0,
        metalness: 0.0
    });
    wallPlane = new THREE.Mesh(wallGeometry, wallMaterial);
    wallPlane.position.y = bgHeight / 2;  // 벽면 중앙 높이
    wallPlane.position.z = 0;  // 가구 뒤쪽에 약간 간격을 둠
    wallPlane.receiveShadow = true;  // 그림자 받기 설정
    scene.add(wallPlane);
}

function removeBackground() {
    scene.remove(wallPlane);
    scene.remove(floorPlane);
}