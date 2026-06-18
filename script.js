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
// Global instance tracker
let html5QrcodeInstance = null;

// Safe stop function
function stopScanner() {
    if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
        html5QrcodeInstance.stop().then(() => {
            console.log("Camera successfully stopped.");
            document.getElementById('scanner-wrapper').style.display = 'none';
        }).catch(err => console.error("Error stopping camera: ", err));
    }
}

// Main Scanner Logic
function startBarcodeScanner() {
    // 1. CONNECTION VERIFICATION CHECK
    // If the library script link above failed, this safe-check catches it instantly
    if (typeof Html5Qrcode === "undefined") {
        console.error("Connection Error: The Html5Qrcode library is not ready yet!");
        alert("Scanner library connection failed. Please refresh the page or check your internet connection.");
        return;
    }

    console.log("Connection Verified! Securely linking custom script to the library.");

    const scanBtn = document.getElementById('scan-btn');
    const scannerWrapper = document.getElementById('scanner-wrapper');

    if (!scanBtn) return;

    scanBtn.addEventListener('click', () => {
        // Prevent launching duplicate background camera loops
        if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
            console.warn("Scanner is already actively running.");
            return;
        }

        // Show your layout container framework dynamically
        if (scannerWrapper) scannerWrapper.style.display = 'block';

        // Connect the instance directly to your HTML target view element ID
        html5QrcodeInstance = new Html5Qrcode("scanner-view");

        // Optimized rectangular configuration for retail codes
        // 🎯 OPTIMIZATION: Added videoConstraints configuration directly into the object mapping.
        // Loaded QR_CODE into format array strictly to recognize it and catch it in the callback filter.
        
        /////
            console.log("optimize")
        //    line important need some optimization
        /////
        const config = { 
            fps: 20, 
            qrbox: { width: 1280, height: 720 },
            formatsToSupport: [ 
                Html5QrcodeSupportedFormats.EAN_13, 
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.QR_CODE
            ],
            videoConstraints: {
                facingMode: "environment",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };
        //////
        console.log("end optimize")
        ///////
        // Fire the live streaming video feed
        html5QrcodeInstance.start(
            { facingMode: "environment" }, // Keeps your stable single-key parameter object safe
            config,
            (decodedText, decodedResult) => {
                
                // 🎯 OPTIMIZATION: GOOGLE LENS EXCLUSIVE FILTER
                // If it evaluates a QR code, it instantly drops out of the function without populating your field
                if (decodedResult && decodedResult.result && decodedResult.result.format) {
                    const formatName = decodedResult.result.format.formatName;
                    if (formatName === "QR_CODE") {
                        console.log("QR code frame dropped and ignored successfully.");
                        return; 
                    }
                }

                // Success: Code recognized inside the container frame!
                console.log("Scanned Item Code: ", decodedText);
                
                const inputField = document.querySelector('input[placeholder="write product code"]');
                if (inputField) {
                    inputField.value = decodedText;
                    // Trigger events so Allosh price data updates instantly
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    inputField.dispatchEvent(new Event('change', { bubbles: true }));
                }
                stopScanner();
            },
            (errorMessage) => { /* Scanning continuous image frames... */ }
        ).catch(err => {
            console.warn("Rear camera failed, trying front/default webcam fallback...", err);
            
            // Apply camera configurations to user-facing lens environment fallback seamlessly
            config.videoConstraints.facingMode = "user";

            // Safe fallback attempt for laptop browser testing environments
            html5QrcodeInstance.start(
                { facingMode: "user" }, 
                config,
                (decodedText, decodedResult) => {
                    // Check and filter QR codes on front/laptop test camera loops too
                    if (decodedResult && decodedResult.result && decodedResult.result.format) {
                        if (decodedResult.result.format.formatName === "QR_CODE") {
                            return;
                        }
                    }

                    const inputField = document.querySelector('input[placeholder="write product code"]');
                    if (inputField) {
                        inputField.value = decodedText;
                        inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    stopScanner();
                },
                (err2) => {}
            ).catch(finalErr => {
                console.error("Camera connection completely blocked: ", finalErr);
            });
        });
    });

    // Attach stop handler to cancel button safely
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', stopScanner);
    }
}

// Run the script securely after the browser DOM structure renders completely
document.addEventListener("DOMContentLoaded", () => {
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
            totals.innerHTML=parseFloat(totals.innerHTML)+(parseFloat(targetProduct.Price)*parseFloat(tdQuantity.innerHTML)) 
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
                totals.innerHTML=parseFloat(totals.innerHTML)-(parseFloat(tdPrice.innerHTML)*parseInt(previousValue))+(parseFloat(tdPrice.innerHTML)*parseFloat(tdQuantity.innerHTML))
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
