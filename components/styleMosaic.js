const densitySpacings = {
    0: [2.00, 1.00, 2.00, 1.50, 1.80, 2.20, 1.40, 2.00, 1.70, 1.90, 2.10, 1.60, 2.30],
    1: [1.98, 1.02, 1.98, 1.52, 1.79, 2.18, 1.42, 1.98, 1.69, 1.89, 2.09, 1.61, 2.28],
    2: [1.96, 1.04, 1.96, 1.54, 1.78, 2.16, 1.44, 1.96, 1.68, 1.88, 2.08, 1.62, 2.26],
    3: [1.94, 1.06, 1.94, 1.56, 1.77, 2.14, 1.46, 1.94, 1.67, 1.87, 2.06, 1.63, 2.24],
    4: [1.92, 1.08, 1.92, 1.58, 1.76, 2.12, 1.48, 1.92, 1.66, 1.86, 2.04, 1.64, 2.22],
    5: [1.90, 1.10, 1.95, 1.45, 1.85, 2.10, 1.45, 1.90, 1.75, 1.85, 2.05, 1.65, 2.25],
    6: [1.88, 1.12, 1.94, 1.47, 1.84, 2.08, 1.47, 1.89, 1.74, 1.84, 2.03, 1.66, 2.23],
    7: [1.86, 1.14, 1.93, 1.49, 1.83, 2.06, 1.49, 1.88, 1.73, 1.83, 2.02, 1.67, 2.21],
    8: [1.84, 1.16, 1.92, 1.51, 1.82, 2.04, 1.51, 1.87, 1.72, 1.82, 2.00, 1.68, 2.19],
    9: [1.82, 1.18, 1.91, 1.53, 1.81, 2.02, 1.53, 1.86, 1.71, 1.81, 1.99, 1.69, 2.17],
    10: [1.80, 1.20, 1.90, 1.40, 1.70, 2.00, 1.50, 1.80, 1.60, 1.90, 2.00, 1.70, 2.20],
    11: [1.78, 1.22, 1.89, 1.42, 1.69, 1.98, 1.52, 1.79, 1.59, 1.89, 1.98, 1.71, 2.18],
    12: [1.76, 1.24, 1.88, 1.44, 1.68, 1.96, 1.54, 1.78, 1.58, 1.88, 1.97, 1.72, 2.16],
    13: [1.74, 1.26, 1.87, 1.46, 1.67, 1.94, 1.56, 1.77, 1.57, 1.87, 1.95, 1.73, 2.14],
    14: [1.72, 1.28, 1.86, 1.48, 1.66, 1.92, 1.58, 1.76, 1.56, 1.86, 1.94, 1.74, 2.12],
    15: [1.70, 1.25, 1.85, 1.45, 1.75, 1.95, 1.55, 1.75, 1.65, 1.85, 2.00, 1.65, 2.15],
    16: [1.68, 1.30, 1.84, 1.46, 1.74, 1.94, 1.56, 1.74, 1.64, 1.84, 1.98, 1.66, 2.13],
    17: [1.66, 1.32, 1.83, 1.48, 1.73, 1.92, 1.58, 1.73, 1.63, 1.83, 1.97, 1.67, 2.11],
    18: [1.64, 1.34, 1.82, 1.50, 1.72, 1.91, 1.60, 1.72, 1.62, 1.82, 1.96, 1.68, 2.09],
    19: [1.62, 1.36, 1.81, 1.52, 1.71, 1.89, 1.62, 1.71, 1.61, 1.81, 1.94, 1.69, 2.07],
    20: [1.60, 1.30, 1.70, 1.50, 1.80, 1.90, 1.60, 1.70, 1.50, 1.80, 2.00, 1.60, 2.10],
    21: [1.58, 1.32, 1.69, 1.52, 1.78, 1.88, 1.62, 1.68, 1.49, 1.79, 1.99, 1.61, 2.08],
    22: [1.56, 1.34, 1.68, 1.54, 1.77, 1.86, 1.64, 1.67, 1.48, 1.78, 1.97, 1.62, 2.06],
    23: [1.54, 1.36, 1.67, 1.56, 1.76, 1.85, 1.66, 1.66, 1.47, 1.77, 1.96, 1.63, 2.04],
    24: [1.52, 1.38, 1.66, 1.58, 1.75, 1.83, 1.68, 1.65, 1.46, 1.76, 1.94, 1.64, 2.02],
    25: [1.50, 1.35, 1.65, 1.55, 1.80, 1.85, 1.65, 1.65, 1.55, 1.75, 1.95, 1.55, 2.05],
    26: [1.48, 1.36, 1.64, 1.56, 1.78, 1.83, 1.66, 1.63, 1.54, 1.74, 1.94, 1.56, 2.03],
    27: [1.46, 1.38, 1.63, 1.58, 1.77, 1.81, 1.68, 1.62, 1.53, 1.73, 1.92, 1.57, 2.01],
    28: [1.44, 1.40, 1.62, 1.60, 1.76, 1.80, 1.70, 1.61, 1.52, 1.72, 1.91, 1.58, 1.99],
    29: [1.42, 1.42, 1.61, 1.62, 1.74, 1.78, 1.72, 1.60, 1.51, 1.71, 1.89, 1.59, 1.97],
    30: [1.40, 1.40, 1.50, 1.60, 1.80, 1.70, 1.50, 1.60, 1.70, 1.80, 1.90, 1.60, 2.00],
    31: [1.38, 1.42, 1.49, 1.62, 1.78, 1.69, 1.52, 1.58, 1.69, 1.79, 1.89, 1.61, 1.98],
    32: [1.36, 1.44, 1.48, 1.64, 1.77, 1.67, 1.54, 1.57, 1.68, 1.78, 1.87, 1.62, 1.96],
    33: [1.34, 1.46, 1.47, 1.66, 1.76, 1.65, 1.56, 1.56, 1.67, 1.77, 1.86, 1.63, 1.94],
    34: [1.32, 1.48, 1.46, 1.68, 1.74, 1.63, 1.58, 1.55, 1.66, 1.76, 1.84, 1.64, 1.92],
    35: [1.30, 1.45, 1.40, 1.65, 1.70, 1.75, 1.55, 1.55, 1.65, 1.70, 1.85, 1.55, 1.90],
    36: [1.28, 1.46, 1.39, 1.66, 1.69, 1.73, 1.57, 1.53, 1.64, 1.69, 1.84, 1.56, 1.88],
    37: [1.26, 1.48, 1.38, 1.68, 1.68, 1.71, 1.59, 1.52, 1.63, 1.68, 1.82, 1.57, 1.86],
    38: [1.24, 1.50, 1.37, 1.70, 1.66, 1.69, 1.61, 1.51, 1.62, 1.67, 1.81, 1.58, 1.84],
    39: [1.22, 1.52, 1.36, 1.72, 1.65, 1.67, 1.63, 1.50, 1.61, 1.66, 1.79, 1.59, 1.82],
    40: [1.20, 1.50, 1.30, 1.70, 1.60, 1.80, 1.50, 1.70, 1.60, 1.70, 1.80, 1.50, 1.90],
    41: [1.18, 1.51, 1.29, 1.72, 1.58, 1.78, 1.51, 1.68, 1.59, 1.69, 1.79, 1.51, 1.88],
    42: [1.16, 1.53, 1.28, 1.74, 1.57, 1.76, 1.53, 1.67, 1.58, 1.68, 1.77, 1.52, 1.86],
    43: [1.14, 1.55, 1.27, 1.76, 1.55, 1.74, 1.55, 1.66, 1.57, 1.67, 1.76, 1.53, 1.84],
    44: [1.12, 1.57, 1.26, 1.78, 1.54, 1.72, 1.57, 1.65, 1.56, 1.66, 1.74, 1.54, 1.82],
    45: [1.10, 1.55, 1.25, 1.75, 1.55, 1.85, 1.50, 1.65, 1.55, 1.65, 1.75, 1.45, 1.85],
    46: [1.09, 1.56, 1.24, 1.76, 1.53, 1.83, 1.52, 1.63, 1.54, 1.64, 1.74, 1.46, 1.83],
    47: [1.08, 1.58, 1.23, 1.78, 1.51, 1.81, 1.54, 1.62, 1.53, 1.63, 1.72, 1.47, 1.81],
    48: [1.07, 1.60, 1.22, 1.80, 1.50, 1.79, 1.56, 1.61, 1.52, 1.62, 1.71, 1.48, 1.79],
    49: [1.06, 1.62, 1.21, 1.82, 1.48, 1.77, 1.58, 1.60, 1.51, 1.61, 1.69, 1.49, 1.77],
    50: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
    51: [1.05, 1.30, 1.10, 1.35, 1.15, 1.40, 1.10, 1.30, 1.20, 1.35, 1.15, 1.30, 1.40],
    52: [1.08, 1.32, 1.12, 1.38, 1.18, 1.42, 1.12, 1.32, 1.22, 1.38, 1.18, 1.32, 1.42],
    53: [1.11, 1.34, 1.14, 1.41, 1.21, 1.44, 1.14, 1.34, 1.24, 1.41, 1.21, 1.34, 1.44],
    54: [1.14, 1.36, 1.16, 1.44, 1.24, 1.46, 1.16, 1.36, 1.26, 1.44, 1.24, 1.36, 1.46],
    55: [1.15, 1.30, 1.20, 1.35, 1.15, 1.40, 1.10, 1.30, 1.20, 1.35, 1.15, 1.30, 1.40],
    56: [1.16, 1.35, 1.22, 1.36, 1.18, 1.42, 1.11, 1.32, 1.22, 1.38, 1.18, 1.32, 1.42],
    57: [1.17, 1.40, 1.24, 1.37, 1.21, 1.44, 1.12, 1.34, 1.24, 1.41, 1.21, 1.34, 1.44],
    58: [1.18, 1.45, 1.26, 1.38, 1.24, 1.46, 1.13, 1.36, 1.26, 1.44, 1.24, 1.36, 1.46],
    59: [1.19, 1.50, 1.28, 1.39, 1.27, 1.48, 1.14, 1.38, 1.28, 1.47, 1.27, 1.38, 1.48],
    60: [1.10, 1.40, 1.20, 1.50, 1.30, 1.60, 1.20, 1.50, 1.40, 1.60, 1.30, 1.50, 1.70],
    61: [1.09, 1.41, 1.18, 1.52, 1.28, 1.58, 1.19, 1.49, 1.39, 1.59, 1.29, 1.49, 1.69],
    62: [1.08, 1.42, 1.16, 1.54, 1.26, 1.56, 1.18, 1.48, 1.38, 1.58, 1.28, 1.48, 1.68],
    63: [1.07, 1.43, 1.14, 1.56, 1.24, 1.54, 1.17, 1.47, 1.37, 1.57, 1.27, 1.47, 1.67],
    64: [1.06, 1.44, 1.12, 1.58, 1.22, 1.52, 1.16, 1.46, 1.36, 1.56, 1.26, 1.46, 1.66],
    65: [1.05, 1.50, 1.25, 1.55, 1.30, 1.65, 1.20, 1.55, 1.40, 1.65, 1.25, 1.50, 1.75],
    66: [1.04, 1.51, 1.23, 1.57, 1.29, 1.63, 1.18, 1.54, 1.39, 1.64, 1.24, 1.49, 1.74],
    67: [1.03, 1.52, 1.21, 1.59, 1.27, 1.61, 1.17, 1.53, 1.38, 1.63, 1.23, 1.48, 1.73],
    68: [1.02, 1.53, 1.19, 1.61, 1.25, 1.59, 1.16, 1.52, 1.37, 1.62, 1.22, 1.47, 1.72],
    69: [1.01, 1.54, 1.17, 1.63, 1.23, 1.57, 1.15, 1.51, 1.36, 1.61, 1.21, 1.46, 1.71],
    70: [1.00, 1.60, 1.30, 1.70, 1.40, 1.70, 1.20, 1.60, 1.50, 1.70, 1.30, 1.60, 1.80],
    71: [1.03, 1.58, 1.28, 1.68, 1.38, 1.68, 1.18, 1.58, 1.48, 1.68, 1.28, 1.58, 1.78],
    72: [1.06, 1.56, 1.26, 1.66, 1.36, 1.66, 1.16, 1.56, 1.46, 1.66, 1.26, 1.56, 1.76],
    73: [1.09, 1.54, 1.24, 1.64, 1.34, 1.64, 1.14, 1.54, 1.44, 1.64, 1.24, 1.54, 1.74],
    74: [1.12, 1.52, 1.22, 1.62, 1.32, 1.62, 1.12, 1.52, 1.42, 1.62, 1.22, 1.52, 1.72],
    75: [1.15, 1.55, 1.35, 1.65, 1.40, 1.75, 1.25, 1.60, 1.50, 1.75, 1.30, 1.65, 1.80],
    76: [1.13, 1.54, 1.33, 1.67, 1.38, 1.73, 1.23, 1.58, 1.48, 1.73, 1.28, 1.63, 1.78],
    77: [1.11, 1.53, 1.31, 1.69, 1.36, 1.71, 1.21, 1.56, 1.46, 1.71, 1.26, 1.61, 1.76],
    78: [1.09, 1.52, 1.29, 1.71, 1.34, 1.69, 1.19, 1.54, 1.44, 1.69, 1.24, 1.59, 1.74],
    79: [1.07, 1.51, 1.27, 1.73, 1.32, 1.67, 1.17, 1.52, 1.42, 1.67, 1.22, 1.57, 1.72],
    80: [1.30, 1.20, 1.50, 1.30, 1.60, 1.50, 1.40, 1.60, 1.30, 1.70, 1.40, 1.50, 1.80],
    81: [1.28, 1.25, 1.48, 1.35, 1.59, 1.48, 1.38, 1.59, 1.28, 1.68, 1.38, 1.48, 1.78],
    82: [1.26, 1.30, 1.46, 1.40, 1.58, 1.46, 1.36, 1.58, 1.26, 1.66, 1.36, 1.46, 1.76],
    83: [1.24, 1.35, 1.44, 1.45, 1.57, 1.44, 1.34, 1.57, 1.24, 1.64, 1.34, 1.44, 1.74],
    84: [1.22, 1.40, 1.42, 1.50, 1.56, 1.42, 1.32, 1.56, 1.22, 1.62, 1.32, 1.42, 1.72],
    85: [1.15, 1.60, 1.35, 1.75, 1.40, 1.80, 1.25, 1.65, 1.50, 1.80, 1.30, 1.70, 1.85],
    86: [1.14, 1.63, 1.33, 1.76, 1.38, 1.78, 1.23, 1.66, 1.48, 1.78, 1.28, 1.68, 1.83],
    87: [1.13, 1.66, 1.31, 1.77, 1.36, 1.76, 1.21, 1.67, 1.46, 1.76, 1.26, 1.66, 1.81],
    88: [1.12, 1.69, 1.29, 1.78, 1.34, 1.74, 1.19, 1.68, 1.44, 1.74, 1.24, 1.64, 1.79],
    89: [1.11, 1.72, 1.27, 1.79, 1.32, 1.72, 1.17, 1.69, 1.42, 1.72, 1.22, 1.62, 1.77],
    90: [1.00, 1.70, 1.40, 1.80, 1.50, 1.80, 1.30, 1.70, 1.60, 1.80, 1.40, 1.70, 1.90],
    91: [1.01, 1.73, 1.38, 1.82, 1.48, 1.78, 1.28, 1.71, 1.58, 1.79, 1.38, 1.68, 1.88],
    92: [1.02, 1.76, 1.36, 1.84, 1.46, 1.76, 1.26, 1.72, 1.56, 1.78, 1.36, 1.66, 1.86],
    93: [1.03, 1.79, 1.34, 1.86, 1.44, 1.74, 1.24, 1.73, 1.54, 1.77, 1.34, 1.64, 1.84],
    94: [1.04, 1.82, 1.32, 1.88, 1.42, 1.72, 1.22, 1.74, 1.52, 1.76, 1.32, 1.62, 1.82],
    95: [1.10, 1.85, 1.35, 1.90, 1.50, 1.95, 1.40, 1.80, 1.60, 1.90, 1.40, 1.80, 2.00],
    96: [1.09, 1.87, 1.33, 1.92, 1.48, 1.93, 1.38, 1.78, 1.58, 1.88, 1.38, 1.78, 1.98],
    97: [1.08, 1.89, 1.31, 1.94, 1.46, 1.91, 1.36, 1.76, 1.56, 1.86, 1.36, 1.76, 1.96],
    98: [1.07, 1.91, 1.29, 1.96, 1.44, 1.89, 1.34, 1.74, 1.54, 1.84, 1.34, 1.74, 1.94],
    99: [1.06, 1.93, 1.27, 1.98, 1.42, 1.87, 1.32, 1.72, 1.52, 1.82, 1.32, 1.72, 1.92],
    100: [1.20, 2.00, 1.30, 1.90, 1.40, 1.80, 1.40, 1.90, 1.50, 2.00, 1.50, 1.90, 2.10]
};


function createMosaicStyle() {
    //console.log(shelfWidth, columns)
    clearScene();
    const thickness = 2;
    rows = Math.floor((shelfHeight - thickness) / 34);
    columns = Math.floor((shelfWidth - thickness) / 40) + 1;
    const minColumns = 1; // 최소 컬럼 수 설정
    const maxColumns = 20; // 최대 컬럼 수
    const minColumnWidth = 14; // 최소 컬럼 너비

    // 컬럼 수 제한
    columns = Math.max(minColumns, Math.min(columns, maxColumns));

    // 컬럼 수 계산 로직 수정
    // let calculatedColumns = Math.floor((shelfWidth - thickness) / minColumnWidth);
    // columns = Math.max(minColumns, Math.min(calculatedColumns, maxColumns));

    //const shelfHeightUnit = 32;

    // 행이 1이거나 shelfWidth가 60 미만인 경우 createGridStyle 함수 호출
    if (rows === 1 || shelfWidth < 56) {
        createGridStyle();
        return; // createMosaicStyle 함수 종료
    }

    // 고정된 패턴 정의
    const fixedPattern = [
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,1,1,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,0,1,1,1,1],
        [1,1,0,1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,0,1,1,1,0,1,1]
    ];

    // 밀도에 따른 간격 계산
    const closestDensity = Object.keys(densitySpacings).reduce((a, b) => {
        return Math.abs(b - density) < Math.abs(a - density) ? b : a;
    });
    const spacings = densitySpacings[closestDensity];


    // 간격에 따른 실제 너비 계산 (수정)
    const totalSpacing = spacings.slice(0, columns).reduce((a, b) => a + b, 0);
    const unitWidth = Math.max(minColumnWidth, (shelfWidth - thickness * (columns + 1)) / totalSpacing);
    const columnWidths = spacings.slice(0, columns).map(s => s * unitWidth);



    // 구조 생성 (고정된 패턴 사용)
    let structure = Array(rows).fill().map((_, i) => 
        Array(columns).fill().map((_, j) => 
            fixedPattern[i % fixedPattern.length][j % fixedPattern[0].length]
        )
    );

    // 구조 검증 및 수정 (간격을 고려하여 수정)
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (structure[i][j] === 0 && !canRemovePanel(structure, i, j, columnWidths)) {
                structure[i][j] = 1;
            }
        }
    }

    // 추가적인 구조 검증 (기존 코드와 동일)
    for (let j = 0; j < columns; j++) {
        let consecutiveGaps = 0;
        for (let i = 0; i < rows; i++) {
            if (structure[i][j] === 0) {
                consecutiveGaps++;
                if (consecutiveGaps >= 2) {
                    structure[i][j] = 1;
                    consecutiveGaps = 0;
                }
            } else {
                consecutiveGaps = 0;
            }
        }
    }

    // 가구 생성
    createMosaicFurniture(structure, shelfHeightUnit, columnWidths, thickness);

    // // 백패널 또는 지지 패널 추가
    // if (hasBackPanel) {
    //     addBackPanelMosaic(structure, columnWidths);
    // } else {
    //     addSupPanelMosaic(structure, columnWidths);
    // }

    updatePrice();
    //debounceAdjustCamera();
}

function canRemovePanel(structure, row, col, columnWidths) {
    // 위아래 3칸 연속 확인 (기존 로직과 동일)
    if (row > 0 && row < structure.length - 1) {
        if (structure[row-1][col] === 0 && structure[row+1][col] === 0) {
            return false;
        }
    }

    // 옆으로 연속된 트인 칸 방지 (간격을 고려하여 수정)
    const leftWidth = col > 0 ? columnWidths[col - 1] : 0;
    const rightWidth = col < structure[0].length - 1 ? columnWidths[col + 1] : 0;
    const currentWidth = columnWidths[col];

    if (col > 0 && structure[row][col-1] === 0 && leftWidth + currentWidth > 60) {
        return false;
    }
    if (col < structure[0].length - 1 && structure[row][col+1] === 0 && rightWidth + currentWidth > 60) {
        return false;
    }

    // 상하좌우 인접 셀 확인 (기존 로직과 동일)
    const adjacentCells = [
        [row-1, col], [row+1, col], [row, col-1], [row, col+1]
    ];

    for (let [adjRow, adjCol] of adjacentCells) {
        if (adjRow >= 0 && adjRow < structure.length && 
            adjCol >= 0 && adjCol < structure[0].length) {
            if (structure[adjRow][adjCol] === 0) {
                return false;
            }
        }
    }

    return true;
}

function createMosaicFurniture(structure, shelfHeightUnit, columnWidths, thickness) {
    let accumulatedWidth = -shelfWidth / 2;

    // Vertical panels 생성
    for (let j = 0; j <= columns; j++) {
        const x = accumulatedWidth;
        for (let i = 0; i < rows; i++) {
            let panelHeight = shelfHeightUnit;

            if ((j === 0 && i < rows - 1 && structure[i + 1][j] === 0) ||
                (j === columns && i < rows - 1 && structure[i + 1][j - 1] === 0)) {
                panelHeight = shelfHeightUnit * 2 + thickness;
                const y = i * (shelfHeightUnit + thickness) + shelfHeightUnit + thickness / 2;
                addBox(thickness, panelHeight, shelfDepth, 
                       x + thickness / 2, y + 2, shelfDepth / 2, 
                       materials.verticalBase, materials.verticalEdge, 
                       new THREE.LineBasicMaterial({ color: 0x000000 }), true);
                i++;
            } else {
                const y = i * (shelfHeightUnit + thickness) + thickness / 2;
                addBox(thickness, panelHeight, shelfDepth, 
                       x + thickness / 2, y + panelHeight / 2 + 1, shelfDepth / 2, 
                       materials.verticalBase, materials.verticalEdge, 
                       new THREE.LineBasicMaterial({ color: 0x000000 }), true);
            }
        }
        accumulatedWidth += (j < columns ? columnWidths[j] : 0) + thickness;
    }

    // Horizontal panels 생성
    accumulatedWidth = -shelfWidth / 2;
    for (let i = 0; i <= rows; i++) {
        const y = i * (shelfHeightUnit + thickness) + thickness / 2;

        if (i === 0 || i === rows) {
            addBox(shelfWidth, thickness, shelfDepth, 0, i === 0 ? 1 : shelfHeight - thickness/2, shelfDepth / 2, 
                   materials.horizontalBase, materials.horizontalEdge, 
                   new THREE.LineBasicMaterial({ color: 0x000000 }));
        } else {
            let j = 0;
            while (j < columns) {
                if (structure[i][j] === 1) {
                    let startX = accumulatedWidth + columnWidths[j] / 2 + thickness / 2;
                    let panelWidth = columnWidths[j];
                    let endJ = j;

                    while (endJ < columns - 1 && structure[i][endJ + 1] === 1) {
                        endJ++;
                        panelWidth += columnWidths[endJ] + thickness;
                    }

                    addBox(panelWidth + thickness*2, thickness, shelfDepth, 
                           startX + panelWidth / 2 - columnWidths[j] / 2 + 1, y, shelfDepth / 2, 
                           materials.horizontalBase, materials.horizontalEdge, 
                           new THREE.LineBasicMaterial({ color: 0x000000 }));

                    j = endJ + 1;
                    accumulatedWidth += panelWidth + thickness;
                } else {
                    accumulatedWidth += columnWidths[j] + thickness;
                    j++;
                }
            }
        }
        accumulatedWidth = -shelfWidth / 2;  // 각 행의 시작에서 너비 재설정
    }
}













// 모자이크 백패널

function addBackPanelMosaic() {
    const thickness = 2;
    const backPanelDepth = thickness;
    const shelfHeightUnit = 32;

    let accumulatedWidth = -shelfWidth / 2;

    for (let i = 0; i < rows; i++) {
        const y = i * (shelfHeightUnit + thickness) + shelfHeightUnit / 2 + thickness;

        for (let j = 0; j < columns; j++) {
            const currentWidth = columnWidths[j];
            const x = accumulatedWidth + currentWidth / 2 + thickness / 2;

            // 현재 셀이 1(패널이 있는 곳)인 경우에만 백패널 생성
            if (structure[i][j] === 1) {
                addBox(
                    currentWidth + thickness,  // width
                    shelfHeightUnit,           // height
                    backPanelDepth,            // depth
                    x,                         // x position
                    y,                         // y position
                    1,                         // z position (약간 뒤로 배치)
                    materials.backPanel,       // baseMaterial
                    materials.backPanel,       // edgeMaterial
                    new THREE.LineBasicMaterial({ color: 0x000000 }),  // lineMaterial
                    false                      // isVertical
                );
            }

            accumulatedWidth += currentWidth + thickness;
        }

        accumulatedWidth = -shelfWidth / 2;  // 각 행의 시작에서 너비 재설정
    }
}

function addSupPanelMosaic(structure, shelfHeightUnit, shelfWidthUnit, thickness) {
    // const supPanelWidth = 12;
    // const supPanelDepth = thickness;
    // for (let i = 0; i < rows; i++) {
    //     if (structure[i][0] === 1) {
    //         const x = -shelfWidth / 2 + supPanelWidth / 2;
    //         const y = i * (shelfHeightUnit + thickness) + shelfHeightUnit / 2 + thickness / 2;
    //         addBox(supPanelWidth, shelfHeightUnit, supPanelDepth, x, y, thickness / 2, materials.verticalEdge, materials.verticalBase, new THREE.LineBasicMaterial({ color: 0x000000 }), true);
    //     }
    //     if (shelfWidth >= 44 && structure[i][columns-1] === 1) {
    //         const x = shelfWidth / 2 - supPanelWidth / 2;
    //         const y = i * (shelfHeightUnit + thickness) + shelfHeightUnit / 2 + thickness / 2;
    //         addBox(supPanelWidth, shelfHeightUnit, supPanelDepth, x, y, thickness / 2, materials.verticalEdge, materials.verticalBase, new THREE.LineBasicMaterial({ color: 0x000000 }), true);
    //     }
    // }
    console.log("서포트패널생성");
}