// 2번

// 전역 변수
let labelsVisible = false;
let labels = [];
let originalMaterials = [];

//let currentGridState = false;

//1.라벨 토글 함수
function toggleLabels() {
    clearLabels();
    if (labels.length === 0) {
        createLabels();
    }

    labelsVisible = !labelsVisible;
    labels.forEach(label => {
        label.visible = labelsVisible;
    });

    updateButtonStyle();
}

function updateLabelsVisibility() {
    if (labels.length > 0) {
        labels.forEach(label => {
            label.visible = labelsVisible;
        });
    }
}

// 버튼 스타일 업데이트 함수
function updateButtonStyle() {
    // const button = document.getElementById('view-labels');

    // if (labelsVisible) {
    //     button.classList.add('active');
    //     button.textContent = '치수숨기기';
    // } else {
    //     button.classList.remove('active');
    //     button.textContent = '치수보기';
    // }
}

// 라벨 생성 경우의 수 지정하는 함수 (createLabel힘수와 헷갈리지 마세요.)
function createLabels() {
    clearLabels();
    const unitHeight = 32;

    switch (currentStyle) {
        case 'grid':
            createGridLabels(unitHeight);
            break;
        case 'slant':
            createSlantLabels(unitHeight);
            break;
        case 'pixel':
            createPixelLabels(unitHeight);
            break;
        case 'gradient':
            createGradientLabels(unitHeight);
            break;
        default:
            console.error('Unknown style:', currentStyle);
            break;
    }
}

// 마감선90도
function createPerpendicularEnd(point, direction, length) {
    const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
    const endPoint = new THREE.Vector3().addVectors(point, perpendicular.multiplyScalar(length));
    return endPoint;
}

function createGuideline(start, end) {
    const material = new THREE.LineBasicMaterial({ color: 0x333333 });
    
    // 메인 라인 생성
    const mainGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const mainLine = new THREE.Line(mainGeometry, material);
    scene.add(mainLine);
    labels.push(mainLine);

    // 방향 벡터 계산
    const direction = new THREE.Vector3().subVectors(end, start).normalize();
    
    // 수직 방향 벡터 계산
    let perpendicular;
    if (Math.abs(direction.z) < 0.999) {
        // direction이 거의 z축과 평행하지 않을 때
        perpendicular = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
    } else {
        // direction이 거의 z축과 평행할 때
        perpendicular = new THREE.Vector3(0, 1, 0).normalize();
    }
    
    // 수직 라인의 길이 (총 길이의 절반)
    const perpendicularLength = 3;
    
    // 시작점과 끝점에 수직 라인 추가
    const startPerpStart = new THREE.Vector3().addVectors(start, perpendicular.clone().multiplyScalar(-perpendicularLength / 2));
    const startPerpEnd = new THREE.Vector3().addVectors(start, perpendicular.clone().multiplyScalar(perpendicularLength / 2));
    
    const endPerpStart = new THREE.Vector3().addVectors(end, perpendicular.clone().multiplyScalar(-perpendicularLength / 2));
    const endPerpEnd = new THREE.Vector3().addVectors(end, perpendicular.clone().multiplyScalar(perpendicularLength / 2));

    const startPerpGeometry = new THREE.BufferGeometry().setFromPoints([startPerpStart, startPerpEnd]);
    const endPerpGeometry = new THREE.BufferGeometry().setFromPoints([endPerpStart, endPerpEnd]);

    const startPerpLine = new THREE.Line(startPerpGeometry, material);
    const endPerpLine = new THREE.Line(endPerpGeometry, material);

    scene.add(startPerpLine);
    scene.add(endPerpLine);
    labels.push(startPerpLine);
    labels.push(endPerpLine);
}

function createGridLabels(unitHeight) {
    clearLabels();
    
    // 그리드 외경 치수
    createLabel(`${shelfWidth}`, new THREE.Vector3(0, shelfHeight + thickness * 3, shelfDepth + 1), 'width');
    //createLabel(`${shelfHeight}`, new THREE.Vector3(-shelfWidth / 2 - 30, shelfHeight / 2, shelfDepth + 1), 'height');
    createLabel(`${shelfHeight}`, new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight / 2, shelfDepth + 1), 'height');

    createLabel(`${shelfDepth}`, new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight + thickness * 3, shelfDepth / 2), 'depth');

    // 외경 치수 가이드라인 추가
    // createGuideline(
    //     new THREE.Vector3(-shelfWidth/2, shelfHeight + thickness * 3, shelfDepth + 1),
    //     new THREE.Vector3(shelfWidth/2, shelfHeight + thickness * 3, shelfDepth + 1)
    // );
    // createGuideline(
    //     new THREE.Vector3(shelfWidth / 2 + 10, 0, shelfDepth + 1),
    //     new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight, shelfDepth + 1)
    // );

    // 가로 가이드 라인 생성
    createGuideline(
        new THREE.Vector3(-shelfWidth / 2, shelfHeight + thickness * 3, shelfDepth + 1),
        new THREE.Vector3(shelfWidth / 2, shelfHeight + thickness * 3, shelfDepth + 1)
    );
    
    // 세로 가이드 라인 생성
    createGuideline(
        new THREE.Vector3(shelfWidth / 2 + 10, 0, shelfDepth + 1),
        new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight, shelfDepth + 1)
    );
    
    // 깊이 가이드 라인 생성
    createGuideline(
        new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight + thickness * 3, shelfDepth),
        new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight + thickness * 3, 0)
    );

    // 밀도에 따른 패널추가
    let additionalPanels = 0;
    if (density >= 75) additionalPanels = 3;
    else if (density >= 50) additionalPanels = 2;
    else if (density >= 25) additionalPanels = 1;

    let panelCount = columns + additionalPanels;
    let panelSpacing = (shelfWidth - thickness) / (panelCount - 1);

    if (panelSpacing < 26) {
        panelCount = Math.floor((shelfWidth - thickness) / 26) + 1;
        panelSpacing = (shelfWidth - thickness) / (panelCount - 1);
    } else if (panelSpacing > 50) {
        panelCount = Math.ceil((shelfWidth - thickness) / 50) + 1;
        panelSpacing = (shelfWidth - thickness) / (panelCount - 1);
    }

    for (let j = 0; j < panelCount - 1; j++) {
        const leftX = -shelfWidth / 2 + j * panelSpacing + thickness / 2;
        const rightX = leftX + panelSpacing;
        const labelX = (leftX + rightX) / 2;

        let unitWidth = panelSpacing - thickness;
        
        // 각 기로 패널에 라벨 추가
        for (let i = 1; i <= rows; i++) {
            const labelY = i * (34) + thickness - (32 + i / 4);
            createLabel(`${unitWidth.toFixed(0)}`, new THREE.Vector3(labelX - thickness, labelY + thickness, shelfDepth + 1), `width-${i}-${j}`);
        }
    }
    
    // 각 세로 패널에 라벨 추가
    for (let i = 0; i < rows; i++) {
        const heightLabelX = -shelfWidth / 2 + 0.5 * panelSpacing;
        const labelY = (i + 0.5) * (unitHeight + thickness);
        createLabel(`${unitHeight.toFixed(0)}`, new THREE.Vector3(heightLabelX - 20, labelY, shelfDepth + 1), `height-${i}-0`);
    }
}

// 신규 slant
function createSlantLabels(unitHeight) {
    clearLabels();
    
    //조건부 처리: rows가 1이거나 shelfWidth가 78 미만인 경우
    if (rows === 1 || shelfWidth < 78) {
        createGridLabels(unitHeight);
        return;
    }
    
    // 외경 치수 (변경하지 않음)
    createLabel(`${shelfWidth}`, new THREE.Vector3(-thickness, shelfHeight + thickness * 3, shelfDepth + 1), 'width');

    createLabel(`${shelfHeight}`, new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight / 2, shelfDepth + 1), 'height');

    createLabel(`${shelfDepth}`, new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight + thickness * 3, shelfDepth / 2), 'depth');

    // 가로 가이드 라인 생성
    createGuideline(
        new THREE.Vector3(-shelfWidth/2, shelfHeight + thickness * 3, shelfDepth + 1),
        new THREE.Vector3(shelfWidth/2, shelfHeight + thickness * 3, shelfDepth + 1)
    );

    // 세로 가이드 라인 생성
    createGuideline(
        new THREE.Vector3(shelfWidth / 2 + 10, 0, shelfDepth + 1),
        new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight, shelfDepth + 1)
    );
    
    // 깊이 가이드 라인 생성
    createGuideline(
        new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight + thickness * 3, shelfDepth),
        new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight + thickness * 3, 0)
    );

    const adjustedShelfWidth = shelfWidth - 24;
    
    // slant 스타일 내경 치수
    let additionalPanels = 0;
    if (density >= 75) additionalPanels = 3;
    else if (density >= 50) additionalPanels = 2;
    else if (density >= 25) additionalPanels = 1;

    let panelCount = columns + additionalPanels;
    let panelSpacing = (adjustedShelfWidth - thickness) / (panelCount - 1);

    if (panelSpacing < 26) {
        panelCount = Math.floor((adjustedShelfWidth - thickness) / 26) + 1;
        panelSpacing = (adjustedShelfWidth - thickness) / (panelCount - 1);
    } else if (panelSpacing > 50) {
        panelCount = Math.ceil((adjustedShelfWidth - thickness) / 50) + 1;
        panelSpacing = (adjustedShelfWidth - thickness) / (panelCount - 1);
    }

    for (let j = 0; j < panelCount - 1; j++) {
        const leftX = -adjustedShelfWidth / 2 + j * panelSpacing + thickness / 2;
        const rightX = leftX + panelSpacing;
        let labelX = (leftX + rightX) / 2;
    
        let unitWidth;
        if (j === 0 || j === panelCount - 2) {
            unitWidth = panelSpacing - thickness / 2;
        } else {
            unitWidth = panelSpacing - thickness;
        }
    
        for (let i = 1; i <= rows; i++) {
            const labelY = i * (34) + thickness - (28 + i / 4);
            
            if (i % 2 === 1) {
                // 홀수 행
                createLabel(`${unitWidth.toFixed(0)}`, new THREE.Vector3(labelX - thickness - unitWidth/4 + 2, labelY -2, shelfDepth + 1), `width-${i}-${j}`);
            } else {
                // 짝수 행
                createLabel(`${unitWidth.toFixed(0)}`, new THREE.Vector3(labelX - thickness + unitWidth/4 + 2, labelY -2, shelfDepth + 1), `width-${i}-${j}`);
            }
        }
    }
    
    for (let i = 0; i <= rows - 1; i++) {
        const heightLabelX = -adjustedShelfWidth / 2 + 0.5 * panelSpacing;
        const labelY = (i + 0.5) * (unitHeight + thickness);
        createLabel(`${unitHeight.toFixed(0)}`, new THREE.Vector3(heightLabelX - 16, labelY, shelfDepth + 1), `height-${i}-0`);
    }
}

// 78만빼고 잘됨.
function createPixelLabels(unitHeight) {
    
    clearLabels();
    // 행이 1이거나 shelfWidth가 79 미만인 경우 createGridLabels 함수 호출
    if (rows === 1 || shelfWidth < 78) {
        createGridLabels(unitHeight);
        return;
    }
    
    // Pixel 스타일의 내경 치수 계산 및 라벨 생성
    const thickness = 2; // 패널 두께
    // 픽셀 외경 치수
    createLabel(`${shelfWidth}`, new THREE.Vector3(-thickness, shelfHeight + thickness * 3, shelfDepth + 1), 'width');

    createLabel(`${shelfHeight}`, new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight / 2, shelfDepth + 1), 'height');

    createLabel(`${shelfDepth}`, new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight + thickness * 3, shelfDepth / 2), 'depth');

    // 가로 가이드 라인 생성
    createGuideline(
        new THREE.Vector3(-shelfWidth/2, shelfHeight + thickness * 3, shelfDepth + 1),
        new THREE.Vector3(shelfWidth/2, shelfHeight + thickness * 3, shelfDepth + 1)
    );

    // 세로 가이드 라인 생성
    createGuideline(
        new THREE.Vector3(shelfWidth / 2 + 10, 0, shelfDepth + 1),
        new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight, shelfDepth + 1)
    );
    
    // 깊이 가이드 라인 생성
    createGuideline(
        new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight + thickness * 3, shelfDepth),
        new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight + thickness * 3, 0)
    );
    
    const gaps = calculateGaps(shelfWidth, density); // gaps 계산
    let y = 0;

    for (let row = 0; row < rows; row++) {
        y += thickness; // 두께 추가
        const shelfHeightUnit = (shelfHeight - thickness * (rows + 1)) / rows;
        let x = -shelfWidth / 2 + thickness / 2; // 초기 x 위치

        for (let i = 0; i < gaps.length; i++) {
            const unitWidth = gaps[i];

            // 세로 패널 사이의 내경 폭 치수 라벨 생성 (열사이 중간에서 -12 위치)
            const labelY = y + shelfHeightUnit / 2;
            createLabel(`${unitWidth.toFixed(0)}`, new THREE.Vector3(x + unitWidth / 2 - thickness / 2, labelY- 12, shelfDepth + 1), `width-${row}-${i}`);

            // 가로 패널 사이의 내경 치수(내경높이) 라벨 생성 (행사이 중간 위치, 행마다 한 번만 생성)
            if (i === 0) {
                const labelX = x + unitWidth / 2;
                createLabel(`${unitHeight.toFixed(0)}`, new THREE.Vector3(labelX - 18, y + shelfHeightUnit / 2, shelfDepth + 1), `height-${row}-${i}`);
            }

            x += unitWidth + thickness; // 다음 x 위치 계산
        }

        y += shelfHeightUnit; // 다음 y 위치 계산
    }
}







function createGradientLabels(unitHeight) {
    clearLabels();

    if (shelfWidth < 60) {
        createGridLabels(unitHeight);
        return; 
    }
    
    // 그리드 외경 치수
    createLabel(`${shelfWidth}`, new THREE.Vector3(0, shelfHeight + thickness * 3, shelfDepth + 1), 'width');
    createLabel(`${shelfHeight}`, new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight / 2, shelfDepth + 1), 'height');
    createLabel(`${shelfDepth}`, new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight + thickness * 3, shelfDepth / 2), 'depth');

    // 가로 가이드 라인 생성
    createGuideline(
        new THREE.Vector3(-shelfWidth / 2, shelfHeight + thickness * 3, shelfDepth + 1),
        new THREE.Vector3(shelfWidth / 2, shelfHeight + thickness * 3, shelfDepth + 1)
    );
    
    // 세로 가이드 라인 생성
    createGuideline(
        new THREE.Vector3(shelfWidth / 2 + 10, 0, shelfDepth + 1),
        new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight, shelfDepth + 1)
    );
    
    // 깊이 가이드 라인 생성
    createGuideline(
        new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight + thickness * 3, shelfDepth),
        new THREE.Vector3(shelfWidth / 2 + 10, shelfHeight + thickness * 3, 0)
    );

    const rows = Math.floor((shelfHeight - thickness) / 34);
    const shelfHeightUnit = 32;

    // 내부 폭 계산
    let x = -shelfWidth / 2 + thickness / 2;
    for (let i = 0; i < internalWidths.length; i++) {
        const unitWidth = internalWidths[i];
        const labelX = x + unitWidth / 2;

        // 각 세로 패널에 폭 라벨 추가
        for (let j = 0; j < rows; j++) {
            const labelY = j * (shelfHeightUnit + thickness) + shelfHeightUnit / 2 + thickness;
            createLabel(`${unitWidth.toFixed(0)}`, new THREE.Vector3(labelX, labelY - 12, shelfDepth + 1), `width-${i}-${j}`);
        }

        x += unitWidth + thickness;
    }

    // 각 가로 패널에 높이 라벨 추가
    for (let i = 0; i < rows; i++) {
        const labelY = (i + 0.5) * (shelfHeightUnit + thickness);
        createLabel(`${shelfHeightUnit}`, new THREE.Vector3(-shelfWidth / 2 - 7, labelY, shelfDepth + 1), `height-${i}`);
    }
}






// 라벨 생성 함수 (createLabels힘수와 헷갈리지 마세요.)
function createLabel(text, position, id) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 160;
    canvas.height = 80;

    // Background
    context.fillStyle = 'rgba(51, 51, 51, 0.8)';
    roundRect(context, 0, 0, canvas.width, canvas.height, 40);
    context.fill();

    // Text
    context.font = 'bold 60px "맑은 고딕", Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);

    sprite.scale.set(10, 5, 1);
    sprite.position.copy(position);
    sprite.renderOrder = 1;
    sprite.visible = labelsVisible;
    sprite.userData.id = id;

    // Rotate the sprite if it's a depth label
    if (id === "depth") {
        sprite.material.rotation = 0;
    }

    scene.add(sprite);
    labels.push(sprite);
}


// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// 라벨 업데이트 함수 (필요시 사용)
function updateLabels() {
    labels.forEach(label => {
        scene.remove(label);
    });
    labels = [];
    clearLabels();
    createLabels();
}