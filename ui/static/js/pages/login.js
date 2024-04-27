import { fetches } from "../services.js"

export class customLogin extends HTMLElement {
    connectedCallback() {
        this.constructLogin()
        this.#makeEventListener()
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
        `
    }

    #makeEventListener() {
        this.querySelector('.title span a').addEventListener('click', (e) => {
            e.preventDefault()
            document.querySelector('body').appendChild(document.createElement('custom-register'))
            if (!customElements.get('custom-register')) customElements.define('custom-register', customRegister)
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
        `

        this.#makeEventListener()
        // this.#registereventlister()
    }

    #makeEventListener() {
        this.querySelector('.title span a').addEventListener('click', (e) => {
            e.preventDefault()
            document.querySelector('body').appendChild(document.createElement('custom-login'))
            if (!customElements.get('custom-login')) customElements.define('custom-login', customLogin)
            this.remove()
        })
    }

//     registerUser = async (userData) => {
//         try {
//             const response = await fetches('register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(userData)
//             })
//             if (!response.ok) {
//                 throw new Error('Failed to register user')
//             }
//             const responseData = await response.json()
//             console.log(responseData);
//             return responseData // Vous pouvez retourner des informations supplémentaires de l'utilisateur enregistré, si nécessaire
//         } catch (error) {
//             console.error('Error registering user:', error)
//             throw error
//         }
//     }
//     #registereventlister() {
//         document.querySelector('#register-login-main').addEventListener('submit', async (event) => {
//             event.preventDefault()

//             // Récupérer les valeurs des champs du formulaire
//             const formData = new FormData(event.target)
//             const userData = Object.fromEntries(formData.entries())

//             try {
//                 // Ajouter les champs supplémentaires au userData
//                 userData.nickname = formData.get('nickname')
//                 userData.age = formData.get('age')
//                 userData.gender = formData.get('gender')
//                 userData.firstname = formData.get('firstname')
//                 userData.lastname = formData.get('lastname')
//                 userData.email = formData.get('email')
//                 userData.password = formData.get('password')

//                 // Envoyer les données à l'API
//                 await registerUser(userData)
//                 console.log("bingo");
//                 return
//                 // Rediriger l'utilisateur vers la page de connexion ou afficher un message de succès
//             } catch (error) {
//                 // Afficher un message d'erreur à l'utilisateur
//             }
//         })
//     }
}