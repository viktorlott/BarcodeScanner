
const MongoClient = require("mongodb").MongoClient


const DB_URL = `mongodb://${"localhost"}:${"27017"}`
const firebase = require("firebase/app");

// Add the Firebase services that you want to use
require("firebase/auth")
require("firebase/firestore");
require("firebase/database");


const firebaseConfig = {
  apiKey: "AIzaSyC6D4ZHprU12Ssr2p7ts50tCXj_e1pHMvA",
  authDomain: "maxiscraper.firebaseapp.com",
  databaseURL: "https://maxiscraper.firebaseio.com",
  projectId: "maxiscraper",
  storageBucket: "maxiscraper.appspot.com",
  messagingSenderId: "1078616534349",
  appId: "1:1078616534349:web:a38ea50f7970e1f0"
};
// Initialize Firebase


firebase.initializeApp(firebaseConfig);

const database = firebase.database();
// const search_key = "7350066440160"

async function fetchBarcode(search_key) {
  const productModel = await ProductsModel()
  return new Promise(resolve => {
    database.ref().once("value", function(snapshot) {

      snapshot.forEach(function(data) {
		productModel.insertOne(data.val())

      });
    });
  })
}


async function ProductsModel() {
	const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	
	const db = client.db("scanner")

	const products = db.collection("products")

	return products


}


fetchBarcode()