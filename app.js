// liste des contacts
let contactList = [];

// General variables

// Variables des formulaires
let prenom, nom, tel, groupe, email, bio, file, btnCreer, btnRenit, inputForm;

prenom = document.querySelector('#prenom');
nom = document.querySelector('#nom');
tel = document.querySelector('#tel');
groupe = document.querySelector('#groupe');
email = document.querySelector('#email');
bio = document.querySelector('#bio');
file = document.querySelector('#file');
btnCreer = document.querySelector('.btn__submit');
btnRenit = document.querySelector('.btn__reset');
inputForm = document.querySelectorAll('.formContact ul input');

// Variables sur la liste des contacts
let divContactList = document.querySelector('.listContact__content');

// Events
btnCreer.addEventListener('click', (e) => {
    e.preventDefault();
    addContact();
});
// document.body.onload = function() {
//     contactList = JSON.parse(localStorage.getItem('contacts'));
//     viewContacts(contactList)
// }
btnRenit.addEventListener('click', formReset);
inputForm.forEach((element) => {
    element.addEventListener('blur', () => {
        validation(element);
    })
})


/* LES VALIDATIONS */
function validation(input) {
    let p;
    let paramBorder = (input) => {
        p = document.createElement('p');
        input.style.borderColor = 'red';
        p.style.color = 'red';
        input.insertAdjacentElement('afterend', p);
    }

    let charactLength = (idInput, x, y) => {
        if(idInput.value.length < x) {
            paramBorder(idInput);
            p.textContent = `Veillez renseigner un ${input.id} avec plus de ${x} caractères`;
            return;
        } else if(idInput.value.length > y) {
            paramBorder(idInput);
            p.textContent = `Veillez renseigner un ${idInput.id} avec moins de ${y} caractères`;
            return;
        } else {
            idInput.style.borderColor = '';
        }
    }
   
    if(input.id == "nom") {
        charactLength(input, 3, 50)

    } else if(input.id == 'prenom') {
        charactLength(input, 3, 50)
    } else if(input.id == 'email') {
        regexEmail(input);
    } else if(input.id == "tel") {
        
    } else if(input.id == 'file') {
       
    }
    
};

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
function addContact() {
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
    // localStorage.setItem('contacts', JSON.stringify(contactList));
    viewContacts(contactList);
    formReset();
}

// la fonction qui supprime le contact
function deleteContact(contactElement, position) {
    contactList.splice(position, 1);
    let contact = contactElement.closest(".contact__profil");
    contact.remove();
}

// la fonction qui modifie le contact
function completedContact(contactElement, position) {
    let contact = contactList[position];

    prenom.value = contact.prenom;
    nom.value = contact.nom;
    tel.value = contact.tel;
    groupe.value = contact.groupe;
    email.value =contact.email;
    bio.value = contact.bio;
    file.value = contact.file;

    btnCreer.value = "Modifier";
    btnRenit.value = "Annuler";

    btnCreer.addEventListener('click', () => {
        deleteContact(contactElement, position);
        btnCreer.value = "Créer";
        btnRenit.value = "Réinit";
    })
    btnRenit.addEventListener('click', () => {
        prenom.value = '';
        nom.value = '';
        tel.value = '';
        groupe.value = '';
        email.value = '';
        bio.value = '';
        file.value = '';
        btnCreer.value = "Créer";
        btnRenit.value = "Réinit";
    })

}

// La fonction qui affiche chaque contact du tableau sur le DOM
function viewContacts(tab) {
    let figureTemplate = document.querySelector('#figure__template');
    for(let i = 0; i < tab.length; i++) {
        if(i == tab.length-1) {
            let index = i;
            let figureContent = figureTemplate.content.cloneNode(true);

            // figureContent.querySelector('.profil__image').setAttribute('src', file.value);
            figureContent.querySelector('.f-names').textContent = `${tab[i].prenom} ${tab[i].nom} - ${tab[i].groupe}`;
            figureContent.querySelector('.f-tel').textContent = `${tab[i].tel}`;
            figureContent.querySelector('.f-bio').textContent = `${tab[i].bio}`;

            figureContent.querySelector('.contact__profil').addEventListener('click', (e) => {
                const clickElement = e.target;
                if((clickElement.tagName == 'IMG') && (clickElement.className == 'profilBtn__completed')) {
                    completedContact(clickElement, index);
                }
                if((clickElement.tagName == 'IMG') && (clickElement.className == 'profilBtn__delete')) {
                    if(confirm("Voullez-vous vraiment supprimer le contact ?")) {
                        deleteContact(clickElement, index);
                    }
                }
            });

            divContactList.append(figureContent);
        }
    }      
}