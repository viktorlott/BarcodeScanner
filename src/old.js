
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";


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

function fetchBarcode(search_key) {
  return new Promise(resolve => {
    database.ref().orderByChild("productid").equalTo(search_key).once("value", function(snapshot) {
      snapshot.forEach(function(data) {
          resolve(data.val())
      });
    });
  })
}



// sudo certbot certonly --manual --preferred-challenges=dns --email viktor@develottment.com --server https://acme-v02.api.letsencrypt.org/directory --agree-tos -d *.develottment.com

// certbot-auto certonly --server https://acme-v02.api.letsencrypt.org/directory --manual --preferred-challenges=dns --email viktor@develottment.com -d 'develottment.com,*.develottment.com'