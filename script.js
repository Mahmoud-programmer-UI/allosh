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
    // 1. Declare the scanner variable globally so all functions can access it
let html5QrcodeInstance = null;

// 2. Define the Stop Scanner function globally
function stopScanner() {
    if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
        html5QrcodeInstance.stop().then(() => {
            console.log("Camera stopped successfully.");
            // Hide your container modal here if necessary
            // document.getElementById('scanner-modal').style.display = 'none';
        }).catch(err => {
            console.error("Error stopping the camera: ", err);
        });
    }
}

// 3. Main function to initialize all event listeners
function initializeScannerApp() {
    const scanBtn = document.getElementById('scan-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const scannerView = document.getElementById('scanner-view');

    // Safety checks: Make sure the HTML elements actually exist on the page first
    if (!scanBtn || !scannerView) {
        console.error("Scanner elements missing in HTML. Ensure IDs 'scan-btn' and 'scanner-view' exist.");
        return;
    }

    // Attach the cancel button event listener securely
    if (cancelBtn) {
        cancelBtn.addEventListener('click', stopScanner);
    }

    // Attach the main scan button event listener
    scanBtn.addEventListener('click', () => {
        // Prevent duplicate instances if clicked multiple times
        if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
            console.warn("Scanner is already running.");
            return;
        }

        // Initialize the library instance on your element ID
        html5QrcodeInstance = new Html5Qrcode("scanner-view");

        // Configuration optimized for long linear product barcodes
        const config = { 
            fps: 15, 
            qrbox: { width: 280, height: 150 } 
        };

        // Success callback helper to avoid code duplication inside fallbacks
        const handleSuccess = (decodedText) => {
            console.log("Scanned Code: ", decodedText);
            
            // Find your existing text input field
            const inputField = document.querySelector('input[placeholder="write product code"]');
            if (inputField) {
                inputField.value = decodedText;
                
                // Crucial for frameworks: fire input event so your search code registers the change
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
                inputField.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                console.error("Product code input field not found!");
            }
            
            stopScanner();
        };

        // Start scanning: Try back camera first (environment)
        html5QrcodeInstance.start(
            { facingMode: "environment" }, 
            config,
            handleSuccess,
            (errorMessage) => { /* Scanning frame-by-frame... */ }
        ).catch(err => {
            // Fallback: Try desktop webcam/front camera if back camera fails
            console.warn("Environment camera failed, trying fallback webcam...", err);
            
            html5QrcodeInstance.start(
                { facingMode: "user" }, 
                config,
                handleSuccess,
                (err2) => {}
            ).catch(finalErr => {
                alert("Camera access denied or unavailable. Please check your browser/site permissions.");
                console.error("Camera failed entirely: ", finalErr);
            });
        });
    });
}

// 4. Run the initialization script
initializeScannerApp();
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