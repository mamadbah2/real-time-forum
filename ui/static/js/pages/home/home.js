import { FilterForm } from "./FilterForm.js"
import { ListPost } from "./ListPost.js"


export class HomeSection extends HTMLElement {
    connectedCallback() {
        this.constructHomeSection()
    }

    constructHomeSection() {
        // updateURL('my_home')
        if (!customElements.get("custom-filter")) customElements.define("custom-filter", FilterForm)
        if (!customElements.get("custom-posts")) customElements.define("custom-posts", ListPost)
        this.innerHTML = `
            <custom-filter></custom-filter>
            <custom-posts></custom-posts>
        `
    }
}


