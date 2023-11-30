// General variables

// Variables des formulaires
let prenom, nom, tel, groupe, email, bio, file, btnCreer, btnRenit, inputForm, imgUrl;

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
imgUrl;

// Variables sur la liste des contacts
let divContactList = document.querySelector('.listContact__content');
let contactProfil = document.querySelector('.contact__profil');

// Tableau des contacts stocké dans le local storage
let contactList = window.localStorage.getItem('contactList');
if(contactList === null) {  
    contactList = [];
} else {
    contactList = JSON.parse(contactList);
    viewContacts()
}

// Events
btnCreer.addEventListener('click', (e) => {
    e.preventDefault();
    addContact();
});
btnRenit.addEventListener('click', formReset);
inputForm.forEach((element) => {
    element.addEventListener('blur', () => {
        validation(element);
    })
})
file.addEventListener("change", (event) => {
    const files = event.target.files;
    if(document.querySelector('.file img')) {
        document.querySelector('.file img').remove();
    }
    for (const file of files) {
        let img = document.createElement("img");
        const reader = new FileReader();
        console.log(reader);
        reader.onload = () => {
            document.querySelector('.file span').style.display = 'none';
            document.querySelector('.file label').appendChild(img);
            imgUrl = reader.result; 
            img.src = imgUrl; 
        };
        reader.readAsDataURL(file);
    }
});


/* LES VALIDATIONS */
function validation(input) {
    let p;
    let errorMessage = (element) => {
        if(document.querySelector('.formContact ul p')) {
            document.querySelector('.formContact ul p').remove();
            p = document.createElement('p');
            element.style.borderColor = 'red';
            p.style.color = 'red';
            element.insertAdjacentElement('afterend', p);
        } else {
            p = document.createElement('p');
            element.style.borderColor = 'red';
            p.style.color = 'red';
            element.insertAdjacentElement('afterend', p);
        }
    }
    let cleanMessage = (element) => {
        if(document.querySelector('.formContact ul p')) {
            document.querySelector('.formContact ul p').remove();
            element.style.border = ''
        }
    }
    let charactLength = (element, x, y) => {
        if(element.value.length < x) {
            errorMessage(element);
            document.querySelector('.formContact ul p').textContent = `Veillez renseigner un ${input.id} avec plus de ${x} caractères`;
            return;
        } else if(element.value.length > y) {
            errorMessage(element);
            p.textContent = `Veillez renseigner un ${element.id} avec moins de ${y} caractères`;
            return;
        } else {
            cleanMessage(element)
        }
    }
    let telValid = (idInput) => {
        let regex = /^(084|085|080|089|081|082|099|097|090)[0-9]{7}$/;
        if(isNaN(idInput.value)) {
            errorMessage(idInput);
            p.textContent = "Veillez renseigner un numéro de téléphone valide";
            return;
        } else if(!(idInput.value.length === 10)) {
            errorMessage(idInput);
            p.textContent = "Veillez renseigner un numéro de téléphone avec 10 chiffres ";
            return;
        } else if(!regex.test(idInput.value)) {
            console.log(regex.test(idInput.value));
            errorMessage(idInput);
            p.textContent = "Veillez renseigner un numéro de téléphone au format valide";
            return;
        } else if(contactList.find((element) => element.tel == idInput.value) !== undefined) {
            console.log(idInput.value);
            errorMessage(idInput);
            p.textContent = "Le numéro de téléphone est déjà utilisé ";
            return;
        } else {
            cleanMessage(idInput)
        }
    }
    let emailValid = (input) => {
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;        
        if(!regex.test(input.value)) {
            errorMessage(input);
            p.textContent = "Veillez renseigner une adresse email valide";
            return;
        } else if(contactList.find((element) => element.email == input.value) !== undefined) {
            errorMessage(input);
            p.textContent = "Email existe déjà";
            return;
        } else {
            cleanMessage(input);
        }  
    }
    let imgValid = (idInput) => {
        let regex = /.+\.(png|jpg)$/;

        if(!regex.test(idInput.value)) {
            errorMessage(idInput);
            p.textContent = "Veillez renseigner une image valide";
            return;
        } else if('5Mo') {
            errorMessage()
            p.textContent = "le poids de l’image doit être inférieur à 5 Mo";
            return;
        }
    }
    

    if(input.id == "prenom" || input.id == "nom") {
        charactLength(input, 3, 50)

    } else if(input.id == "tel") {
        telValid(input);       
    }  else if(input.id == 'email') {
        emailValid(input);
    }
    else if(input.id == 'file') {
       imgValid(input);
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
    imgUrl = "";

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
    document.querySelector('.file img').remove();

}

// la fonction de confirmation de la suppression d'un contact
function confirmDelete(element, indexElement) {
    let div = document.createElement('div');
    div.classList.add('div__confirm');
    div.innerHTML = `
                <p>Voulez-vous vraiment supprimer ce contact ?</p>
                <div>
                    <button class="delete-annule">Annuler</button>
                    <button class="delete-ok">Ok</button>
                </div>
                `
    div.querySelector('.delete-annule').onclick = () => {
        div.remove(); 
        element.closest(".contact__profil").classList.remove('contact__profil-confirm');
    };
    div.querySelector('.delete-ok').onclick = () => {deleteContact(element, indexElement)}
    element.closest(".contact__profil").appendChild(div);
    element.closest(".contact__profil").classList.add('contact__profil-confirm');
}

// la fonction qui supprime le contact
function deleteContact(contactElement, position) {
    contactElement.closest(".contact__profil").remove();
    contactList.splice(position, 1);
    const tabString = JSON.stringify(contactList);
    window.localStorage.setItem('contactList', tabString);
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
    imgUrl = contact.file;

    btnCreer.value = "Modifier";
    btnRenit.value = "Annuler";

    btnCreer.addEventListener('click', () => {
        deleteContact(contactElement, position);
        viewContacts();
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
        imgUrl = '';
        btnCreer.value = "Créer";
        btnRenit.value = "Réinit";
    })

}

// La fonction qui affiche chaque contact du tableau sur le DOM
function viewContacts() {
    divContactList.innerHTML = '';
    let figureTemplate = document.querySelector('#figure__template');
    for(let i = 0; i < contactList.length; i++) {
        let index = i;
        let figureContent = figureTemplate.content.cloneNode(true);

        figureContent.querySelector('.profil__image').src = `${contactList[i].file}`;
        figureContent.querySelector('.f-names').textContent = `${contactList[i].prenom} ${contactList[i].nom} - ${contactList[i].groupe}`;
        figureContent.querySelector('.f-tel').textContent = `${contactList[i].tel}`;
        figureContent.querySelector('.f-bio').textContent = `${contactList[i].bio}`;

        figureContent.querySelector('.contact__profil').addEventListener('click', (e) => {
            const clickElement = e.target;
            if((clickElement.tagName == 'IMG') && (clickElement.className == 'profilBtn__completed')) {
                completedContact(clickElement, index);
            }
            if((clickElement.tagName == 'IMG') && (clickElement.className == 'profilBtn__delete')) {
                 confirmDelete(clickElement, index);

            }
        });

        divContactList.append(figureContent);
    }      
}