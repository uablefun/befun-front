let colors_dict = {
    "black":"wood001",
    "white":"wood002",
    "gray":"wood003",
    "ivory+":"wood004",
    "pink+":"wood005",
    "blue+":"wood006",
    "orange+":"wood007",
    "green+":"wood008",
    "navy+":"wood009",
    "skyblue+":"wood010",
    "lightgreen+":"wood011",
    "mint+":"wood012",
    "lemon+":"wood013",
    "redviolet+":"wood014",
}
const colorButtons = document.querySelectorAll('.color-button');

document.addEventListener('DOMContentLoaded', () => {
    switch(currentColor) {
        case "black":
            isCustomColor = false;
            changeFurnitureTexture(colors_dict["black"]);
            break;
        case "white":
            isCustomColor = false;
            changeFurnitureTexture(colors_dict["white"]);
            break;
        case "gray":
            isCustomColor = false;
            changeFurnitureTexture(colors_dict["gray"]);
            break;
        case "ivory+":
            isCustomColor = true;
            changeFurnitureTexture(colors_dict["ivory+"]);
            break;
        case "pink+":
            isCustomColor = true;
            changeFurnitureTexture(colors_dict["pink+"]);
            break;
        case "blue+":
            isCustomColor = true;
            changeFurnitureTexture(colors_dict["blue+"]);
            break;
        case "orange+":
            isCustomColor = true;
            changeFurnitureTexture(colors_dict["orange+"]);
            break;
        case "green+":
            isCustomColor = true;
            changeFurnitureTexture(colors_dict["green+"]);
            break;
        case "navy+":
            isCustomColor = true;
            changeFurnitureTexture(colors_dict["navy+"]);
            break;
        case "skyblue+":
            isCustomColor = true;
            changeFurnitureTexture(colors_dict["skyblue+"]);
            break;
        case "lightgreen+":
            isCustomColor = true;
            changeFurnitureTexture(colors_dict["lightgreen+"]);
            break;
        case "mint+":
            isCustomColor = true;
            changeFurnitureTexture(colors_dict["mint+"]);
            break;
        case "lemon+":
            isCustomColor = true;
            changeFurnitureTexture(colors_dict["lemon+"]);
            break;
        case "redviolet+":
            isCustomColor = true;
            changeFurnitureTexture(colors_dict["redviolet+"]);
            break;
        default:
            console.log(currentColor);
            break;
    }
    
    colorButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const img = button.querySelector('img');

            // currentColor를 갱신
            for (var key in colors_dict) {
                if (colors_dict[key] === img.alt) {
                    currentColor = key;
                    if (colors_dict[key].startsWith("wood")) {
                        if (colors_dict[key] === "wood001" ||
                            colors_dict[key] === "wood002" ||
                            colors_dict[key] === "wood003") {
                            isCustomColor = false;
                        }
                        else {
                            isCustomColor = true;
                        }
                        changeFurnitureTexture(colors_dict[currentColor]);
                    }
                    else {
                        changeFurnitureColor(colors_dict[currentColor]);
                    }
                }
            }

            // 모든 버튼의 선택 상태 해제
            colorButtons.forEach(btn => btn.classList.remove('selected'));
            // 현재 클릭한 버튼 선택 상태로 설정
            button.classList.add('selected');
        });
    });
});

function changeFurnitureColor(color) {
    switch(color) {
        case "silverAndIndigo":
            baseColor = '#DBD4CC';
            edgeColor = '#2B3C59';
            break;
        default:
            baseColor = '#FFFFFF';
            edgeColor = baseColor;
            break;
    }
    
    disposeTextures(materials.verticalBase);
    disposeTextures(materials.verticalEdge);
    disposeTextures(materials.horizontalBase);
    disposeTextures(materials.horizontalEdge);
    disposeTextures(materials.backPanel);

    materials.verticalBase.color.set(baseColor);
    materials.verticalEdge.color.set(edgeColor);
    materials.horizontalBase.color.set(baseColor);
    materials.horizontalEdge.color.set(edgeColor);
    materials.backPanel.color.set(baseColor);

    // 색상 변경 후 새롭게 선반을 생성
    createShelf(currentStyle);
}

function changeFurnitureTexture(textureName) {
    const textureLoader = new THREE.TextureLoader();

    const textures = {
        verticalBase: { diffMap: null },
        verticalEdge: { diffMap: null },
        horizontalBase: { diffMap: null },
        horizontalEdge: { diffMap: null },
        backPanel: { diffMap: null }
    };
    
    let texturesLoaded = 0;
    const totalTextures = 5; // 5 textureTypes * 1 textureMap (diffuse only)
    const loadedTextures = [];

    const checkAndApplyTextures = () => {
        if (texturesLoaded === totalTextures) {
            disposeTextures(materials.verticalBase);
            disposeTextures(materials.verticalEdge);
            disposeTextures(materials.horizontalBase);
            disposeTextures(materials.horizontalEdge);
            disposeTextures(materials.backPanel);
            
            const applyTexture = (material, texture) => {
                material.map = texture.diffMap;
                // 다른 맵 설정 제거
                material.roughnessMap = null;
                material.normalMap = null;
                material.aoMap = null;
                material.needsUpdate = true;
            };

            applyTexture(materials.verticalBase, textures.verticalBase);
            applyTexture(materials.verticalEdge, textures.verticalEdge);
            applyTexture(materials.horizontalBase, textures.horizontalBase);
            applyTexture(materials.horizontalEdge, textures.horizontalEdge);
            applyTexture(materials.backPanel, textures.backPanel);

            createShelf(currentStyle);

            // 로드된 텍스처 로그 (필요시 주석 해제)
            // console.log(`로드된 텍스처: ${loadedTextures.join(', ')}`);
        }
    };

    const textureTypes = ['verticalBase', 'verticalEdge', 'horizontalBase', 'horizontalEdge', 'backPanel'];
    const textureMaps = ['diff']; // diffuse 맵만 사용
    
    textureTypes.forEach(type => {
        textureMaps.forEach(map => {
            const texturePath = `./imgs/textures/${textureName}/${type}_${map}.jpg`;
            const textureLabel = `${type}_${map}`;
            
            textureLoader.load(
                texturePath,
                (texture) => {
                    textures[type][`${map}Map`] = texture;
                    loadedTextures.push(textureLabel);
                    texturesLoaded++;
                    checkAndApplyTextures();
                },
                undefined,
                () => {
                    // 에러 발생 시 조용히 처리
                    texturesLoaded++;
                    checkAndApplyTextures();
                }
            );
        });
    });
}

// function changeFurnitureTexture(textureName) {
//     //console.log('changeFurnitureTexture called with:', textureName);
//     const textureLoader = new THREE.TextureLoader();

//     const textures = {
//         verticalBase: { diffMap: null, roughMap: null, norMap: null, aoMap: null },
//         verticalEdge: { diffMap: null, roughMap: null, norMap: null, aoMap: null },
//         horizontalBase: { diffMap: null, roughMap: null, norMap: null, aoMap: null },
//         horizontalEdge: { diffMap: null, roughMap: null, norMap: null, aoMap: null },
//         backPanel: { diffMap: null, roughMap: null, norMap: null, aoMap: null }
//     };
    
//     let texturesLoaded = 0;
//     const totalTextures = 20; // 5 textureTypes * 4 textureMaps
//     const loadedTextures = [];
//     const failedTextures = [];

//     const checkAndApplyTextures = () => {
//         if (texturesLoaded === totalTextures) {
//             disposeTextures(materials.verticalBase);
//             disposeTextures(materials.verticalEdge);
//             disposeTextures(materials.horizontalBase);
//             disposeTextures(materials.horizontalEdge);
//             disposeTextures(materials.backPanel);
            
//             const applyTexture = (material, texture) => {
//                 material.map = texture.diffMap;
//                 material.roughnessMap = texture.roughMap;
//                 material.normalMap = texture.norMap;
//                 material.normalScale.set(5, 5); // 노멀 맵의 강도 설정

//                 material.aoMap = texture.aoMap;
//                 material.needsUpdate = true;
//             };

//             applyTexture(materials.verticalBase, textures.verticalBase);
//             applyTexture(materials.verticalEdge, textures.verticalEdge);
//             applyTexture(materials.horizontalBase, textures.horizontalBase);
//             applyTexture(materials.horizontalEdge, textures.horizontalEdge);
//             applyTexture(materials.backPanel, textures.backPanel);

//             createShelf(currentStyle);

//             // 모든 텍스처 로딩 후 콘솔에 출력
//             //console.log(`로드된 텍스처: ${loadedTextures.join(', ')}`);
//             //console.log(`로드되지 않은 텍스처: ${failedTextures.join(', ')}`);
//         }
//     };

//     const textureTypes = ['verticalBase', 'verticalEdge', 'horizontalBase', 'horizontalEdge', 'backPanel'];
//     const textureMaps = ['diff', 'rough', 'nor', 'ao'];
    
//     textureTypes.forEach(type => {
//         textureMaps.forEach(map => {
//             const texturePath = `./imgs/textures/${textureName}/${type}_${map}.jpg`;
//             const textureLabel = `${type}_${map}`;
//             //console.log('Attempting to load texture:', texturePath);
            
//             textureLoader.load(
//                 texturePath,
//                 (texture) => {
//                     textures[type][`${map}Map`] = texture;
//                     loadedTextures.push(textureLabel);
//                     texturesLoaded++;
//                     checkAndApplyTextures();
//                 },
//                 undefined,
//                 (error) => {
//                     console.warn('Failed to load texture:', texturePath, error);
//                     failedTextures.push(textureLabel);
//                     texturesLoaded++;
//                     checkAndApplyTextures();
//                 }
//             );
//         });
//     });
// }

function disposeTextures(material) {
    if (material.map) {
        material.map.dispose();
        material.map = null;
    }
    if (material.roughnessMap) {
        material.roughnessMap.dispose();
        material.roughnessMap = null;
    }
    if (material.normalMap) {
        material.normalMap.dispose();
        material.normalMap = null;
    }
    if (material.aoMap) {
        material.aoMap.dispose();
        material.aoMap = null;
    }
    material.color.set('#ffffff');
    material.needsUpdate = true;
}

// app.js에서 분리해서 가져옴.

// function loadInitialTextures() {
//     const textureLoader = new THREE.TextureLoader();

//     textureLoader.load('imgs/edge/vertical_edge.png', function(texture) {
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.center.set(0.5, 0.5);
//         materials.verticalEdge.color.set('');
//         materials.verticalEdge.map = texture;
//         materials.verticalEdge.needsUpdate = true;
//         createShelf(currentStyle);
//     }, undefined, function(error) {
//         console.error('Error loading vertical edge texture:', error);
//     });

//     textureLoader.load('imgs/edge/horizontal_edge.png', function(texture) {
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.center.set(0.5, 0.5);
//         materials.horizontalEdge.color.set('');
//         materials.horizontalEdge.map = texture;
//         materials.horizontalEdge.needsUpdate = true;
//     }, undefined, function(error) {
//         console.error('Error loading horizontal edge texture:', error);
//     });

//     textureLoader.load('imgs/body/vertical_body.jpg', function(texture) {
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.center.set(0.5, 0.5);
//         materials.verticalBase.color.set('');
//         materials.verticalBase.map = texture;
//         materials.verticalBase.needsUpdate = true;
//     }, undefined, function(error) {
//         console.error('Error loading vertical body texture:', error);
//     });

//     textureLoader.load('imgs/body/horizontal_body.jpg', function(texture) {
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.center.set(0.5, 0.5);
//         materials.horizontalBase.color.set('');
//         materials.horizontalBase.map = texture;
//         materials.horizontalBase.needsUpdate = true;
//         createShelf(currentStyle);
//     }, undefined, function(error) {
//         console.error('Error loading horizontal body texture:', error);
//     });
// }

//13 월드좌표계 도입

function updateTextureRepeat(material, panelType) {
    if (!material.map) {
        //console.warn('Material has no map:', material);
        return;
    }

    //console.log(`Updating texture repeat for material: ${material.uuid}`);

    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;

    // 기준 텍스처 크기 설정 (예: shelfWidth가 30일 때의 크기)
    const baseTextureWidth = 30; // cm 단위
    const baseTextureHeight = 30; // cm 단위

    // 월드 좌표계 기준 반복 계산
    let repeatX, repeatY;
    switch(panelType) {
        case 'verticalBase':
        case 'verticalEdge':
            repeatX = shelfHeight / baseTextureHeight;
            repeatY = thickness / baseTextureWidth;
            break;
        case 'horizontalBase':
        case 'horizontalEdge':
            repeatX = shelfWidth / baseTextureWidth;
            repeatY = thickness / baseTextureHeight;
            break;
        case 'backPanel':
            repeatX = shelfWidth / baseTextureWidth;
            repeatY = shelfHeight / baseTextureHeight;
            break;
        default:
            repeatX = 1;
            repeatY = 1;
    }

    // 텍스처 반복 설정
    material.map.repeat.set(repeatX, repeatY);

    // 텍스처 오프셋 조정으로 정렬 유지
    material.map.offset.x = 0;
    material.map.offset.y = 0;

    material.map.needsUpdate = true;

    //console.log(`Updated repeat: ${material.map.repeat.x}, ${material.map.repeat.y}`);
}