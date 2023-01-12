const express = require('express');
const pug = require("pug");
const session = require('express-session');

let app = express();
app.use(express.static("public"));


let userid;
//Body parsers
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session(
    { 
      secret: 'top secret key',
      resave: true,
      saveUninitialized: false,
      store: userid 
    })
);

//Database variables
let mongo = require('mongodb');
const { application } = require('express');
const e = require('express');
const { name } = require('pug/lib');
let MongoClient = mongo.MongoClient;
let db;
let gallery;
let categoryArts;
let mediumArts;

//2 db colletions one for users one for artworks

app.get('/myProfile/artwork/categories/:id',getCategory);
app.get('/myProfile/artwork/artists/:name', getArtist);
app.get('/myProfile/artwork/art/:name', getArt);
app.get('/myProfile/artwork/mediums/:id', getMediums);
app.get('/myProfile/addWorkshop', addWorkshop);
app.get('/myProfile/addArt', addArt);
app.get('/myProfile/upgrade',upgrade);
app.get('/myProfile/cancelUpgrade',cancelUpgrade);
app.get('/myProfile/profiles/:name',loadsingleProfile);
app.get('/myProfile/profiles',loadUserProfiles);
app.get('/myProfile',loadProflie);
app.get('/logout',logout);
app.post('/addArt', addArtTodb);
app.post('/addLike',addLike);
app.post('/addReview',addReview);
app.post('/follow',follow);
app.post('/registerWorkshop',registerWorkshop);
app.post('/login',login);
app.post('/register',register);
app.post('/addWorkshop',addWorkshopTodb);


//default login page
app.get('/', (request, response) => {
    
    response.write(pug.renderFile("./views/home.pug",{}))
    response.status(200);
    response.end();    

})

//render all the art work
app.get('/myProfile/artwork', (request, response) => { 
    getGallery()
	response.write(pug.renderFile("./views/artworks.pug",{gallery}))
    response.status(200);
	response.end();
})

function login(request, response){
    let data = request.body;
    console.log(data);

    db.collection("users").findOne({name: data[0]},function(err,result,next){
        if(err) throw err;
        console.log(result);
        if(result.name === data[0] && result.password === data[1]){
            console.log("login succuess");

            if(request.session.store === undefined){
                request.session.store = data[0];
            }else{
                response.write("can't login right now");
            }
            
            response.status(200);
            response.end();
        }
    })
}

function upgrade(request, response){

    db.collection("users").updateOne({name: request.session.store},{$set:{isArtist:true}},function(err,result){
        response.status(200);
        response.end();
    })
}

function cancelUpgrade(request, response){

    db.collection("users").updateOne({name: request.session.store},{$set:{isArtist:false}},function(err,result){
        response.status(200);
        response.end();
    })
}

function logout(request, response){
    request.session.store = undefined;
    response.status(200);
    response.end();
}

function loadProflie(request, response){

    db.collection("users").findOne({name: request.session.store},function(err,result){
        if(result.isArtist == true){
            response.write(pug.renderFile("./views/myaProfile.pug",{result}))
            //console.log(result);
            response.status(200);
            response.end();
        }else{
            response.write(pug.renderFile("./views/mypProfile.pug",{result}))
            //console.log(result);
            response.status(200);
            response.end();
        }

    })
}

function loadsingleProfile(request, response){
    let name = request.params.name;

    db.collection("users").findOne({name: name},function(err,result){

        if(result.isArtist == true){
            response.write(pug.renderFile("./views/singleaProfile.pug",{result}))
            //console.log(result);
            response.status(200);
            response.end();
        }else{
            response.write(pug.renderFile("./views/singlepProfile.pug",{result}))
            //console.log(result);
            response.status(200);
            response.end();
        }
    })
}

function register(request, response){
    let data = request.body;
    //console.log(data);
    let newUser = {};
    newUser["name"] = data[0];
    newUser["password"] = data[1];
    newUser["liked"] = "none";
    newUser["reviewed"] = "none";
    newUser["follows"] = "none";
    newUser["isArtist"] = false;
    newUser["workShop"] = "none";
    newUser["registeredWorkShop"] = "none";
    console.log(newUser);

    db.collection("users").findOne({name: data[0]},function(err,result){
        if(err) throw err;
        //console.log(result);
        if(result === null){

            db.collection("users").insertOne(newUser,function(err,result){
                if(err) throw err;
                response.status(200);
                response.end();
            })
        }else{
            response.status(208);
            response.end();
        }
    })

}

function addReview(request, response){

    let data = request.body;
    console.log(data);

    db.collection("gallery").updateOne({name:data[0]},{$set:{review:data[1]}}, function(err, result){
        if(err) throw err;
        
        db.collection("users").updateOne({name: request.session.store},{$set:{reviewed:data[0]}},function(err,result){
            response.status(200);
            response.end();
        })
    })
}

function follow(request, response){
    let data = request.body;

    db.collection("users").updateOne({name: request.session.store},{$set:{follows:data[0]}},function(err,result){
        response.status(200);
        response.end();
    })
}

function registerWorkshop(request, response){
    let data = request.body;

    db.collection("users").updateOne({name: request.session.store},{$set:{registeredWorkShop:data[0]}},function(err,result){
        response.status(200);
        response.end();
    })
}

//add like to database
function addLike(request, response){
    let data = request.body;
    console.log(data);

    db.collection("gallery").updateOne({name:data[0]},{$set:{likes:parseInt(data[1])+1}}, function(err, result){
        if(err) throw err;

        db.collection("users").updateOne({name: request.session.store},{$set:{liked:data[0]}},function(err,result){
            response.status(200);
            response.end();
        })
    })

}

//render add art page
function addArt(request, response){
    response.write(pug.renderFile("./views/addArt.pug",{}))
    response.status(200);
	response.end();
}

//get new artwork data and insert into database
function addArtTodb(request, response){

    let newArt = request.body;

    db.collection("gallery").insertOne(newArt, function(err, result){
        if(err) throw err;
        console.log("Successfuly inserted ")
        response.status(200).send();
    })
}

//render add workshop page
function addWorkshop(request, response){
    response.write(pug.renderFile("./views/addWorkshop.pug",{}))
    response.status(200);
	response.end();
}

function addWorkshopTodb(request, response){
    let data = request.body;
    console.log(data);

    db.collection("users").updateOne({name: request.session.store},{$set:{workShop:data[0]}},function(err,result){
        response.status(200);
        response.end();
    })
}

function loadUserProfiles(request, response){
    let users = [];

    db.collection("users").find({}).toArray(function(err, result){
        if(err) throw err;

        result.forEach(element => {

            if(element.name != request.session.store){
                users.push(element);
            }
        });

        response.write(pug.renderFile("./views/profiles.pug",{users}));
        response.status(200);
        response.end();
    })
}

//helper function for getting gallery data
function getGallery(){

    db.collection("gallery").find({}).toArray(function(err, result){
        if(err) throw err;
        gallery = result;
    })
}

//render page with sepsicfic Category
function getCategory(request, response){

    let id = request.params.id;
    //console.log(id);

    db.collection("gallery").find({"category":id}).toArray(function(err, result){ 
        if(err) throw err;  
        categoryArts = result;
        console.log(categoryArts);
        response.write(pug.renderFile("./views/categorys.pug",{categoryArts}));
        response.status(200);
        response.end();
    })

}

//render page with sepsicfic Mediums
function getMediums(request, response){

    let id = request.params.id;
    console.log(id);

    db.collection("gallery").find({"medium":id}).toArray(function(err, result){
        if(err) throw err;   
        mediumArts = result;
        console.log(mediumArts);
        response.write(pug.renderFile("./views/mediums.pug",{mediumArts}));
        response.status(200);
        response.end();
    })
}

//render page with sepsicfic Artist
function getArtist(request, response){

    let name = request.params.name;

    db.collection("gallery").find({"artist":name}).toArray(function(err, result){
        if(err) throw err;   
        console.log(result);
        response.write(pug.renderFile("./views/artist.pug",{result}));
        response.status(200);
        response.end();
    })

}

//render a single are page with all info
function getArt(request, response){

    let name = request.params.name;

    console.log(name);

    db.collection("gallery").find({"name":name}).toArray(function(err, result){ 
        if(err) throw err;
        console.log(result);
        response.write(pug.renderFile("./views/singleart.pug",{result}));
        response.status(200);
        response.end();
    })

}

// Initialize database connection
MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true }, function(err, client) {
  if(err) throw err;

  //Get the final database
  db = client.db('final');
  getGallery()
  // Start server once Mongo is initialized
  app.listen(3000);
  console.log("Listening on port 3000");
});