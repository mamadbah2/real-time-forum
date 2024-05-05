import { fetches, disconnectedManager, fetchesPost, invokeTag } from "../../utils.js";

export class CommentForm extends HTMLElement {
    connectedCallback() {
        this.constructComment();
        this.commentInformation();
    }

    constructComment() {
        this.innerHTML = `
            <form action="" method="post" id="form-comment">
                <textarea name="comment" rows="1" placeholder="Ajouter un commentaire"></textarea>
                <button name="send-comment" type="submit">
                    <i class="fa-regular fa-paper-plane"></i>
                </button>
            </form>
        
            <div id="comments">
                
            </div>
        `;
    }

    constructor() {
        super();
        this.pid = document.querySelector('custom-comment').dataset.pid;

    }

    async commentInformation() {
        const comments = await fetches(`comment?${this.pid}`);
        if (comments.CommentsInfo != null) {
            document.querySelector('#comments').innerHTML = `
            ${comments.CommentsInfo.map((c) => {
                return `
                <div class="c" id="${c.Comment_id}">
                        <div class="cinfo">
                            <p>Commenté par : <span>${c.Username}</span></p>
                            <p>Le <span>${c.Date_Creation}</span></p>
                        </div>
                        <div class="ccontent">
                            <p style="overflow-wrap:break-word;">
                                ${c.Comment}
                            </p>
                        </div>
                            <form action="" method="post">
                                <input type="hidden" name="commentId" value="${c.Comment_id}">
                                <div class="caction">
                                    <div class="like">
                                        <button type="submit" name="likeComment" value="${c.LikeActualUser}">
                                            <span><i class="fa-regular fa-thumbs-up"></i></span>
                                            <span class="i"> ${c.Like_Number} </span>
                                        </button>
                                    </div>
                                    <div class="dislike">
                                        <button type="submit" name="dislikeComment" value="${c.DislikeActualUser}">
                                            <span><i class="fa-regular fa-thumbs-down"></i></span>
                                            <span class="i"> ${c.Dislike_Number} </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                    </div>
            `;
            }).join('')}
                    
            `;

        }

        this.#makeEventListener();
    }

    #makeEventListener() {
        const btns = this.querySelectorAll('.caction button');
        const commentFormBtn = this.querySelector('button[name="send-comment"]');

        // J'l ai mis en fonction parce que j'ai besoin de lui dans 2 partie du code
        function MakeEventReaction(btns, pid) {
            btns.forEach((btn) => {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (disconnectedManager.getState()) {
                        invokeTag('custom-login', e);
                    } else {
                        const form = btn.closest('form');
                        const formData = new FormData(form);
                        formData.append(btn.getAttribute('name'), btn.getAttribute('value'));
                        fetchesPost(`comment?${pid}`, formData).then((data) => {
                            if (!data.BadRequestForm) {
                                const btnLike = form.querySelector('.like button');
                                const btnDislike = form.querySelector('.dislike button');
                                const compteurLikeElt = btnLike.parentElement.querySelector('.i');
                                const compteurDislikeElt = btnDislike.parentElement.querySelector('.i');

                                btnLike.setAttribute('value', data.CommentInfo.LikeActualUser);
                                btnDislike.setAttribute('value', data.CommentInfo.DislikeActualUser);

                                console.log(data.CommentInfo.LikeActualUser);
                                compteurLikeElt.textContent = data.CommentInfo.Like_Number;
                                compteurDislikeElt.textContent = data.CommentInfo.Dislike_Number;

                            }
                        });
                    }
                });
            });
        }

        MakeEventReaction(btns, this.pid);

        commentFormBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!disconnectedManager.getState()) {

                const formData = new FormData(commentFormBtn.closest('form'));
                formData.append("send-comment", "");
                fetchesPost(`comment?${this.pid}`, formData).then((data) => {
                    commentFormBtn.previousElementSibling.value = '';
                    const c = data.CommentInfo;
                    console.log("-----------", data);
                    const divComment = document.createElement('div');
                    divComment.className = "c";
                    divComment.id = `${c.Comment_id}`;
                    divComment.innerHTML = `
                        <div class="cinfo">
                            <p>Commenté par : <span>${c.Username}</span></p>
                            <p>Le <span>${c.Date_Creation}</span></p>
                        </div>
                        <div class="ccontent">
                            <p style="overflow-wrap:break-word;">
                                ${c.Comment}
                            </p>
                        </div>
                            <form action="" method="post">
                                <input type="hidden" name="commentId" value="${c.Comment_id}">
                                <div class="caction">
                                    <div class="like">
                                        <button type="submit" name="likeComment" value="${c.LikeActualUser}">
                                            <span><i class="fa-regular fa-thumbs-up"></i></span>
                                            <span class="i"> ${c.Like_Number} </span>
                                        </button>
                                    </div>
                                    <div class="dislike">
                                        <button type="submit" name="dislikeComment" value="${c.DislikeActualUser}">
                                            <span><i class="fa-regular fa-thumbs-down"></i></span>
                                            <span class="i"> ${c.Dislike_Number} </span>
                                        </button>
                                    </div>
                                </div>
                            </form> `;

                    return divComment;
                }).then((elt) => {
                    const commentBloc = document.querySelector('#comments');
                    MakeEventReaction(elt.querySelectorAll('button'), this.pid);
                    commentBloc.insertBefore(elt, commentBloc.firstChild);
                }).catch((reason) => { console.log(reason); });

            } else {
                invokeTag('custom-login', e);
            }

        });
    }
}
