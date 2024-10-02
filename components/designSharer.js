const shareResult = document.getElementById('share-result');
const shareButton = document.getElementById('share-link');
var shareModal = document.getElementById("modal-share");
var shareModalCloseButton = document.getElementById("modal-close-button-share");
const shareResultCopyButton = document.getElementById('share-result-copy');

function openShareModal() {
    shareModal.style.display = 'block';
}

function closeShareModal() {
    shareModal.style.display = 'none';
}

shareResultCopyButton.addEventListener('click', function() {
    shareResult.select();
    document.execCommand('copy');
    alert("텍스트가 클립보드에 복사되었습니다!");
});

shareButton.addEventListener("click", openShareModal);
shareModalCloseButton.addEventListener("click", closeShareModal);

function updateURL() {
    const variantURL = currentStyle;
    const densityURL = density;
    const widthURL = shelfWidth;
    const heightURL = shelfHeight;
    const depthURL = shelfDepth;
    const backPanelURL = hasBackPanel;
    const colorURL = currentColor;

    const designState = {
        variantURL,
        densityURL,
        widthURL,
        heightURL,
        depthURL,
        backPanelURL,
        colorURL
    };
    
    const encodedState = encodeURIComponent(JSON.stringify(designState));

    const url = new URL(window.location);
    url.searchParams.set('state', encodedState); // 기존 state 파라미터가 있으면 업데이트, 없으면 추가
    const shareableURL = url.toString();

    shareResult.value = `${shareableURL}`;
}

function loadDesignState() {
    const params = new URLSearchParams(window.location.search);
    const encodedState = params.get('state');

    if (encodedState) {
        const designState = JSON.parse(decodeURIComponent(encodedState));
        currentStyle = designState.variantURL;
        changeVariant(currentStyle);
        density = designState.densityURL;
        shelfWidth = designState.widthURL;
        shelfHeight = designState.heightURL;
        shelfDepth = designState.depthURL;
        setDepth(shelfDepth);
        hasBackPanel = designState.backPanelURL;
        const newState = hasBackPanel === true ? 'on' : 'off';
        document.getElementById('toggle-backpanel').setAttribute('data-state', newState);
        const imgSrc = newState === 'off' ? 'imgs/icon/toggle_off.svg' : 'imgs/icon/toggle_on.svg';
        document.getElementById('toggle-backpanel').querySelector('img').setAttribute('src', imgSrc);
        currentColor = designState.colorURL;
        colorButtons.forEach(btn => {
            if (btn.getAttribute('data-color-name') === currentColor) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateURL();
    loadDesignState();
    shareButton.addEventListener('click', updateURL);
    loadDesignState();
    adjustCameraPosition();
});