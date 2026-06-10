let input = document.querySelector("input")
let itemAlreadeyAdded = []
let counter = 1;
let previousValue=0;
let productNameHtml = document.querySelector(".product-name")
let productPriceHtml = document.querySelector(".product-price")
let productCodeHtml = document.querySelector(".product-code")
let addProduct = document.querySelector(".add-product")
let addItem = document.querySelector(".add-item")
let tableSection = document.querySelector(".table-section")
let priceCheckSection = document.querySelector(".price-check")
let clearInputBtn = document.querySelector(".clear-input")    
let deletePartOfInput = document.querySelector(".delete-part-of-input")    
let buttonsNumbers = document.querySelectorAll(".numbers-field button") 
let closeAlert = document.querySelector(".close-alert")
let bodyAlert = document.querySelector(".alert")
let totals=document.querySelector(".total span")
let inpModifyQuan=document.querySelector(".modify-quantity")

function scannerWork(){
// ============================================================================
// 1. GLOBAL SYSTEM CORE CONFIGURATION STACK
// ============================================================================
let html5QrcodeInstance = null;
let isEngineTransitioning = false; // Guard flag to prevent multi-click crashes

function stopScanner() {
    if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
        html5QrcodeInstance.stop().then(() => {
            console.log("Scanner engine paused cleanly.");
        }).catch(err => console.error("Error shutting down camera: ", err));
    }
}

// ============================================================================
// 2. HARDWARE CORE INITIALIZATION LOGIC PIPELINE
// ============================================================================
function startBarcodeScanner() {
    if (typeof Html5Qrcode === "undefined") return;

    const productInput = document.getElementById('product-code-input');
    const scanBtn = document.getElementById('scan-btn');
    const scannerView = document.getElementById('scanner-view');

    // Create a single instance mapped directly inside our viewport container
    html5QrcodeInstance = new Html5Qrcode("scanner-view");

    const config = { 
        fps: 30, // 30 FPS for fast pixel scanning
        qrbox: (viewWidth, viewHeight) => {
            return { 
                width: Math.floor(viewWidth * 0.85), 
                height: 120 
            };
        },
        aspectRatio: 1.333333, // Standard 4:3 format to avoid code stretching
        formatsToSupport: [ 
            Html5QrcodeSupportedFormats.EAN_13, 
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_8
        ]
    };

    const runCamera = (mode) => {
        // Blocker guard: Stop execution if camera is already changing power states
        if (isEngineTransitioning || (html5QrcodeInstance && html5QrcodeInstance.isScanning)) {
            return;
        }

        isEngineTransitioning = true;

        if (scannerView) {
            scannerView.style.setProperty("display", "block", "important");
            scannerView.style.width = "100%";
            scannerView.style.height = "100%";
        }

        const videoConstraints = {
            facingMode: mode,
            advanced: [
                { focusMode: "continuous" },
                { exposureMode: "continuous" }
            ]
        };

        html5QrcodeInstance.start(
            videoConstraints, 
            config,
            (decodedText) => {
                console.log("Barcode Recognized: ", decodedText);
                if (productInput) {
                    productInput.value = decodedText;
                    productInput.dispatchEvent(new Event('input', { bubbles: true }));
                    productInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            },
            (err) => {
                if (scannerView && scannerView.style.display === "none") {
                    scannerView.style.setProperty("display", "block", "important");
                }
            }
        ).then(() => {
            isEngineTransitioning = false; // State transition completed successfully
        }).catch(err => {
            isEngineTransitioning = false; // Reset guard on error
            if (mode === "environment") {
                runCamera("user"); // Fallback to front camera if back lens is busy
            } else {
                console.warn("Camera stream blocked or unavailable.", err);
            }
        });
    };

    // Auto-boot camera immediately on page load
    runCamera("environment");

    // "Scan" button safely hooks into the camera state without re-triggering it if active
    if (scanBtn) {
        scanBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!html5QrcodeInstance.isScanning && !isEngineTransitioning) {
                runCamera("environment");
            } else {
                console.log("Scanner is already running actively. Request ignored safely.");
            }
        });
    }
}

// ============================================================================
// 3. HARDWARE INTEGRATED APP KEYPAD LAYER CAPTURE
// ============================================================================
function initializeKeypadMechanics() {
    const inputField = document.getElementById('product-code-input');
    if (!inputField) return;

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName !== 'BUTTON' || target.id === 'scan-btn') return;

        const buttonText = target.innerText.trim();

        if (buttonText === 'Clear' || buttonText === 'C') {
            inputField.value = '';
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (buttonText === 'Delete' || buttonText === 'X') {
            inputField.value = inputField.value.slice(0, -1);
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (!isNaN(buttonText) && buttonText !== '') {
            inputField.value += buttonText;
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializeKeypadMechanics();
    startBarcodeScanner();
});
}
scannerWork()
// تشغيل أزرار الأرقام
buttonsNumbers.forEach((e) => {
    e.onclick = () => {
        input.value = input.value + e.innerHTML.trim()
    }
})

clearInputBtn.onclick = () => {
    input.value = ""
}

closeAlert.onclick = () => {
    bodyAlert.classList.replace("show-flex", "hide")
}

deletePartOfInput.onclick = () => {
    let inputArr = [...input.value]
    inputArr.pop()
    input.value = inputArr.join("")
}

// زر الـ Check Product
addProduct.onclick = () => {
    // تصليح المقارنة (String ضد String)
    let targetProduct = cleanData.find((e) => e["Item number"].trim() === input.value.trim())
    
    if (!targetProduct) {
        bodyAlert.classList.replace("hide", "show-flex")
        return; // أوقف الوظيفة فوراً لو المنتج مش موجود عشان الكود ميضربش
    }
    
    productNameHtml.innerHTML = `product name: ${targetProduct["Product name"]}`
    productPriceHtml.innerHTML = `product price: ${targetProduct.Price} EGP`
    productCodeHtml.innerHTML = `product code: ${targetProduct["Item number"]}`
}

// زر الـ Add Item للجدول
addItem.onclick = () => {
    let targetProduct = cleanData.find((e) => e["Item number"].trim() === input.value.trim())
    
    if (!targetProduct) {
        alert("برجاء إدخال كود منتج صحيح أولاً");
        return;
    }

    tableSection.classList.replace("hide", "show")
    priceCheckSection.classList.replace("show-flex", "hide")

    // التأكد من أن المنتج مضاف مسبقاً (استخدمنا الاسم كمقياس)
    if (itemAlreadeyAdded.includes(targetProduct["Product name"])) {
        // استخدمنا Item number كـ ID للـ tr
        let tr = document.getElementById(targetProduct["Item number"].trim())
        if (tr) {
            let tdQuantity = tr.querySelector(".quantity")
            tdQuantity.innerHTML = parseFloat(tdQuantity.innerHTML) + 1
            totals.innerHTML=parseFloat(totals.innerHTML)+parseFloat(targetProduct.Price) 
        }
    } else {
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        let tdPrice = document.createElement("td");
        let tdCode = document.createElement("td");
        let tdQuantity = document.createElement("td");
        let tdDeleteRaw = document.createElement("td");
        let btnDeleteRaw = document.createElement("button");
        let tdQuantityValue = document.createElement("p");
        let btnQuantityInc = document.createElement("button");
        let btnQuantityDec = document.createElement("button");
        let btnSetQuantity = document.createElement("button");
        tdDeleteRaw.appendChild(btnDeleteRaw)        
        btnSetQuantity.innerHTML="Set Quantity"
        btnSetQuantity.onclick=()=>{
            if(tdQuantityValue.dataset.situation=="true"){
                if(typeof parseInt( inpModifyQuan.value)=="number"){
                    console.log(inpModifyQuan)
                }
                tdQuantityValue.innerHTML=inpModifyQuan.value
                console.log(tdQuantityValue.innerHTML)
                console.log(inpModifyQuan.value)
                totals.innerHTML=parseFloat(totals.innerHTML)-(parseFloat(tdPrice.innerHTML)*parseInt(previousValue))+parseFloat(tdPrice.innerHTML)
                totals.innerHTML=parseFloat( totals.innerHTML).toFixed(2)                
            }

            tdQuantityValue.dataset.situation="true"
            // we will add the same condition here
            tdQuantityValue.innerHTML=inpModifyQuan.value
            previousValue=inpModifyQuan.value
            totals.innerHTML=parseFloat(totals.innerHTML)+(parseFloat(tdPrice.innerHTML)*parseInt(inpModifyQuan.value)) -parseFloat(tdPrice.innerHTML)
            totals.innerHTML=parseFloat( totals.innerHTML).toFixed(2)
            inpModifyQuan.value=""
        }
        btnDeleteRaw.innerHTML="Delete"
        btnDeleteRaw.style.cssText="background-color: rgb(221, 15, 15);border: 1px solid black;width: 50px;height: 35px;display: flex;justify-content: center;align-items: center;border-radius: 7px;"
        btnDeleteRaw.onclick=()=>{
            let index=itemAlreadeyAdded.indexOf(targetProduct["Product name"])
            itemAlreadeyAdded.splice(index,1)
            totals.innerHTML=parseFloat(totals.innerHTML)- parseFloat(tdQuantityValue.innerHTML)*parseFloat(tdPrice.innerHTML)
            totals.innerHTML=parseFloat(totals.innerHTML).toFixed(2)
            document.querySelector("tbody").removeChild(tr)
        }
        tdName.innerHTML = targetProduct["Product name"];
        tdPrice.innerHTML = targetProduct.Price + " EGP";
        tdPrice.classList.add("price")
        if(totals.innerHTML=="0"){
            totals.innerHTML =targetProduct.Price
            totals.innerHTML=parseFloat(totals.innerHTML).toFixed(2)

        }else{
            console.log(parseFloat(totals.innerHTML))
            console.log(targetProduct.Price)
            totals.innerHTML =`${parseFloat(totals.innerHTML)+parseFloat(targetProduct.Price)}`
            totals.innerHTML=parseFloat(totals.innerHTML).toFixed(2)
        
        }
        tdCode.innerHTML = targetProduct["Item number"];
        tdQuantityValue.innerHTML = counter;
        tdQuantityValue.classList.add("quantity")
        // tdQuantity.style.cssText="display:grid;grid-template-columns: repeat(3,1fr);"
        btnQuantityDec.innerHTML="-"
        btnQuantityInc.innerHTML="+"
        // تعيين الـ id للسطر برقم المنتج
        tr.id = targetProduct["Item number"].trim();
        btnQuantityDec.onclick=()=>{

            if(tdQuantityValue.innerHTML==1){
                alert("it can`t be in negative")
                console.log(tdQuantityValue.innerHTML)
            }else{
                let fatherOfelement=tdQuantity.parentElement
                totals.innerHTML=parseFloat(totals.innerHTML)-parseFloat(fatherOfelement.querySelector(".price").innerHTML)
                totals.innerHTML=parseFloat(totals.innerHTML).toFixed(2)

                console.log(typeof parseFloat(totals.innerHTML))
                console.log(typeof parseFloat(fatherOfelement.querySelector(".price").innerHTML))
                tdQuantityValue.innerHTML=parseFloat(tdQuantityValue.innerHTML)- 1
            }
        }
        btnQuantityInc.onclick=()=>{
                let fatherOfelement=tdQuantity.parentElement
                totals.innerHTML=parseFloat(totals.innerHTML)+parseFloat(fatherOfelement.querySelector(".price").innerHTML)
                totals.innerHTML=parseFloat(totals.innerHTML).toFixed(2)
                tdQuantityValue.innerHTML=parseFloat(tdQuantityValue.innerHTML) + 1
        }
        itemAlreadeyAdded.push(tdName.innerHTML)
        tdQuantity.appendChild(btnQuantityDec)
        tdQuantity.appendChild(tdQuantityValue)
        tdQuantity.appendChild(btnQuantityInc)
        tdQuantity.appendChild(btnSetQuantity)
        tr.appendChild(tdName)
        tr.appendChild(tdPrice)
        tr.appendChild(tdQuantity)
        tr.appendChild(tdCode)
        tr.appendChild(tdDeleteRaw)
        
        document.querySelector("tbody").appendChild(tr)
    }
}

function returnBack() {
    priceCheckSection.classList.replace("hide", "show-flex")
    tableSection.classList.replace("show", "hide")
}
