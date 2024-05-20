import { connectedPerson, fetches, notificatedPerson } from "../../utils.js"


export class Duplicata extends HTMLElement {

    connectedCallback() {
        this.constructChat()
        this.userInformation()
    }

    constructChat() {
        this.innerHTML = `<div id="chatBox">
        <div class="container">
            <div class="nav-bar">
                <a>User List <i class="fa-regular fa-user"></i></a>
            </div>
            <div class="messages-area">

            </div>
            <div></div>
        </div>
    </div>`


    }

    async userInformation() {
        const msgArea = this.querySelector('.messages-area')
       

        fetches('home').then((data) => {
            msgArea.innerHTML = data.UserList.map((u) => {
                return `
                    <div class="list-user" data-id="${u.User_id}">${u.Username} </div>
                    `

            }).join('')
        }).then(() => { this.#makeEventListener() })

    }

    #makeEventListener() {
        const msgArea = this.querySelector('.messages-area')

        setTimeout(() => {
            msgArea.querySelectorAll('.list-user').forEach((uDiv) => {
                for (let i = 0; i < connectedPerson.length; i++) {
                    if (connectedPerson[i] == parseInt(uDiv.dataset.id)) {
                        if (!uDiv.querySelector('span')) uDiv.appendChild(document.createElement('span'))
                    }
                }
            })
        }, 500)

    }

}