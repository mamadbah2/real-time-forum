import { customLogin } from "../pages/login.js";
import { fetches } from "../services.js";

export class customHeader extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `
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
    `;
        this.displayHome()
        this.makeEventListener()

    }

    async displayHome() {
        const data = await fetches('home')
        const online = this.querySelector('#online')
        const logout = this.querySelector('#logout')
        console.log(data)

        if (data.Disconnected) {
            online.innerHTML = `
                <h4>Bienvenue </h4>
                <p>Vous profitez mieux en etant connecté</p>
            `;

            logout.innerHTML = `<a href="">Login</a>`;
        }

    }

    makeEventListener() {
        const body = document.querySelector('body')
        console.log(this.querySelector('#logout'));
        this.querySelector('#logout').addEventListener('click', (e) => {
            e.preventDefault()
            const loginCustomNode = document.createElement('custom-login')
            body.appendChild(loginCustomNode);
            customElements.define('custom-login', customLogin)
            body.querySelector('#website custom-header').remove()
        })
    }

}