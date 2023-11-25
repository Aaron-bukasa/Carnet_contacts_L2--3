// liste des contacts
let contactList = [];

// General variables

// Variables des formulaires
let prenom, nom, tel, groupe, email, bio, file, formContact, btnCreer, btnRenit;

prenom = document.querySelector('#prenom');
nom = document.querySelector('#nom');
tel = document.querySelector('#tel');
groupe = document.querySelector('#groupe');
email = document.querySelector('#email');
bio = document.querySelector('#bio');
file = document.querySelector('#file');
formContact = document.querySelector('.formContact');
btnCreer = document.querySelector('.btn__submit');
btnRenit = document.querySelector('.btn__reset');

// Variables sur la liste des contacts
let divContactList = document.querySelector('.listContact__content');
const figureTemplate = document.querySelector('#figure__template');


// Events
btnCreer.addEventListener('click', addContact);
window.addEventListener('load', () => {
    contactList = JSON.parse(localStorage.getItem("tab"));
    viewContacts(contactList)
})
btnRenit.addEventListener('click', formReset);


/* LES VALIDATIONS */




/* FONCTIONS */

// La fonction qui reinitialise les champs du formulaire
function formReset() {
    prenom.value = "";
    nom.value = "";
    tel.value = "";
    groupe.value = "";
    email.value = "";
    bio.value = "";
    file.value = "";
}

// La fonction qui ajoute le contact dans le tableau des contacts
function addContact(e) {
    e.preventDefault();
    const newContact = {
        "prenom": prenom.value,
        "nom": nom.value,
        "tel": tel.value,
        "groupe": groupe.value,
        "email": email.value,
        "bio": bio.value,
        "file": file.value
    }
    contactList.push(newContact);
    localStorage.setItem("tab", JSON.stringify(contactList));
    formReset();
    viewContacts(contactList);
}

// la fonction qui supprime le contact
function deleteContact() {

}

// la fonction qui modifie le contact
function completedContact() {

}

// La fonction qui imprime chaque contact du tableau sur le DOM
function viewContacts(tab) {
    for(let contact of tab) {
        let figureContent = figureTemplate.content.cloneNode(true);
        divContactList.append(figureContent);

        // document.querySelector('.profil__image').setAttribute('src', file.value);
        document.querySelector('.f-names').textContent = `${contact.prenom} ${contact.nom} - ${contact.groupe}`;
        document.querySelector('.f-tel').textContent = `${contact.tel}`;
        document.querySelector('.f-bio').textContent = `${contact.bio}`;

        let figure = document.querySelector('.listContact__content figure');
        // figure.addEventListener('click', (e) => {
        //     const containerElement = e;
        //     const clickElement = e.target.tagName;
        //     console.log(clickElement);
        //     if(clickElement == 'svg' && clickElement.parentElement.classList == 'profilBtn__completed') {
        //         console.log('coucou');
        //     }
        //     if(clickElement == 'svg' && clickElement.parentElement.classList == 'profilBtn__delete') {
        //         console.log('delete');
        //     }
            
        // })
    }
}
