function createSlantStyle() {
    clearScene();
    const thickness = 2;
    
    // 입력받은 shelfWidth를 24만큼 줄임
    const adjustedShelfWidth = shelfWidth - 24;
    
    //rows = Math.floor((shelfHeight - thickness) / 32) + 1;
    //rows = Math.floor((shelfHeight - thickness * (rows+1))) / 32 + 1;
    // 행의 수 계산
    //rows = Math.floor((shelfHeight - thickness * (rows + 1)) / 32);
    rows = Math.floor((shelfHeight - thickness) / 34);
    columns = Math.floor((adjustedShelfWidth - thickness) / 40) + 1;
    //const shelfHeightUnit = (shelfHeight - thickness * (rows + 1)) / rows;
    const shelfHeightUnit = 32;
    // 행이 1이거나 shelfWidth가 78 미만인 경우 createGridStyle 함수 호출
    if (rows === 1 || shelfWidth < 78) {
        createGridStyle();
        return; // createSlantStyle 함수 종료
    }

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
        addBox(adjustedShelfWidth+24, thickness, shelfDepth, 0, y + thickness / 2, shelfDepth / 2, materials.horizontalBase, materials.horizontalEdge, lineMaterial);
    }

    // 세로 패널 생성
    let panelCount = columns + additionalPanels;
    let panelSpacing = (adjustedShelfWidth - thickness) / (panelCount - 1);

    if (panelSpacing < 26) {
        panelCount = Math.floor((adjustedShelfWidth - thickness) / 26) + 1;
        panelSpacing = (adjustedShelfWidth - thickness) / (panelCount - 1);
    } else if (panelSpacing > 54) {
        panelCount = Math.ceil((adjustedShelfWidth - thickness) / 54) + 1;
        panelSpacing = (adjustedShelfWidth - thickness) / (panelCount - 1);
    }

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < panelCount; i++) {
            const x = -adjustedShelfWidth / 2 + i * panelSpacing;
            let y = j * (shelfHeightUnit + thickness) + thickness / 2;
            if (j % 2 === 0) {
                addBox(thickness, shelfHeightUnit, shelfDepth, x - (adjustedShelfWidth / panelCount / 4) , y + shelfHeightUnit / 2 + thickness / 2, shelfDepth / 2, materials.verticalBase, materials.verticalEdge, lineMaterial, true);
            } else {
                addBox(thickness, shelfHeightUnit, shelfDepth, x + (adjustedShelfWidth / panelCount / 4)+2, y + shelfHeightUnit / 2 + thickness / 2, shelfDepth / 2, materials.verticalBase, materials.verticalEdge, lineMaterial, true);
            }
        }
    }

    if (hasBackPanel) {
        addBackPanelSlant(adjustedShelfWidth);
    } else {
        addSupPanelSlant(adjustedShelfWidth);
    }

    updatePrice();
    debounceAdjustCamera();
}

function addBackPanelSlant(adjustedShelfWidth) {
    const thickness = 2;
    const backPanelDepth = thickness;
    const shelfHeightUnit = 32;

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
    let panelSpacing = (adjustedShelfWidth - thickness) / (panelCount - 1);

    if (panelSpacing < 26) {
        panelCount = Math.floor((adjustedShelfWidth - thickness) / 26) + 1;
        panelSpacing = (adjustedShelfWidth - thickness) / (panelCount - 1);
    } else if (panelSpacing > 54) {
        panelCount = Math.ceil((adjustedShelfWidth - thickness) / 54) + 1;
        panelSpacing = (adjustedShelfWidth - thickness) / (panelCount - 1);
    }

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    for (let j = 0; j <= rows - 1; j++) {
        for (let i = 0; i < panelCount - 1; i++) {
            let x, y;
            const panelWidth = panelSpacing - thickness;

            if (j % 2 === 0) {
                // 홀수 행
                x = -adjustedShelfWidth / 2 + i * panelSpacing - (adjustedShelfWidth / panelCount / 4);
                y = j * (shelfHeightUnit + thickness) + shelfHeightUnit / 2 + thickness / 2;
            } else {
                // 짝수 행
                x = -adjustedShelfWidth / 2 + i * panelSpacing + (adjustedShelfWidth / panelCount / 4) + 2;
                y = j * (shelfHeightUnit + thickness) + shelfHeightUnit / 2 + thickness / 2;
            }

            addBox(
                panelWidth,
                shelfHeightUnit,
                backPanelDepth,
                x + (panelWidth+thickness) / 2,
                y + thickness/2,
                thickness/2,  
                materials.backPanel,
                materials.backPanel,
                lineMaterial,
                false  // isVertical (백패널은 수직이 아님)
            );
        }
    }
}

function addSupPanelSlant(adjustedShelfWidth) {
    const thickness = 2;
    const supPanelWidth = 12;
    const supPanelHeight = 32;
    const supPanelDepth = thickness;
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // 밀도에 따른 추가 패널 수 계산
    let additionalPanels = 0;
    if (density >= 75) additionalPanels = 3;
    else if (density >= 50) additionalPanels = 2;
    else if (density >= 25) additionalPanels = 1;

    let panelCount = columns + additionalPanels;
    let panelSpacing = (adjustedShelfWidth - thickness) / (panelCount - 1);

    if (panelSpacing < 26) {
        panelCount = Math.floor((adjustedShelfWidth - thickness) / 26) + 1;
        panelSpacing = (adjustedShelfWidth - thickness) / (panelCount - 1);
    } else if (panelSpacing > 54) {
        panelCount = Math.ceil((adjustedShelfWidth - thickness) / 54) + 1;
        panelSpacing = (adjustedShelfWidth - thickness) / (panelCount - 1);
    }

    const slantOffset = adjustedShelfWidth / panelCount / 4 + 1;

    for (let j = 0; j <= rows - 1; j++) {
        const y = j * (supPanelHeight + thickness) + supPanelHeight / 2 + thickness;
        const isOddRow = j % 2 === 0;
        
        if (adjustedShelfWidth < 80) {
            // 폭이 80 미만일 경우 왼쪽에만 패널 추가
            const x = -adjustedShelfWidth / 2 + supPanelWidth / 2 + (isOddRow ? -slantOffset : slantOffset);
            addBox(
                supPanelWidth, 
                supPanelHeight, 
                supPanelDepth, 
                x + thickness, 
                y, 
                thickness / 2, 
                materials.verticalEdge,
                materials.verticalBase,  
                lineMaterial,
                true
            );
        } else {
            // 폭이 80 이상일 경우 양쪽에 패널 추가
            const leftX = -adjustedShelfWidth / 2 + supPanelWidth / 2 + (isOddRow ? -slantOffset : slantOffset);
            const rightX = adjustedShelfWidth / 2 - supPanelWidth / 2 + (isOddRow ? -slantOffset : slantOffset);

            // 왼쪽 패널
            addBox(
                supPanelWidth, 
                supPanelHeight, 
                supPanelDepth, 
                leftX + thickness, 
                y, 
                thickness / 2, 
                materials.verticalEdge,
                materials.verticalBase,  
                lineMaterial,
                true
            );

            // 오른쪽 패널
            addBox(
                supPanelWidth, 
                supPanelHeight, 
                supPanelDepth, 
                rightX - 2, 
                y, 
                thickness / 2, 
                materials.verticalEdge,
                materials.verticalBase,  
                lineMaterial,
                true
            );
        }
    }
}