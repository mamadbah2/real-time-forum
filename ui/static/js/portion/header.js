import { customLogin } from "../pages/login.js";
import { PostForm } from "../pages/post.js";
import { disconnected, fetches, invokeTag } from "../services.js";

export class customHeader extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `
            <div id="haut">
                <div id="logo">
                    <img src="/static/img/forum_logo.gif" alt="logo">
                </div>
                <div id="online">

                </div>

                <nav>
                    <span id="postcreate">
                        <a href="/create">Ajouter un post</a>
                    </span>
                    <span>
                        <a href="/">Liste Postes</a>
                    </span>
                    <span id="logout">
                        <a href="/logout">Logout</a>
                    </span>
                </nav>
            </div>
    `;
        this.headerInfo()
        this.#makeEventListener()

    }

    async headerInfo() {
        const data = await fetches('home')
        const online = this.querySelector('#online')
        const logout = this.querySelector('#logout')
        disconnected = data.Disconnected
        if (data.Disconnected) {
            online.innerHTML = `
                <h4>Bienvenue </h4>
                <p>Vous profitez mieux en etant connecté</p>
            `;

            logout.innerHTML = `<a href="">Login</a>`;
        }

    } 

    #makeEventListener() {
        this.querySelector('#logout').addEventListener('click', (e) => {
            invokeTag('custom-login')
        })
        
        this.querySelector('#postcreate').addEventListener('click', (e) => {
            e.preventDefault()
            if (!disconnected) {
                invokeTag('post-form')
            } else {
                invokeTag('custom-login')
            }

        });
    }

}