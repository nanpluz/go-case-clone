canvas = document.getElementById('canvas');
userImages = document.getElementsByClassName('user-image');
userTexts = document.getElementsByClassName('user-text');
items = [];
Array.from(userImages).forEach(image => items.push(image));
Array.from(userTexts).forEach(text => items.push(text));
let selectedItem;
if (!selectedItem) selectedItem = 0;
let isResizing;
let isRotating;
if (!isResizing) isResizing = false;
if (!isRotating) isRotating = false;
indexOfNextItem = 0;
currentZIndexes = []
items.forEach(item => {
    currentZIndexes.push(0);
    item.style.zIndex = 0;
})

setInterval(()=>{
    items.forEach((item, i)=>{
        console.log('índice', i);
        console.log('zIndex', item.style.zIndex);
    })
}, 1500);

function main() {
    automaticallyResizeTextareas();
}

function rereadScript() {
    clearEventListeners();

    rereadParameters();
    Array.from(items).forEach((item, i) => {
        item.addEventListener('mousedown', () => { selectItem(i); });
        item.style.zIndex = 0;
    });
    let deleteButtons = document.getElementsByClassName('delete');
    Array.from(deleteButtons).forEach((deleteButton, i) => {
        deleteButton.addEventListener('mousedown', () => { deleteItem(i) });
    });

    handleDragging();
    handleResizing();
    handleRotating();

    automaticallyResizeTextareas();

    handleMoveUpwards();
    handleMoveBackwards();
}

function rereadParameters() {
    canvas = document.getElementById('canvas');
    userImages = document.getElementsByClassName('user-image');
    userTexts = document.getElementsByClassName('user-text');
    items = [];
    Array.from(userImages).forEach(image => items.push(image));
    Array.from(userTexts).forEach(text => items.push(text));
    items.forEach(item => {
        if (!item.classList.contains('is-text')) {
            if (!item.style.width) item.style.width = '150px';
            if (!item.style.height) item.style.height = '200px';
        }
    })
    selectedItem;
    if (!selectedItem) selectedItem = 0;
    if (!isResizing) isResizing = false;
    if (!isRotating) isRotating = false;

    if (!currentZIndexes) {
        for (item of items) {
            currentZIndexes.push(0);
        }
    } else if (currentZIndexes.length < items.length) {
        verifyZIndexesLength();
    }
}

function verifyZIndexesLength() {
    if (currentZIndexes.length < items.length) currentZIndexes.push(0);
    if (currentZIndexes.length < items.length) verifyZIndexesLength();
}

function handleMoveUpwards() {
    let moveUpwards = document.getElementsByClassName('move-upward');

    let i = -1;
    for (let moveUpward of moveUpwards) {
        moveUpward.addEventListener('mousedown', ()=>{
            currentZIndexes[i] = ++currentZIndexes[i];
            items.forEach((item, ii)=>{
                if(i == ii) {
                    items[i].style.zIndex = `${currentZIndexes[i]}`;
                };
            })
            if (moveUpward.parentElement.classList.contains('is-text')) moveUpward.parentElement.children[6].innerHTML = currentZIndexes[i];
            else moveUpward.parentElement.children[4].innerHTML = currentZIndexes[i];
        });        

        i++;
    }
}

function handleMoveBackwards() {
    let moveBackwards = document.getElementsByClassName('move-backward');

    let i = -1;
    for (let moveBackward of moveBackwards) {
        moveBackward.addEventListener('mousedown', mousedown);

        function mousedown() {
            currentZIndexes[i] = --currentZIndexes[i];
            console.log(items[i].style.zIndex);
            items[i].zIndex = `${currentZIndexes[i]}`;
            console.log(items[i].zIndex);
            if (moveBackward.parentElement.classList.contains('is-text')) {
                moveBackward.parentElement.children[6].innerHTML = currentZIndexes[i];
            }
            else {
                moveBackward.parentElement.children[4].innerHTML = currentZIndexes[i]
            };
        }

        i++;
    }
}

function deleteItem(i) {
    items[i].remove();
    rereadScript();
}

function reset() {
    rereadParameters();

    items[selectedItem].style.top = '175px';
    items[selectedItem].style.left = '50px';
    items[selectedItem].style.width = '150px';
    items[selectedItem].style.height = '220px';
    items[selectedItem].style.transform = 'rotateZ(0deg)';
}

function handleDragging() {
    track = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    }

    rereadParameters();
    items.forEach(item => item.addEventListener('mousedown', ($event) => { mousedown($event) }));
    window.addEventListener('mouseup', () => { window.removeEventListener('mousemove', mousemove) });

    function mousedown($event) {
        rereadParameters();
        track.startX = $event.clientX;
        track.startY = $event.clientY;

        window.addEventListener('mousemove', mousemove);
    }

    function mousemove($event) {
        if (!isResizing && !isRotating) {
            track.endX = $event.clientX;
            track.endY = $event.clientY;

            moveUserImage((track.endX - track.startX), (track.endY - track.startY));

            track.startX = $event.clientX;
            track.startY = $event.clientY;
        }
    }

    function moveUserImage(x, y) {
        items[selectedItem].style.top = `${getNumberFromPixels(items[selectedItem].style.top) + y}px`;
        items[selectedItem].style.left = `${getNumberFromPixels(items[selectedItem].style.left) + x}px`;
    }

    function getNumberFromPixels(pixels) {
        if (pixels) return Number(pixels.substring(0, (pixels.length - 2)));
        else return 0;
    }
}

function handleResizing() {
    let resizers = document.getElementsByClassName('resizer');
    let currentResizer;

    for (let resizer of resizers) {
        rereadParameters();

        if (!resizer.parentElement.parentElement.classList.contains('is-text')) resizer.addEventListener('mousedown', mousedown);

        function mousedown($event) {
            rereadParameters();
            isResizing = true;
            currentResizer = $event.target;

            let prevX = $event.clientX;
            let prevY = $event.clientY;

            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);

            function mousemove($event) {
                let prevRotation = items[selectedItem].style.transform;
                items[selectedItem].style.transform = 'rotateZ(0deg)';

                const canvasRect = canvas.getBoundingClientRect();
                const userImageRect = items[selectedItem].getBoundingClientRect();

                if (currentResizer.classList.contains('nw')) {
                    items[selectedItem].style.width = `${userImageRect.width + (prevX - $event.clientX)}px`;
                    items[selectedItem].style.height = `${userImageRect.height + (prevY - $event.clientY)}px`;
                    items[selectedItem].style.top = `${(userImageRect.top - canvasRect.top) - (prevY - $event.clientY)}px`;
                    items[selectedItem].style.left = `${(userImageRect.left - canvasRect.left) - (prevX - $event.clientX)}px`;
                }

                else if (currentResizer.classList.contains('ne')) {
                    items[selectedItem].style.width = `${userImageRect.width - (prevX - $event.clientX)}px`;
                    items[selectedItem].style.height = `${userImageRect.height + (prevY - $event.clientY)}px`;
                    items[selectedItem].style.top = `${(userImageRect.top - canvasRect.top) - (prevY - $event.clientY)}px`;
                }

                else if (currentResizer.classList.contains('se')) {
                    items[selectedItem].style.width = `${userImageRect.width - (prevX - $event.clientX)}px`;
                    items[selectedItem].style.height = `${userImageRect.height - (prevY - $event.clientY)}px`;
                }

                else if (currentResizer.classList.contains('sw')) {
                    items[selectedItem].style.width = `${userImageRect.width + (prevX - $event.clientX)}px`;
                    items[selectedItem].style.height = `${userImageRect.height - (prevY - $event.clientY)}px`;
                    items[selectedItem].style.left = `${(userImageRect.left - canvasRect.left) - (prevX - $event.clientX)}px`;
                }

                prevX = $event.clientX;
                prevY = $event.clientY;

                items[selectedItem].style.transform = prevRotation;
            }

            function mouseup($event) {
                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
                isResizing = false;
            }
        }
    }
}

function handleRotating() {
    let rotatorPoints = document.getElementsByClassName('rotator__point');
    let track = {
        startX: 0,
        endX: 0,
    }

    rereadParameters();
    Array.from(rotatorPoints).forEach(rotatorPoint => {
        rotatorPoint.addEventListener('mousedown', mousedown);
    });

    function mousedown(e) {
        rereadParameters();
        isRotating = true;

        track.startX = e.clientX;

        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);
    }

    function mousemove(e) {
        track.endX = e.clientX;
        rotateImage();
        track.startX = e.clientX;
    }

    function rotateImage() {
        items[selectedItem].style.transform = `rotateZ(${(Number(getCurrentRotationAngle()) + (track.endX - track.startX))}deg)`;
    }

    function getCurrentRotationAngle() {
        let angle = items[selectedItem].style.transform;
        angle = angle.substring(8, angle.length);
        angle = angle.substring(0, angle.length - 4);
        return angle;
    }

    function mouseup() {
        isRotating = false;
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }
}

function addTextOnCanvas() {
    canvas.innerHTML += `
        <div class="user-image is-text" style="top: 150px; left: 50px; cursor: grab;"> 
            <div class="rotator">
                <div class="rotator__point" style="cursor: pointer;"></div>
                <hr class="rotator__bar">
            </div>
            <div class="resizers" style="opacity: 0; pointer-events: none;">
                <div class="resizer nw" style="cursor: grab;"></div>
                <div class="resizer ne" style="cursor: grab;"></div>
                <div class="resizer se" style="cursor: grab;"></div>
                <div class="resizer sw" style="cursor: grab;"></div>
            </div>
            <div class="delete text-delete"><i class="fa-xmark fa-solid fa-lg"></i></div>
            <div class="user-image--text" style="pointer-events: none; cursor: grab;" contenteditable="true">Lorem ipsum</div>
            <div class="text-selection-border" style="cursor: grab;"></div>
            <div class="move-upward"> <i class="fa-arrow-up fa-solid fa-lg"></i></div>
            <div class="z-index">0</div>
            <div class="move-backward"> <i class="fa-arrow-down fa-solid fa-lg"></i></div>
        </div>
    `
    selectItem(indexOfNextItem);
    indexOfNextItem++;
    rereadScript();
}

function addItemOnCanvas(e) {
    $addItemOnCanvas(e).then().catch(err => { throw err });
}

function changeFontSize(event) {
    items[selectedItem].children[3].style.fontSize = `${event.target.value}px`;
}

function changeFontWeight(event) {
    items[selectedItem].children[3].style.fontWeight = `${event.target.value}`;
}

function $addItemOnCanvas(e) {
    return new Promise((resolve, reject) => {
        getBase64(e.target.files[0]).then((file) => {
            canvas.innerHTML += `
                    <div class="user-image" draggable="false" style="background-image: url(${file});">
                        <div class="rotator">
                            <div class="rotator__point"></div>
                            <hr class="rotator__bar">
                        </div>     
                        <div class="resizers">
                            <div class="resizer nw"></div>
                            <div class="resizer ne"></div>
                            <div class="resizer se"></div>
                            <div class="resizer sw"></div>
                        </div>
                        <div class="delete"><i class="fa-xmark fa-solid fa-lg"></i></div>
                        <div class="move-upward"> <i class="fa-arrow-up fa-solid fa-lg"></i></div>
                        <div class="z-index">0</div>
                        <div class="move-backward"> <i class="fa-arrow-down fa-solid fa-lg"></i></div>
                    </div>
                `

            selectItem(indexOfNextItem);

            indexOfNextItem++;

            rereadScript();

            getImageInput().value = null;

            resolve();
        }).catch(err => reject(err));

    })
}

function getBase64(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function editText() {
    items[selectedItem].children[3].focus();

    window.setTimeout(function () {
        var sel, range;
        if (window.getSelection && document.createRange) {
            range = document.createRange();
            range.selectNodeContents(items[selectedItem].children[3]);
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(items[selectedItem].children[3]);
            range.select();
        }
    }, 1);
}

function clearEventListeners() {
    var old_canvas_element = document.getElementsByClassName("canvas")[0];
    var new_canvas_element = old_canvas_element.cloneNode(true);
    old_canvas_element.parentNode.replaceChild(new_canvas_element, old_canvas_element);
}

function selectItem(i) {
    selectedItem = i;
    rereadScript();
    pointSelectedItem();
}

function getImageInput() {
    return document.getElementsByClassName('image-input')[0];
}

function pointSelectedItem() {
    hideResizersOfOthers();
    hideRemoversOfOthers();
    hideRotatorsOfOthers();
    hideTextSelectionBorders();

    if (items[selectedItem].classList.contains('is-text')) items[selectedItem].children[4].style.opacity = '1';
}

function hideRotatorsOfOthers() {
    let rotators = document.getElementsByClassName('rotator');

    //first reset
    for (let rotatorBtn of rotators) {
        rotatorBtn.style.opacity = 1;
        rotatorBtn.style.pointerEvents = 'all';
    }

    //then do the work
    let i = 0;
    for (let rotatorBtn of rotators) {
        if (i != selectedItem) {
            rotatorBtn.style.opacity = 0;
            rotatorBtn.style.pointerEvents = 'none';
        }
        i++;
    }
}

function hideRemoversOfOthers() {
    let deletes = document.getElementsByClassName('delete');

    //first reset
    for (let deleteBtn of deletes) {
        deleteBtn.style.opacity = 1;
        deleteBtn.style.pointerEvents = 'all';
    }

    //then do the work
    let i = 0;
    for (let deleteBtn of deletes) {
        if (i != selectedItem) {
            deleteBtn.style.opacity = 0;
            deleteBtn.style.pointerEvents = 'none';
        }
        i++;
    }
}

function hideResizersOfOthers() {
    let resizers = document.getElementsByClassName('resizer');

    //first the reset
    for (let resizer of resizers) {
        resizer.style.opacity = 1;
        resizer.style.pointerEvents = 'all';
    }

    //then the magic
    let currentImageIndex = 0;
    let resizerIndex = 0;
    for (let resizer of resizers) {
        if (resizerIndex === 4) { currentImageIndex++; resizerIndex = 0 }

        if (currentImageIndex != selectedItem) {
            resizer.style.opacity = 0;
            resizer.style.pointerEvents = 'none';
        }

        resizerIndex++;
    }
}

function changeTextColor(e) {
    items[selectedItem].children[3].style.color = e.target.value;
}

function hideTextSelectionBorders() {
    items.forEach((item, i) => {
        if (items[i].classList.contains('is-text')) items[i].children[4].style.opacity = '0';
    })
}

function automaticallyResizeTextareas() {
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
        tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
        this.style.height = 0;
        this.style.height = (this.scrollHeight) + "px";
    }
}

main();