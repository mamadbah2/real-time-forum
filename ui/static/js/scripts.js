// Enregistre la position de défilement lorsqu'un utilisateur fait défiler la page
window.addEventListener('scroll', function () {
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

// Récupère la position de défilement enregistrée et rétablit la position au chargement de la page
window.addEventListener('load', function () {
    const selectImage = document.querySelector('.select-image');
    const inputFile = document.querySelector('#file');
    const imgArea = document.querySelector('.img-area');

    selectImage.addEventListener('click', function (event) {
        event.preventDefault();
        inputFile.click();
    })

    inputFile.addEventListener('change', function () {
        // recupere l'image dans le inputFile
        const image = this.files[0]
        if (image.size < 20000000) {
            // cree une nouvelle instance fileReader
            const reader = new FileReader();
            // definit une fonction qui est appele des la fin de lecture du fichier
            reader.onload = () => {
                // S'il y avait deja une image il va l'enlever
                const allImg = imgArea.querySelectorAll('img');
                allImg.forEach(item => item.remove());
                // Dans reader.result se trouve stocker le resultat de 
                // reader.readAsDataURL(image);
                const imgUrl = reader.result;
                const img = document.createElement('img');
                img.src = imgUrl;
                imgArea.appendChild(img);
                imgArea.classList.add('active');
                // Stocke dans l'attribut data-img de la balise
                // <div class="img-area" data-img="">  le nom du l'img
                imgArea.dataset.img = image.name;
            }
            reader.readAsDataURL(image);
        } else {
            alert("Image size more than 2MB");
        }
    })

    var scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition !== null) {
        window.scrollTo(0, scrollPosition);
        sessionStorage.removeItem('scrollPosition'); // Supprime la position de défilement après l'avoir restaurée
    }


});




