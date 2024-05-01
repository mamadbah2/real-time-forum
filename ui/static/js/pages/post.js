import { fetches, fetchesPost } from "../services.js";

export class PostForm extends HTMLElement {
    connectedCallback() {
        this.renderForm()
        this.fetchCategories()
    }

    async fetchCategories() {
        const creatData = await fetches('home')
        document.querySelector('.checkCategory').innerHTML = ` ${creatData.Categores.map(category => `
            <label for="${category.Name}">
                <input type="checkbox" name="categorCheck" value="${category.Category_id}" id="${category.Name}">
                <span>${category.Name}</span>
            </label>
        `).join('')}`
    }

    renderForm() {
        this.innerHTML = `
            <main>
                <button id="comeBack">
                <i class="fa-solid fa-xmark"></i>
                </button>
                <form id="post-form" method="post" enctype="multipart/form-data">
                <h5 class="Error"></h5>
                    <div class="checkCategory">

                    </div>
                    <!-- upload-img -->
                    <div class="container">
                        <input type="file" name="imagePost" id="file" accept="image/*" hidden>
                        <div class="img-area" data-img="">
                            <i class="fa-solid fa-circle-up icon"></i>
                            <h3>Upload Image</h3>
                            <p>Image size must be less than <span>20MB</span></p>
                        </div>
                        <button class="select-image">upload</button>
                    </div>
                    <!-- upload-img -->
                    <div id="area-text">
                        <textarea name="content" placeholder="Taper un post ici"></textarea>
                    </div>
                    <input type="submit" name="createPost" value="Creer">
                </form>
            </main>
        `;
        this.#makeEventListener();
    }

    #makeEventListener() {
        const selectImage = this.querySelector('.select-image');
        const inputFile = this.querySelector('#file');
        const imgArea = this.querySelector('.img-area');
        const btnBack = this.querySelector('#comeBack');
        const btnSubmitForm = this.querySelector('form input[name="createPost"]')

        btnBack.addEventListener('click', (e) => {
            e.preventDefault()
            document.querySelector('#website').innerHTML = `<custom-header></custom-header>
            <main>
                <custom-home></custom-home>
            </main>
            <custom-section></custom-section>`
            this.remove()
        })

        // Evenement du formulaire visant a creer le post
        btnSubmitForm.addEventListener('click', (e) => {
            e.preventDefault()
            const formData = new FormData(this.querySelector('form'))
            fetchesPost('create', formData, true).then((data) => {
                if (!data.BadRequestForm) {
                    document.querySelector('#website').innerHTML = `<custom-header></custom-header>
                    <main>
                        <custom-home></custom-home>
                    </main>
                    <custom-section></custom-section>`
                    this.remove()
                } else {
                    this.querySelector('.Error').textContent = "Veiller entrer de bonnes valeurs aux champs du formulaire"
                }
            }).catch((reason)=> {
                throw new Error(reason)
            })
        })

        // Previsionnage de l'image
        selectImage.addEventListener('click', function (event) {
            event.preventDefault();
            inputFile.click();
        })

        inputFile.addEventListener('change', function (e) {
            // recupere l'image dans le inputFile
            const image = this.files[0]
            console.log(image)
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
        });



    }


}

