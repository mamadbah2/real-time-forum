import { fetches } from "../services.js"

export class FilterForm extends HTMLElement {
    connectedCallback() {
        console.log("barry")
        const categories = fetches('home')
        console.log("Barry");
        console.log(categories)
        this.constructForm(categories)    
    }

    constructForm(categories) {
        const disconnected = this.getAttribute('disconnected') === 'true'

        this.innerHTML = `
            <div id="bar-filter">
                <form action="${disconnected ? '/logout' : '/'}" method="GET">
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
                        ${categories.map(category => `
                            <label for="${category.Name}">
                                <input type="checkbox" name="filterCategoryCheck" id="${category.Name}" value="${category.Name}">
                                <span>${category.Name}</span>
                            </label>
                        `).join('')}
                    </div>
                    <input type="submit" name="filter" value="valid">
                </form>
            </div>
        `
    }
}