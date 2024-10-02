const serverURL = "https://befun-back-69ti.onrender.com";
// Test: http://localhost:8080
// Real: https://befun-back-69ti.onrender.com

// 백패널 토글 눌렀을 시 이벤트
function triggerBackPanelToggle() {
    const currentState = document.getElementById('toggle-backpanel').getAttribute('data-state');
    const newState = currentState === 'off' ? 'on' : 'off';
    document.getElementById('toggle-backpanel').setAttribute('data-state', newState);

    const imgSrc = newState === 'off' ? 'imgs/icon/toggle_off.svg' : 'imgs/icon/toggle_on.svg';
    document.getElementById('toggle-backpanel').querySelector('img').setAttribute('src', imgSrc);

    toggleBackPanel(newState === 'on');
}

function initializeEventListeners() {

    // 스타일 변경 버튼
    document.querySelectorAll('.variant-button').forEach(button => {
        button.addEventListener('click', function() {
            changeVariant(this.dataset.variant);
        });
    });

    // 밀도 조절
    document.getElementById('density').addEventListener('input', handleDensityChange);
    document.getElementById('density').addEventListener('change', handleDensityChange);
    document.querySelector('.slider-button[data-action="density-decrease"]').addEventListener('click', () => changeDensity(-1));
    document.querySelector('.slider-button[data-action="density-increase"]').addEventListener('click', () => changeDensity(1));

    // 너비 조절
    document.getElementById('width').addEventListener('input', handleWidthChange);
    //document.getElementById('width').addEventListener('change', handleWidthChange);

    document.getElementById('width').addEventListener('mouseup', adjustCameraPosition);
    document.getElementById('width').addEventListener('touchend', adjustCameraPosition);

    //document.getElementById('width').addEventListener('change', adjustCameraAfterWidthChange);
    document.querySelector('.slider-button[data-action="width-decrease"]').addEventListener('click', () => changeWidth(-1));
    document.querySelector('.slider-button[data-action="width-increase"]').addEventListener('click', () => changeWidth(1));



    // 높이 조절
    document.getElementById('height').addEventListener('input', handleHeightChange);
    document.getElementById('height').addEventListener('change', handleHeightChange);

    document.getElementById('height').addEventListener('mouseup', adjustCameraPosition);
    document.getElementById('height').addEventListener('touchend', adjustCameraPosition);


    document.querySelector('.slider-button[data-action="height-decrease"]').addEventListener('click', () => changeHeight(-34));
    document.querySelector('.slider-button[data-action="height-increase"]').addEventListener('click', () => changeHeight(34));


    // 깊이 조절
    document.querySelectorAll('.depth-button').forEach(button => {
        button.addEventListener('click', function() {
            setDepth(parseInt(this.textContent));
        });
    });

    // 치수 보기 토글
    // document.getElementById('check-dimensions').addEventListener('click', toggleLabels);
    document.getElementById('view-labels').addEventListener('click', toggleLabels);

    // // 백패널 토글
    document.getElementById('toggle-backpanel').addEventListener('click', triggerBackPanelToggle);

    function saveDesignAndCaptureImage() {
        // 디자인 정보 저장
        const designData = {

            width: shelfWidth,
            height: shelfHeight,
            depth: shelfDepth,
            density: density,
            style: currentStyle,
            parts: parts.map(part => ({
                position: part.position,
                scale: part.scale,
                rotation: part.rotation
            }))
        };
        localStorage.setItem('designData', JSON.stringify(designData));

        // MongoDB에 디자인 정보 저장
        fetch('/api/designs/save-design', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(designData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Design saved:', data);
            console.log('성공');
        })
        .catch((error) => {
            console.error('Error saving design:', error);
        });


        // 이미지 캡처
        requestAnimationFrame(() => {
            const dataURL = renderer.domElement.toDataURL('image/png');
            localStorage.setItem('capturedImage', dataURL);

            // mydesign.html로 이동 (새 창)
            window.open('mydesign.html', '_blank');

            // // 모달로 출력 원할시
            // showModal();
        });
    }

    // 모달창 보여주기
    function showModal() {
        const modal = document.getElementById("myModal");
        modal.style.display = "block";
    }



    // 모델 내보내기
    document.querySelector('button[data-action="export-obj"]').addEventListener('click', () => exportModel('obj'));
    document.querySelector('button[data-action="export-glb"]').addEventListener('click', () => exportModel('glb'));

}

function handleDensityChange(event) {
    updateDensity(event.target.value);
    updateLabels();
    updateLabelsVisibility();
}

function handleWidthChange(event) {
    updateWidth(event.target.value);
    updateLabels();
    updateLabelsVisibility();
    //createBackground(shelfWidth, shelfHeight, shelfDepth);

}

function handleHeightChange(event) {
    updateHeight(event.target.value);
    updateLabels();
    updateLabelsVisibility();
}

// 구매 버튼 클릭
document.getElementById('buyButton').addEventListener('click', async () => {
    updateURL();
    function generateUUID() {
        return 'xxxxyxxxxxyxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const uuid = generateUUID();
    const detailImageName = generateUUID() + `.png`;

    var shopNo = 1;
    var productName = document.getElementById('product-title').innerText;
    var productPrice = originalPrice;
    var supplyPrice = "9000";
    var display = "T";
    var selling = "T";
    var customProductCode = uuid;
    var detailImage = null;

    if (labels.length != 0) {
        clearLabels();
        labelsVisible = false;
        labels.length = 0;
    }
    adjustCameraPosition();
    renderer.render(scene, camera);
    var uploadImage = renderer.domElement.toDataURL('image/png').split(',')[1];
    var uploadImagesData = {
        "requests": [
          {
            "image": uploadImage
          }
        ]
      };

    // 이미지 업로드 Promise
    function uploadImages() {
        return new Promise((resolve, reject) => {
            var xhrUploadImages = new XMLHttpRequest();
            xhrUploadImages.open("POST", serverURL + "/api/products/images", true);
            xhrUploadImages.setRequestHeader("Content-Type", "application/json");

            xhrUploadImages.onreadystatechange = function () {
                if (xhrUploadImages.readyState === 4) {
                    if (xhrUploadImages.status === 200) {
                        const uploadImagesJsonResponse = JSON.parse(xhrUploadImages.responseText);
                        detailImage = uploadImagesJsonResponse.images[0].path.substring(uploadImagesJsonResponse.images[0].path.indexOf('/web'));
                        console.log('result:', detailImage);
                        resolve(detailImage);
                    } else {
                        reject('Error uploading images: ' + xhrUploadImages.statusText);
                    }
                }
            };

            xhrUploadImages.send(JSON.stringify(uploadImagesData));
        });
    }

    try {
        // 이미지 업로드가 완료될 때까지 기다림
        const detailImage = await uploadImages();

        // 제품 생성 요청
        var productData = {
            "shop_no": shopNo,
            "request": {
                "product_name": productName.toString() + " (제품 코드: " + customProductCode.toString() + ")",
                "price": productPrice,
                "supply_price": supplyPrice,
                "display": display,
                "selling": selling,
                "custom_product_code": customProductCode.toString(),
                "detail_image": detailImage,
                "description": shareResult.value
            }
        };

        var xhrCreate = new XMLHttpRequest();
        xhrCreate.open("POST", serverURL + "/api/products", true);
        xhrCreate.setRequestHeader("Content-Type", "application/json");

        xhrCreate.onreadystatechange = function () {
            if (xhrCreate.readyState === 4) {
                if (xhrCreate.status === 200) {
                    // 제품 생성 후, 제품 리스트 조회
                    var xhrList = new XMLHttpRequest();
                    xhrList.open("GET", serverURL + "/api/products", true);
                    xhrList.setRequestHeader("Content-Type", "application/json");

                    xhrList.onreadystatechange = function () {
                        if (xhrList.readyState === 4) {
                            if (xhrList.status === 200) {
                                var products = JSON.parse(xhrList.responseText).products;
                                var createdProduct = products.find(p => p.custom_product_code === customProductCode);
                                
                                if (createdProduct) {
                                    var productNo = createdProduct.product_no;

                                    // localStorage에 product_no 저장
                                    localStorage.setItem('productNo', productNo);

                                    // 장바구니 페이지로 리디렉션
                                    window.location.href = 'https://uable001.cafe24.com/order/basket.html';
                                } else {
                                    console.error('Created product not found in product list');
                                }
                            } else {
                                console.error('Failed to retrieve product list:', xhrList.statusText);
                            }
                        }
                    };
                    xhrList.send();
                } else {
                    console.error('Error creating product:', xhrCreate.statusText);
                }
            }
        };

        xhrCreate.send(JSON.stringify(productData));
    } catch (error) {
        console.error(error);
    }
});

// header, footer로딩 삭제


// 캐러셀carousel

document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.getElementById('mainImage');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    let imageIndex = 0;

    function loadImages() {
        const img = new Image();
        img.onload = function() {
            // Image loaded successfully, add it to the carousel
            const thumbnail = document.createElement('img');
            thumbnail.src = this.src;
            thumbnail.alt = `Thumbnail ${imageIndex}`;
            thumbnail.classList.add('thumbnail');
            if (imageIndex === 0) thumbnail.classList.add('active');
            thumbnail.addEventListener('click', function() {
                mainImage.src = this.src;
                mainImage.alt = this.alt;
                document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            });
            thumbnailContainer.appendChild(thumbnail);
            
            // Load next image
            imageIndex++;
            loadImages();
        };
        img.onerror = function() {
            // No more images to load
            //console.log('Finished loading images');
        };
        img.src = `imgs/carousel/1/${imageIndex}.jpg`;
    }

    // Start loading images
    loadImages();
});



