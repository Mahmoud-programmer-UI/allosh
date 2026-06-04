let input = document.querySelector("input")
let itemAlreadeyAdded = []
let counter = 1;

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
function scannerWork(){
// ============================================================================
// 1. GLOBAL SCOPE DECLARATIONS
// ============================================================================
let html5QrcodeInstance = null;

document.addEventListener("DOMContentLoaded", () => {
    initializeScannerApp();
});

// ============================================================================
// 2. SAFE STOP SCANNER FUNCTION
// ============================================================================
function stopScanner() {
    if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
        html5QrcodeInstance.stop().then(() => {
            console.log("Camera engine safely stopped.");
        }).catch(err => {
            console.error("Failed to turn off camera stream: ", err);
        });
    }
}

// ============================================================================
// 3. MAIN SCANNER CORE MODULE
// ============================================================================
function initializeScannerApp() {
    const scanBtn = document.getElementById('scan-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const scannerView = document.getElementById('scanner-view');

    if (!scanBtn || !scannerView) {
        console.error("Missing elements. Ensure 'scan-btn' and 'scanner-view' exist in HTML.");
        return;
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', stopScanner);
    }

    scanBtn.addEventListener('click', () => {
        // Prevent duplicate initializations
        if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
            console.warn("Scanner is already running.");
            return;
        }

        html5QrcodeInstance = new Html5Qrcode("scanner-view");

        // CLEAN CONFIGURATION (Passing video constraints safely right here)
        const config = { 
            fps: 20, 
            qrbox: { width: 320, height: 145 },
            videoConstraints: {
                facingMode: "environment",
                focusMode: "continuous" // Direct, built-in camera autofocus option
            },
            formatsToSupport: [ 
                Html5QrcodeSupportedFormats.EAN_13, 
                Html5QrcodeSupportedFormats.UPC_A,   
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.CODE_128
            ]
        };

        const handleSuccess = (decodedText) => {
            console.log("Barcode Recognized: ", decodedText);
            
            const inputField = document.querySelector('input[placeholder="write product code"]');
            if (inputField) {
                inputField.value = decodedText;
                
                // Fire standard events so your price matching script picks it up instantly
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
                inputField.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            stopScanner();
        };

        // Start scanning using the unified config object
        html5QrcodeInstance.start(
            { facingMode: "environment" }, 
            config,
            handleSuccess,
            (errorMessage) => { /* Scanning... */ }
        ).catch(err => {
            console.warn("Environment camera failed. Testing fallback mode...", err);
            
            // Re-attempt using laptop webcam safely without forcing a dirty clear
            html5QrcodeInstance.start(
                { facingMode: "user" }, 
                config,
                handleSuccess,
                (err2) => {}
            ).catch(finalErr => {
                alert("Camera Initialization Failed. Please ensure site permissions are granted.");
                console.error("Hardware streaming crash log: ", finalErr);
            });
        });
    });
}
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
            tdQuantity.innerHTML = parseInt(tdQuantity.innerHTML) + 1
        }
    } else {
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        let tdPrice = document.createElement("td");
        let tdCode = document.createElement("td");
        let tdQuantity = document.createElement("td");
        
        tdName.innerHTML = targetProduct["Product name"];
        tdPrice.innerHTML = targetProduct.Price + " EGP";
        tdCode.innerHTML = targetProduct["Item number"];
        tdQuantity.innerHTML = counter;
        tdQuantity.classList.add("quantity")
        
        // تعيين الـ id للسطر برقم المنتج
        tr.id = targetProduct["Item number"].trim();
        
        itemAlreadeyAdded.push(tdName.innerHTML)
        
        tr.appendChild(tdName)
        tr.appendChild(tdPrice)
        tr.appendChild(tdQuantity)
        tr.appendChild(tdCode)
        
        document.querySelector("tbody").appendChild(tr)
    }
    input.value = ""; // تصفير الإدخال بعد الإضافة
}

function returnBack() {
    priceCheckSection.classList.replace("hide", "show-flex")
    tableSection.classList.replace("show", "hide")
}