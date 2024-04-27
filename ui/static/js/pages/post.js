import { fetches } from "../services.js";

export class PostForm extends HTMLElement {
    connectedCallback() {
        this.renderForm()
        this.fetchCategories()
        // this.#attachEventListeners()
    }

    async fetchCategories() {
        const creatData = await fetches('home')
        document.querySelector('.checkCategory').innerHTML = ` ${creatData.Categores.map(category => `
            <label for="${category.Name}">
                <input type="checkbox" name="categorCheck" value="${category.Name}" id="${category.Name}">
                <span>${category.Name}</span>
            </label>
        `).join('')}`
    }

    async renderForm() {
        this.innerHTML = `
            <main>
                <form id="post-form" method="post" enctype="multipart/form-data">
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
        this.#attachEventListeners();
    }

    #attachEventListeners() {
        this.querySelector('.select-image').addEventListener('click', (e) => {
            e.preventDefault()
            const fileInput = this.querySelector('input[type="file"]');
            fileInput.click(); // Ouvrir la boîte de dialogue pour sélectionner un fichier
        });

        // Écoutez l'événement "change" sur l'élément input[type="file"]
        this.querySelector('input[type="file"]').addEventListener('change', (event) => {
            // Gérez la sélection de l'image ici
            const selectedFile = event.target.files[0]; // Obtenez le fichier sélectionné
            console.log('Image sélectionnée :', selectedFile);
            // Vous pouvez maintenant traiter le fichier sélectionné comme vous le souhaitez, par exemple l'afficher dans un aperçu, l'envoyer au serveur, etc.
        });
    }


}

