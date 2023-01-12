const fs = require("fs");
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

let gallery;

let temp = fs.readFileSync('gallery.json');
gallery = JSON.parse(temp);

MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true }, function(err, client) {
  if(err) throw err;

  db = client.db('final');
  db.dropCollection("gallery", function(err, result){
	  if(err){
			console.log("Error dropping collection. Likely case: collection did not exist (don't worry unless you get other errors...)")
		}else{
				console.log("Cleared gallary collection.");
		}

		db.collection("gallery").insertMany(gallery, function(err, result){
			if(err) throw err;
			console.log("Successfuly inserted " + result.insertedCount + " artworks.")
			process.exit();
		})
  });
});