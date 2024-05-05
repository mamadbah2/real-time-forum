import { disconnectedManager, fetches, fetchesPost, invokeTag } from "../../utils.js";

export class ListPost extends HTMLElement {
    connectedCallback() {
        this.postInformation();

    }

    async postInformation() {
        const homeData = await fetches('home');
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
            `;
        }).join('')}
            </div>
            `;

        this.#makeEventListener();
    }

    #makeEventListener() {
        // Ici dorenavant vu qu'il y a plusieurs evenement à definir, on écrira des fonctions dans la methode.
        // Tout d'abord evenement gerant les like et dislike
        const btns = this.querySelectorAll('button');
        const commentBtns = this.querySelectorAll('.comment a');
        btns.forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                if (disconnectedManager.getState()) {
                    invokeTag('custom-login', e);
                } else {
                    const form = btn.closest('form');
                    const formData = new FormData(form);
                    formData.append(btn.getAttribute('name'), btn.getAttribute('value'));
                    fetchesPost('home', formData).then((data) => {
                        if (!data.BadRequestForm) {
                            const btnLike = form.querySelector('.like button');
                            const btnDislike = form.querySelector('.dislike button');
                            const compteurLikeElt = btnLike.parentElement.querySelector('.i');
                            const compteurDislikeElt = btnDislike.parentElement.querySelector('.i');

                            btnLike.setAttribute('value', data.PostInfo.LikeActualUser);
                            btnDislike.setAttribute('value', data.PostInfo.DislikeActualUser);

                            console.log(data.PostInfo.LikeActualUser);
                            compteurLikeElt.textContent = data.PostInfo.Like_Number;
                            compteurDislikeElt.textContent = data.PostInfo.Dislike_Number;

                        }
                    });
                }
            });
        });


        commentBtns.forEach((cbtn) => {
            cbtn.addEventListener('click', (e) => {
                e.preventDefault();
                const main = document.querySelector('main');
                const btnListPost = document.querySelector('#postenum');
                const actualPostElt = cbtn.closest('.post');
                main.innerHTML = `<custom-comment data-pid="${actualPostElt.id}"></custom-comment>`;
                btnListPost.addEventListener('click', (e) => {
                    e.preventDefault();
                    main.innerHTML = `<custom-home></custom-home>`;
                    btnListPost.removeEventListener('click', null);
                });
            });
        });

    }

}
