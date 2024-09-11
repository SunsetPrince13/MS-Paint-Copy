const canvas = document.querySelector("canvas");
const canvasContent = canvas.getContext('2d');
const sizeRange = document.querySelector("#lineWidth");
const undo_btn = document.querySelector("#undo");
const redo_btn = document.querySelector("#redo");
const eraser = document.querySelector("#eraser");
const colorPicker = document.querySelector("#color_picker");
const cursor_tracker = document.querySelector(".cursor_tracker")
const element = document.querySelector(".element_container")
const download_btn = document.querySelector(".download_image");
const download_popup = document.querySelector(".popup_download");

var fileSaved = false;
var lineSize = sizeRange.value;
var currentOption = "";
var colour = colorPicker.value;

let isPressed = false;
let isErasing = false;

let startPosX, startPosY = 0;
let endPointX, endPointY = 0;

const clearCircularRegion = (x, y) => {
    canvasContent.arc(x, y, lineSize, 0, Math.PI*2)
    canvasContent.stroke();
    //canvasContent.clip();
    canvasContent.clearRect(x - lineSize, y - lineSize, lineSize * 2, lineSize * 2);
    //canvasContent.restore();
}
const clearEventListeners = () => {
    canvas.removeEventListener("mousedown", lineFunctionDown)
    canvas.removeEventListener("mouseup", lineFunctionUp)
    canvas.removeEventListener("mousedown", circleFunctionDown)
    canvas.removeEventListener("mouseup", circleFunctionUp)
    canvas.removeEventListener("mousedown", brushFunctionDown)
    canvas.removeEventListener("mousemove", brushFunctionMove)
    document.removeEventListener("mouseup", brushFunctionUp)
    canvas.removeEventListener("mousedown", erasingFunctionDown)
    canvas.removeEventListener("mousemove", erasingFunctionMove)
    canvas.removeEventListener("mouseup", erasingFunctionUp)
    isErasing = false;
}

let options = document.querySelectorAll(".options")

options.forEach(x => {
    x.addEventListener("click", () => {
        options.forEach(z => z.style.backgroundColor = "rgb(51, 55, 249)")
        x.style.backgroundColor = "rgb(26, 28, 135)"
        currentOption = x.id;
        switch (currentOption) {
            case "Circle":
                clearEventListeners();
                PaintFunctions.drawCircle();
                break;
            case "Line":
                clearEventListeners();
                PaintFunctions.drawLine();
                break;
            case "Brush":
                clearEventListeners();
                PaintFunctions.drawBrush();
                break;
        }
    })
    
})



document.querySelector(".clear").addEventListener("click", () => {
    canvasContent.clearRect(0, 0, canvas.width, canvas.height);
})

sizeRange.addEventListener("input", (e) => {
    lineSize = e.target.value;
})

const lineFunctionDown = (e) => {
    canvasContent.lineCap = "round";
    startPosX = e.offsetX;
    startPosY = e.offsetY;
    canvasContent.beginPath();
    canvasContent.moveTo(startPosX, startPosY);
    canvasContent.stroke()
    canvasContent.strokeStyle = colour;

}

const trackerFollowMouse = (e) => {
    
    if(e.target.id == "canvas" && !isErasing){
        var lengthx = e.pageX-lineSize/2;
        var lengthy = e.pageY-lineSize/2;
        cursor_tracker.style.display = "block";
        cursor_tracker.style.left =lengthx +"px";
        cursor_tracker.style.top = lengthy+"px"
        cursor_tracker.style.width = lineSize+"px";
        cursor_tracker.style.height = lineSize+"px";
        
        cursor_tracker.style.backgroundColor = colour;
    }else {
        cursor_tracker.style.display = "none";
    }
}

const lineFunctionUp = (e) => {
    canvasContent.lineWidth = lineSize;
    endPointX = e.offsetX;
        endPointY = e.offsetY;
        canvasContent.lineTo(endPointX, endPointY);
        canvasContent.stroke();
        
}

const circleFunctionDown = (e) => {
    
    startPosX = e.offsetX;
    startPosY = e.offsetY;
    
}

const circleFunctionUp = (e) => {
            
    canvasContent.lineWidth = lineSize;
    canvasContent.lineCap = "round";
    endPointX = e.offsetX;
    endPointY = e.offsetY;
    var CircleCoord = new Vector2((startPosX+endPointX)/2, (startPosY+endPointY)/2);
    canvasContent.beginPath();
    canvasContent.ellipse(CircleCoord.x, CircleCoord.y, Math.abs(startPosX-endPointX)/2, Math.abs(startPosY - endPointY)/2, Math.PI, 0, Math.PI*2)
    canvasContent.strokeStyle = colour;
    canvasContent.stroke();

}

const brushFunctionDown = (e) => {
    canvasContent.lineWidth = lineSize;
    startPosX = e.offsetX;
    startPosY = e.offsetY;
    canvasContent.beginPath();
    canvasContent.moveTo(startPosX, startPosY);
    canvasContent.stroke()
    isPressed = true
    
}

const brushFunctionMove = (e) => {
    if(isPressed){
        endPointX = e.offsetX;
        endPointY = e.offsetY;
        canvasContent.lineCap = "round";
        canvasContent.lineTo(endPointX, endPointY);
        canvasContent.strokeStyle = colour;
        canvasContent.stroke();
        canvasContent.moveTo(endPointX, endPointY)
    }
    
}

const brushFunctionUp = () => {
            
    isPressed = false;
}

const erasingFunctionDown = (e) => {
    isErasing = true;
    isPressed = true;
    //clearCircularRegion(e.pageX-lineSize/2, e.pageY-lineSize/2);
    canvasContent.clearRect(e.pageX-lineSize/2, e.pageY-lineSize/2, lineSize, lineSize);
}

const erasingFunctionMove = (e) => {
    isErasing = true;
    if(isPressed){
        canvasContent.lineCap = "round";
        //clearCircularRegion(e.pageX-lineSize/2, e.pageY-lineSize/2);
        canvasContent.clearRect(e.pageX-lineSize/2, e.pageY-lineSize/2, lineSize, lineSize);
    }
    
}

const erasingFunctionUp = (e) => {
    isPressed = false;
}

class PaintFunctions{
    static drawLine(){
        canvas.addEventListener("mousedown", lineFunctionDown)
        
        canvas.addEventListener("mouseup", lineFunctionUp)
    }

    static drawCircle(){
        canvas.addEventListener("mousedown", circleFunctionDown)
    
        canvas.addEventListener("mouseup", circleFunctionUp)
    }

    static drawBrush(){
        canvas.addEventListener("mousedown", brushFunctionDown)
        canvas.addEventListener("mousemove", brushFunctionMove)
        

        document.addEventListener("mouseup", brushFunctionUp)
    }

    static clearDrawings(){
        canvasContent.clearRect();
    }

    static undo(){
        document.execCommand("undo");
    }

    static redo(){
        document.execCommand("redo");
    }

    static eraseContent(){
        
        canvas.addEventListener("mousedown", erasingFunctionDown)
        canvas.addEventListener("mousemove", erasingFunctionMove)

        canvas.addEventListener("mouseup", erasingFunctionUp)
    }
}

undo_btn.addEventListener("click", PaintFunctions.undo());
redo_btn.addEventListener("click", PaintFunctions.redo());



eraser.addEventListener("click", () => {
    
    currentOption = "Eraser"
    switch (currentOption) {
        case "Circle":
            clearEventListeners();
            PaintFunctions.drawCircle();
            break;
        case "Line":
            clearEventListeners();
            PaintFunctions.drawLine();
            break;
        case "Brush":
            clearEventListeners();
            PaintFunctions.drawBrush();
            break;
        case "Eraser":
            clearEventListeners();
            PaintFunctions.eraseContent();
            break;
    }
});

class Vector2{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    findMagnitude(){
        return this.x + this.y;
    }
}

colorPicker.addEventListener("input", (e) => {
    colorPicker.style.borderColor = e.target.value;
    colour = e.target.value;
})

document.addEventListener("mousemove", trackerFollowMouse)

document.addEventListener("wheel", trackerFollowMouse)

canvas.addEventListener("mousemove", (e) => {
    var xVal = e.offsetX > 0 ? e.offsetX : 0;
    var yVal = e.offsetY > 0 ? e.offsetY : 0;
    document.querySelector(".cursor_position_tracker_text").innerHTML = `${xVal}, ${yVal}px`;
})

const downloadImage = (filename, path = "image/png") => {
    var data = canvas.toDataURL(path);
    var anchorDownload = document.createElement("a");
    anchorDownload.href= data;
    anchorDownload.download = filename;
    document.body.appendChild(anchorDownload);
    anchorDownload.click();

}
document.body.addEventListener("click", (e) => {
        if(e.target.id != download_popup.id){
            download_popup.style.display = "none";
        }
        
    })



const SaveContent = () => {
    const input_btn = document.querySelector(".filename").textContent;
    console.log(input_btn);
    var drawingName = input_btn != null ? input_btn : "";
    downloadImage(drawingName);
}



download_btn.addEventListener("click", () => {
    download_popup.style.display ="block"
    //download_popup.style.width = "400px"
    //download_popup.style.height = "220px"
    download_popup.addEventListener("keydown", (e) => {
        if(e.key == "Enter") {
            SaveContent();
        }
    })
    
})

window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    alert("Consider saving changes before leaving?");
})

document.querySelector(".save").addEventListener("click", () => SaveContent())

document.querySelectorAll("button").forEach(x => {
    x.addEventListener("click", (e) => {
        var bubble = document.createElement("span");
        /*bubble.style.top = e.clientY+"px";
        bubble.style.left = e.clientX+"px";*/
        x.appendChild(bubble);
    })
})