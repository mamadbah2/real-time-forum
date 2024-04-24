import { FilterForm } from "../pages/home.js";
import { customLogin } from "../pages/login.js";
import { fetches } from "../services.js";

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
                    <span>
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

            <div id="bas">
                <div>
                    <h2>About Us <code>&#9940;</code></h2>
                    <p>
                        Les gars, les gars... <code>&#128683;</code> <code>&#128683;</code> <code>&#9888;</code> <br />
                        Tout fail a ce forum sera condamné sous peine de mort.
                        En cas de fail, Vous avez le droit de garder le silence.
                        Tout ce que vous direz pourra être retenu contre vous devant un tribunal.
                        Vous avez le droit à un avocat. Si vous n'avez pas les moyens de
                        vous en offrir un, un avocat vous sera désigné d'office.
                    </p>
                    </div>
                    <div>
                    <h4>Copyrigths <code>&#169;</code></h4>
                    <p>
                        2024 Tous droits réservés <code>&#128512;</code> realisé avec du <code>&#128150;</code> et un peu de
                        <code>&#9749;</code>
                    </p>
                    </div>
            </div>
    `;
        this.displayHome()
        this.#makeEventListener()

    }

    async displayHome() {
        const data = await fetches('home')
        const online = this.querySelector('#online')
        const logout = this.querySelector('#logout')
        if (data.Disconnected) {
            online.innerHTML = `
                <h4>Bienvenue </h4>
                <p>Vous profitez mieux en etant connecté</p>
            `;

            logout.innerHTML = `<a href="">Login</a>`;
        }

    } 

    #makeEventListener() {
        const body = document.querySelector('body')
        this.querySelector('#logout').addEventListener('click', (e) => {
            e.preventDefault()
            const loginCustomNode = document.createElement('custom-login')
            body.appendChild(loginCustomNode);
            if (!customElements.get('custom-login')) customElements.define('custom-login', customLogin)
            body.querySelector('#website custom-header').remove()
        })
    }

}