userImage = document.getElementById('user-image');
isResizing = false;
canvas = document.getElementById('canvas');

function main() {
    reset();

    handleDragging();
    handleResizing();
}

function reset() {
    userImage.style.top = '175px';
    userImage.style.left = '50px';
    userImage.style.width = '150px';
    userImage.style.height = '220px';
}

function handleDragging() {
    track = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    }

    window.addEventListener('mousedown', ($event) => { mousedown($event) });
    window.addEventListener('mouseup', () => { window.removeEventListener('mousemove', mousemove) });

    function mousedown($event) {
        if(!isResizing) {
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
        userImage.style.top = `${getNumberFromPixels(userImage.style.top) + y}px`;
        userImage.style.left = `${getNumberFromPixels(userImage.style.left) + x}px`;
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
        resizer.addEventListener('mousedown', mousedown);

        function mousedown($event) {
            isResizing = true;
            currentResizer = $event.target;

            let prevX = $event.clientX;
            let prevY = $event.clientY;

            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);

            function mousemove($event) {
                const canvasRect = canvas.getBoundingClientRect();
                const userImageRect = userImage.getBoundingClientRect();

                if(currentResizer.classList.contains('nw')) {
                    userImage.style.width = `${userImageRect.width + (prevX - $event.clientX)}px`;
                    userImage.style.height = `${userImageRect.height + (prevY - $event.clientY)}px`;
                    userImage.style.top = `${(userImageRect.top - canvasRect.top) - (prevY - $event.clientY)}px`;
                    userImage.style.left = `${(userImageRect.left - canvasRect.left) - (prevX - $event.clientX)}px`;
                }

                else if(currentResizer.classList.contains('ne')) {
                    userImage.style.width = `${userImageRect.width - (prevX - $event.clientX)}px`;
                    userImage.style.height = `${userImageRect.height + (prevY - $event.clientY)}px`;
                    userImage.style.top = `${(userImageRect.top - canvasRect.top) - (prevY - $event.clientY)}px`;
                }

                else if(currentResizer.classList.contains('se')) {
                    userImage.style.width = `${userImageRect.width - (prevX - $event.clientX)}px`;
                    userImage.style.height = `${userImageRect.height - (prevY - $event.clientY)}px`;
                }

                else if(currentResizer.classList.contains('sw')) {
                    userImage.style.width = `${userImageRect.width + (prevX - $event.clientX)}px`;
                    userImage.style.height = `${userImageRect.height - (prevY - $event.clientY)}px`;
                    userImage.style.left = `${(userImageRect.left - canvasRect.left) - (prevX - $event.clientX)}px`;
                }

                prevX = $event.clientX;
                prevY = $event.clientY;
            }

            function mouseup($event) {
                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
                isResizing = false;
            }
        }
    }
}

main();