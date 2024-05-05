import { disconnectedManager, fetches } from "../../utils.js";

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
            const checkedFliked = document.getElementById('fliked').checked;
            const checkedFposted = document.getElementById('fposted').checked;
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

                if (!disconnectedManager.getState()) {
                    if (checkedFliked) {
                        posts.forEach((post) => {
                            let likedElt = post.querySelector('.haction button[name="like"]');
                            if (likedElt.getAttribute('value') === 'true') {
                                listPostElt.removeChild(post);
                            }
                        });
                    }
                    if (checkedFposted) {
                        posts.forEach((post) => {
                            let postCreator = post.querySelector('.hinfo > p').textContent;
                            let actualUsername = document.querySelector('#ownerUsername').textContent;
                            if (postCreator !== actualUsername) {
                                listPostElt.removeChild(post);
                            }
                        });
                    }
                }

                if (!(checkedFliked || checkedFposted || statusCheck)) {
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
                    <div class="checkFilter">
                        <label for="fliked">
                            <input type="checkbox" name="filterCheck" value="Liked-Post" id="fliked">
                            <span>My Liked Posts</span>
                        </label>
                        <label for="fposted">
                            <input type="checkbox" name="filterCheck" value="Created-Post" id="fposted">
                            <span>My Created Posts</span>
                        </label>
                    </div>
                    <div class="checkCategory">

                    </div>
                    <input type="submit" name="filter" value="valid">
                </form>
            </div>
        `;
    }
}
