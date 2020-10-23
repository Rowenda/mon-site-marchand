const url = "http://localhost:3000/api/teddies";

getAllTeddyBear().then(function(data){createCard(data)});

 //récupération de l'ID de la page courante
let urlJson= new URL(window.location);
let id= urlJson.searchParams.get("id");
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

//On récupere la taille de l'ojet contenant les informations pour connaître la limite de notre boucle.
function ObjectSize(obj) {
    let size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

//On récupère les informations de tout les objets présents
 function getAllTeddyBear() {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json()) 
            .then(function(response){ resolve(response)})
            .catch(reject);
    })
   }

   //On va générer le code html pour la card de chaque produit/objet.
 function createCard(data){
    for (let i=0; i <ObjectSize(data); i++){   
      let price = parseInt(data[i].price);
      price = price / 100;
      price = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price); 
      document.getElementById("cardContainer").insertAdjacentHTML('beforeend', '<div class="card col-6 p-1 mb-2" style="width: 18rem;"> <img src=" '+ data[i].imageUrl + '" class="card-img-top" alt="..."> <div class="card-body">  <h5 class="card-title">'+ data[i].name  + '</h5> <p class="card-text">' + price + ' euros</p> <a href="'+ "teddyBear.html?id="  + data[i]._id + ' " class="btn btn-primary">Voir le d&eacute;tail produit</a> </div>'
      )}
}

//une fonction qui si le panier est vide, initialise le panier, et sinon le récupère dans le local storage.
function loadCart(key){
    cart = STORAGE.load(key)
   if ( cart !== null){
       return cart;
   }else {
       //On initialise un tableau vide qui sera le panier.
        cart = [];      
   }
}


   
   cart = loadCart(STORAGE_KEY_CART);