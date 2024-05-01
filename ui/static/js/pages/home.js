import { disconnectedManager, fetches, fetchesPost, invokeTag } from "../services.js"


export class HomeSection extends HTMLElement {
    connectedCallback() {
        this.constructHomeSection()
    }

    constructHomeSection() {
        if (!customElements.get("custom-filter")) customElements.define("custom-filter", FilterForm)
        if (!customElements.get("custom-posts")) customElements.define("custom-posts", ListPost)
        this.innerHTML = `
            <custom-filter></custom-filter>
            <custom-posts></custom-posts>
        `
    }
}

class FilterForm extends HTMLElement {
    connectedCallback() {
        this.constructForm()
        this.filterInformation()
        this.#makeEventListener()
    }

    async filterInformation() {
        const homeData = await fetches('home')
        document.querySelector('.checkCategory').innerHTML = `${homeData.Categores.map(category => `<label for=${category.Name}>
            <input type="checkbox" name="filterCategoryCheck" id=${category.Name} value=${category.Name}>
            <span>${category.Name}</span>
        </label>`).join('')}`
    }

    #makeEventListener() {
        const formFilterSubmit = document.querySelector('#bar-filter form input[name="filter"]')
        formFilterSubmit.addEventListener('click', (e) => {
            e.preventDefault();

            // Reinitialision de tous les posts
            document.querySelector('custom-posts').remove()
            document.querySelector('custom-home').appendChild(document.createElement('custom-posts'))

            // Recuperation des valeurs du form
            const checkedFliked = document.getElementById('fliked').checked
            const checkedFposted = document.getElementById('fposted').checked
            const checkCategory = document.querySelectorAll('#bar-filter .checkCategory label')
            // Traitement des valeurs du form en différé


            setTimeout(() => {
                const listPostElt = document.querySelector('#list-post')
                console.log(listPostElt.innerHTML)
                const posts = listPostElt.querySelectorAll('.post')
                listPostElt.innerHTML = ''
                console.log(posts)
                let statusCheck = false
                checkCategory.forEach((categoryNode) => {
                    if (categoryNode.querySelector('input').checked) {
                        statusCheck = true
                        posts.forEach(post => {
                            let textCategory = Array.from(post.querySelectorAll('.hcontent ul li')).reduce((acc, node) => {
                                return acc + node.textContent
                            }, '');
                            if (textCategory.includes(categoryNode.getAttribute('for'))) {
                                listPostElt.appendChild(post)

                            }
                        });
                    }
                })

                if (!disconnectedManager.getState()) {
                    if (checkedFliked) {
                        posts.forEach((post) => {
                            let likedElt = post.querySelector('.haction button[name="like"]')
                            if (likedElt.getAttribute('value') === 'true') {
                                listPostElt.removeChild(post)
                            }
                        })
                    }
                    if (checkedFposted) {
                        posts.forEach((post) => {
                            let postCreator = post.querySelector('.hinfo > p').textContent
                            let actualUsername = document.querySelector('#ownerUsername').textContent
                            if (postCreator !== actualUsername) {
                                listPostElt.removeChild(post)
                            }
                        })
                    }
                }

                if (!(checkedFliked || checkedFposted || statusCheck)) {
                    listPostElt.parentElement.remove()
                    document.querySelector('custom-home').appendChild(document.createElement('custom-posts'))
                }
            }, 500)
        })
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
        `
    }
}

class ListPost extends HTMLElement {
    connectedCallback() {
        this.postInformation()

    }

    async postInformation() {
        const homeData = await fetches('home')
        this.innerHTML = `<div id="list-post">
        ${homeData.PostsInfo.map(post => {
            return `
                <div class="post" id="${post.Post_id}">
        <div class="p">
            <div class="hinfo">
                <p>Publié par : <span>${post.Username}</span></p>
                <p>Date Heure UTC : <span>${post.Creation_Date}</span></p>
            </div>
            <div class="hcontent">
                <ul>
                    ${post.Categories.map(c => ` <li> ${c} </li>`).join('')}
                </ul>
                <p style:="overflow-wrap:break-word;">
                    ${post.Content}
                </p>
            </div>
                <form action="" method="post">
                    <div style="display: none;">
                        <input type="text" name="postId" value="${post.Post_id}">
                    </div>
                    <div class="haction">
                        <div class="like">
                            <button name="like" value="${post.LikeActualUser}" type="submit">
                                <span><i class="fa-regular fa-thumbs-up"></i></span>
                            </button>
                            <span class="i"> ${post.Like_Number} </span>
                        </div>
                        <div class="dislike">
                            <button name="dislike" value="${post.DislikeActualUser}" type="submit">
                                <span><i class="fa-regular fa-thumbs-down"></i></span>
                            </button>
                            <span class="i"> ${post.Dislike_Number} </span>
                        </div>
                        <div class="comment">
                            <a href="">
                                <span><i class="fa-regular fa-comments"></i></span>
                            </a>
                            <span>${post.Comment_Number} </span>
                        </div>
                    </div>
                </form>
        </div>
        ${(post.ImageName !== "" ? `<div class="p-img"><img src="/static/uploads/${post.ImageName}" alt="image de post"></div>` : '')}
    </div>
            `}).join('')}
            </div>
            `;

        this.#makeEventListener()
    }

    #makeEventListener() {
        // Ici dorenavant vu qu'il y a plusieurs evenement à definir, on écrira des fonctions dans la methode.

        // Tout d'abord evenement gerant les like et dislike
        const btns = this.querySelectorAll('button')
        const commentBtns = this.querySelectorAll('.comment a')
        btns.forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault()
                if (disconnectedManager.getState()) {
                    invokeTag('custom-login', e)
                } else {
                    const form = btn.closest('form')
                    const formData = new FormData(form)
                    formData.append(btn.getAttribute('name'), btn.getAttribute('value'))
                    fetchesPost('home', formData).then((data) => {
                        if (!data.BadRequestForm) {
                            const btnLike = form.querySelector('.like button')
                            const btnDislike = form.querySelector('.dislike button')
                            const compteurLikeElt = btnLike.parentElement.querySelector('.i')
                            const compteurDislikeElt = btnDislike.parentElement.querySelector('.i')

                            btnLike.setAttribute('value', data.PostInfo.LikeActualUser)
                            btnDislike.setAttribute('value', data.PostInfo.DislikeActualUser)

                            console.log(data.PostInfo.LikeActualUser)
                            compteurLikeElt.textContent = data.PostInfo.Like_Number
                            compteurDislikeElt.textContent = data.PostInfo.Dislike_Number

                        }
                    })
                }
            })
        })


        commentBtns.forEach((cbtn) => {
            cbtn.addEventListener('click', (e) => {
                e.preventDefault()
                const main = document.querySelector('main')
                const btnListPost = document.querySelector('#postenum')
                const actualPostElt = cbtn.closest('.post')
                main.innerHTML = `<custom-comment data-pid="${actualPostElt.id}"></custom-comment>`
                btnListPost.addEventListener('click', (e) => {
                    e.preventDefault()
                    main.innerHTML = `<custom-home></custom-home>`
                    btnListPost.removeEventListener('click', null)
                })
            })
        })

    }

}

export class SectionFoot extends HTMLElement {
    connectedCallback() {
        this.constructSection()
    }

    constructSection() {
        this.innerHTML = `
        <div>
            <h2>About Us <code>&#9940;</code></h2>
            <p>
                Les gars, les gars... <code>&#128683;</code> <code>&#128683;</code> <code>&#9888;</code> <br />
                Tout fail a ce forum sera condamné sous peine de mort.
                En cas de fail, Vous avez le droit de garder le silence.
                Tout ce que vous direz pourra être retenu contre vous devant un tribunal.
                Vous avez le droit à un avocat. Si vous n'avez pas les moyens de
                vous en offrir un, un avocat vous sera désigné d'office.
            </p>
        </div>
        <div>
            <h4>Copyrigths <code>&#169;</code></h4>
            <p>
                2024 Tous droits réservés <code>&#128512;</code> realisé avec du <code>&#128150;</code> et un peu de
                <code>&#9749;</code>
            </p>
        </div>
        `
    }

}