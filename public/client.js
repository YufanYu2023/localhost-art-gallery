let mongo = require('mongodb');

//get text values and add artwork
function addArt(){

    let name = document.getElementById("name").value;
    let artist = document.getElementById("artist").value;
    let category = document.getElementById("category").value;
    let medium = document.getElementById("medium").value;
    let description = document.getElementById("description").value;
    let image = document.getElementById("image").value;
    let newArt;

    if(name != "" && artist!=""&&category!="" && medium !="" && description!=""&&image!=""){

        newArt = {"name":name, "artist": artist, "category":category, "medium": medium, "description":description, "image":image};

        //clear fields
        document.getElementById("name").value = "";
        document.getElementById("artist").value = "";
        document.getElementById("category").value = "";
        document.getElementById("medium").value = "";
        document.getElementById("description").value = "";
        document.getElementById("image").value = "";
    }else{
        alert("please don't leave blank");
    }

    console.log(newArt);

    //post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			alert("new artwork added");
		}
	}

	//Send a POST request to the server containing the recipe data
	req.open("POST", `/addArt`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(newArt));    
}

//add like to a artwork
function likeArt(){
    let name = document.getElementById("name").textContent;
    let likeNum = document.getElementById("likeNum").textContent;
    let data = [];
    data.push(name);
    data.push(likeNum);

    //post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			document.getElementById("likeNum").innerHTML = parseInt(likeNum)+1;
		}
	}

	//Send a POST request to the server containing the recipe data
	req.open("POST", `/addLike`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data));   
}

//send review to server
function addReview(){

    let name = document.getElementById("name").textContent;
    let review = document.getElementById("review").value;
    let reviews = document.getElementById("reviews").innerHTML;
    console.log(review);

    let data = [];
    data.push(name);
    data.push(review);

    //post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			document.getElementById("reviews").innerHTML = `${reviews}<br>${review}`;
		}
	}

	//Send a POST request to the server containing the recipe data
	req.open("POST", `/addReview`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data));  
}

function getLogin(){
    let username = document.getElementById("lUserName").value;
    let password = document.getElementById("lPassword").value;

    let data =[];
    data.push(username);
    data.push(password);

    //post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            loadProfile();
			//document.getElementById("reviews").innerHTML = `${reviews}<br>${review}`;
		}
	}

	//Send a POST request to the server containing the recipe data
	req.open("POST", `/login`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data));  
}

function loadProfile(){
    //get request
    window.location = '/myProfile' ;
}

function logout(){
    //post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            window.location = '/' ;
		}
	}

	//Send a POST request to the server containing the recipe data
	req.open("GET", `/logout`);
    req.setRequestHeader("Content-Type", "application/json");
	req.send();  
}

function getRegister(){
    let username = document.getElementById("rUserName").value;
    let password = document.getElementById("rPassword").value;

    let data =[];
    data.push(username);
    data.push(password);

    //post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			//document.getElementById("reviews").innerHTML = `${reviews}<br>${review}`;
            alert("Registered");;
		}else if(this.status==208){
            alert("user already exists");
        }
	}

	//Send a POST request to the server containing the recipe data
	req.open("POST", `/register`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data));  
}

function upgrade(){
    //post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			//document.getElementById("reviews").innerHTML = `${reviews}<br>${review}`;
            window.location = '/myProfile' ;
		}
	}

	//Send a POST request to the server containing the recipe data
	req.open("GET", `/myProfile/upgrade`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send();  
}

function cancelUpgrade(){
    //post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			//document.getElementById("reviews").innerHTML = `${reviews}<br>${review}`;
            window.location = '/myProfile' ;
		}
	}

	//Send a POST request to the server containing the recipe data
	req.open("GET", `/myProfile/cancelUpgrade`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send();     
}

function addWorkshop(){
    let tilte = document.getElementById("title").value;
    data = [tilte]
    //post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			//document.getElementById("reviews").innerHTML = `${reviews}<br>${review}`;
            alert("workshop added");
		}
	}

	//Send a POST request to the server containing the recipe data
	req.open("POST", `/addWorkshop`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data));  
}

function follow(){

    let name = document.getElementById("name").textContent;
    let data = [name];

    //post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            alert(`you followed ${name}`);
		}
	}

	//Send a POST request to the server containing the recipe data
	req.open("POST", `/follow`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data));   
}

function registerWorkshop(){
    let tilte = document.getElementById("title").textContent;
    let data = [tilte];

    //post request
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            alert(`you registered ${tilte}`);
		}
	}

	//Send a POST request to the server containing the recipe data
	req.open("POST", `/registerWorkshop`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data));  
}

function searchByName(){
	let name = document.getElementById("artName").value;

	window.location = `/myProfile/artwork/art/${name}` ;
}

function searchByArtist(){
	
	let name = document.getElementById("artist").value;

	window.location = `/myProfile/artwork/artists/${name}` ;
}

function searchByCategory(){

	let name = document.getElementById("category").value;

	window.location = `/myProfile/artwork/categories/${name}` ;
}