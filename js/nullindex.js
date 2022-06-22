import { firebaseConfig } from '../config/config.js';

firebase.initializeApp(firebaseConfig());

var db = firebase.firestore();

let total;
let items;
let empty = true;

db.collection("Cart").doc("3550")
    .onSnapshot((doc) => {
        total = 0;
        if (!(doc.data() == null)) {
            console.log("Cart.doc.3550 is not null");
            var length = Object.keys(doc.data()).length;
            if (length == 0) {
                if (!empty) {
                    removeOldItems('currentItem');
                }
                empty = true;
                document.getElementById('basket-empty').style.display = 'block';
                document.getElementsByClassName('basket-labels')[0].style.display = 'none';
                document.getElementById('basket-subtotal').innerText = total.toFixed(2);
                document.getElementById('basket-total').innerText = total.toFixed(2);

            } else {
                if (empty) {
                    document.getElementById('basket-empty').style.display = 'none';
                    document.getElementsByClassName('basket-labels')[0].style.display = 'block';
                    empty = false;
                }
                items = Object.keys(doc.data())
                let itemList = new Map();
                for (let i = 0; i < items.length; i++) {
                    itemList.set(items[i], doc.data()[items[i]]);
                };

                db.collection('Items').where('id', 'in', items)
                    .get()
                    .then((querySnapshot) => {
                        removeOldItems('currentItem');
                        querySnapshot.forEach((doc) => {
                            var subtotal = doc.data().mrp * itemList.get(doc.data().id)
                            var div = document.createElement('div');
                            div.setAttribute('id', 'item');
                            div.setAttribute('class', 'currentItem');
                            div.innerHTML = `
                                            <div class="basket-product">
                                            <div class="item">
                                            <div class="product-image">
                                            <img src="http://placehold.it/120x120" alt="Placholder Image 2" class="product-frame">
                                            </div>
                                            <div class="product-details">
                                            <h1 class="h1"><strong><span class="item-quantity">${itemList.get(doc.data().id)}</span> x ${doc.data().name}</strong></h1>
                                            <p>Product Code - ${doc.data().id}</p>
                                            </div>
                                            </div>
                                            <div class="price">${doc.data().mrp.toFixed(2)}</div>
                                            <div class="quantity" style="text-align: left; padding-left: 20px;">${itemList.get(doc.data().id)}</div>
                                            <div class="subtotal" style="margin-left:15px;">${subtotal.toFixed(2)}</div>
                                            </div>
                                            `;
                            document.getElementById('items').appendChild(div);



                            total += subtotal
                            document.getElementById('basket-subtotal').innerText = total.toFixed(2);
                            document.getElementById('basket-total').innerText = total.toFixed(2);
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
            }

        }
        console.log("Cart.doc.3550 is null");

    });

db.collection("Cart").doc("3550").
    collection("Data").doc("current_status").onSnapshot((doc) => {
        if (!doc.data().in_use) {
            db.collection("Cart").doc("3550").delete().then(() => {
                console.log("Document successfully deleted!");
                location.href = "paymentSuccessful.html";
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }
    });


function removeOldItems(className) {
    var elements = document.getElementsByClassName(className);
    while (elements[0]) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}
