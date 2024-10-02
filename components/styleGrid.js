function createGridStyle() {
    clearScene();
    const thickness = 2;
    // 행의 수 계산
    //rows = Math.floor((shelfHeight - thickness * (rows + 1)) / 32);
    rows = Math.floor((shelfHeight - thickness) / 34);
    columns = Math.floor((shelfWidth - thickness) / 40) + 1;
    //const shelfHeightUnit = (shelfHeight - thickness * (rows + 1)) / rows;
    const shelfHeightUnit = 32;
    const shelfWidthUnit = (shelfWidth - thickness * (columns + 1)) / columns;

    // 밀도에 따른 추가 패널 수 계산
    let additionalPanels = 0;
    if (density >= 75) {
        additionalPanels = 3;
    } else if (density >= 50) {
        additionalPanels = 2;
    } else if (density >= 25) {
        additionalPanels = 1;
    }

    // Line material for edges 수정
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // 가로 패널 생성
    for (let i = 0; i <= rows; i++) {
        const y = i * (shelfHeightUnit + thickness);
        addBox(shelfWidth, thickness, shelfDepth, 0, y + thickness / 2, shelfDepth / 2, materials.horizontalBase, materials.horizontalEdge, lineMaterial);
    }

    // 세로 패널 생성
    let panelCount = columns + additionalPanels; // 패널 하나 추가
    let panelSpacing = (shelfWidth - thickness) / (panelCount - 1);

    if (panelSpacing < 26) {
        panelCount = Math.floor((shelfWidth - thickness) / 26) + 1;
        panelSpacing = (shelfWidth - thickness) / (panelCount - 1);
    } else if (panelSpacing > 50) {
        panelCount = Math.ceil((shelfWidth - thickness) / 50) + 1;
        panelSpacing = (shelfWidth - thickness) / (panelCount - 1);
    }

    for (let i = 0; i < panelCount; i++) {
        const x = -shelfWidth / 2 + i * panelSpacing;
        for (let j = 0; j < rows; j++) {
            let y = j * (shelfHeightUnit + thickness) + thickness / 2;
            if (i === panelCount - 1) {
                y += 0;
            }
            addBox(thickness, shelfHeightUnit, shelfDepth, x+1, y + shelfHeightUnit / 2 + thickness / 2, shelfDepth / 2, materials.verticalBase, materials.verticalEdge, lineMaterial, true);
        }
    }

    // 백패널 또는 지지 패널 추가
    if (hasBackPanel) {
        addBackPanelGrid();
    } else {
        addSupPanelGrid();
    }

    //createBackground();
    updatePrice();
    debounceAdjustCamera();
}

function addBackPanelGrid() {
    const thickness = 2;
    const backPanelDepth = thickness;
    //const shelfHeightUnit = (shelfHeight - thickness * (rows + 1)) / rows;
    const shelfHeightUnit = 32
    
    // 밀도에 따른 추가 패널 수 계산
    let additionalPanels = 0;
    if (density >= 75) {
        additionalPanels = 3;
    } else if (density >= 50) {
        additionalPanels = 2;
    } else if (density >= 25) {
        additionalPanels = 1;
    }
    let panelCount = columns + additionalPanels;
    let panelSpacing = (shelfWidth - thickness) / (panelCount - 1);

    if (panelSpacing < 26) {
        panelCount = Math.floor((shelfWidth - thickness) / 26) + 1;
        panelSpacing = (shelfWidth - thickness) / (panelCount - 1);
    } else if (panelSpacing > 50) {
        panelCount = Math.ceil((shelfWidth - thickness) / 50) + 1;
        panelSpacing = (shelfWidth - thickness) / (panelCount - 1);
    }

    // 백패널 생성
    for (let i = 0; i < panelCount - 1; i++) {
        const xPosition = -shelfWidth / 2 + i * panelSpacing;
        for (let j = 0; j <= rows - 1; j++) {
            const yPosition = j * (shelfHeightUnit + thickness) + shelfHeightUnit / 2 + thickness;

            // addBox 함수를 사용하여 백패널 추가
            addBox(
                panelSpacing - thickness,  // width
                shelfHeightUnit,           // height
                backPanelDepth,            // depth
                xPosition + panelSpacing / 2 + 1,  // x position
                yPosition,                 // y position
                1,                         // z position (약간 뒤로 배치)
                materials.backPanel,       // baseMaterial
                materials.backPanel,       // edgeMaterial (백패널은 모든 면이 동일한 재질)
                new THREE.LineBasicMaterial({ color: 0x000000 }),  // lineMaterial
                false                      // isVertical (백패널은 수직이 아님)
            );
        }
    }
}

function addSupPanelGrid() {
    const thickness = 2;
    const supPanelWidth = 12;
    const supPanelHeight = 32;
    const supPanelDepth = thickness;
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    const leftPanelX = -shelfWidth / 2 + supPanelWidth / 2;
    const rightPanelX = shelfWidth / 2 - supPanelWidth / 2;

    // 행마다 서포트 패널 추가
    for (let row = 0; row < rows; row++) {
        const yPosition = row * (supPanelHeight + thickness) + supPanelHeight / 2 + 2;

        // 높이가 44 미만일 경우 왼쪽에만 패널 추가
        if (shelfWidth < 44) {
            addBox(
                supPanelWidth, 
                supPanelHeight, 
                supPanelDepth, 
                leftPanelX + thickness, 
                yPosition, 
                thickness / 2, 
                materials.verticalEdge,
                materials.verticalBase,  
                lineMaterial,
                true
            );
        } else {
            // 높이가 44 이상일 경우 왼쪽과 오른쪽에 패널 추가
            addBox(
                supPanelWidth, 
                supPanelHeight, 
                supPanelDepth, 
                leftPanelX + thickness, 
                yPosition, 
                thickness / 2, 
                materials.verticalEdge,
                materials.verticalBase,  
                lineMaterial,
                true
            );

            addBox(
                supPanelWidth, 
                supPanelHeight, 
                supPanelDepth, 
                rightPanelX - thickness, 
                yPosition, 
                thickness / 2, 
                materials.verticalEdge,
                materials.verticalBase,   
                lineMaterial,
                true
            );
        }
    }
}