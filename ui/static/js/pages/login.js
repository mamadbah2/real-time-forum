export class customLogin extends HTMLElement {
    connectedCallback() {
        this.constructLogin();
        this.#makeEventListener();
    }

    constructLogin() {
        this.innerHTML = `
        <main id="register-login-main">
    <form class="form" method="post">
        <div class="title">
            Forum.01,<br>
            <span><a href="">tu n'as pas de compte ?</a></span>
        </div>
        <input class="input" name="email" placeholder="Email" type="email">
        <input class="input" name="password" placeholder="Password" type="password">
        
        <button class="button-confirm">Let's go →</button>
    </form>

</main>
        `;
    }

    #makeEventListener() {
        this.querySelector('.title span a').addEventListener('click', (e) => {
            e.preventDefault()
            document.querySelector('body').appendChild(document.createElement('custom-register'))
            // if (!customElements.get('custom-register')) customElements.define('custom-register', customRegister)
            this.remove()
        })
    }

}

export class customRegister extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <main id="register-login-main">
    <form class="form" method="post">
        <div class="title">
            Forum.01,<br>
            <span><a href="">t'as déjà un compte ?</a></span>
        </div>
        <input class="input" name="nickname" placeholder="Nickname" type="username">
        <input class="input" name="age" placeholder="Age" type="date">
        <select class="input" name="gender" placeholder="Gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>
        <input class="input" name="firstname" placeholder="First Name" type="username">
        <input class="input" name="lastname" placeholder="Last Name" type="username">
        <input class="input" name="email" placeholder="Email" type="email">
        <input class="input" name="password" placeholder="Password" type="password">

        <button class="button-confirm">Let's go →</button>
    </form>

</main>
        `;

        this.#makeEventListener();
    }

    #makeEventListener() {
        this.querySelector('.title span a').addEventListener('click', (e) => {
            e.preventDefault()
            document.querySelector('body').appendChild(document.createElement('custom-login'))
            // if (!customElements.get('custom-login')) customElements.define('custom-login', customLogin)
            this.remove()
        })
    }
}