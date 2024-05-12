import { connectedPerson, fetches, fetchesPost, socketManager } from "../../utils.js"


export class customChat extends HTMLElement {
    /* constructor() {
        super()
        this.socket = socketManager.get()
    } */

    connectedCallback() {
        this.constructChat()
        this.userInformation()
    }

    constructChat() {
        this.innerHTML = `<div id="chatBox">
        <div class="container">
            <div class="nav-bar">
                <a>Chat</a>
    
                <!-- Fais office de croix -->
                <div class="close">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
            <div class="messages-area">

            </div>
            <div class="sender-area" data-id=""  style="display:none">
                <div class="input-place">
                    <input placeholder="Send a message." class="send-input" type="text">
                    <div class="send">
                        <svg class="send-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                        this.remove()xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512"
                            style="enable-background:new 0 0 512 512" xml:space="preserve">
                            <g>
                                <g>
                                    <path fill="#6B6C7B"
                                        d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.309,8.287C2.86,59.547-3.098,78.551,1.558,96.808 L38.327,241h180.026c8.284,0,15.001,6.716,15.001,15.001c0,8.284-6.716,15.001-15.001,15.001H38.327L1.558,415.193 c-4.656,18.258,1.301,37.262,15.547,49.595c14.274,12.357,33.937,15.495,51.31,8.287l413.094-171.409 C500.317,293.862,512,276.364,512,256.001C512,235.638,500.317,218.139,481.508,210.336z">
                                    </path>
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
            <div></div>
        </div>
    </div>`


    }

    async userInformation() {
        const msgArea = this.querySelector('.messages-area')
        console.log(connectedPerson)
        // Here We check our connection by showing the length of connectedPerson table
        if (connectedPerson.length == 0) {
            document.querySelector('#chatBox .nav-bar a').innerHTML= `<span style="color: red;">Connection failed</span>`
        }
        fetches('home').then((data) => {
            msgArea.innerHTML = data.UserList.map((u) => {
                for (let i = 0; i < connectedPerson.length; i++) {
                    if (connectedPerson[i] == u.User_id) {
                        return `
                        <div class="list-user" data-id="${u.User_id}">${u.Username} <span></span></div>
                        `
                    }
                }
                return `
                        <div class="list-user" data-id="${u.User_id}">${u.Username} </div>
                        `
            }).join('')
        }).then(() => { this.#makeEventListener() })

    }

    #makeEventListener() {
        const closeBtn = this.querySelector('.close')
        const senderArea = this.querySelector('.sender-area')

        closeBtn.addEventListener('click', () => {
            this.remove()
        })

        // conversation
        const listUser = this.querySelectorAll('.list-user')
        const msgArea = this.querySelector('.messages-area')
        listUser.forEach(v => {
            v.addEventListener('click', async () => {
                // We take de receiver Id
                let receiverId = v.dataset.id
                senderArea.style.display = "block"
                senderArea.dataset.id = receiverId
                try {
                    // We take the value of form
                    const formData = new FormData()
                    formData.append('receiverId', receiverId)
                    const data = await fetchesPost('chat', formData)
                    // Here we handle the message
                    if (data.Conversation !== null) {
                        let tabMess = data.Conversation.map((msg) => {
                            if (msg.Receiver_id == receiverId) {
                                return [msg.Message_id, `<div class="message-content r"><p>${msg.Content}</p><span>${msg.Date_Creation}</span></div>`]
                            }
                            return [msg.Message_id, `<div class="message-content s"><p>${msg.Content}</p><span>${msg.Date_Creation}</span></div>`]
                        })
                        tabMess.sort((a, b) => a[0] - b[0]);
                        console.log("tab : ", tabMess);
                        msgArea.innerHTML = `${tabMess.map((msg) => {
                            return msg[1]
                        }).join('')}`
                    } else {
                        msgArea.innerHTML = ``
                    }
                    document.querySelector('#chatBox .nav-bar a').textContent = `${v.textContent}`
                } catch (error) {
                    console.error('Erreur : ', error)
                }
            })

        })

        //submit
        const senderIcone = this.querySelector('.send-icon');
        const sendInput = this.querySelector('.send-input');
        senderIcone.addEventListener('click', async () => {
            if (sendInput.value !== "") {
                try {
                    socketManager.get().send(sendInput.value+"\n"+senderArea.dataset.id)
                    msgArea.innerHTML+= `<div class="message-content s"><p>${sendInput.value}</p><span>${new Date().toISOString()}</span></div>`
                    sendInput.value = ''
                    
                } catch (error) {
                    console.error('Error:', error);
                }
            } 
        });
    }

}