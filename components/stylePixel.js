// gaps 계산 함수
function calculateGaps(shelfWidth, density) {
    const thickness = 2;
    
    let leftRatio, rightRatio;

    if (shelfWidth < 110) {
    leftRatio = 1 - ((density - 50) / 50) * 0.00;
    rightRatio = 1 + ((density - 50) / 50) * 0.00;
    } else if (shelfWidth < 319) {
    leftRatio = 1 - ((density - 50) / 50) * 0.08;
    rightRatio = 1 + ((density - 50) / 50) * 0.08;    
    } else {
    leftRatio = 1 - ((density - 50) / 50) * 0.12;
    rightRatio = 1 + ((density - 50) / 50) * 0.12;  
    }



    // const leftRatio = 1 - ((density - 50) / 50) * 0.15;
    // const rightRatio = 1 + ((density - 50) / 50) * 0.15;

    let gaps;

    if (shelfWidth < 110) {
        const availableSpace = shelfWidth - 4 * thickness;
        const centerGap1 = Math.min(54, availableSpace - 34);
        const sideGap1 = (availableSpace - centerGap1) / 2;
        gaps = [sideGap1 * leftRatio, centerGap1, sideGap1 * rightRatio];
    } else if (shelfWidth < 185) {
        const availableSpace = shelfWidth - 6 * thickness;
        const centerGap2 = Math.min(54, availableSpace - 68);
        const sideGap2 = (availableSpace - centerGap2) / 4;
        gaps = [sideGap2 * leftRatio, sideGap2 * leftRatio, centerGap2, sideGap2 * rightRatio, sideGap2 * rightRatio];
    } else if (shelfWidth < 241) {
        const availableSpace = shelfWidth - 8 * thickness;
        const centerGap3 = Math.min(54, availableSpace - 85) - 12;
        const sideGap3 = (availableSpace - centerGap3 * 2) / 5;
        gaps = [sideGap3 * leftRatio, sideGap3 * leftRatio, centerGap3 * leftRatio, sideGap3, centerGap3 * rightRatio, sideGap3 * rightRatio, sideGap3 * rightRatio];
    } else if (shelfWidth < 319) {
        const availableSpace = shelfWidth - 10 * thickness;
        const centerGap4 = Math.min(54, availableSpace - 102) - 15;
        const sideGap4 = (availableSpace - centerGap4 * 3) / 6;
        gaps = [sideGap4 * leftRatio, sideGap4 * leftRatio, centerGap4 * leftRatio, sideGap4 * leftRatio, centerGap4, sideGap4 * rightRatio, centerGap4 * rightRatio, sideGap4 * rightRatio, sideGap4 * rightRatio];
    } else if (shelfWidth < 396) {
        const availableSpace = shelfWidth - 12 * thickness;
        const centerGap5 = Math.min(54, availableSpace - 119) - 10;
        const sideGap5 = (availableSpace - centerGap5 * 4) / 7;
        gaps = [sideGap5 * leftRatio, sideGap5 * leftRatio, centerGap5 * leftRatio, sideGap5 * leftRatio, centerGap5 * leftRatio, sideGap5, centerGap5 * rightRatio, sideGap5 * rightRatio, centerGap5 * rightRatio, sideGap5 * rightRatio, sideGap5 * rightRatio];
    } else if (shelfWidth <= 450) {
        const availableSpace = shelfWidth - 14 * thickness;
        const centerGap6 = Math.min(54, availableSpace - 136) - 8;
        const sideGap6 = (availableSpace - centerGap6 * 5) / 8;
        gaps = [sideGap6 * leftRatio, sideGap6 * leftRatio, centerGap6 * leftRatio, sideGap6 * leftRatio, centerGap6 * leftRatio, sideGap6 * leftRatio, centerGap6, sideGap6 * rightRatio, centerGap6 * rightRatio, sideGap6 * rightRatio, centerGap6 * rightRatio, sideGap6 * rightRatio, sideGap6 * rightRatio];
    }

    return gaps;
}

// 가로세로패널생성 함수
function createPixelStyle() {
    clearScene();
    const thickness = 2; // 가로 및 세로 패널의 두께

    // 행의 수 계산
    //rows = Math.floor((shelfHeight - thickness * (rows + 1)) / 32);
    rows = Math.floor((shelfHeight - thickness) / 34);

    // 행이 1이거나 shelfWidth가 78 미만인 경우 createGridStyle 함수 호출
    if (rows === 1 || shelfWidth < 78) {
        createGridStyle();
        return; // createPixelStyle 함수 종료
    }

    clearScene();

    const gaps = calculateGaps(shelfWidth, density);


    // 각 유닛의 높이 계산
    //const shelfHeightUnit = (shelfHeight - thickness * (rows + 1)) / rows;
    const shelfHeightUnit = 32;

    // Line material for edges
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    const isEvenRows = rows % 2 === 0;

    for (let row = 0; row <= rows; row++) {
        const y = row * (shelfHeightUnit + thickness);

        // 가로 패널 추가
        if (row === 0 || row === rows) {
            if (row === rows && isEvenRows) {
                // 짝수 행일 때 최상단 가로 패널은 하나로 생성
                addBox(shelfWidth, thickness, shelfDepth, -thickness / 2, y + thickness / 2, shelfDepth / 2, materials.horizontalBase, materials.horizontalEdge, lineMaterial);
            } else {
                // 제일 아래와 홀수 행의 최상단 가로 패널은 교대로 생성
                let x = -shelfWidth / 2 + thickness / 2;
                for (let i = 0; i < gaps.length; i++) {
                    if (i % 2 === 1) {
                        const width = gaps[i] + thickness;
                        addBox(width + thickness, thickness, shelfDepth, x + width / 2 - thickness / 2, y + thickness / 2, shelfDepth / 2, materials.horizontalBase, materials.horizontalEdge, lineMaterial);
                    }
                    x += gaps[i] + thickness;
                }
            }
        } else {
            // 중간의 가로 패널은 하나로 생성
            addBox(shelfWidth, thickness, shelfDepth, -thickness / 2, y + thickness / 2, shelfDepth / 2, materials.horizontalBase, materials.horizontalEdge, lineMaterial);
        }

        if (row < rows) {  // 마지막 행 이전까지만 세로 패널 추가
            let x = -shelfWidth / 2 + thickness / 2;
            for (let i = 0; i <= gaps.length; i++) {
                if (row % 2 === 0) {  // 짝수 행
                    // 첫 번째와 마지막 세로 패널을 생성하지 않음
                    if (i === 0 || i === gaps.length) {
                        x += (i < gaps.length) ? gaps[i] + thickness : 0;
                        continue;
                    }
                }
                // 세로 칸막이
                addBox(thickness, shelfHeightUnit, shelfDepth, x - thickness / 2, y + shelfHeightUnit / 2 + thickness, shelfDepth / 2, materials.verticalBase, materials.verticalEdge, lineMaterial, true);
                if (i < gaps.length) {
                    x += gaps[i] + thickness;
                }
            }
        }
    }

    // 백패널 추가 (hasBackPanel이 true일 때만)
    if (hasBackPanel) {
        addBackPanelPixel();
    } else {
        addSupPanelPixel();
    }

    updatePrice();
    debounceAdjustCamera();
}



function addBackPanelPixel() {
    const thickness = 2;
    const backPanelDepth = thickness;
    //const shelfHeightUnit = (shelfHeight - thickness * (rows + 1)) / rows;
    const shelfHeightUnit = 32;

    const gaps = calculateGaps(shelfWidth, density);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    const isOddTotalRows = rows % 2 !== 0;

    for (let row = 0; row < rows; row++) {
        const y = row * (shelfHeightUnit + thickness);
        const isFirstRow = row === 0;
        const isLastRow = row === rows - 1;
        const isEvenRow = row % 2 === 0;

        if (isEvenRow) {  // 짝수 행
            let x = -shelfWidth / 2 + thickness / 2 + gaps[0] + thickness;  // 첫 번째 gap을 건너뜁니다.

            for (let i = 1; i < gaps.length-1; i++) {  // i를 1부터 시작합니다.
                const width = gaps[i];

                // 센터갭 확인
                let isCenterGap = false;
                if ((shelfWidth < 110 && i === 1) ||
                    (shelfWidth < 185 && i === 2) ||
                    (shelfWidth < 241 && (i === 2 || i === 4)) ||
                    (shelfWidth < 319 && (i === 2 || i === 4 || i === 6)) ||
                    (shelfWidth < 396 && (i === 2 || i === 4 || i === 6 || i === 8)) ||
                    (shelfWidth <= 450 && (i === 2 || i === 4 || i === 6 || i === 8 || i === 10))) {
                    isCenterGap = true;
                }

                //센터갭 부분의 백패널 생성 여부 결정 조건문.
                //센터갭 부분의 백패널 생성 여부 결정 조건문.
                let shouldCreatePanel = true;
                if (shelfWidth >= 110) {
                    if (isCenterGap && (isFirstRow || (isLastRow && !isOddTotalRows))) {
                        shouldCreatePanel = false;
                    } else if (isCenterGap && (isFirstRow || (isLastRow && isOddTotalRows))) {
                        shouldCreatePanel = false;
                    }
                }


                if (shouldCreatePanel) {
                    addBox(
                        width,
                        shelfHeightUnit,
                        backPanelDepth,
                        x + width / 2,
                        y + shelfHeightUnit / 2 + thickness,
                        backPanelDepth / 2,
                        materials.backPanel,
                        materials.backPanel,
                        lineMaterial,
                        false
                    );
                }
                x += width + thickness;
            }
        } else {  // 홀수 행 (변경 없음)
            let x = -shelfWidth / 2 + thickness / 2;
            for (let i = 0; i < gaps.length; i++) {
                const width = gaps[i] + thickness;
                addBox(
                    width - thickness,
                    shelfHeightUnit,
                    backPanelDepth,
                    x + width / 2 - thickness / 2,
                    y + shelfHeightUnit / 2 + thickness,
                    backPanelDepth / 2,
                    materials.backPanel,
                    materials.backPanel,
                    lineMaterial,
                    false
                );
                x += width;
            }
        }
    }
}






// function addSupPanelPixel() {
//     const thickness = 2;
//     const supPanelDepth = thickness;
//     const supPanelWidth = 12;
//     const shelfHeightUnit = 32;

//     const gaps = calculateGaps(shelfWidth, density);

//     const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

//     const isOddTotalRows = rows % 2 !== 0;

//     for (let row = 0; row < rows; row++) {
//         const y = row * (shelfHeightUnit + thickness);
//         const isFirstRow = row === 0;
//         const isLastRow = row === rows - 1;
//         const isEvenRow = row % 2 === 0;

//         if (isEvenRow) {  // 짝수 행
//             let x = -shelfWidth / 2 + thickness / 2 + gaps[0] + thickness;  // 첫 번째 gap을 건너뜁니다.

//             for (let i = 1; i < gaps.length - 1; i++) {  // i를 1부터 시작합니다.
//                 const width = gaps[i];

//                 // 첫 번째 패널은 무조건 생성, 그 이후로는 교대로 생성
//                 if (i === 1 || i % 2 === 1) {
//                     addBox(
//                         supPanelWidth,
//                         shelfHeightUnit,
//                         supPanelDepth,
//                         x + width / 2 - supPanelWidth / 2,
//                         y + shelfHeightUnit / 2 + thickness,
//                         supPanelDepth / 2,
//                         materials.verticalEdge,
//                         materials.verticalBase,
//                         lineMaterial,
//                         true
//                     );
//                 }
//                 x += width + thickness;
//             }
//         } else {  // 홀수 행
//             let x = -shelfWidth / 2 + thickness / 2;
//             for (let i = 0; i < gaps.length; i++) {
//                 const width = gaps[i] + thickness;
//                 // 첫 번째 패널은 무조건 생성, 그 이후로는 교대로 생성
//                 if (i === 0 || i % 2 === 0) {
//                     addBox(
//                         supPanelWidth,
//                         shelfHeightUnit,
//                         supPanelDepth,
//                         x + width / 2 - supPanelWidth / 2,
//                         y + shelfHeightUnit / 2 + thickness,
//                         supPanelDepth / 2,
//                         materials.verticalEdge,
//                         materials.verticalBase,
//                         lineMaterial,
//                         true
//                     );
//                 }
//                 x += width;
//             }
//         }
//     }
// }




function addSupPanelPixel() {
    const thickness = 2;
    const backPanelDepth = thickness;
    const shelfHeightUnit = 32;

    const gaps = calculateGaps(shelfWidth, density);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    const isOddTotalRows = rows % 2 !== 0;

    for (let row = 0; row < rows; row++) {
        const y = row * (shelfHeightUnit + thickness);
        const isFirstRow = row === 0;
        const isLastRow = row === rows - 1;
        const isEvenRow = row % 2 === 0;

        if (isEvenRow) {  // 짝수 행
            let x = -shelfWidth / 2 + thickness / 2 + gaps[0] + thickness;
            let panelCount = 0;

            for (let i = 1; i < gaps.length - 1; i++) {
                const width = gaps[i];
                panelCount++;

                if (panelCount % 2 !== 0) {  // 홀수 번째 패널일 때만 생성
                    addBox(
                        width,
                        shelfHeightUnit,
                        backPanelDepth,
                        x + width / 2,
                        y + shelfHeightUnit / 2 + thickness,
                        backPanelDepth / 2,
                        materials.backPanel,
                        materials.backPanel,
                        lineMaterial,
                        false
                    );
                }

                x += width + thickness;
            }
        } else {  // 홀수 행
            let x = -shelfWidth / 2 + thickness / 2;
            let panelCount = 0;

            for (let i = 0; i < gaps.length; i++) {
                const width = gaps[i] + thickness;
                panelCount++;

                if (panelCount % 2 !== 0) {  // 홀수 번째 패널일 때만 생성
                    addBox(
                        width - thickness,
                        shelfHeightUnit,
                        backPanelDepth,
                        x + width / 2 - thickness / 2,
                        y + shelfHeightUnit / 2 + thickness,
                        backPanelDepth / 2,
                        materials.backPanel,
                        materials.backPanel,
                        lineMaterial,
                        false
                    );
                }

                x += width;
            }
        }
    }
}