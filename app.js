//Global variables
const form = document.querySelector('.formContact');
const listContact = document.querySelector('.listContact');
const figureTemplate = document.querySelector('#figure__template');
const divContactList = document.querySelector('.listContact__content');
let contactProfil = document.querySelector('.contact__profil');
let labelFile = document.querySelector('#labelfile');
let focusElement;
let focusIndex;

// Input elements
const prenom = document.querySelector('#prenom');
const nom = document.querySelector('#nom');
const tel = document.querySelector('#tel');
const groupe = document.querySelector('#groupe');
const email = document.querySelector('#email');
const bio = document.querySelector('#bio');
const file = document.querySelector('#file');
let imgUrl;

// Button elements
btnCreer = document.querySelector('.btn__submit');
btnRenit = document.querySelector('.btn__reset');

// Input listeners
let inputForm = document.querySelectorAll('.formContact ul input');
inputForm.forEach((element) => {
    element.addEventListener('blur', () => {
        if(element.id === "prenom") {
            nomPrenomValid(element);
        }else if(element.id === "nom"){
            nomPrenomValid(element);
        } else if(element.id == "tel") {
            telValid(element);
        } else if(element.id == 'email') {
            emailValid(element);
        }
    })
})
file.addEventListener("change", (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    imgValid(file);
});
labelFile.addEventListener(
    "dragover",
    function (event) {
      event.preventDefault();
      labelFile.style.backgroundColor = '#99d2fa';
    }
  );
labelFile.addEventListener(
    "dragleave",
    function (event) {
        event.preventDefault();
        labelFile.style.backgroundColor = '';
    }
);
labelFile.addEventListener(
    "drop",
    function (e) {
        e.preventDefault();
        let file = e.dataTransfer.files[0]
        imgValid(file);
        labelFile.style.backgroundColor = '';
    }
);

// Button listeners
btnCreer.addEventListener('click', (e) => {
    e.preventDefault();
    addModified();
})
function addModified() {
    if(btnCreer.value === 'Modifier') {
        deleteContact(focusElement, focusIndex);

        btnCreer.value = "Créer";
        btnCreer.classList.remove('btn-modifier');
        btnRenit.value = "Réinit";
        addContact();

        document.querySelector('#mobileBtn__formView').style.display = 'block';
    } else {
        if(!nomPrenomValid(prenom) || !nomPrenomValid(nom) || !telValid(tel) || !emailValid(email)) {
        } else {
            addContact()
        }
    }
}
btnRenit.addEventListener('click', formReset);

// Mobile button listener
const btnMobile = document.querySelector('#mobileBtn__formView');
const arrowBack = document.querySelector('.arrow_back');
const logoNewContact = document.querySelector('.logo__newContact');
const spanNewContact = document.querySelector('.logo__newContact ~ span');
btnMobile.addEventListener('click', () => {
    form.style.display = 'block';
    listContact.style.display = 'none';
    arrowBack.style.display = 'block';
    logoNewContact.style.display = 'none';
    spanNewContact.style.display = 'none';
})

// Tableau des contacts stocké dans le local storage
let contactList = window.localStorage.getItem('contactList');
if(contactList === null) {  
    contactList = [];
} else {
    contactList = JSON.parse(contactList);
    viewContacts();
}

/* les fonctions de validation */
function errorMessage(element) {
    let pError = document.querySelector(`#${element.id} + p`);
    pError ? pError.remove() : pError;
    let p = document.createElement('p');
    element.style.borderColor = 'red';
    p.style.color = 'red';
    element.insertAdjacentElement('afterend', p);
}
function cleanMessage (element) {
    let pClean = document.querySelector(`#${element.id} + p`);
    pClean ? pClean.remove() : pClean;
     element.style.border = '';
}
function imgValid(element){
    const img = element;
    let imageView = () => {
        let newImg = document.querySelector(`#labelfile img`);
        newImg ? newImg.remove() : newImg;
        let image = document.createElement("img");
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = () => {
            document.querySelector('.file span').style.display = 'none';
            document.querySelector('.file label').appendChild(image);
            imgUrl = reader.result;
            image.src = imgUrl;
        }
    }
    if (!/^image\/(png|jpg|jpeg)$/.test(img.type)) {
        errorMessage(labelFile);
        document.querySelector('#labelfile + p').textContent = "Veillez Renseigner une image valide"
        return false;
    } else {
        errorMessage(labelFile);
        if (img.size > 5000000) {
            document.querySelector('#labelfile + p').textContent = "Le poids de l'image doit être inférieur à 5Mo";
            return false;
        } else {
            cleanMessage(labelFile);
            imageView();
            return true;
        }
    }
}

function nomPrenomValid(element) {
    if(element.value.length < 3) {
        errorMessage(element);
        document.querySelector(`#${element.id} + p`).textContent = `Veillez renseigner un ${element.id} avec plus de 3 caractères`;
        return false;
    } else if(element.value.length > 50) {
        errorMessage(element);
        document.querySelector(`#${element.id} + p`).textContent = `Veillez renseigner un ${element.id} avec moins de 50 caractères`;
        return false;
    } else {
        cleanMessage(element);
        return true;
    }
}

function telValid(idInput) {
    let regex = /^(084|085|080|089|081|082|099|097|090)[0-9]{7}$/;
    if(isNaN(idInput.value)) {
        errorMessage(idInput);
        document.querySelector(`#${idInput.id} + p`).textContent = "Veillez renseigner un numéro de téléphone valide";
        return false;
    } else if(!(idInput.value.length === 10)) {
        errorMessage(idInput);
        document.querySelector(`#${idInput.id} + p`).textContent = "Veillez renseigner un numéro de téléphone avec 10 chiffres ";
        return false;
    } else if(!regex.test(idInput.value)) {
        errorMessage(idInput);
        document.querySelector(`#${idInput.id} + p`).textContent = "Veillez renseigner un numéro de téléphone au format valide";
        return false;
    } else if(contactList.find((element) => element.tel == idInput.value) !== undefined) {
        errorMessage(idInput);
        document.querySelector(`#${idInput.id} + p`).textContent = "Le numéro de téléphone est déjà utilisé ";
        return false;
    } else {
        cleanMessage(idInput);
        return true;
    }
}
function emailValid(input) {
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;        
    if(!regex.test(input.value)) {
        errorMessage(input);
        document.querySelector(`#${input.id} + p`).textContent = "Veillez renseigner une adresse email valide";
        return false;
    } else if(contactList.find((element) => element.email == input.value) !== undefined) {
        errorMessage(input);
        document.querySelector(`#${input.id} + p`).textContent = "Email existe déjà";
        return false;
    } else {
        cleanMessage(input);
        return true;
    }  
}

/* FONCTIONS */

// La fonction qui reinitialise les champs du formulaire
function formReset() {
    prenom.value = "";
    nom.value = "";
    tel.value = "";
    groupe.value = "";
    email.value = "";
    bio.value = "";
    imgUrl = "";
    document.querySelector('#labelfile img') ? document.querySelector('#labelfile img').remove() : document.querySelector('#labelfile img');
    document.querySelector('.file span').style.display = 'block';
}

// La fonction qui ajoute le contact dans le tableau des contacts
function addContact() {
    const newContact = {
        "prenom": prenom.value,
        "nom": nom.value,
        "tel": tel.value,
        "groupe": groupe.value,
        "email": email.value,
        "bio": bio.value,
        "file": imgUrl
    }
    contactList.push(newContact);
    const tabString = JSON.stringify(contactList);
    window.localStorage.setItem('contactList', tabString);
    viewContacts();
    formReset();
    if(document.querySelector('.file img')) {
        document.querySelector('.file img').remove();
    };
    document.querySelector('.file span').style.display = 'block';
}

// la fonction de confirmation de la suppression d'un contact
function confirmDelete(element, indexElement) {
    const div = document.createElement('div');
    const pMessage = document.createElement('p');
    const divBtns = document.createElement('div');
    const btnNo = document.createElement('button');
    const btnOk = document.createElement('button');

    div.classList.add('div__confirm');
    pMessage.textContent = "Voulez-vous vraiment supprimer ce contact ?";
    btnNo.classList.add('delete-annule');
    btnNo.textContent = "Annuler";
    btnOk.classList.add('delete-ok');
    btnOk.textContent = "OK";

    divBtns.appendChild(btnNo);
    divBtns.appendChild(btnOk);
    div.appendChild(pMessage);
    div.appendChild(divBtns);

    div.querySelector('.delete-annule').onclick = () => {
        div.remove(); 
        element.closest(".contact__profil").classList.remove('contact__profil-confirm');
    };
    div.querySelector('.delete-ok').onclick = () => {deleteContact(element, indexElement)}
    element.closest(".contact__profil").appendChild(div);
    element.closest(".contact__profil").classList.add('contact__profil-confirm');
}

// la fonction qui supprime le contact
function deleteContact(contactElement, index) {
    contactElement.closest(".contact__profil").remove();
    contactList.splice(index, 1);
    const tabString = JSON.stringify(contactList);
    window.localStorage.setItem('contactList', tabString);
}

// la fonction qui modifie le contact
function completedContact(element, index) {
    focusElement = element;
    focusIndex = index;
    element.closest(".contact__profil").classList.add('contact__profil-bg');

    let contact = contactList[index];

    prenom.value = contact.prenom;
    nom.value = contact.nom;
    tel.value = contact.tel;
    groupe.value = contact.groupe;
    email.value =contact.email;
    bio.value = contact.bio;
    imgUrl = contact.file;
    
    document.querySelector('#labelfile img') ? document.querySelector('#labelfile img').remove() : document.querySelector('#labelfile img');
    let img = document.createElement('img');
    img.src = imgUrl;
    labelFile.appendChild(img);
    document.querySelector('#labelfile span').style.display = 'none';

    btnCreer.value = "Modifier";
    btnCreer.classList.add('btn-modifier');
    btnRenit.value = "Annuler";

    btnRenit.addEventListener('click', () => {
        prenom.value = '';
        nom.value = '';
        tel.value = '';
        groupe.value = '';
        email.value = '';
        bio.value = '';
        imgUrl = '';

        btnCreer.value = "Créer";
        btnCreer.classList.remove('btn-modifier');
        btnRenit.value = "Réinit";

        element.style.backgroundColor = '';
        document.querySelector('#labelfile img') ? document.querySelector('#labelfile img').remove() : document.querySelector('#labelfile img');
        element.closest(".contact__profil").classList.remove('contact__profil-bg');

        form.classList.add('formContact-mobile');
        listContact.classList.remove('listContact-mobile');
        document.querySelector('#mobileBtn__formView').style.display = 'block';
    })
}

// La fonction qui affiche chaque contact du tableau sur le DOM
function viewContacts() {
    divContactList.innerHTML = '';
    let pEmptyList = document.createElement('p');
    divContactList.appendChild(pEmptyList);

    if(contactList.length == 0) {
        form.classList.remove('formContact-mobile');
        listContact.classList.add('listContact-mobile')
        pEmptyList.style.display = 'block';  
        document.querySelector('#mobileBtn__formView').style.display = 'none';          
    } else {
        pEmptyList.style.display = 'none';
        for(let i = 0; i < contactList.length; i++) {
            let index = i;
            let figureContent = figureTemplate.content.cloneNode(true);

            if(contactList[i].file == undefined) {
                contactList[i].file = './img/profile-female.png';
            }

            figureContent.querySelector('.profil__image').src = `${contactList[i].file}`;
            figureContent.querySelector('.f-names').textContent = `${contactList[i].prenom} ${contactList[i].nom} - ${contactList[i].groupe}`;
            figureContent.querySelector('.f-tel').textContent = `${contactList[i].tel}`;
            figureContent.querySelector('.f-bio').textContent = `${contactList[i].bio}`;

            figureContent.querySelector('.contact__profil').addEventListener('click', (e) => {
                const clickElement = e.target;
                let bgContactModifier = document.querySelector('.contact__profil-bg');
                if((clickElement.className == 'img__completed') || (clickElement.className == 'btn__completed') || (clickElement.className == 'span__completed') || (clickElement.className == 'img__mobile-completed')) {

                    completedContact(clickElement, index);
                    bgContactModifier ? bgContactModifier.classList.remove('contact__profil-bg') : bgContactModifier;

                    form.classList.remove('formContact-mobile');
                    listContact.classList.add('listContact-mobile');
                    document.querySelector('#mobileBtn__formView').style.display = 'none';

                } else if((clickElement.className == 'img__delete') || (clickElement.className == 'btn__delete') || (clickElement.className == 'span__delete') || (clickElement.className == 'img__mobile-delete')) {
                    confirmDelete(clickElement, index);

                    bgContactModifier ? bgContactModifier.classList.remove('contact__profil-bg') : bgContactModifier;
                }
            });

            divContactList.append(figureContent);
            form.classList.add('formContact-mobile');
            listContact.classList.remove('listContact-mobile');
        }
    }
}