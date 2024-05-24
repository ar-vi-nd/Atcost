let productlist = document.getElementById("container")
console.log(container)

let load = document.getElementById("load")

load.addEventListener("click",function(){
    getproddata(showproddata);
})


function getproddata(){
    let xml = new XMLHttpRequest()
    xml.open("GET","/getdetails")
    xml.send()
    xml.addEventListener("load",function(){
        console.log(xml.responseText)
        let data = JSON.parse(xml.responseText)
        console.log(data[data.length-1])

        if(data[data.length-1]==0){
            load.setAttribute("style","display:none")
        }

        for(let i=0;i<=data.length-2 ; i++){
            console.log(data[i])
            showproddata(data[i])

        }
    })
}

function showproddata(element){

    let prod = document.createElement("div")
    prod.classList.add("prod")
    prod.setAttribute("id",element.id)
    let prodimg = document.createElement("div")
    let prodet = document.createElement("div")
    prodet.classList.add("prodet")
    let prodprice = document.createElement("div")
    let prodname = document.createElement("div")
    let prodbut = document.createElement("div")
    let atc = document.createElement("div")

    let imag = document.createElement("img")
    imag.setAttribute("src",`${element.image}`)
    imag.classList.add("size")
    prodimg.appendChild(imag)

    prodname.innerHTML = element.name;
    prodprice.innerHTML ="Price: "+ element.price

    let button = document.createElement("button")
    button.innerHTML = "More Details"
    button.setAttribute("class","btn btn-info")
    // button.classList.add("btn btn-info")

    let addtocart = document.createElement("button")
    addtocart.innerHTML = "Add to Cart"

    let message= document.createElement("div")
    message.setAttribute('class','message')

    prodbut.appendChild(button)
    atc.appendChild(addtocart)
    prodet.appendChild(prodname)
    prodet.appendChild(prodprice)
    prodet.appendChild(prodbut)
    prodet.appendChild(atc)
    prodet.appendChild(message)
    prod.appendChild(prodimg)
    prod.appendChild(prodet)
    container.appendChild(prod)
    


    // modal from here

    let modal=document.createElement('div');
    modal.setAttribute('class','modal');
let modalin=document.createElement('div');
modalin.setAttribute('class','modal-content');
let modspan=document.createElement('span');
modspan.setAttribute('class','close');
modspan.innerHTML="&#10005;";
let modmod = document.createElement("div")
modmod.classList.add("modmod")

let modmo = document.createElement("div")
modmo.classList.add("modmo")

let modimg = document.createElement("div")


let img2=document.createElement('img');
img2.setAttribute('src',`${element.image}`);
img2.setAttribute('class','img2');
img2.classList.add('size');

modimg.appendChild(img2)

let mod1=document.createElement('span');
mod1.innerText=`Name : ${element.name}`;
let mod2=document.createElement('span');
mod2.innerText=`Description : ${element.description}`;
let mod3=document.createElement('span');
mod3.innerText=`Category : ${element.category}`;
let mod4=document.createElement('span');
mod4.innerText=`Price : ${element.price}`;
modalin.appendChild(modmod);
modalin.appendChild(modmo);
modmod.appendChild(modimg);
modmo.appendChild(mod1);
modmo.appendChild(mod2);
modmo.appendChild(mod3);
modmo.appendChild(mod4);
modal.appendChild(modalin);
modalin.appendChild(modspan);

prod.appendChild(modal)

button.setAttribute('onclick','detail(this.parentNode.parentNode.parentNode)');
addtocart.setAttribute("onclick","addtocartfn(this.parentNode.parentNode.parentNode)")

}



getproddata(showproddata);


function detail(parent){

//     let id = parseInt(parent.id) 
//     console.log(parent)
//     console.log(parent.id)
//     console.log(id)

//     let modal = document.getElementsByClassName("modal")[id-1];
//     console.log(modal)

// // Get the button that opens the modal
// let btn = parent.children[1].children[2].children[0];

// // Get the <span> element that closes the modal
// let span = document.getElementsByClassName("close")[id-1];

// // When the user clicks the button, open the modal 
//   modal.style.display = "block";

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }

let id = parseInt(parent.id)
console.log(parent)
console.log(parent.id)
console.log(id)

let modal = document.getElementsByClassName("modal")
// let modal = document.getElementsByClassName("modal")[id-1];
console.log(modal)

for (let i = 0; i < modal.length; i++) {
    console.log(modal[i].parentNode)

    if (modal[i].parentNode.id == id) {

        let btn = modal[i].parentNode.children[1].children[2].children[0];
        let span = modal[i].children[0].children[2]
        modal[i].style.display = "block"
        span.onclick = function () {
            modal[i].style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal[i]) {
                modal[i].style.display = "none";
            }
        }

    }
}

}


function addtocartfn(parent){

  let data ={itemid:parent.id}


  let xml = new XMLHttpRequest()
  xml.open("POST","/addtocart")
  xml.setRequestHeader("content-type", "application/json");
  xml.send(JSON.stringify(data))
  xml.addEventListener("load",function(){
    if(xml.status==200){
      console.log(xml.responseText)
      let message =  parent.children[1].children[4]
      console.log(message)
      if(xml.responseText == 0){
       message.innerHTML = "Added to cart"
       message.style.display = "block";
        message.style.background = "#4CAF50";
        setTimeout(() => {
          message.style.color = "#000000";
          message.style.display = "none"
  
      }, 2900)
      }
      else if(xml.responseText == 1){
        console.log("yanna")
       message.innerHTML = "Already in cart"
       message.style.display = "block";
        message.style.background = "#4CAF50";
        setTimeout(() => {
          message.style.color = "#000000";
          message.style.display = "none"
  
      }, 2900)
      }


    }
  })


}





