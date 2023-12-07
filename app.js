// General variables

// VARIABLES SUR LE FORMULAIRE
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

// VARIABLES SUR LA LISTE DES CONTACTS

let divContactList = document.querySelector('.listContact__content');
let contactProfil = document.querySelector('.contact__profil');
let labelFile = document.querySelector('#labelfile');


// Tableau des contacts stocké dans le local storage
let contactList = window.localStorage.getItem('contactList');
if(contactList === null) {  
    contactList = [];
} else {
    contactList = JSON.parse(contactList);
    viewContacts();
}

// Events
btnCreer.addEventListener('click', (e) => {
    console.log(btnCreer);
    if(btnCreer.value = "Modifier") {
        addContact();
    } else {
        if(!nomPrenomValid(prenom) || !nomPrenomValid(nom) || !telValid(tel) || !emailValid(email)) {
            e.preventDefault();
        } else {
            addContact();
        }
    }
});
btnRenit.addEventListener('click', formReset);
document.querySelector('#mobileBtn__formView').addEventListener('click', () => {
    document.querySelector('.formContact').style.display = 'block';
    document.querySelector('.listContact').style.display = 'none';
    document.querySelector('#mobileBtn__formView').style.display = 'none';
})
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
    },
    false
);

/* LES VALIDATIONS */
function errorMessage(element) {
    if(document.querySelector(`#${element.id} + p`)) {
        document.querySelector(`#${element.id} + p`).remove();
        let p = document.createElement('p');
        element.style.borderColor = 'red';
        p.style.color = 'red';
        element.insertAdjacentElement('afterend', p);
    } else {
        let p = document.createElement('p');
        element.style.borderColor = 'red';
        p.style.color = 'red';
        element.insertAdjacentElement('afterend', p);
    }
}
function cleanMessage (element) {
    if(document.querySelector(`#${element.id} + p`)) {
        document.querySelector(`#${element.id} + p`).remove();
        element.style.border = ''
    }
}
function imgValid(element){
    const img = element;
    let label = document.querySelector('#labelfile');
    let imageView = () => {
        if(document.querySelector(`#labelfile img`)) {
            document.querySelector(`#labelfile img`).remove();
            let image = document.createElement("img");
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = () => {
                document.querySelector('.file span').style.display = 'none';
                document.querySelector('.file label').appendChild(image);
                imgUrl = reader.result;
                image.src = imgUrl;

            }         
        } else {
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
    }
    //^[\w\W]+(\.png|\.jpg)$     ou   /^image\/(png|jpg)$/
    if (!/^image\/(png|jpg|jpeg)$/.test(img.type)) {
        errorMessage(label);
        document.querySelector('#labelfile + p').textContent = "Veillez Renseigner une image valide"
        a = false;
        return a;
    } else {
        errorMessage(label);
        if (img.size > 5000000) {
            document.querySelector('#labelfile + p').textContent = "Le poids de l'image doit être inférieur à 5Mo";
            a = false;
            return a;
        } else {
            cleanMessage(label);
            imageView();
            a = true
            return a;
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
    document.querySelector('.listContact').style.display = 'none';
    contactElement.closest(".contact__profil").style.backgroundColor = '#99d2fa';

    let contact = contactList[position];

    prenom.value = contact.prenom;
    nom.value = contact.nom;
    tel.value = contact.tel;
    groupe.value = contact.groupe;
    email.value =contact.email;
    bio.value = contact.bio;
    imgUrl = contact.file;
    
    if(document.querySelector('#labelfile img')) {
        document.querySelector('#labelfile img').remove();
        let label = document.querySelector('#labelfile');
        let img = document.createElement('img');
        img.src = imgUrl;
        label.appendChild(img);
        document.querySelector('#labelfile span').style.display = 'none';
    } else {
        let label = document.querySelector('#labelfile');
        let img = document.createElement('img');
        img.src = imgUrl;
        label.appendChild(img);
        document.querySelector('#labelfile span').style.display = 'none';
    }
    

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
        document.querySelector('#labelfile img').remove();
    })

}

// La fonction qui affiche chaque contact du tableau sur le DOM
function viewContacts() {
    let pEmptyList = document.querySelector('.p__emptyList');
    let form = document.querySelector('.formContact');
    let listContact = document.querySelector('.listContact');

    if(contactList.length == 0) {
        form.classList.remove('formContact-mobile');
        listContact.classList.add('listContact-mobile')
        pEmptyList.style.display = 'block';  
        document.querySelector('#mobileBtn__formView').style.display = 'none';          
    } else {
        pEmptyList.style.display = 'none';
        let figureTemplate = document.querySelector('#figure__template');
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
                if((clickElement.className == 'img__completed') || (clickElement.className == 'btn__completed') || (clickElement.className == 'span__completed')) {
                    completedContact(clickElement, index);
                }
                if((clickElement.className == 'img__delete') || (clickElement.className == 'btn__delete') || (clickElement.className == 'span__delete')) {
                    confirmDelete(clickElement, index);
                }
            });

            divContactList.append(figureContent);

            form.classList.add('formContact-mobile');
            listContact.classList.remove('listContact-mobile');
        }
    }
}