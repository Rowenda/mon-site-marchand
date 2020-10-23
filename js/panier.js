//La constante qui permet l'accés au fichier Json de l'API
const url = "http://localhost:3000/api/teddies";

const STORAGE_KEY_CART = "cartstorage" ;

const STORAGE = {
    
    save: (key, value) => {
        const jsonData = JSON.stringify(value);
        window.localStorage.setItem(key, jsonData);
    },
    
    load: key => {
        const jsonData = localStorage.getItem(key);
        return JSON.parse(jsonData);
    }
    
}; 

function saveCart(cart) {
    STORAGE.save(STORAGE_KEY_CART, cart );
}

//une fonction qui si le panier est vide, initialise le panier, et sinon le récupère dans le local storage.
function loadCart(key){
    cart = STORAGE.load(key)
   if ( cart !== null){
       return cart;
   }else {
       //On initialise un tableau vide qui sera le panier.
       return cart = [];      
   }
}

function getOneTeddyBear(id){
    return new Promise((resolve, reject) => {
        //On construit l'Url dont on a besoin a l'aide de fetch.
        fetch(url+ '/' +id)
        .then(response => response.json()) 
        .then(function(response){ resolve(response)})
        .catch(reject);
    })
    
}

//Fonction qui permet de supprimer un objet du tableau et du local storage lorsqu'on clique sur le bouton supprimer.
function onDeleteButton(e) {
    //On récupère en local storage le tableau contenant notre panier.
    cart = loadCart(STORAGE_KEY_CART);
    //On cible les data-id de l'élément ciblé.
    data = e.target.dataset.id;
    //On récupère une chaîne de caractère qu'on va séparer et ranger dans un tableau ou le premier élément (l'id) sera a l'index 0 et le deuxième (les couleurs) a l'indice 1.
    dataTab = data.split('+');
    //On va parcourir le tableau correspondant au tableau pour trouver l'entrée sélectionnée par l'utilisateur.
    for (index=0 ; index < cart.length ; index++){
        if (dataTab[0] == cart[index].id && dataTab[1] == cart[index].colors){
            //On retire l'élément correspondant du tableau affiché sur la page avant d'en supprimer l'entrée.
           document.getElementById(`${cart[index].id}+${cart[index].colors}`).remove();
           //on extrait l'objet du tableau correspondant au panier
           outOfCart = cart.splice (index, 1);
           //On met le nouveau tableau avec une entrée en moins dans le local storage.
            saveCart(cart);
        } 
    }
}
 
function adjustQuantity(adjustement, cartQuantity, price, sum, e, allPrice){
    //On récupère en local storage le tableau contenant notre panier.
    cart = loadCart(STORAGE_KEY_CART);
    //On cible les data-id de l'élément ciblé.
    data = e.target.dataset.id;
    //On récupère une chaîne de caractère qu'on va séparer et ranger dans un tableau ou le premier élément (l'id) sera a l'index 0 et le deuxième (les couleurs) a l'indice 1.
    dataTab = data.split('+');

    //On va parcourir le tableau correspondant au tableau pour trouver l'entrée sélectionnée par l'utilisateur.
    for (index=0 ; index < cart.length ; index++){
        if (dataTab[0] == cart[index].id && dataTab[1] == cart[index].colors){
            
            cartQuantity = cart[index].quantity;
            //on transforme la variable en un chiffre manipulable.
            cartQuantity = parseInt(cartQuantity);
            // Si la quantité est supérieure ou égale a 0 et qu'on veux augmenter.
            if (cartQuantity >= 0 && adjustement > 0) {
                //On incrèmente la valeur de la variable de quantité
                cartQuantity = cartQuantity +1;
                //Dans le cas ou la quantité est supérieure a 1 et qu'on veux la réduire 
            }
            if (cartQuantity >= 2 && adjustement < 0){    
                //On réduit la valeur de 1.
                cartQuantity = cartQuantity -1;
            }

            
            
            price = price * parseInt(cartQuantity);
            //Le prix étant exprimé en centimes on va le mettre en un format plus lisible.
            price = price / 100;
            price = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price); 
            
            document.querySelector(`.displayQuantity[data-id="${cart[index].id}+${cart[index].colors}"]`).innerHTML= cartQuantity ;
            document.querySelector(`.price[data-id="${cart[index].id}+${cart[index].colors}"]`).innerHTML= price ;
            //On modifie la quantité dans le tableau lui même
            cart[index].quantity = cartQuantity;
            
            for (a=0; a < allPrice.length; a++){
                if (allPrice[a][0] == cart[index].id && allPrice[a][2] == cart[index].colors){
                    subPrice = allPrice[a][1];
                    if( adjustement > 1){
                        //Perte de la variable sum ici.
                        console.log(sum);
                        total = parseInt(total) + parseInt(subPrice); 
                                }
                                if (adjustement < 1 ){
                                total = parseInt(total) - parseInt(subPrice)
                                }
                            
            
                        }    
                        
                        sum =  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(sum); 
                        document.getElementById("totalCommande").innerHTML = sum;
            //On met le nouveau tableau avec une entrée en moins dans le local storage.
            saveCart(cart);
            } 
        }
}
}


/**************************************************************************************************************
 * ************************************************************************************************************
 * CODE PRINCIPAL *********************************************************************************************
 * ************************************************************************************************************
 */

cart = loadCart(STORAGE_KEY_CART);

    let sum = 0; 
    total = 0;
    allPrice = [];

   for (k = 0 ; k < cart.length ; k++){ 
    
        let id = cart[k].id;
        let cartQuantity = cart[k].quantity;
        let cartColors = cart[k].colors;
        let priceTab= {};

       
        getOneTeddyBear(id).then(function(product){   
            //On convertit le prix en une valeur numérique
            let onePrice = parseInt(product.price);
            //Le prix étant exprimé en centimes on va le mettre en un format plus lisible.
            let price = onePrice / 100;
            price = price * parseInt(cartQuantity);
            price = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price); 
            
            //On va générer le code html pour chaque objet parcouru dans la boucle.
            document.getElementById("displayCart").insertAdjacentHTML('beforeend',`
            <tr id="${product._id}+${cartColors}">
            <td><img src="${product.imageUrl}" alt="nounours" style="width: 150px;"></td>
            <td>${product.name}</td>
            <td>${cartColors}</td>
            <td><button class="decrease" data-id="${product._id}+${cartColors}"> << </button><div class="displayQuantity" data-id="${product._id}+${cartColors}">${cartQuantity}</div><button class="increase"  data-id="${product._id}+${cartColors}"> >> </button></td>
            <td class="price" data-id="${product._id}+${cartColors}"> ${price}</td>
            <td><button class="delete" type="button" data-id="${product._id}+${cartColors}">Supprimer</button></td>
            </tr>
            `);                
            document.querySelector(`.delete[data-id="${product._id}+${cartColors}"]`).addEventListener('click', onDeleteButton);
            
            priceTab[0] = product._id;
            priceTab[1] = product.price;
            priceTab[2] = cartColors
            allPrice.push(priceTab);
            
                                for (a=0; a < allPrice.length; a++){
                                    if (allPrice[a][0] == id && allPrice[a][2] == cartColors){
                                        subPrice = allPrice[a][1];
                                        subtotal = parseInt(subPrice) * parseInt(cartQuantity);
                                        subtotal = parseInt(subtotal / 100) ;
                                        sum = parseInt(sum) + parseInt(subtotal); 
                                    }
                    
                                }
                                
                                total =  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(sum); 
                                document.getElementById("totalCommande").innerHTML = total;
            
            document.querySelector(`.increase[data-id="${product._id}+${cartColors}"]`).addEventListener('click', function (e) {adjustQuantity(1, cartQuantity, onePrice, sum, e, allPrice)});
            document.querySelector(`.decrease[data-id="${product._id}+${cartColors}"]`).addEventListener('click', function (e) {adjustQuantity(-1, cartQuantity, onePrice, sum, e, allPrice)});





        })
    }  


