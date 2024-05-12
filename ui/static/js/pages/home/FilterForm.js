import { fetches } from "../../utils.js";

export class FilterForm extends HTMLElement {
    connectedCallback() {
        this.constructForm();
        this.filterInformation();
        this.#makeEventListener();
    }

    async filterInformation() {
        const homeData = await fetches('home');
        document.querySelector('.checkCategory').innerHTML = `${homeData.Categores.map(category => `<label for=${category.Name}>
            <input type="checkbox" name="filterCategoryCheck" id=${category.Name} value=${category.Name}>
            <span>${category.Name}</span>
        </label>`).join('')}`;
    }

    #makeEventListener() {
        const formFilterSubmit = document.querySelector('#bar-filter form input[name="filter"]');
        formFilterSubmit.addEventListener('click', (e) => {
            e.preventDefault();

            // Reinitialision de tous les posts
            document.querySelector('custom-posts').remove();
            const customPosts = document.createElement('custom-posts');
            customPosts.style.display = 'none';
            document.querySelector('custom-home').appendChild(customPosts);

            // Recuperation des valeurs du form
            const checkCategory = document.querySelectorAll('#bar-filter .checkCategory label');
            // Traitement des valeurs du form en différé
            setTimeout(() => {
                const listPostElt = document.querySelector('#list-post');
                console.log(listPostElt.innerHTML);
                const posts = listPostElt.querySelectorAll('.post');
                listPostElt.innerHTML = '';
                console.log(posts);
                let statusCheck = false;
                checkCategory.forEach((categoryNode) => {
                    if (categoryNode.querySelector('input').checked) {
                        statusCheck = true;
                        posts.forEach(post => {
                            let textCategory = Array.from(post.querySelectorAll('.hcontent ul li')).reduce((acc, node) => {
                                return acc + node.textContent;
                            }, '');
                            if (textCategory.includes(categoryNode.getAttribute('for'))) {
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
            }, 500);
        });
    }

    constructForm() {
        this.innerHTML = `
            <div id="bar-filter">
                <form action="" method="GET">
                    <div class="checkCategory">

                    </div>
                    <input type="submit" name="filter" value="valid">
                </form>
            </div>
        `;
    }
}
