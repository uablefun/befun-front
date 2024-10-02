// 랜덤 병합을 위한 유틸리티 함수
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createPatternStyle() {
    clearScene();
    const thickness = 2;
    const shelfHeightUnit = 32;
    const shelfWidthUnit = 40;

    // rows 및 columns 계산
    const rows = Math.floor((shelfHeight - thickness) / (shelfHeightUnit + thickness));
    const columns = Math.floor((shelfWidth - thickness) / shelfWidthUnit) + 1;

    // 밀도에 따른 추가 패널 수 계산
    let additionalPanels = 0;
    if (density >= 75) {
        additionalPanels = 3;
    } else if (density >= 50) {
        additionalPanels = 2;
    } else if (density >= 25) {
        additionalPanels = 1;
    }

    // 병합 정보를 저장할 2D 배열 초기화
    let mergeInfo = Array(rows).fill().map(() => Array(columns).fill(0));

    // 랜덤 병합 수행
    for (let col = 0; col < columns; col++) {
        for (let row = 0; row < rows - 1; row++) {
            if (mergeInfo[row][col] === 0 && mergeInfo[row + 1][col] === 0) {
                // 병합 확률은 선반 크기에 따라 조정
                const mergeProbability = 0.2 + (shelfWidth / 1000); // 예: 선반이 클수록 병합 확률 증가
                if (Math.random() < mergeProbability) {
                    mergeInfo[row][col] = 1;
                    mergeInfo[row + 1][col] = 2; // 2는 아래쪽 병합을 의미
                }
            }
        }
    }

    // Line material for edges
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // 가로 패널 (선반) 생성
    for (let i = 0; i <= rows; i++) {
        const y = i * (shelfHeightUnit + thickness);
        // 병합된 셀 위치의 가로 패널은 생성하지 않음
        if (i < rows && mergeInfo[i][0] !== 2) {
            addBox(
                shelfWidth,
                thickness,
                shelfDepth,
                0,
                y + thickness / 2,
                shelfDepth / 2,
                materials.horizontalBase,
                materials.horizontalEdge,
                lineMaterial
            );
        }
    }

    // 세로 패널 생성
    let panelCount = columns + additionalPanels;
    let panelSpacing = (shelfWidth - thickness) / (panelCount - 1);

    if (panelSpacing < 26) {
        panelCount = Math.floor((shelfWidth - thickness) / 26) + 1;
        panelSpacing = (shelfWidth - thickness) / (panelCount - 1);
    } else if (panelSpacing > 54) {
        panelCount = Math.ceil((shelfWidth - thickness) / 54) + 1;
        panelSpacing = (shelfWidth - thickness) / (panelCount - 1);
    }

    for (let i = 0; i < panelCount; i++) {
        const x = -shelfWidth / 2 + i * panelSpacing;
        for (let j = 0; j < rows; j++) {
            if (mergeInfo[j][i] === 0 || mergeInfo[j][i] === 1) {
                const height = mergeInfo[j][i] === 1 ? shelfHeightUnit * 2 + thickness : shelfHeightUnit;
                const y = j * (shelfHeightUnit + thickness) + thickness / 2;
                addBox(
                    thickness,
                    height,
                    shelfDepth,
                    x,
                    y + height / 2,
                    shelfDepth / 2,
                    materials.verticalBase,
                    materials.verticalEdge,
                    lineMaterial,
                    true
                );
            }
        }
    }

    // 백패널 또는 서포트 패널 추가
    if (hasBackPanel) {
        addBackPanelPattern(mergeInfo, panelCount, panelSpacing, rows);
    } else {
        addSupPanelPattern(mergeInfo, panelCount, panelSpacing, rows);
    }

    updatePrice();
    debounceAdjustCamera();
}

function addBackPanelPattern(mergeInfo, panelCount, panelSpacing) {
    const thickness = 2;
    const backPanelDepth = thickness;
    const shelfHeightUnit = 32;

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    for (let i = 0; i < panelCount - 1; i++) {
        for (let j = 0; j < rows; j++) {
            if (mergeInfo[j][i] === 0 || mergeInfo[j][i] === 1) {
                const height = mergeInfo[j][i] === 1 ? shelfHeightUnit * 2 + thickness : shelfHeightUnit;
                const width = panelSpacing - thickness;
                const x = -shelfWidth / 2 + i * panelSpacing;
                const y = j * (shelfHeightUnit + thickness) + thickness / 2;

                addBox(
                    width,
                    height,
                    backPanelDepth,
                    x + width / 2 + thickness / 2,
                    y + height / 2,
                    backPanelDepth / 2,
                    materials.backPanel,
                    materials.backPanel,
                    lineMaterial,
                    false
                );
            }
        }
    }
}

function addSupPanelPattern(mergeInfo, panelCount, panelSpacing, rows) {
    const thickness = 2;
    const supPanelWidth = 12;
    const supPanelDepth = thickness;
    const shelfHeightUnit = 32;

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    for (let i = 0; i < panelCount; i += panelCount - 1) {
        for (let j = 0; j < rows; j++) {
            if (mergeInfo[j][i] === 0 || mergeInfo[j][i] === 1) {
                const height = mergeInfo[j][i] === 1 ? shelfHeightUnit * 2 + thickness : shelfHeightUnit;
                const x = i === 0 ? -shelfWidth / 2 + supPanelWidth / 2 : shelfWidth / 2 - supPanelWidth / 2;
                const y = j * (shelfHeightUnit + thickness) + thickness / 2;

                addBox(
                    supPanelWidth,
                    height,
                    supPanelDepth,
                    x,
                    y + height / 2,
                    supPanelDepth / 2,
                    materials.verticalEdge,
                    materials.verticalBase,
                    lineMaterial,
                    true
                );
            }
        }
    }
}