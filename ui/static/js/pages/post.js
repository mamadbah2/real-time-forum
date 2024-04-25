import { fetches } from "../services.js";

export class PostForm extends HTMLElement {
    connectedCallback() {
        this.renderForm()
    }

    async fetchCategories() {
        const creatData = await fetches('home')
        return creatData.Categores.map(category => `
            <label for="${category.name}">
                <input type="checkbox" name="categorCheck" value="${category.id}" id="${category.name}">
                <span>${category.name}</span>
            </label>
        `).join('');
    }

    async renderForm() {
        const categories = await this.fetchCategories()
        this.innerHTML = `
            <main>
                <form id="post-form" method="post" enctype="multipart/form-data">
                    <div class="checkCategory">
                        ${categories}
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
        });
    }
}

