function setDescr() {
	var x = document.getElementById("hex_value");
	var y = document.getElementsByClassName("proj-color");
	x.innerHTML = y[0].firstChild.innerHTML;
	console.log(y[0].innerHTML); 
}

setDescr();