// 원본. 그냥 안정화버전이나, 노이즈가 있음.
function addBox(width, height, depth, x, y, z, baseMaterial, edgeMaterial, lineMaterial, isVertical = false) {
    const geometry = new THREE.BoxGeometry(width, height, depth);

    let materialsArray;

    if (isVertical) {
        const rotatedBaseMaterial = baseMaterial.clone();
        if (rotatedBaseMaterial.map) {
            rotatedBaseMaterial.map.rotation = THREE.MathUtils.degToRad(textureRotation.verticalBase);
            rotatedBaseMaterial.map.center.set(0.5, 0.5);
            // console.log('Calling updateTextureRepeat for vertical base material');
            updateTextureRepeat(rotatedBaseMaterial, 'verticalBase');
        }

        materialsArray = [
            rotatedBaseMaterial, // left
            rotatedBaseMaterial, // right
            edgeMaterial, // top
            edgeMaterial, // bottom
            edgeMaterial, // front
            edgeMaterial  // back
        ];
    } else {
        const rotatedBaseMaterial = baseMaterial.clone();
        if (rotatedBaseMaterial.map) {
            rotatedBaseMaterial.map.rotation = THREE.MathUtils.degToRad(textureRotation.horizontalBase);
            rotatedBaseMaterial.map.center.set(0.5, 0.5);
            // console.log('Calling updateTextureRepeat for horizontal base material');
            updateTextureRepeat(rotatedBaseMaterial, 'horizontalBase');
        }

        materialsArray = [
            edgeMaterial, // left
            edgeMaterial, // right
            rotatedBaseMaterial, // top
            rotatedBaseMaterial, // bottom
            edgeMaterial, // front
            edgeMaterial  // back
        ];
    }

    const mesh = new THREE.Mesh(geometry, materialsArray);
    mesh.position.set(x, y, z);
    mesh.scale.set(1, 1, 1);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // addBox로 생성된 객체라는 태그를 추가
    mesh.userData.isAddBox = true;

    scene.add(mesh);
    parts.push(mesh);

    // // 1. 원본. 패널 정보 저장
    // const panelInfo = {
    //     width: width,
    //     height: height,
    //     depth: depth,
    //     position: { x: x, y: y, z: z },
    //     scale: { x: 1, y: 1, z: 1 },
    //     rotation: { x: 0, y: 0, z: 0 }
    // };
    // savedParts.push(panelInfo);
    
    // // 2. 1/100 크기로 변환된 패널 정보 저장
    // const panelInfo = {
    //     width: width * 0.01,
    //     height: height * 0.01,
    //     depth: depth * 0.01,
    //     position: { 
    //         x: x * 0.01, 
    //         y: y * 0.01, 
    //         z: z * 0.01 
    //     },
    //     scale: { x: 0.01, y: 0.01, z: 0.01 },
    //     rotation: { x: 0, y: 0, z: 0 }
    // };
    // savedParts.push(panelInfo);

    // 3. 패널을 분류한다. 4가지로
    const panelInfo = {
        width: width * 0.01,
        height: height * 0.01,
        depth: depth * 0.01,
        // position: { 
        //     x: x * 0.01, 
        //     y: y * 0.01, 
        //     z: z * 0.01 
        // },
        // scale: { x: 0.01, y: 0.01, z: 0.01 },
        // rotation: { x: 0, y: 0, z: 0 },
        type: determinePanelType(width, height, depth, hasBackPanel) // 패널 유형 결정
    };
    
    // 패널 타입을 결정하는 함수
    function determinePanelType(width, height, depth, hasBackPanel) {
        if (height === 2) { // height가 2인 경우 (가로 패널)
            return 'h'; // Horizontal
        } else if (width === 2) { // width가 2인 경우 (세로 패널)
            return 'v'; // Vertical
        } else if (depth === 2) {
            if (hasBackPanel) {
                return 'b'; // Back Panel
            } else {
                return 's'; // Support Panel
            }
        }
        return 'unknown'; // 분류되지 않은 경우
    }
    
    savedParts.push(panelInfo);



}


// gridline관련내용 삭제.
