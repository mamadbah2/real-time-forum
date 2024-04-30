import { disconnectedManager, fetches, invokeTag } from "../services.js";

export class customHeader extends HTMLElement {

    connectedCallback() {
        this.constructHeader()
        this.headerInfo()
        this.#makeEventListener()
    }

    constructHeader() {
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
                        <a style="color:white" href="/logout">Logout</a>
                    </span>
                </nav>
            </div>
    `;
    }

    async headerInfo() {
        const data = await fetches('home')
        const online = this.querySelector('#online')
        const logout = this.querySelector('#logout')
        logout.style.background = 'red'
        disconnectedManager.setState(data.Disconnected) // Cela gere l'etat de connexion au niveau du front
        if (data.Disconnected) {
            online.innerHTML = `
                <h4>Bienvenue </h4>
                <p>Vous profitez mieux en etant connecté</p>
            `;
            logout.innerHTML = `<a style="color:white" href="">Login</a>`;
        } else {
            online.innerHTML = `
            <h4 id="ownerUsername">${data.UserInfo.Username} </h4>
            <p>${data.UserInfo.Email} </p>
            <p><strong>Status </strong> <span class="connected">Connected</span></p>
            <p>${data.UserInfo.LikeCounter} Like(s) <i class="fa-regular fa-thumbs-up"></i></p>
            <p>${data.UserInfo.CommentCounter} Comment(s) <i class="fa-regular fa-comments"></i></p>
            `;
        }

    }

    #makeEventListener() {
        this.querySelector('#logout').addEventListener('click', (e) => {
            e.preventDefault()
            if (!disconnectedManager.getState()) {
                fetches('logout').then((data) => {
                    if (!data.BadRequestForm) {
                        disconnectedManager.setState(true)
                    }
                })
            }
            invokeTag('custom-login', e)
        })

        this.querySelector('#postcreate').addEventListener('click', (e) => {
            if (!disconnectedManager.getState()) {
                invokeTag('post-form', e)
            } else {
                invokeTag('custom-login', e)
            }
        });

        this.querySelector('nav span:nth-child(2) > a').addEventListener('click', (e) => {
            e.preventDefault()
        })

    }

}