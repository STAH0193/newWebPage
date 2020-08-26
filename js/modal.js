var modal = document.getElementById("myModalOne");
var imgOne = document.getElementById("sigFlowReel");
var modalImg = document.getElementById("sigFlowModal");

imgOne.onclick = function() {
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.lastChild;
}

var span = document.getElementsByClassName("close") [0];

span.onclick = function() {
    modal.style.display = "none";
}

/**ELI PAGE */
var modalTwo = document.getElementById("myModalTwo");
var imgTwo = document.getElementById("eliReel");
var modalImgTwo = document.getElementById("eliModal");

imgTwo.onclick = function() {
    modalTwo.style.display = "block";
    modalImgTwo.src = this.src;
    captionTextTwo.innerHTML = this.lastChild;
}

var span = document.getElementsByClassName("closeTwo") [0];

span.onclick = function() {
    modalTwo.style.display = "none";
}

/** LIL MAYOR */
var modalThree = document.getElementById("myModalThree");
var imgThree = document.getElementById("bmb");
var modalImgThree = document.getElementById("bmbModal");

imgThree.onclick = function() {
    modalThree.style.display = "block";
    modalImgThree.src = this.src;
    captionTextThree.innerHTML = this.lastChild;
}

var span = document.getElementsByClassName("closeThree") [0];

span.onclick = function() {
    modalThree.style.display = "none";
}

/** WEB AUDIO */
var modalFour = document.getElementById("myModalFour");
var imgFour = document.getElementById("webAudioReel");
var modalImgFour = document.getElementById("audioModal");

imgFour.onclick = function() {
    modalFour.style.display = "block";
    modalImgFour.src = this.src;
    captionTextFour.innerHTML = this.lastChild;
}

var span = document.getElementsByClassName("closeFour") [0];

span.onclick = function() {
    modalFour.style.display = "none";
}

/** POSTER ONE */
var modalFive = document.getElementById("myModalFive");
var imgFive = document.getElementById("flyerOne");
var modalImgFive = document.getElementById("flyerOneModal");

imgFive.onclick = function() {
    modalFive.style.display = "block";
    modalImgFive.src = this.src;
    captionTextFive.innerHTML = this.lastChild;
}

var span = document.getElementsByClassName("closeFive") [0];

span.onclick = function() {
    modalFive.style.display = "none";
}

/** Field Rec */
var modalSev = document.getElementById("myModalSev");
var imgSev = document.getElementById("fieldRec");
var modalImgSev = document.getElementById("fieldRecModal");

imgSev.onclick = function() {
    modalSev.style.display = "block";
    modalImgSev.src = this.src;
    captionTextSev.innerHTML = this.lastChild;
}

var span = document.getElementsByClassName("closeSev") [0];

span.onclick = function() {
    modalSev.style.display = "none";
}

/** BMB One */
var modalEgg= document.getElementById("myModalEgg");
var imgEgg = document.getElementById("BMBone");
var modalImgEgg = document.getElementById("BMBmodal");

imgEgg.onclick = function() {
    modalEgg.style.display = "block";
    modalImgEgg.src = this.src;
    captionTextEgg.innerHTML = this.lastChild;
}

var span = document.getElementsByClassName("closeEgg") [0];

span.onclick = function() {
    modalEgg.style.display = "none";
}

