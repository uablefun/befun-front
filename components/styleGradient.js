let prevShelfWidth = 0;
let prevShelfHeight = 0;
let prevDensity = 0;
let internalWidths = [];

// 3. 
function calculateInternalWidths(columnCount, totalWidth, density) {
    const thickness = 2;
    const minWidth = 25;
    const maxWidth = 66;
    let widths = new Array(columnCount).fill(0);
    
    const availableWidth = totalWidth - columnCount * thickness;
    const baseWidth = availableWidth / columnCount;
    
    const centerIndex = Math.floor(columnCount / 2);
    const isOdd = columnCount % 2 === 1;
    
    if (density === 50) {
        // 50% density 처리
        const ratio = 1.12;
        for (let i = 0; i < columnCount; i++) {
            const distanceFromCenter = Math.abs(i - centerIndex);
            if (isOdd && i === centerIndex) {
                widths[i] = baseWidth;
            } else {
                widths[i] = baseWidth * Math.pow(ratio, distanceFromCenter);
            }
        }
    } else {
        // 0%와 100% density 처리 (및 그 사이의 값들)
        const densityFactor = density / 100;
        for (let i = 0; i < columnCount; i++) {
            const positionFactor = (i / (columnCount - 1)) * 2 - 1;
            const widthAdjustment = baseWidth * 0.5 * (densityFactor - 0.5) * positionFactor;
            widths[i] = baseWidth + widthAdjustment;
        }
    }
    
    // 최소 및 최대 폭 제한 적용
    widths = widths.map(w => Math.max(minWidth, Math.min(maxWidth, w)));
    
    // 전체 폭에 맞추기 위한 미세 조정
    let totalCalculatedWidth = widths.reduce((a, b) => a + b, 0);
    let diff = availableWidth - totalCalculatedWidth;
    let adjustmentPerColumn = diff / columnCount;
    widths = widths.map(w => Math.max(minWidth, Math.min(maxWidth, w + adjustmentPerColumn)));
    
    return widths;
}



function createGradientStyle() {
    clearScene();
    const thickness = 2;
    
    // 행과 열의 수 계산
    const rows = Math.floor((shelfHeight - thickness) / 34);
    const shelfHeightUnit = 32;
    
    // 컬럼 수 계산
    let columnCount = Math.floor((shelfWidth - thickness) / 40) + 1;


    if (shelfWidth < 60) {
        createGridStyle();
        return; 
    }
    
    // 내경 배열 계산 및 밀도에 따른 조정
    if (shelfWidth !== prevShelfWidth || shelfHeight !== prevShelfHeight || density !== prevDensity) {
        internalWidths = calculateInternalWidths(columnCount, shelfWidth - 2 * thickness, density);
        prevShelfWidth = shelfWidth;
        prevShelfHeight = shelfHeight;
        prevDensity = density;
    }
    
    // Line material for edges
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    
    // 수평 패널 추가
    for (let i = 0; i <= rows; i++) {
        const y = i * (shelfHeightUnit + thickness);
        addBox(shelfWidth, thickness, shelfDepth, 0, y + thickness / 2, shelfDepth / 2, materials.horizontalBase, materials.horizontalEdge, lineMaterial);
    }
    
    // 수직 패널 추가
    let x = -shelfWidth / 2 + thickness / 2;
    for (let i = 0; i < internalWidths.length; i++) {
        for (let j = 0; j < rows; j++) {
            const y = j * (shelfHeightUnit + thickness) + shelfHeightUnit / 2 + thickness;
            addBox(thickness, shelfHeightUnit, shelfDepth, x, y, shelfDepth / 2, materials.verticalBase, materials.verticalEdge, lineMaterial, true);
        }
        x += internalWidths[i] + thickness;
    }
    
    // 우측 끝 수직 패널 추가
    for (let j = 0; j < rows; j++) {
        const y = j * (shelfHeightUnit + thickness) + shelfHeightUnit / 2 + thickness;
        addBox(thickness, shelfHeightUnit, shelfDepth, shelfWidth / 2 - thickness / 2, y, shelfDepth / 2, materials.verticalBase, materials.verticalEdge, lineMaterial, true);
    }
    

    if (hasBackPanel) {
        addBackPanelGradient();
    } else {
        addSupPanelGradient();
    }

    updatePrice();
    //debounceAdjustCamera();
}



function addBackPanelGradient() {
    const thickness = 2;
    const backPanelDepth = thickness;
    const shelfHeightUnit = 32;
    const rows = Math.floor((shelfHeight - thickness) / 34);

    // 수직 패널 추가 로직과 동일하게 x 위치 계산
    let x = -shelfWidth / 2 + thickness / 2;
    let totalUsedWidth = 0;

    for (let i = 0; i < internalWidths.length; i++) {
        let panelWidth = internalWidths[i];
        
        // 마지막 패널인 경우 너비 조정
        if (i === internalWidths.length - 1) {
            panelWidth = shelfWidth - totalUsedWidth - thickness * 2; // 마지막 세로 패널의 두께를 고려
        }
        
        totalUsedWidth += panelWidth + thickness;

        for (let j = 0; j < rows; j++) {
            const y = j * (shelfHeightUnit + thickness) + shelfHeightUnit / 2 + thickness;

            // 백패널 추가 (수직 패널 바로 뒤에 위치)
            addBox(
                panelWidth,               // width
                shelfHeightUnit,          // height
                backPanelDepth,           // depth
                x + panelWidth / 2 + thickness / 2,  // x position (수직 패널 바로 뒤)
                y,                        // y position
                1,  // z position (선반 뒤쪽에 위치)
                materials.backPanel,      // baseMaterial
                materials.backPanel,      // edgeMaterial
                new THREE.LineBasicMaterial({ color: 0x000000 }),  // lineMaterial
                false                     // isVertical
            );
        }

        // 다음 패널의 x 위치 계산 (수직 패널 추가 로직과 동일)
        x += panelWidth + thickness;
    }
}

























function addSupPanelGradient() {
    const thickness = 2;
    const supPanelWidth = 12;
    const supPanelHeight = 32;
    const supPanelDepth = thickness;
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    const rows = Math.floor((shelfHeight - thickness) / 34);
    const leftPanelX = -shelfWidth / 2 + supPanelWidth / 2 + 2;
    const rightPanelX = shelfWidth / 2 - supPanelWidth / 2 - 2;

    // 행마다 서포트 패널 추가
    for (let row = 0; row < rows; row++) {
        const yPosition = row * (supPanelHeight + thickness) + supPanelHeight / 2 + thickness;

        // 왼쪽 서포트 패널 추가
        addBox(
            supPanelWidth, 
            supPanelHeight, 
            supPanelDepth, 
            leftPanelX, 
            yPosition, 
            1, 
            materials.verticalEdge,
            materials.verticalBase,  
            lineMaterial,
            true
        );

        // 선반 너비가 44 이상일 경우 오른쪽에도 서포트 패널 추가
        if (shelfWidth >= 44) {
            addBox(
                supPanelWidth, 
                supPanelHeight, 
                supPanelDepth, 
                rightPanelX, 
                yPosition, 
                1, 
                materials.verticalEdge,
                materials.verticalBase,   
                lineMaterial,
                true
            );
        }
    }
}