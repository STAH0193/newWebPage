var modal = document.getElementById("myModal");

var img = document.getElementById("eliReel")
var modalImg = document.getElementById("eliModal");

img.onclick = function() {
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.lastChild;
}

var span = document.getElementsByClassName("close") [0];

span.onclick = function() {
    modal.style.display = "none";
}