let products=[
    {
        productName:"مارس هيروس كونفيرتس",
        productPrice:225,
        productCode:672552411629,
        id:1,
    },
    {
        productName:" توفيفي توفي بالكيراميل",
        productPrice:195,
        productCode:4014400400007,
        id:2,
    },
    {
        productName:"لبان مانتوس توتي فروتي",
        productPrice:20,
        productCode:8990800015316,
        id:3,
    },
    {
        productName:"فريش فارم سجق",
        productPrice:200,
        productCode:410,
        id:4,
    },
]

let input=document.querySelector("input")
let itemAlreadeyAdded=[]
let counter=1;
let productNameHtml=document.querySelector(".product-name")
let productPriceHtml=document.querySelector(".product-price")
let productCodeHtml=document.querySelector(".product-code")
let addProduct=document.querySelector(".add-product")
let addItem=document.querySelector(".add-item")
let tableSection=document.querySelector(".table-section")
let priceCheckSection=document.querySelector(".price-check")
let clearInputBtn=document.querySelector(".clear-input")    
let deletePartOfInput=document.querySelector(".delete-part-of-input")    
let buttonsNumbers=document.querySelectorAll(".numbers-field button") 
let closeAlert=document.querySelector(".close-alert")
let bodyAlert=document.querySelector(".alert")
    // input.oninput=()=>{
    //     if(isNaN( typeof (parseInt(input.value))) ){
    //         input.value=""
    //     }
    //     console.log(parseInt(input.value))
    // }
console.log(buttonsNumbers)
buttonsNumbers.forEach((e)=>{
    e.onclick=()=>{
        input.value=input.value+e.innerHTML
    }
})
clearInputBtn.onclick=()=>{
    input.value=""
}
closeAlert.onclick=()=>{
    bodyAlert.classList.replace("show-flex","hide")
}
deletePartOfInput.onclick=()=>{
    let inputArr=[...input.value]
    inputArr.pop()
    input.value=inputArr.join("")
}
addProduct.onclick=()=>{
    let targetProduct=products.find((e)=>e.productCode=== parseInt(input.value))
    console.log(targetProduct)
    if(!targetProduct){
        bodyAlert.classList.replace("hide","show-flex")
    }
    productNameHtml.innerHTML=`product name:${targetProduct.productName}`
    productPriceHtml.innerHTML=`product price:${targetProduct.productPrice} EGP`
    productCodeHtml.innerHTML=`product code:${targetProduct.productCode}`
}
console.log(addItem )
    function TestArr(){
        console.log(itemAlreadeyAdded)
    }
addItem.onclick=()=>{
     TestArr()
    let targetProduct=products.find((e)=>e.productCode=== parseInt(input.value))
    tableSection.classList.replace("hide","show")
    if(priceCheckSection.classList.contains("show-flex")){
        priceCheckSection.classList.replace("show-flex","hide")

    }else{
        priceCheckSection.classList.add("hide")

    }
    if(targetProduct.productCode==""||targetProduct.productPrice==""||targetProduct.productName==""){
        alert("there is no product to show")
    }else{


        if(itemAlreadeyAdded.includes(targetProduct.productName)){
            let tr=document.getElementById(targetProduct.id)
            let tdQuantity=tr.querySelector(".quantity")
            tdQuantity.innerHTML=parseInt(tdQuantity.innerHTML ) + 1
        }else{
            let tr=document.createElement("tr");
            let tdNAme=document.createElement("td");
            let tdPrice=document.createElement("td");
            let tdCode=document.createElement("td");
            let tdQuantity=document.createElement("td");
            tdNAme.innerHTML=targetProduct.productName;
            tdPrice.innerHTML=targetProduct.productPrice + "EGP";
            tdCode.innerHTML=targetProduct.productCode;
            tdQuantity.innerHTML=counter
            tdQuantity.classList.add("quantity")
            tr.id=targetProduct.id
            itemAlreadeyAdded.push(tdNAme.innerHTML)
            tr.appendChild(tdNAme)
            tr.appendChild(tdPrice)
            tr.appendChild(tdQuantity)
            tr.appendChild(tdCode)
            document.querySelector("tbody").appendChild(tr)

        }
    }

}
function returnBack(){
    priceCheckSection.classList.replace("hide","show-flex")
    tableSection.classList.replace("show","hide")
}
returnBack()