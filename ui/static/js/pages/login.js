export class customLogin extends HTMLElement {
    connectedCallback() {
        document.querySelector('#website custom-header').innerHTML = ``
        this.innerHTML = `
        <main id="register-login-main">
        <form class="form" method="post">
            <div class="title">
                Forum.01,<br>
                <span><a href="/register">tu n'as pas de compte ?</a></span>
            </div>
            <input class="input" name="email" placeholder="Email" type="email">
            <input class="input" name="password" placeholder="Password" type="password">
            
            <button class="button-confirm">Let's go →</button>
        </form>
    
    </main>
        `;
    }
}

export class customRegister extends HTMLElement {
    connectedCallback() {
        document.querySelector('#website custom-header').innerHTML = ``
        this.innerHTML = `
        <main id="register-login-main">
    <form class="form" method="post">
        <div class="title">
            Forum.01,<br>
            <span><a href="/login">t'as déjà un compte ?</a></span>
        </div>
        <input class="input" name="username" placeholder="username" type="username">
        <input class="input" name="email" placeholder="Email" type="email">
        <input class="input" name="password" placeholder="Password" type="password">

        <button class="button-confirm">Let's go →</button>
    </form>

</main>
        `;
    }
}