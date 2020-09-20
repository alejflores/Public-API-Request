const randomUsersUrl = 'https://randomuser.me/api/?results=12&nat=us';
const gallery = document.querySelector('#gallery');
const searchContainer = document.querySelector('.search-container')
const modalContainer = createNode('div', 'modal-container');
    append(gallery, modalContainer)
    modalContainer.style.display = 'none';

// fetches users from Random User API, and invokes functions to display users dynamically 
function getRandomPeople (url){
    fetch(url) // Call the fetch function passing the url of the API as a parameter
    .then( response => response.json())
    .then( data => gatherUsersData(data)) // returns myUsers
    .then( myUsers => generateUsers(myUsers) )//generates user cards 
    .then( myUsers => enableModal(myUsers) )//enables event listeners on cards and  enables modal
    .catch((error) => {
        console.error('Error:', error);
      });
}

//----------------------------------------------------------------
// helper functions
//----------------------------------------------------------------

// function creates an element with the tagname, classes and id attributes
function createNode(element, classlist, id) {
    let myElement = document.createElement(element);
        if(classlist){
            myElement.classList=`${classlist}`;
        }
        if(id){
        myElement.id=`${id}`;
        }
    return myElement; 
  }

  function append(parent, el) {
    return parent.appendChild(el); // Append the second parameter(element) to the first one
  }


// function extracts only the info we need from the the fetch request. Returns myUsers array
function gatherUsersData(data){
    
    myUsers = data.results.map( user => {
        const users = {};
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

// function generates and appends user cards. takes a user array as parameter
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

// function enables modal, adds event listeners to cards and invokes generateModal if user clicks on a card
function enableModal(users){
    const userCards = document.querySelectorAll('.card');    
    
    userCards.forEach(card => card.addEventListener("click",  (e)=> {
        let selectedCard = e.currentTarget.id;
        modalContainer.style.display = 'block';

        for (let i=0; i< users.length; i++){
            let username = users[i].id.toLowerCase();
            if(username === selectedCard){
               activeUserModal = users[i];
                generateModal(activeUserModal, users);
            }
        }
}))}

// function takes the selected card and users array.
function generateModal(selectedUser, users){
    let user = selectedUser;
        modalContainer.style.display = 'block';

    if(modalContainer.hasChildNodes()) { modalContainer.innerText = '';}

    const modalContent = createNode('div', 'modal');
    const extitButton = createNode('button', 'modal-close-btn', 'modal-close-btn');
        extitButton.type = 'button';
    const extitButtonX = createNode('strong');
        extitButtonX.innerText = 'X';
    const modalInfoContainer = createNode('div', 'modal-info-container');

    const modalNavigation = createNode('div', 'modal-btn-container');
    const prevButton = createNode('button', 'modal-prev btn', 'modal-prev');
        prevButton.type = 'button';
        prevButton.innerText = 'Prev';
    const nextButton = createNode('button', 'modal-next btn', 'modal-next');
        nextButton.type = 'button';
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


    append(extitButton, extitButtonX)
    append(modalContent, extitButton)
    append(modalContent, modalInfoContainer)

    modalInfoContainer.insertAdjacentHTML('beforeend',html);

    append(modalNavigation, prevButton)
    append(modalNavigation, nextButton)
    append(modalContent,modalNavigation)

    navigation(user, users, nextButton, prevButton);
    append(modalContainer, modalContent)

    extitButton.addEventListener('click', () => {
        let modalClose = document.querySelector('.modal-container')
        modalContainer.style.display = 'none';
    })
}

function navigation (user, users, nextButton, prevButton){
    for (let i=0; i< users.length; i++){
        if(user.id === users[i].id){
            if( i < users.length - 1){
                nextUser = users[i+1];
                nextButton.style.display = 'block';
                nextButton.addEventListener('click', () => {
                    generateModal(nextUser, users);
                })
                } else{
                    nextButton.style.display = 'none';
                }

            if( i > 0){
                previousUser = users[i-1];
                prevButton.style.display = 'block';
                prevButton.addEventListener('click', () => {
                generateModal(previousUser, users);
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
// exceeds 
//----------------------------------------------------------------

// function creates and appends search form. keyup event listener on the search field triggers searchUser function
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

        append(searchForm, inputSearch)
        append(searchForm, inputSubmit)
        append(searchContainer, searchForm)

        inputSearch.addEventListener('keyup', search => {
            searchUser(inputSearch.value);
        })


}

createSearchForm();

//function takes user search field input and checks if the search field input matches letters user's names
//if matched it pushes user to an array, removes existing cards. and invokes the generateUsers and enableModal functions with the new array. 
function searchUser( query ) {
    let searchedUsers = [];

    let search = query.toLowerCase();
    for ( let i = 0; i < myUsers.length; i++ ) {
        let userSearch = myUsers[i].id.toLowerCase();
        if (userSearch.includes(search)){            
            searchedUsers.push(myUsers[i]);
          }
    }
    let cleanCards = document.querySelectorAll('.card');
    for (let i = 0; i < cleanCards.length; i++){
        cleanCards[i].remove();
    }
    gallery.innerHTML = " ";
    gallery.appendChild(modalContainer);

    generateUsers(searchedUsers);
    enableModal(searchedUsers)

    const searchedUserCards = document.querySelectorAll('.card');    
    
    searchedUserCards.forEach(card => card.addEventListener("click",  (e)=> {
        let selectedCard = e.currentTarget.id.toLowerCase();
        modalContainer.style.display = 'block';

        for (let i=0; i< searchedUsers.length; i++){
            let username = searchedUsers[i].id.toLowerCase();
            if(username.toLowerCase() === selectedCard.toLowerCase()){
                activeUserModal = searchedUsers[i];
                activeUser = myUsers[i];
            }
        }
        generateModal(activeUserModal, searchedUsers);
    }))
}
