//La constante qui permet l'accés au fichier Json de l'API
const url = "http://localhost:3000/api/teddies";

//récupération de l'ID de la page courante
let urlJson= new URL(window.location);
let id= urlJson.searchParams.get("id");


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

//On récupère les données lié a l'id d'un objet.
getOneTeddyBear(id).then(function(product){displayOneTB(product)});

function getOneTeddyBear(id){
    return new Promise((resolve, reject) => {
        //On construit l'Url dont on a besoin a l'aide de fetch.
        fetch(url+ '/' +id)
        .then(response => response.json()) 
        .then(function(response){ resolve(response)})
        .catch(reject);
    })
    
}

//On affiche les informations de l'objet récupéré.
function displayOneTB (product){
    //On convertit le prix en une valeur numérique
    let price = parseInt(product.price);
    //Le prix étant exprimé en centimes on va le mettre en un format plus lisible.
    price = price / 100;
    price = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price); 
    
    //On récupère le tableau des couleurs du produit
    colors = product.colors;
    
    //On la traduis en une chaîne de caractère pour l'affichage.
    color= colors.join(', ');
    
    
    document.getElementById("teddy").insertAdjacentHTML('beforeend', `<div class="card col-6"><img src=" ${product.imageUrl} " alt="nounours" style="width: 100%;">
    </div><div class="card col-6"><h1> ${product.name} </h1><h3>Couleurs :  ${color} </h3>
    <h2> ${price} </h2><p> ${product.description} </p>`
    );
    
    //Pour afficher les couleurs dans un selecteur et pouvoir récupérer la valeur choisie par l'utilisateur.
    for (index = 0; index < colors.length ; index++){
        
        document.getElementById("colors").insertAdjacentHTML('beforeend', `<option value="${colors[index]}"> ${colors[index]} </option>`)
        
    }  
    /*
    for (j= 0 ; j < colors.length; j++ ){
        document.querySelector(".colors").insertAdjacentHTML('beforeend', '<div background-color: ' + colors[j] + '> </div>')
    }
    */
}

const STORAGE_KEY_CART = "cartstorage" ;

function onSubmitButton(e){
    
    //on empêche la soumission du formulaire pour en récupérer les données.
    e.preventDefault();
    
    //On stocke les données dont on a besoin dans un objet.
    object = {
        id : id ,
        colors : document.getElementById("colors").value,
        quantity : document.getElementById("quantity").value
    };
    
    let control = true ;
    
    //On parcoure notre tableau d'objet
    for(j= 0 ; j < cart.length ; j++){
        //Pour chaque objet, si l'id et la couleur de l'objet créé par la soumission sont = à l'id et la couleur d'un objet du tableau on incrémente juste la quantité.
        if (object.id == cart[j].id && object.colors == cart[j].colors){
            cart[j].quantity = parseInt(cart[j].quantity) + parseInt(object.quantity);
            control = false;
        }
    }    
    
    if (control != false) {
        cart.push(object);
    }
    
    //On stocke le dernier tableau cart créé dans storage (chaque stockage écrase le précédent mais le tableau cart lui s'indente).
    saveCart(cart)
}

//Une fonction qui stocke le tableau de données du panier en local et sera récupéré par la page panier.
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


    
    cart = loadCart(STORAGE_KEY_CART);
    document.getElementById("form").addEventListener('submit', onSubmitButton);