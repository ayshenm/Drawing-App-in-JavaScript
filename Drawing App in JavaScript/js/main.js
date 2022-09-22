const canvas = document.querySelector("canvas");
toolBtns = document.querySelectorAll(".tool");
fillColor = document.querySelector("#fill-color");
sizeSlider = document.querySelector("#size-slider");
colorBtns = document.querySelectorAll(".colors .option");
colorPicker = document.querySelector("#color-picker");
clearCanvas = document.querySelector(".clear-canvas");
saveCanvas = document.querySelector(".save-img");

ctx = canvas.getContext("2d");

//varsayilan deyere malik global deyiskenler
let prevMouseX,prevMouseY,snapshot;
let isDrawing = false;
selectedTool = "brush";
brushWidth = 5;
selectedColor = "#000";

const setCanvasBackground = () =>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;//yuklenen dosyanin rengin deyisdirme

} 

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    //elementin görünə bilən enini/hündürlüyünü qaytarır
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});
  
const drawRect = (e) =>{
   //dolgu rengi check deyilse border kvadrat cek eks halda bacground fill et
    if(!fillColor.checked){
      //mouse gostericisine gore daire yarat  
     return ctx.strokeRect(e.offsetX, e.offsetY,prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY,prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) =>{
    ctx.beginPath();//yeni yol yaratma
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY),2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0,  2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) =>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);//3bucaq yartma
    ctx.lineTo(e.offsetX, e.offsetY);//mouse gore ilk setir yaratma
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();//iki xetti avtomatik ucbucaga birlesdirme
    fillColor.checked ? ctx.fill() : ctx.stroke();//dolu ucbucaq etme
}
    

const startDraw = (e) => {
   isDrawing = true;
   prevMouseX = e.offsetX;
   prevMouseY = e.offsetY;
   ctx.beginPath();//yeni xett cekmek
   ctx.lineWidth = brushWidth;//firca qalinligi
   ctx.strokeStyle = selectedColor;//stroke kontur rengin deyisme
   ctx.fillStyle = selectedColor;//dolgunun rengin deyisme
   //canvas datalarini kopyala
   snapshot = ctx.getImageData(0,0, canvas.width, canvas.height);

}
const drawing = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0,0);//

    if(selectedTool === "brush" || selectedTool === "eraser"){
        //secilen alet silgi ise rengin ag et
        //eks teqdirde kontur rengin secilene ata
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;    
    ctx.lineTo(e.offsetX, e.offsetY);//mouse uyğun olaraq xətt yaratmaq
    ctx.stroke();//rəng ilə xətt çəkmək/doldurmaq
    }else if(selectedTool === "rectangle"){
        drawRect(e);
    }else if(selectedTool === "circle"){
        drawCircle(e);
    }else{
        drawTriangle(e);
    }
    
}
 toolBtns.forEach(btn =>{
    btn.addEventListener("click", () => {//click butun optionslara elave ediir
        //aktiv class əvvəlki seçimlərdən silmək və cari kliklənmiş seçimlərə əlavə etmək
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(btn.id);
    })

 });

 sizeSlider.addEventListener("change", ()  => brushWidth = sizeSlider.value);// deyeri brushsize kecirme
 

 colorBtns.forEach(btn =>{
    btn.addEventListener("click", () =>{//butun renglere clik elave etme
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        //secili btn backgroundunu secilen renge kecirme
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");

    });

 });


colorPicker.addEventListener("change", () =>{
    //secicinin reng deyerini deyisdirme
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();

});

clearCanvas.addEventListener("click", () =>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);//canvasin icin temizleme
    setCanvasBackground();

});

saveCanvas.addEventListener("click", () =>{
    const link = document.createElement("a")//yeni a elementi yarat
    link.download = `${Date.now()}.jpg`;//movcud verilenleri yuklemeye kecirme
    link.href = canvas.toDataURL();//datani hrefe deyerine kecirme
    link.click();//CLICK zamani sekli yukleme 

});
canvas.addEventListener("mousedown",startDraw);
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
