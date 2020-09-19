const randomUsersUrl = 'https://randomuser.me/api/?results=12&nat=us';
const gallery = document.querySelector('#gallery');
const searchContainer = document.querySelector('.search-container')
const modalContainer = document.createElement('div');
modalContainer.classList = 'modal-container';
    gallery.appendChild(modalContainer);
    modalContainer.style.display = 'none';


function getRandomPeople (url){
    fetch(url) // Call the fetch function passing the url of the API as a parameter
    .then( response => response.json())
    .then( data => gatherUsersData(data)) // returns myUsers
    .then( myUsers => generateUsers(myUsers) )//generates user cards 
    .then( myUsers => enableModal(myUsers) )//enables event listeners on cards, to enable modal
    .catch((error) => {
        console.error('Error:', error);
      });
}

//----------------------------------------------------------------
// helper functions
//----------------------------------------------------------------

function gatherUsersData(data){
    
    myUsers = data.results.map( user => {
        const users = {};
        // users.id = user.login;
        users.name = user.name; // title, first, last
        users.id = user.name.first+'-'+user.name.last;
        users.image = user.picture; // large, medium, thumbnail
        users.email = user.email;
        users.phone = phoneNumberNormalize(user.phone) ;
        users.location = user.location; // city, street{name,number}, state, country
        users.dob = user.dob; // age, date
        return users;
    });
    return myUsers;

}
{/* <div class="card" id="${user.id.username}"> */}

function generateUsers(data){
    data.map(user => {
        const html = `
    <div class="card" id="${user.id.toLowerCase()}">
        <div class="card-img-container">
            <img class="card-img" src="${user.image.medium}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="${user.name.first}-${user.name.last}" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
    </div>
    `;

    gallery.insertAdjacentHTML('beforeend', html)
    });
    return data;
}

function enableModal(myUsers){
    const userCards = document.querySelectorAll('.card');    
    
    userCards.forEach(card => card.addEventListener("click",  (e)=> {
        let selectedCard = e.currentTarget.id;
        console.log(selectedCard);
        modalContainer.style.display = 'block';

        for (let i=0; i< myUsers.length; i++){
            // let username = myUsers[i].id.username;
            let username = myUsers[i].id.toLowerCase();
            if(username === selectedCard){
               let activeUserModal = myUsers[i];
                generateModal(activeUserModal);
            }
        }
}))}

function generateModal(selectedUser){
    let user = selectedUser;
        modalContainer.style.display = 'block';

    if(modalContainer.hasChildNodes()) { modalContainer.innerText = '';}

    const modalContent = document.createElement('div');
        modalContent.classList = 'modal';
    const extitButton = document.createElement('button');
        extitButton.type = 'button';
        extitButton.id = 'modal-close-btn';
        extitButton.classList = 'modal-close-btn';
    const modalInfoContainer = document.createElement('div');
        modalInfoContainer.classList = 'modal-info-container';

    const modalNavigation = document.createElement('div');
        modalNavigation.classList = 'modal-btn-container';
    const prevButton = document.createElement('button');
        prevButton.type = 'button';
        prevButton.id = 'modal-prev';
        prevButton.classList = 'modal-prev btn';
        prevButton.innerText = 'Prev';
    const nextButton = document.createElement('button');
        nextButton.type = 'button';
        nextButton.id = 'modal-next';
        nextButton.classList = 'modal-next btn';
        nextButton.innerText = 'Next';

    let streetAdd = user.location.street;
        streetAdd = ` ${streetAdd.number} ${streetAdd.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}`;
    let userBirthday= user.dob.date.split("T")[0];

    const html = `
            <img class="modal-img" src="${user.image.medium}" alt="profile picture">
            <h3 id="${user.name.first}-${user.name.last}" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="modal-text">${user.email}</p>
            <hr>
            <p class="modal-text">${user.phone}</p>
            <p class="modal-text">${streetAdd}</p>
            <p class="modal-text">Birthday: ${userBirthday}</p>
    `;

    modalContent.appendChild(extitButton);
    modalContent.appendChild(modalInfoContainer);
    modalInfoContainer.insertAdjacentHTML('beforeend',html);

    modalNavigation.appendChild(prevButton);
    modalNavigation.appendChild(nextButton);

    modalContent.appendChild(modalNavigation);

    navigation( user , nextButton, prevButton);
    modalContainer.appendChild(modalContent);

    extitButton.addEventListener('click', () => {
        let modalClose = document.querySelector('.modal-container')
        modalContainer.style.display = 'none';
    })


}


function navigation (user , nextButton, prevButton){

    for (let i=0; i< myUsers.length; i++){
        // if(user.id.username === myUsers[i].id.username){
        if(user.id === myUsers[i].id){
            if( i < myUsers.length - 1){
                nextUser = myUsers[i+1];
                nextButton.style.display = 'block';

                nextButton.addEventListener('click', () => {
                    generateModal(nextUser);
                
                })
                } else{
                    nextButton.style.display = 'none';
                }

                if( i > 0){
                    previousUser = myUsers[i-1];
                    prevButton.style.display = 'block';
                    prevButton.addEventListener('click', () => {
                        generateModal(previousUser);
                    })
                    }else{
                        prevButton.style.display = 'none';
                    }
        }
    }
}


// normalize string and remove all unnecessary characters
//informed from this discussion https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript 

function phoneNumberNormalize(phone){
 phone = phone.replace(/[^\d]/g, "");
     return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

}

getRandomPeople(randomUsersUrl);


//----------------------------------------------------------------
// event listeners
//----------------------------------------------------------------






//exceeds

// You can use the commented out markup below as a template
// for your search feature, but you must use JS to create and 
// append it to `search-container` div.

// IMPORTANT: Altering the arrangement of the markup and the 
// attributes used may break the styles or functionality.

// <form action="#" method="get">
//     <input type="search" id="search-input" class="search-input" placeholder="Search...">
//     <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
// </form>

function createSearchForm() {

    let searchForm = document.createElement('form');
        searchForm.action = '#';
        searchForm.method = 'get';

    let inputSearch = document.createElement('input');
        inputSearch.type = 'search';
        inputSearch.id = 'search-input';
        inputSearch.classList = 'search-input';
        inputSearch.placeholder = 'Search...';
    let inputSubmit = document.createElement('input');
        inputSubmit.type = 'submit';
        inputSubmit.value = '🔍';
        inputSubmit.id = 'search-submit';
        inputSubmit.classList = 'search-submit';

        searchForm.appendChild(inputSearch);
        searchForm.appendChild(inputSubmit);
        searchContainer.appendChild(searchForm);


        inputSubmit.addEventListener('click', search => {
            alert(inputSearch.value);
            searchUser(inputSearch.value);
        })
    

}


createSearchForm();
let searchedUsers = [];


function searchUser( query ) {
    let search = query.toLowerCase();
    console.log(query);
    let userCards = document.querySelectorAll('.card');
    console.log(userCards)
    console.log(userCards.length)
    for ( let i = 0; i < userCards.length; i++ ) {
        if (userCards[i].id.includes(query)){
            userCards[i].style.display = 'block';
          }else{
            userCards[i].style.display = 'none';
          }
    }
}


// To do  fix modal user view after search. 