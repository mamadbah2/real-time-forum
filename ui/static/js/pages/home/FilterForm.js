import { fetches } from "../../utils.js";

export class FilterForm extends HTMLElement {
    connectedCallback() {
        this.constructForm();
        this.filterInformation();
    }

    async filterInformation() {
        const homeData = await fetches('home');
        document.querySelector('.checkCategory').innerHTML = `${homeData.Categores.map(category => `<label for=${category.Name}>
            <input type="checkbox" name="filterCategoryCheck" id=${category.Name} value=${category.Name}>
            <span>${category.Name}</span>
        </label>`).join('')}`;
        this.#makeEventListener();

    }

    #makeEventListener() {
        // Récupérer toutes les cases à cocher de la catégorie
        const checkCategories = document.querySelectorAll('#bar-filter .checkCategory input[type="checkbox"]');

        // Fonction de filtrage
        function filterPosts() {
            // Réinitialisation de tous les posts
            const customPostsContainer = document.querySelector('custom-posts');
            if (customPostsContainer) {
                customPostsContainer.remove();
            }
            const customPosts = document.createElement('custom-posts');
            customPosts.style.display = 'none';
            document.querySelector('custom-home').appendChild(customPosts);

            // Récupération des valeurs du formulaire
            setTimeout(() => {
                const listPostElt = document.querySelector('#list-post');
                if (listPostElt) {
                    const posts = listPostElt.querySelectorAll('.post');
                    listPostElt.innerHTML = '';
                    let statusCheck = false;
                    checkCategories.forEach((categoryCheckbox) => {
                        if (categoryCheckbox.checked) {
                            statusCheck = true;
                            posts.forEach(post => {
                                let textCategory = Array.from(post.querySelectorAll('.hcontent ul li')).reduce((acc, node) => {
                                    return acc + node.textContent;
                                }, '');
                                if (textCategory.includes(categoryCheckbox.value)) {
                                    listPostElt.appendChild(post);
                                }
                            });
                        }
                    });

                    if (!statusCheck) {
                        listPostElt.parentElement.remove();
                        document.querySelector('custom-home').appendChild(document.createElement('custom-posts'));
                    }
                    customPosts.style.display = 'block';
                }
            }, 500);
        }

        // Ajouter des écouteurs d'événements 'change' à chaque case à cocher
        checkCategories.forEach((checkbox) => {
            checkbox.addEventListener('change', filterPosts);
        });

    }

    constructForm() {
        this.innerHTML = `
            <div id="bar-filter">
                <form action="" method="GET">
                    <div class="checkCategory">

                    </div>
                </form>
            </div>
        `;
    }
}
