import { disconnectedManager, fetches, invokeTag } from "../../utils.js";

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
                        <a>Ajouter un post</a>
                    </span>
                    <span id="postenum">
                        <a>Liste Postes</a>
                    </span>
                    <span id="logout">
                        <a style="color:white">Logout</a>
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
                e.preventDefault()
                document.querySelector('body').appendChild(document.createElement('post-form'))
            } else {
                invokeTag('custom-login', e)
            }
        });

        this.querySelector('nav span:nth-child(2) > a').addEventListener('click', (e) => {
            e.preventDefault()
        })

        this.querySelector('#logo').addEventListener('click', () => {
            const body = document.querySelector('body')

            body.innerHTML = `<div id="website">
            <custom-header></custom-header>
            <main>
            
            </main>
            <custom-section></custom-section>
        </div>`

            setTimeout(() => {
                body.innerHTML = `<div id="website">
                <custom-header></custom-header>
                <main>
                    <custom-home></custom-home>
                </main>
                <custom-section></custom-section>
            </div>`
            }, 500);

        })

    }

}