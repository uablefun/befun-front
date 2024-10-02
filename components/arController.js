const arButton = document.getElementById('view-ar');
var arModal = document.getElementById("modal-ar");
var arModalCloseButton = document.getElementById("modal-close-button-ar");

function showARModal() {
    document.getElementById('modal-ar').style.display = 'flex';
}

function closeARModal() {
    document.getElementById('modal-ar').style.display = 'none';
}

arButton.addEventListener('click', () => {
    showARModal();
    saveModelIntoServer();
});

arModalCloseButton.addEventListener("click", closeARModal);

function generateQRCode(filename) {
    // const encodedState = encodeURIComponent(JSON.stringify(filename));
    
    //https://uable001.cafe24.com/befun/ar.html
    const arPageUrl = new URL(serverURL + '/befun/ar.html');
    arPageUrl.searchParams.set('state', filename);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(arPageUrl)}`;
    
    if (qrCodeUrl) {
        document.getElementById('qrcode').src = decodeURIComponent(encodeURIComponent(qrCodeUrl));
    } else {
        alert('QR 코드 URL을 찾을 수 없습니다.');
    }
}

function saveModelIntoServer() {
    if (labels.length != 0) {
        clearLabels();
        labelsVisible = false;
        labels.leng1th = 0;
    }
    removeBackground();

    // Clone the original scene
    const exportScene = scene.clone();
    let randomModelName = null;
    
    // Generate random file name
    function generateRandomUUID() {
        return 'xxxxyxxxxxyxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    randomModelName = generateRandomUUID();
    let glbFilename = randomModelName + `.glb`;

    // Adjust position and scale of all objects in the copied scene
    exportScene.traverse((object) => {
        if (object.isMesh) {
            object.position.multiplyScalar(0.01);
            object.scale.multiplyScalar(0.01);
        }
    });

    // Export to GLB
    const glbExporter = new THREE.GLTFExporter();
    glbExporter.parse(exportScene, function(gltfData) {
        const glbBlob = new Blob([gltfData], { type: 'model/gltf-binary' });
        uploadFile(glbBlob, glbFilename);
    }, { binary: true });

    function uploadFile(blob, filename) {
        const formData = new FormData();
        formData.append('file', blob, filename);

        fetch(`${serverURL}/file/upload`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            console.log('Server response for', filename, ':', result);
        })
        .catch(error => {
            console.error('Error uploading', filename, ':', error);
        });
    }

    generateQRCode(randomModelName);
    createBackground(shelfWidth, shelfHeight, shelfDepth);
}