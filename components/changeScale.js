function updateSliderValuePosition(elementSlider, elementValue) {
    const sliderWidth = elementSlider.offsetWidth;
    const sliderMax = elementSlider.max;
    const sliderMin = elementSlider.min;
    const sliderValue = elementSlider.value;

    // 슬라이더 값을 백분율로 변환하여 위치 계산
    const valuePercentage = (sliderValue - sliderMin) / (sliderMax - sliderMin);
    thumbWidth = 80; // 대략적인 thumb의 너비 (직접 측정한 값으로 대체 가능)
    const valuePosition = valuePercentage * (sliderWidth - thumbWidth);

    // 밀도 값 위치 설정
    elementValue.style.left = `calc(${valuePosition}px + ${thumbWidth / 2}px)`;
}

// 밀도 슬라이더 값 동적으로 표시
document.addEventListener('DOMContentLoaded', () => {
    const densitySlider = document.getElementById('density');
    const densityValue = document.getElementById('density-value');

    // //density 값을 초기값 50으로 설정
    // const initialDensity = 50;
    densitySlider.value = density;
    densityValue.innerText = density;
    updateDensity(densitySlider.value);

    // updateSliderValuePosition(densitySlider, densityValue);


    // 슬라이더 이벤트 리스너
    densitySlider.addEventListener('input', (event) => {
        updateDensity(event.target.value);
        updateSliderValuePosition(densitySlider, densityValue);
    });

    // +, - 버튼 눌렀을 시 값 위치 표시
    document.querySelector('.slider-button[data-action="density-decrease"]').addEventListener('click', () =>
        updateSliderValuePosition(densitySlider, densityValue));
    document.querySelector('.slider-button[data-action="density-increase"]').addEventListener('click', () =>
        updateSliderValuePosition(densitySlider, densityValue));
    
    // 초기 위치 설정
    updateSliderValuePosition(densitySlider, densityValue);

    // 윈도우 크기 변경 시 슬라이더 값 위치 업데이트
    window.addEventListener('resize', () => {
        updateSliderValuePosition(densitySlider, densityValue);
    });

    // 가로 패널, 세로 패널 변경 시 슬라이더 값 위치 업데이트
    const panels = document.querySelectorAll('#horizontal-panel, #vertical-panel');

    panels.forEach(panel => {
        new ResizeObserver(() => {
            updateSliderValuePosition(densitySlider, densityValue);
        }).observe(panel);
    });
});

// 폭 슬라이더 값 동적으로 표시
document.addEventListener('DOMContentLoaded', () => {
    const widthSlider = document.getElementById('width');
    const widthValue = document.getElementById('width-value');
    widthSlider.value = shelfWidth;
    widthValue.innerText = shelfWidth;
    updateWidth(widthSlider.value);

    // 슬라이더 이벤트 리스너
    widthSlider.addEventListener('input', (event) => {
        updateWidth(event.target.value);
        updateSliderValuePosition(widthSlider, widthValue);
    });
    
    // +, - 버튼 눌렀을 시 값 위치 표시
    document.querySelector('.slider-button[data-action="width-decrease"]').addEventListener('click', () =>
        updateSliderValuePosition(widthSlider, widthValue));
    document.querySelector('.slider-button[data-action="width-increase"]').addEventListener('click', () =>
        updateSliderValuePosition(widthSlider, widthValue));
    
    // 초기 위치 설정
    updateSliderValuePosition(widthSlider, widthValue);

    // 윈도우 크기 변경 시 슬라이더 값 위치 업데이트
    window.addEventListener('resize', () => {
        updateSliderValuePosition(widthSlider, widthValue);
    });

    // 가로 패널, 세로 패널 변경 시 슬라이더 값 위치 업데이트
    const panels = document.querySelectorAll('#horizontal-panel, #vertical-panel');

    panels.forEach(panel => {
        new ResizeObserver(() => {
            updateSliderValuePosition(widthSlider, widthValue);
        }).observe(panel);
    });
});

// 높이 슬라이더 값 동적으로 표시
document.addEventListener('DOMContentLoaded', () => {
    const heightSlider = document.getElementById('height');
    const heightValue = document.getElementById('height-value');
    heightSlider.value = shelfHeight;
    heightValue.innerText = shelfHeight;
    updateHeight(heightSlider.value);

    // 슬라이더 이벤트 리스너
    heightSlider.addEventListener('input', (event) => {
        updateHeight(event.target.value);
        updateSliderValuePosition(heightSlider, heightValue);
    });

    // +, - 버튼 눌렀을 시 값 위치 표시
    document.querySelector('.slider-button[data-action="height-decrease"]').addEventListener('click', () =>
        updateSliderValuePosition(heightSlider, heightValue));
    document.querySelector('.slider-button[data-action="height-increase"]').addEventListener('click', () =>
        updateSliderValuePosition(heightSlider, heightValue));

    // 초기 위치 설정\
    updateSliderValuePosition(heightSlider, heightValue);


    // 윈도우 크기 변경 시 슬라이더 값 위치 업데이트
    window.addEventListener('resize', () => {
        updateSliderValuePosition(heightSlider, heightValue);
    });

    // 가로 패널, 세로 패널 변경 시 슬라이더 값 위치 업데이트
    const panels = document.querySelectorAll('#horizontal-panel, #vertical-panel');

    panels.forEach(panel => {
        new ResizeObserver(() => {
            updateSliderValuePosition(heightSlider, heightValue);
        }).observe(panel);
    });
});

// 밀도 값 업데이트 함수
function updateDensity(value) {
    density = parseInt(value);
    const densityElement = document.getElementById('density-value');

    if (densityElement) {
        document.getElementById('density-value').style.display = 'block';
        densityElement.innerText = `${value}%`;
    }

    //label버튼 선택된 조건부. 치수를 보여줌.
    if (labelsVisible) {
        updateLabels();
    }

    createShelf(currentStyle);
    debounceAdjustCamera();
}

function updateWidth(value) {
    shelfWidth = parseInt(value);
    const widthElement = document.getElementById('width-value');

    if (widthElement) {
        document.getElementById('width-value').style.display = 'block';
        widthElement.innerText = `${value}cm`;
    }

    //label버튼 선택된 조건부. 치수를 보여줌.
    if (labelsVisible) {
        updateLabels();
    }

    createShelf(currentStyle);
}

function updateHeight(value) {
    shelfHeight = parseInt(value);
    const heightElement = document.getElementById('height-value');

    if (heightElement) {
        document.getElementById('height-value').style.display = 'block';
        heightElement.innerText = `${value}cm`;
    }

    updateProductTitle();
    createShelf(currentStyle);
}

function updateDepth(value) {
    shelfDepth = parseInt(value);
    const depthElement = document.getElementById('depth-value');

    if (depthElement) {
        depthElement.innerText = `${value}cm`;
    }

    //label버튼 선택된 조건부. 치수를 보여줌.
    if (labelsVisible) {
        updateLabels();
    }

    createShelf(currentStyle);
    debounceAdjustCamera();
}


// ui에서 change함수로 변경하면 upDate함수 실행하여 반영.

function changeDensity(delta) {
    const slider = document.getElementById('density');
    let newValue = parseInt(slider.value) + delta;

    if (newValue >= slider.min && newValue <= slider.max) {
        slider.value = newValue;
        updateDensity(newValue); 
    }
}

function changeWidth(delta) {
    const slider = document.getElementById('width');
    let newValue = parseInt(slider.value) + delta;

    if (newValue >= slider.min && newValue <= slider.max) {
        slider.value = newValue;
        updateWidth(newValue);
        
    }
}

function changeHeight(delta) {
    const slider = document.getElementById('height');
    let newValue = parseInt(slider.value) + delta;

    if (newValue >= slider.min && newValue <= slider.max) {
        slider.value = newValue;
        updateHeight(newValue);
        adjustCameraPosition();
    }
}


function setDepth(depth) {
    document.getElementById('depth-value').innerText = depth + 'cm';
    updateDepth(depth);
    
    // Update the active state of buttons
    document.querySelectorAll('.depth-button').forEach(button => {
        button.classList.remove('active');
    });

    document.querySelector('.depth-button[data-depth="' + depth + '"]').classList.add('active');
}
