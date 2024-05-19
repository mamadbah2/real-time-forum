import { connectedPerson, disconnectedManager, fetches, invokeTag } from "../../utils.js";

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
                        <a>POST  <i class="fa-solid fa-arrow-up-from-bracket"></i></a>
                    </span>
                    <span id="logout">
                        <a>Logout <i class="fa-solid fa-share-from-square"></i></a>
                    </span>
                </nav>
            </div>
    `;
    }

    async headerInfo() {
        const data = await fetches('home')
        const online = this.querySelector('#online')
        const logout = this.querySelector('#logout')
        disconnectedManager.setState(data.Disconnected) // Cela gere l'etat de connexion au niveau du front
        if (data.Disconnected) {
            online.innerHTML = `
                <h4>Bienvenue </h4>
                <p>Vous profitez mieux en etant connecté</p>
            `;
            logout.innerHTML = `<a style="color:white" href="">Login</a>`;
        } else {
            online.innerHTML = `
            <p><strong>Mail </strong> <span class="connected">${data.UserInfo.Email}</span></p>
            <p><strong>Username </strong> <span class="connected">${data.UserInfo.Username}</span></p>
            <p><strong>Gender </strong> <span class="connected">${data.UserInfo.Gender}</span></p>
            <p><strong>Lastname </strong> <span class="connected">${data.UserInfo.Firstname}</span></p>
            <p><strong>Firstname </strong> <span class="connected">${data.UserInfo.Lastname}</span></p>
            <p><strong>Age </strong> <span class="connected">${data.UserInfo.Age}</span></p>
            <p id="ownerId" style="display:none">${data.UserInfo.User_id} </p>
            <p id="ownerUsername" style="display:none">${data.UserInfo.Username} </p>
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
                    document.cookie == "session_token:deleted"
                    let ownerId = document.querySelector('#ownerId').textContent
                    for (let i = 0; i < array.length; i++) {
                        if (connectedPerson[i] == parseInt(ownerId) ) {
                            connectedPerson.splice(i, 1)
                        } 
                    }
                })
            }
            invokeTag('custom-login', e)
        })

        this.querySelector('#postcreate').addEventListener('click', (e) => {
            if (!disconnectedManager.getState()) {
                e.preventDefault()
                document.querySelector('body').appendChild(document.createElement('post-form'))
                document.querySelector('#bar-filter').innerHTML = ''
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