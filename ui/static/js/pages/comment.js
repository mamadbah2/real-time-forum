import { fetches, disconnectedManager, fetchesPost } from "../services.js"

export class CommentSection extends HTMLElement {
    connectedCallback() {
        if (!customElements.get('custom-detail')) customElements.define('custom-detail', DetailPost)
        if (!customElements.get('custom-comment-form')) customElements.define('custom-comment-form', CommentForm)

        this.constructCommentSection()
    }

    constructCommentSection() {
        this.innerHTML = `
            <custom-detail></custom-detail>
            <custom-comment-form></custom-comment-form>
        `
    }

}

class DetailPost extends HTMLElement {
    connectedCallback() {
        this.postInformation()
    }

    async postInformation() {
        let pid = document.querySelector('custom-comment').dataset.pid
        const commentData = await fetches(`comment?${pid}`)
        this.innerHTML = `
        <div id="list-post">

            <div class="post post-comment" id="${commentData.PostInfo.Post_id}">
                <div class="p">
                    <div class="hinfo">
                        <p>Publié par : <span>${commentData.PostInfo.Username}</span></p>
                        <p>Date Heure UTC : <span>${commentData.PostInfo.Creation_Date}</span></p>
                    </div>
                    <div class="hcontent">
                        <ul>
                        ${commentData.PostInfo.Categories.map(c => ` <li> ${c} </li>`).join('')}
                        </ul>
                        <p style="overflow-wrap:break-word;">
                            ${commentData.PostInfo.Content}
                        </p>
                    </div>
                    <div class="p-img">
                        <img src="/static/uploads/${commentData.PostInfo.ImageName}" alt="image de post">
                    </div>

                    
                    <form action="" method="post">
                        <div style="display: none;">
                            <input type="text" name="postId" value="${commentData.PostInfo.Post_id}">
                        </div>
                        <div class="haction">
                            <div class="like">
                                <button name="like" value="${commentData.PostInfo.LikeActualUser}" type="submit">
                                    <span><i class="fa-regular fa-thumbs-up"></i></span>
                                </button>
                                <span class="i"> ${commentData.PostInfo.Like_Number} </span>
                            </div>
                            <div class="dislike">
                                <button name="dislike" value="${commentData.PostInfo.DislikeActualUser}" type="submit">
                                    <span><i class="fa-regular fa-thumbs-down"></i></span>
                                </button>
                                <span class="i"> ${commentData.PostInfo.Dislike_Number} </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;

        this.#makeEventListener()
    }

    #makeEventListener() {
        // Tout d'abord evenement gerant les like et dislike
        const btns = this.querySelectorAll('button')

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
    }
}

class CommentForm extends HTMLElement {
    connectedCallback() {
        this.constructComment()
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
        `
    }

    commentInformation() {
        document.querySelector('#comments').innerHTML = `
        {{ range .CommentsInfo }}
                <div class="c" id="{{ .Comment_id }}">
                    <div class="cinfo">
                        <p>Commenté par : <span>{{ .Username }}</span></p>
                        <p>Le <span>{{ .Date_Creation }}</span></p>
                    </div>
                    <div class="ccontent">
                        <p style="overflow-wrap:break-word;">
                            {{ .Comment }}
                        </p>
                    </div>
                    {{ if $Disconnected }}
                    <form action="/logout" method="get">
                        {{ else }}
                        <form action="/comment?{{ $PostInfoPost_id  }}" method="post">
                            {{end}}
                            <input type="hidden" name="commentId" value="{{ .Comment_id }}">
                            <div class="caction">
                                <div class="like">
                                    <button type="submit" name="likeComment" value="{{ .LikeActualUser }}">
                                        <span><i class="fa-regular fa-thumbs-up"></i></span>
                                        <span> {{ .Like_Number }} </span>
                                    </button>
                                </div>
                                <div class="dislike">
                                    <button type="submit" name="dislikeComment" value="{{ .DislikeActualUser }}">
                                        <span><i class="fa-regular fa-thumbs-down"></i></span>
                                        <span> {{ .Dislike_Number }} </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                </div>
                {{ end }}
        `
    }
}