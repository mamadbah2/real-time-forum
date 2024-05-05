import { CommentForm } from "./CommentForm.js"
import { DetailPost } from "./DetailPost.js"

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