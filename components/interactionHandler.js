// interactionHandler.js
// 2 수정해보자

let raycaster, mouse;
let floatingBox;
let isFloatingBoxFixed = false;
let floatingBoxTimer;
const FLOATING_BOX_TIMEOUT = 10000; // 10초

function initInteractionHandler() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onClick);

    createFloatingBox();
}

function onMouseMove(event) {
    updateMousePosition(event);
    if (!isFloatingBoxFixed) {
        const intersects = performRaycasting();
        if (intersects.length > 0) {
            showFloatingBox(intersects[0].point);
        } else {
            hideFloatingBox();
        }
    }
}

function onClick(event) {
    const intersects = performRaycasting();
    if (intersects.length > 0) {
        fixFloatingBox(intersects[0].point);
    } else if (isFloatingBoxFixed) {
        if (!isClickInsideFloatingBox(event)) {
            hideFloatingBox();
        }
    }
}

function isClickInsideFloatingBox(event) {
    const rect = floatingBox.getBoundingClientRect();
    return (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
    );
}

function fixFloatingBox(position) {
    showFloatingBox(position);
    isFloatingBoxFixed = true;
    resetFloatingBoxTimer();
}

function resetFloatingBoxTimer() {
    if (floatingBoxTimer) {
        clearTimeout(floatingBoxTimer);
    }
    floatingBoxTimer = setTimeout(() => {
        hideFloatingBox();
    }, FLOATING_BOX_TIMEOUT);
}

function updateMousePosition(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function performRaycasting() {
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(parts, true);
}

function createFloatingBox() {
    floatingBox = document.createElement('div');
    floatingBox.style.position = 'absolute';
    floatingBox.style.display = 'none';
    floatingBox.style.backgroundColor = 'white';
    floatingBox.style.border = '1px solid black';
    floatingBox.style.padding = '10px';
    floatingBox.style.borderRadius = '5px';
    floatingBox.innerHTML = `
        <div class="dimension-control">
            <label for="floating-height">Height <span id="floating-height-value">${shelfHeight}cm</span></label>
            <div class="slider-container">
                <button class="slider-button" data-action="height-decrease">-</button>
                <input type="range" id="floating-height" min="34" max="238" value="${shelfHeight}" step="34">
                <button class="slider-button" data-action="height-increase">+</button>
            </div>
        </div>
    `;
    document.body.appendChild(floatingBox);

    const heightSlider = floatingBox.querySelector('#floating-height');
    const heightValue = floatingBox.querySelector('#floating-height-value');
    const decreaseButton = floatingBox.querySelector('[data-action="height-decrease"]');
    const increaseButton = floatingBox.querySelector('[data-action="height-increase"]');

    heightSlider.addEventListener('input', function() {
        const newHeight = this.value;
        heightValue.textContent = `${newHeight}cm`;
        adjustHeight(newHeight);
    });

    decreaseButton.addEventListener('click', function() {
        changeHeight(-34);
        updateFloatingBoxHeight();
    });

    increaseButton.addEventListener('click', function() {
        changeHeight(34);
        updateFloatingBoxHeight();
    });

    floatingBox.addEventListener('mouseenter', resetFloatingBoxTimer);
    floatingBox.addEventListener('mouseleave', () => {
        if (!isFloatingBoxFixed) {
            hideFloatingBox();
        }
    });
}

function showFloatingBox(position) {
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;
    const pos = position.project(camera);
    floatingBox.style.left = (pos.x * widthHalf + widthHalf) + 'px';
    floatingBox.style.top = (-pos.y * heightHalf + heightHalf) + 'px';
    floatingBox.style.display = 'block';
}

function hideFloatingBox() {
    floatingBox.style.display = 'none';
    isFloatingBoxFixed = false;
    if (floatingBoxTimer) {
        clearTimeout(floatingBoxTimer);
    }
}

function adjustHeight(newHeight) {
    newHeight = parseInt(newHeight);
    console.log('Adjusting height to:', newHeight);

    const mainHeightSlider = document.getElementById('height');
    const mainHeightValue = document.getElementById('height-value');
    if (mainHeightSlider && mainHeightValue) {
        mainHeightSlider.value = newHeight;
        mainHeightValue.textContent = `${newHeight}cm`;
    }

    updateHeight(newHeight);
    resetFloatingBoxTimer();
}

function updateFloatingBoxHeight() {
    const floatingHeightSlider = floatingBox.querySelector('#floating-height');
    const floatingHeightValue = floatingBox.querySelector('#floating-height-value');
    if (floatingHeightSlider && floatingHeightValue) {
        floatingHeightSlider.value = shelfHeight;
        floatingHeightValue.textContent = `${shelfHeight}cm`;
    }
}

// 전역 스코프에 함수 노출
window.initInteractionHandler = initInteractionHandler;