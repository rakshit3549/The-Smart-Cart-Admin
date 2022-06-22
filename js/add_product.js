import { firebaseConfig } from '../config/config.js';

firebase.initializeApp(firebaseConfig());
let db = firebase.firestore();

let imageLocation = null;

function updateImageUrl(input) {

    if (input.files[0]) {
        if (input.files[0].type.match(/image.*/)) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#item').attr('src', e.target.result).width(280).height(280);
            };
            document.getElementById("placeholder").style.display = "none"
            reader.readAsDataURL(input.files[0]);
            document.getElementById("item").style.display = "block"
        } else {
            removeOldImg('imageHolder')
        }
    }
}

function removeOldImg(className) {
    console.log("entered")
    document.getElementById("placeholder").style.display = "block"
    document.getElementById('item').style.display = "none"

}

function addNewProduct() {
    var elements = document.getElementById("add").elements;
    var obj = {};
    for (var i = 0; i < elements.length; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
    }

    // Add a new document in collection "cities"
    db.collection("Items").doc(obj.barcodeNumber).set({
        company: obj.companyName,
        name: obj.productName,
        id: obj.barcodeNumber,
        mrp: obj.price,
        currentQuantity: obj.stock
    })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

}