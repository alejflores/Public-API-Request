const randomUsersUrl = 'https://randomuser.me/api/?results=12';
const gallery = document.querySelector('#gallery');

function getRandomPeople (url){
    fetch(url) // Call the fetch function passing the url of the API as a parameter
    .then( response => response.json())
    .then( data => {
        let myData = data.results;
        myUsers = myData.map( (user) => user)
        myUsersHtml= generateUsers(myUsers);
    })
    .catch((error) => {
        console.error('Error:', error);
      });
    


}

//----------------------------------------------------------------
// helper functions
//----------------------------------------------------------------


function generateUsers(data){
    data.map(user => {
        const userFullName =  user.name.first.concat(' ', user.name.last);
        const userEmail = user.email;
        const userPhoto = user.picture.medium;
        const userlocation = user.location;
        const html = `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${userPhoto}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${userFullName}</h3>
            <p class="card-text">${userEmail}</p>
            <p class="card-text cap">${userlocation.city}, ${userlocation.state}</p>
        </div>
    </div>
    `;
    gallery.insertAdjacentHTML('beforeend', html)
    });

    const userCards = document.querySelectorAll('.card');    
    userCards.forEach(card => card.addEventListener("click",  (e)=> {
        let selectedCard = e.target;
            generateModal(selectedCard);
    
    
    }));
    
    
    
    

    
}



function generateModal(user){

    alert(user);

}








//----------------------------------------------------------------
// event listeners
//----------------------------------------------------------------

const userCards = document.querySelectorAll('.card');
console.log(userCards.length);

userCards.forEach(card => card.addEventListener("click",  (e)=> {
    let selectedCard = e.target;
    console.log(selectedCard);
        generateModal(selectedCard);


}));






getRandomPeople(randomUsersUrl);


