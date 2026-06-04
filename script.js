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
        // Make sure to include the library in your head: <script src="https://unpkg.com/html5-qrcode"></script>

    const scanBtn = document.getElementById('scan-btn');
    const closeScannerBtn = document.getElementById('close-scanner-btn');
    const scannerModal = document.getElementById('scanner-modal');
    const productInput = document.getElementById('product-code-input'); // Your input box

    let html5Qrcode; // Will hold our scanner instance

    // Open Scanner
    scanBtn.addEventListener('click', () => {
        scannerModal.style.display = 'block';
        
        // Initialize scanner inside the 'scanner-view' div
        html5Qrcode = new Html5Qrcode("scanner-view");
        
        const config = { fps: 15, qrbox: { width: 250, height: 120 } }; // Rectangle optimized for barcodes
        
        html5Qrcode.start(
            { facingMode: "environment" }, // Uses rear camera on phones
            config,
            (decodedText) => {
                // SUCCESS: This is exactly what you wanted!
                // Put the value right into your input field variable
                productInput.value = decodedText;
                
                // --- CRITICAL STEP ---
                // Trigger your existing price-check function here automatically 
                // e.g., yourExistingLookupFunction(decodedText);
                
                // Stop camera and hide modal
                stopScanner();
            },
            (errorMessage) => {
                // Parsing... scanning frame by frame
            }
        ).catch(err => console.error("Camera access failed", err));
    });

    // Close Scanner Function
    function stopScanner() {
        if (html5Qrcode) {
            html5Qrcode.stop().then(() => {
                scannerModal.style.display = 'none';
            }).catch(err => console.error(err));
        } else {
            scannerModal.style.display = 'none';
        }
    }

    closeScannerBtn.addEventListener('click', stopScanner);
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