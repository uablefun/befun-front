document.addEventListener('DOMContentLoaded', function() {
    init();
    animate();
    initializeEventListeners();
});

let scene, camera, renderer, controls, directionalLight;
// 전역 변수로 바닥 평면과 벽 평면을 추적
let shelfHeightUnit = 32;
let floorPlane, wallPlane;
let returnToOriginalPositionTimer;
let originalPrice;
let discountPrice;
let finalPrice;
let isDiscountActive = true; // true면 할인 중, false면 할인 중 아님
let discountRate = 20; // 할인율(%)
let addChargeRate = 20;
let isCustomColor;
let shelfWidth = 90;
let shelfHeight = 70;
let thickness =2;
let shelfDepth = 30;
let density = 50; // 기본 밀도 값

// // 크기를 1/100로 줄이기
// let furnitureWidth = shelfWidth / 100;
// let furnitureHeight = shelfHeight / 100;
// let furnitureDepth = shelfDepth / 100;
// let furnitureThickness = thickness / 100;

let currentStyle = 'grid';
let hasBackPanel = false;
//let currentColor = { verticalBase: '#DBD4CC', verticalEdge: '#2B3C59', horizontalBase: '#DBD4CC', horizontalEdge: '#2B3C59' };
let currentColor = "gray";
let textureScale = { verticalBase: 1, verticalEdge: 1, horizontalBase: 1, horizontalEdge: 1 };
let textureRotation = { verticalBase: 0, verticalEdge: 0, horizontalBase: 0, horizontalEdge: 0 };
let baseTextureSize = { width: 300, height: 300 }; // 기본 텍스처 크기 설정
let selectedComponent = 'verticalBase';
let parts = [];
let savedParts = []; // 패널 정보를 저장할 배열
let cameraTimeout;
let rows = 2;
let columns = 3;
let highlightedRow = null; // 행 강조를 위한 변수 추가
let dimensionsMode = false;
let loadedFont = null;
let composer, outlinePass; //후처리 렌더패스
let originalBaseTexture = null;
let isOriginalTextureSaved = false;
let initialCameraPosition, initialControlsTarget; // 초기 카메라 위치와 컨트롤 타겟 저장
let isInitialLoad = true;


const materials = {
    verticalBase: new THREE.MeshStandardMaterial({ color: currentColor.verticalBase, side: THREE.DoubleSide }),
    verticalEdge: new THREE.MeshStandardMaterial({ color: currentColor.verticalEdge, side: THREE.DoubleSide }),
    horizontalBase: new THREE.MeshStandardMaterial({ color: currentColor.horizontalBase, side: THREE.DoubleSide }),
    horizontalEdge: new THREE.MeshStandardMaterial({ color: currentColor.horizontalEdge, side: THREE.DoubleSide }),
    backPanel: new THREE.MeshStandardMaterial({ color: currentColor.verticalBase, side: THREE.DoubleSide })
};

// init함수 외부로

function init() {
    scene = new THREE.Scene();
    
    const canvasContainer = document.getElementById('canvas-container');
    const canvasWidth = canvasContainer.clientWidth;
    const canvasHeight = canvasContainer.clientHeight;

    // 카메라
    camera = new THREE.PerspectiveCamera(40, canvasWidth / canvasHeight, 0.1, 1000);
    initialCameraPosition = camera.position.clone(); // 초기 카메라 위치 저장
    camera.lookAt(scene.position);

    //렌더러
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
    renderer.setSize(canvasWidth, canvasHeight);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xffffff);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // orbitControls조정
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.dampingFactor = 0.0;
    controls.enableZoom = true;
    controls.enablePan = true;

    // 줌의 최소 및 최대 범위 설정(카메라 조정과 충돌)
    controls.minDistance = 100; // 최소 줌 거리
    controls.maxDistance = 600; // 최대 줌 거리

    // 수직 각도 제한 설정 (0에서 90도까지)
    controls.maxPolarAngle = Math.PI * 2 / 3;
    controls.minPolarAngle = 0;

    // 수평 각도 제한 설정 (정면을 기준으로 180도)
    //controls.minAzimuthAngle = -Math.PI * 4 / 5;
    //controls.maxAzimuthAngle = Math.PI * 4 / 5;
    
    // // AxesHelper 추가 
    // const axesHelper = new THREE.AxesHelper(50);
    // scene.add(axesHelper);

    initializeLights(scene);

    // 초기 광원 오프셋 설정
    initialLightOffset = new THREE.Vector3().subVectors(directionalLight.position, camera.position);

    createShelf(currentStyle);
    adjustCameraPosition();

    isInitialLoad = false;

    createBackground(shelfWidth, shelfHeight, shelfDepth);

    window.addEventListener('resize', onWindowResize, false);
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera); //일반렌더러
    //composer.render(); // composer를 사용하여 렌더링
    
}

function onWindowResize() {
    const canvasContainer = document.getElementById('canvas-container');
    const canvasWidth = canvasContainer.clientWidth;
    const canvasHeight = canvasContainer.clientHeight;

    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasWidth, canvasHeight);
}

window.addEventListener('resize', onWindowResize, false);

function createShelf(style) {
    clearScene();
    savedParts = []; // savedParts 배열 초기화
    //isInitialPositionAdjusted = false; // 새로운 선반 생성 시 초기 위치 조정 플래그 리셋
    switch(style) { 
        case 'grid':
            createGridStyle();
            break;
        case 'slant':
            createSlantStyle();
            break;
        case 'pat':
            createPatternStyle();
            break;
        case 'pixel':
            createPixelStyle();
            break;
        case 'gradient':
            createGradientStyle();
            break;
        case 'mosaic':
            createMosaicStyle();
            break;
        default:
            console.error('Unknown style:', style);
            createGridStyle(); // Default to grid style if unknown style is encountered
            break;
    }

    // 패널들이 모두 추가된 후 savedParts 배열을 한 번만 출력
    //console.log(savedParts); 
    
    updateProductTitle();
    //텍스처 반복 설정 업데이트
    updateTextureRepeat(materials.verticalBase, shelfWidth, shelfHeight);
    updateTextureRepeat(materials.verticalEdge, thickness, shelfHeight);
    updateTextureRepeat(materials.horizontalBase, shelfWidth, thickness);
    updateTextureRepeat(materials.horizontalEdge, shelfWidth, thickness);
    updateTextureRepeat(materials.backPanel, shelfWidth, shelfHeight);

    // 기존 라벨 제거
    clearLabels();
    // 새로운 라벨 생성
    createLabels();  // 새로운 스타일에 맞춰 라벨 생성
    updateLabelsVisibility();  // 라벨 가시성 상태 업데이트
    
    createBackground(shelfWidth, shelfHeight, shelfDepth);
    //initInteractionHandler();
}

// 씬 제거
function clearScene() {
    parts.forEach(part => {
        scene.remove(part);
    });
    parts = [];
    clearLabels();
}

// 라벨 제거
function clearLabels() {
    labels.forEach(label => {
        scene.remove(label);
    });
    labels = [];
}


// 카메라조정을 위한 전역변수 추가.
let isInitialPositionSet = false;
let initialCenterX = 0;



// 0. 애니메이션 없는버전
// function adjustCameraPosition() {
//     const boundingBox = new THREE.Box3().setFromObject(scene);
//     const size = boundingBox.getSize(new THREE.Vector3());
//     const center = boundingBox.getCenter(new THREE.Vector3());

//     const maxDim = Math.max(size.x, size.y, size.z);
//     const fov = camera.fov * (Math.PI / 180);
//     let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 1.8));

//     cameraZ *= 1.4; // Increase the padding factor for a better view
//     const direction = new THREE.Vector3();
//     camera.getWorldDirection(direction);


//         center.x += -6; // 여기서 x축을 변경   
//         //center.y = 40;
        



//     camera.position.copy(center).addScaledVector(direction, -cameraZ);
//     camera.lookAt(center);

//     const minZ = boundingBox.min.z;
//     const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

//     camera.far = cameraToFarEdge * 100;
//     camera.updateProjectionMatrix();

//     controls.target.set(center.x, center.y, center.z);
//     //controls.update();
// }


// 4옛날버전에 애니메이션만 적용한것

function adjustCameraPosition() {
    const boundingBox = new THREE.Box3().setFromObject(scene);
    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x * 0.45, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 1.8));

    cameraZ *= 1.2; // Increase the padding factor for a better view
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    center.x += 0; // 여기서 x축을 변경   
    center.y += -10;

    const newCameraPosition = center.clone().addScaledVector(direction, -cameraZ);



    if (isInitialLoad) {
        // 초기 로딩 시 애니메이션 없이 즉시 위치 설정
        camera.position.copy(newCameraPosition);
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();
    } else {
        // 초기 로딩 이후 GSAP 애니메이션 적용
        gsap.to(camera.position, {
            duration: 0.3,
            x: newCameraPosition.x,
            y: newCameraPosition.y,
            z: newCameraPosition.z,
            onUpdate: () => {
                camera.lookAt(center);
            }
        });

        gsap.to(controls.target, {
            duration: 0.3,
            x: center.x,
            y: center.y,
            z: center.z,
            onUpdate: () => {
                controls.update();
            }
        });
    }


    const minZ = boundingBox.min.z;
    const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 100;
    camera.updateProjectionMatrix();
}


// 현재 작동안함.
function adjustCameraAfterWidthChange() {
    const newWidth = parseInt(document.getElementById('width').value);
    if (newWidth !== shelfWidth) {
        shelfWidth = newWidth;
        adjustCameraPosition();
    }
}

// 카메라 조정 끝

 
function updateTextureScale(value) {
    textureScale[selectedComponent] = parseFloat(value);
    const textureScaleElement = document.getElementById('texture-scale-value');
    if (textureScaleElement) {
        textureScaleElement.innerText = value;
    }
    createShelf(currentStyle);
}

function updateTextureRotation(value) {
    textureRotation[selectedComponent] = parseFloat(value);
    const textureRotationElement = document.getElementById('texture-rotation-value');
    if (textureRotationElement) {
        textureRotationElement.innerText = `${value}°`;
    }
    createShelf(currentStyle);
}

function showTextureOptions(component) {
    selectedComponent = component;
    const textureScaleElement = document.getElementById('texture-scale');
    const textureRotationElement = document.getElementById('texture-rotation');
    const textureScaleValueElement = document.getElementById('texture-scale-value');
    const textureRotationValueElement = document.getElementById('texture-rotation-value');
    if (textureScaleElement && textureRotationElement && textureScaleValueElement && textureRotationValueElement) {
        textureScaleElement.value = textureScale[selectedComponent];
        textureScaleValueElement.innerText = textureScale[selectedComponent];
        textureRotationElement.value = textureRotation[selectedComponent];
        textureRotationValueElement.innerText = `${textureRotation[selectedComponent]}°`;
    }
}

function toggleBackPanel(isOn) {
    hasBackPanel = isOn;
    createShelf(currentStyle);
    //debounceAdjustCamera();
}

// 스타일 변경
function changeVariant(variant) {
    currentStyle = variant;
    createShelf(currentStyle);

    document.querySelectorAll('.variant-button').forEach(button => {
        button.classList.remove('active');
    });
    const variantButton = document.querySelector(`.variant-button[data-variant="${variant}"]`);
    if (variantButton) {
        variantButton.classList.add('active');
    }
    //debounceAdjustCamera();
}

// 가격조절
function updatePrice() {
    // 가격 표시
    const originalPriceElement = document.getElementById('original-price');
    const discountRateElement = document.getElementById('discount-rate');
    const finalPriceElement = document.getElementById('final-price');

    const pricePerCubicMeter = 8; // 부피당 가격 (예시)
    let totalVolume = 0;

    // 모든 패널의 부피 계산
    parts.forEach(part => {
        const boundingBox = new THREE.Box3().setFromObject(part);
        const size = boundingBox.getSize(new THREE.Vector3());
        const volume = size.x * size.y * size.z;
        totalVolume += volume;
    });

    // 최종 가격 계산
    originalPrice = totalVolume * pricePerCubicMeter;

    if (isCustomColor) {
        originalPrice = originalPrice + (originalPrice * (addChargeRate / 100));
    }

    // 가격을 1000단위로 반올림
    originalPrice = Math.round(originalPrice / 1000) * 1000;

    if (isDiscountActive) {
        discountPrice = originalPrice - (originalPrice * (discountRate / 100));
        discountPrice = Math.round(discountPrice / 10) * 10;
        finalPrice = discountPrice;
        discountRateElement.style.display = 'block';
        finalPriceElement.style.display = 'block';
    } else {
        finalPrice = originalPrice;
        discountRateElement.style.display = 'none';
        originalPriceElement.style.display = 'none';
    }

    if (originalPriceElement) {
        originalPriceElement.innerText = `₩${originalPrice.toLocaleString()}`;
        discountRateElement.innerText = `${discountRate.toLocaleString()}%`;
        finalPriceElement.innerText = `₩${finalPrice.toLocaleString()}`;
    }

    return originalPrice;
}

// 상품명 업데이트
function updateProductTitle() {
    const styleNames = {
        'grid': '그리드',
        'slant': '슬랜트',
        'pixel': '픽셀',
        'gradient': '그라디언트',
        'mosaic':'모자이크'
    };

    const styleName = styleNames[currentStyle] || currentStyle;
    const title = `${styleName} 수납장`;

    const titleElement = document.getElementById('product-title');
    if (titleElement) {
        titleElement.innerText = title;
    }
}

function debounceAdjustCamera() {
    /*
    if (cameraTimeout) {
        clearTimeout(cameraTimeout);
    }
    cameraTimeout = setTimeout(() => {
        adjustCameraPosition();
    }, 1000);
    */
}

// OrbitControls 사용 시작 시 타이머 중지
function onControlStart() {
    /*
    if (returnToOriginalPositionTimer) {
        clearTimeout(returnToOriginalPositionTimer);
    }
    initialCameraPosition = camera.position.clone(); // 현재 카메라 위치 저장
    initialControlsTarget = controls.target.clone(); // 현재 컨트롤 타겟 저장
    */
}

// OrbitControls 사용 종료 시 타이머 시작
function onControlEnd() {
    /*
    returnToOriginalPositionTimer = setTimeout(() => {
        gsap.to(camera.position, {
            duration: 1,
            x: initialCameraPosition.x,
            y: initialCameraPosition.y,
            z: initialCameraPosition.z,
            onUpdate: function() {
                camera.lookAt(initialControlsTarget);
                controls.target.copy(initialControlsTarget); // 타겟 위치를 초기 타겟으로 설정
                controls.update(); // controls 업데이트
                renderer.render(scene, camera); // 매 프레임마다 렌더링
            }
        });
    }, 200); // 1초 후에 원래 위치로 되돌림
    */
}

// function generateQRCode() {
//     // 로컬 스토리지에서 저장된 .glb 파일 URL 가져오기
//     const glbUrl = localStorage.getItem('localGLBFile');

//     // QR 코드에 포함할 URL 생성
//     const qrCodeUrl = window.location.origin + '/qr.html?url=' + encodeURIComponent(glbUrl);

//     // QR 코드 생성 및 표시
//     const qrcodeContainer = document.getElementById('qrcode');
//     qrcodeContainer.innerHTML = ""; // 기존 QR 코드 제거
//     new QRCode(qrcodeContainer, {
//         text: qrCodeUrl,
//         width: 128,
//         height: 128
//     });

//     // 모달 표시
//     showQRModal();
// }

/*
function generateQRCode() {
    console.log('generateQRCode 함수 시작');

    // 로컬 스토리지에서 저장된 .glb 파일 URL 가져오기
    const glbUrl = localStorage.getItem('localGLBFile');
    console.log('로컬 스토리지에서 가져온 GLB URL:', glbUrl);

    // QR 코드에 포함할 URL 생성
    const qrCodeUrl = window.location.origin + '/qr.html?url=' + encodeURIComponent(glbUrl);
    console.log('생성된 QR 코드 URL:', qrCodeUrl);

    // QR 코드 생성 및 표시
    const qrcodeContainer = document.getElementById('qrcode');
    console.log('QR 코드 컨테이너 요소:', qrcodeContainer);

    if (!qrcodeContainer) {
        console.error('QR 코드 컨테이너를 찾을 수 없습니다.');
        return;
    }

    qrcodeContainer.innerHTML = ""; // 기존 QR 코드 제거
    console.log('기존 QR 코드 제거 완료');

    QRCode.toCanvas(qrcodeContainer, qrCodeUrl, function (error) {
        if (error) {
            console.error('QR 코드 생성 중 오류 발생:', error);
            return;
        }
        console.log('QR 코드 생성 성공');
        showQRModal(); // QR 코드 모달 표시
    });
}
*/