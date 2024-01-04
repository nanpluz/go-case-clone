canvas = document.getElementById('canvas');
userImages = document.getElementsByClassName('user-image');
userTexts = document.getElementsByClassName('user-text');
items = [];
Array.from(userImages).forEach(image => items.push(image));
Array.from(userTexts).forEach(text => items.push(text));
selectedItem = 0;
isResizing = false;
isRotating = false;

function main() {
    addDefaultItemOnCanvas();

    reset();

    handleDragging();
    handleResizing();
    handleRotating();
}

function rereadScript() {
    clearEventListeners();

    rereadParameters();

    handleDragging();
    handleResizing();
    handleRotating();
}

function rereadParameters() {
    canvas = document.getElementById('canvas');
    userImages = document.getElementsByClassName('user-image');
    userTexts = document.getElementsByClassName('user-text');
    items = [];
    Array.from(userImages).forEach(image => items.push(image));
    Array.from(userTexts).forEach(text => items.push(text));
    selectedItem = 0;
    isResizing = false;
    isRotating = false;
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
    items.forEach(item=>item.addEventListener('mousedown', ($event) => { mousedown($event) }));
    window.addEventListener('mouseup', () => { window.removeEventListener('mousemove', mousemove) });

    function mousedown($event) {
        rereadParameters();
        if (!isResizing && !isRotating) {
            track.startX = $event.clientX;
            track.startY = $event.clientY;

            window.addEventListener('mousemove', mousemove);
        }
    }

    function mousemove($event) {
        track.endX = $event.clientX;
        track.endY = $event.clientY;

        moveUserImage((track.endX - track.startX), (track.endY - track.startY));

        track.startX = $event.clientX;
        track.startY = $event.clientY;
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
        resizer.addEventListener('mousedown', mousedown);

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
    let rotatorPoint = document.getElementsByClassName('rotator__point')[0];
    let track = {
        startX: 0,
        endX: 0,
    }

    rereadParameters();
    rotatorPoint.addEventListener('mousedown', mousedown);

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

function deleteItem(i) {
    console.log('a');
    console.log(items);
    console.log(i);
    items[i].remove();
}

function addItemOnCanvas(e) {
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
                <i onclick="deleteItem(${items.length - 1})" class="delete fa-xmark fa-solid fa-lg"></i>
            </div>
        `

        rereadParameters();
        rereadScript();
    })
}

function addDefaultItemOnCanvas() {
    canvas.innerHTML += `
        <div class="user-image" draggable="false" style="background-image: url(./assets/gumba.jpg);">
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
            <i onclick="deleteItem(${0})" class="delete fa-xmark fa-solid fa-lg"></i>
        </div>
    `
}

function getBase64(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function clearEventListeners() {
    var old_canvas_element = document.getElementsByClassName("canvas")[0];
    var new_canvas_element = old_canvas_element.cloneNode(true);
    old_canvas_element.parentNode.replaceChild(new_canvas_element, old_canvas_element);
}

main();