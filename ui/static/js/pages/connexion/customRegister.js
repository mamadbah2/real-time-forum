import { fetchesPost, socketManager, updateURL } from "../../utils.js";

export class customRegister extends HTMLElement {
    connectedCallback() {
        // updateURL('register')
        this.constructRegister();
        this.#makeEventListener();
        // this.#registereventlister()
    }

    constructRegister() {
        this.innerHTML = `
        <main id="register-login-main">
    <form class="form" method="post">
        <div class="title">
            <em>Forum.01,</em><br>
            <span><a href="">t'as déjà un compte ?</a></span>
        </div>
        <input class="input" name="nickname" placeholder="Nickname" type="text" required>
        <input class="input" name="age" placeholder="Age" type="number" required>
        <select class="input" name="gender" required>
            <option value=""><em>Select Gender</em></option>
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>
        <input class="input" name="firstname" placeholder="First Name" type="text" required>
        <input class="input" name="lastname" placeholder="Last Name" type="text" required>
        <input class="input" name="email" placeholder="Email" type="email" required>
        <input class="input" name="password" placeholder="Password" type="password" required>

        <button class="button-confirm">Let's go →</button>
    </form>

</main>
        `;
    }

    #makeEventListener() {
        // Lorqu'on clique sur j'ai déjà un compte ca nous renvoie à login
        this.querySelector('.title span a').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('body').appendChild(document.createElement('custom-login'));
            this.remove();
        });

        // Lorsqu'on clique sur Forum01 on revient à la page d'accueil
        /* this.querySelector('.title em').addEventListener('click', (e) => {
            document.querySelector('#website').innerHTML = `<custom-header></custom-header>
            <main>
                <custom-home></custom-home>
            </main>
            <custom-section></custom-section>`;
            this.remove();
        }); */

        // Lorsqu'on soumet le formulaire 
        this.querySelector('.form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            console.log('--------', formData)
            let state = await fetchesPost('register', formData);
            console.log('--------', state);
            if (state.BadRequestForm !== true) {
                document.querySelector('#website').innerHTML = `<custom-header></custom-header>
                <main>
                    <custom-home></custom-home>
                </main>
                <custom-section></custom-section>`;
                this.remove();
                socketManager.set('ws://localhost:4000/chat')
            } else {
                const errNode = document.createElement('h5');
                errNode.textContent = "Mauvais renseignements des champs";
                errNode.className = 'Error';
                this.querySelector('.title').appendChild(errNode);
                setTimeout(() => {
                    errNode.remove();
                }, 3000);
            }
        });
    }
}
