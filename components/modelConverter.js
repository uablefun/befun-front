//const path = require('path');

// // dxf-writer 라이브러리 import
//const DxfWriter = require('dxf-writer');

function downloadFile(data, filename) {
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);

    const url = URL.createObjectURL(data);
    link.href = url;
    link.download = filename;
    link.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }, 100);
}

// 1. OBJ 다운로드(라벨이 노출됨)
// function exportToOBJ() {
//     // 원본 장면을 복사
//     const exportScene = scene.clone();

//     // 복사된 장면의 모든 객체에 대해 위치와 스케일을 1/100로 조정
//     exportScene.traverse((object) => {
//         if (object.isMesh) {
//             // 위치 조정
//             object.position.set(
//                 object.position.x * 0.01,
//                 object.position.y * 0.01,
//                 object.position.z * 0.01
//             );

//             // 스케일 조정
//             object.scale.set(
//                 object.scale.x * 0.01,
//                 object.scale.y * 0.01,
//                 object.scale.z * 0.01
//             );
//         }
//     });

//     // OBJExporter 사용
//     const objExporter = new THREE.OBJExporter();
//     const objData = objExporter.parse(exportScene);

//     // Blob 생성 및 파일 다운로드
//     const objBlob = new Blob([objData], { type: 'text/plain' });
//     const objFilename = `befun_${currentStyle}_${shelfWidth / 100}_${shelfHeight / 100}_${shelfDepth / 100}.obj`;
//     downloadFile(objBlob, objFilename);

//     // MTLExporter를 통해 재질 내보내기
//     const mtlExporter = new THREE.MTLExporter();
//     const mtlData = mtlExporter.parse(exportScene);

//     // Blob 생성 및 파일 다운로드
//     const mtlBlob = new Blob([mtlData], { type: 'text/plain' });
//     const mtlFilename = `befun_${currentStyle}_${shelfWidth / 100}_${shelfHeight / 100}_${shelfDepth / 100}.mtl`;
//     downloadFile(mtlBlob, mtlFilename);
// }

// 2. 라벨노출 방지는 되나. 크기 조절이 안됨.
function exportToOBJ() {
    // 원본 장면에서 내보낼 새로운 장면 생성
    const exportScene = new THREE.Scene();

    // 원본 장면의 모든 객체를 순회
    scene.traverse((object) => {
        if (object.isMesh && object.userData.isAddBox) {
            // addBox로 생성된 객체만 복제
            const cloneMesh = object.clone();

            // 위치 조정
            cloneMesh.position.set(
                object.position.x * 0.01,
                object.position.y * 0.01,
                object.position.z * 0.01
            );

            // 스케일 조정
            cloneMesh.scale.set(
                object.scale.x * 0.01,
                object.scale.y * 0.01,
                object.scale.z * 0.01
            );

            // 새로운 장면에 복제된 메쉬 추가
            exportScene.add(cloneMesh);
        }
    });

    // OBJExporter 사용
    const objExporter = new THREE.OBJExporter();
    const objData = objExporter.parse(exportScene);

    // Blob 생성 및 파일 다운로드
    const objBlob = new Blob([objData], { type: 'text/plain' });
    const objFilename = `befun_${currentStyle}_${shelfWidth / 100}_${shelfHeight / 100}_${shelfDepth / 100}.obj`;
    downloadFile(objBlob, objFilename);

    // MTLExporter를 통해 재질 내보내기
    const mtlExporter = new THREE.MTLExporter();
    const mtlData = mtlExporter.parse(exportScene);

    // Blob 생성 및 파일 다운로드
    const mtlBlob = new Blob([mtlData], { type: 'text/plain' });
    const mtlFilename = `befun_${currentStyle}_${shelfWidth / 100}_${shelfHeight / 100}_${shelfDepth / 100}.mtl`;
    downloadFile(mtlBlob, mtlFilename);
}



// glb 다운로드.텍스쳐정상.크기1/100축소.

function exportToGLB() {
    if (labels.length != 0) {
        clearLabels();
        labelsVisible = false;
        labels.length = 0;
    }
    removeBackground();

    // 원본 장면을 복사
    const exportScene = scene.clone();

    // 복사된 장면의 모든 객체에 대해 위치와 스케일을 1/100로 조정
    exportScene.traverse((object) => {
        if (object.isMesh) {
            // 위치 조정
            object.position.set(
                object.position.x * 0.01,
                object.position.y * 0.01,
                object.position.z * 0.01
            );

            // 스케일 조정
            object.scale.set(
                object.scale.x * 0.01,
                object.scale.y * 0.01,
                object.scale.z * 0.01
            );
        }
    });

    // GLTFExporter를 사용하여 조정된 장면을 GLB로 내보내기
    const exporter = new THREE.GLTFExporter();
    exporter.parse(exportScene, function(gltfData) {
        const blob = new Blob([gltfData], { type: 'model/gltf-binary' });

        // 파일명 생성 및 다운로드
        const filename = `befun_${currentStyle}_${shelfWidth / 100}_${shelfHeight / 100}_${shelfDepth / 100}.glb`;
        downloadFile(blob, filename);
    }, { binary: true });
    
    createBackground(shelfWidth, shelfHeight, shelfDepth);
}




// Three.js 장면을 DXF 형식으로 내보내는 함수
function exportSceneToDXF(scene) {
    const writer = new DxfWriter();
    scene.traverse(function(object) {
        if (object.isMesh) {
            const geometry = object.geometry;
            const position = object.position;

            if (geometry.isBufferGeometry) {
                const vertices = geometry.attributes.position.array;
                for (let i = 0; i < vertices.length; i += 9) {
                    const x1 = vertices[i] + position.x;
                    const y1 = vertices[i + 1] + position.y;
                    const z1 = vertices[i + 2] + position.z;

                    const x2 = vertices[i + 3] + position.x;
                    const y2 = vertices[i + 4] + position.y;
                    const z2 = vertices[i + 5] + position.z;

                    const x3 = vertices[i + 6] + position.x;
                    const y3 = vertices[i + 7] + position.y;
                    const z3 = vertices[i + 8] + position.z;

                    writer.add3DFace(x1, y1, z1, x2, y2, z2, x3, y3, z3);
                }
            }
        }
    });

    return writer.toDxfString();
}



// Three.js 장면을 DXF로 내보내기
function exportToDXF() {
    const dxfData = exportSceneToDXF(scene);
    const blob = new Blob([dxfData], { type: 'application/dxf' });
    const filename = `befun_${currentStyle}_${shelfWidth}_${shelfHeight}_${shelfDepth}.dxf`; // 파일명 생성
    downloadFile(blob, filename);
}


function exportModel(format) {
    if (format === 'obj') {
        exportToOBJ();
    } else if (format === 'glb') {
        exportToGLB();
    } else if (format === 'dxf') {
        exportToDXF();
    }
}









