import { connectedPerson, fetches, fetchesPost, notificatedPerson, socketManager, tabMessManager } from "../../utils.js"

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
            document.querySelector('#chatBox .nav-bar a').innerHTML = `<span style="color: red;">Connection failed</span>`
        }

        fetches('home').then((data) => {
            msgArea.innerHTML = data.UserList.map((u) => {
                for (let i = 0; i < notificatedPerson.length; i++) {
                    if (notificatedPerson[i] == u.User_id) {
                        notificatedPerson.splice(i, 1)
                        return `
                        <div class="list-user" data-id="${u.User_id}">${u.Username} <span class="o"></span></div>
                        `
                    }
                }
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
        let idTimeoutScroll
        closeBtn.addEventListener('click', () => {
            this.remove()
            if (idTimeoutScroll) {
                clearTimeout(idTimeoutScroll)
            }
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

                // We remove the notification
                const notifSpan = v.querySelector('.o')
                if (notifSpan) notifSpan.classList.remove('o')

                try {
                    // We take the value of form
                    const formData = new FormData()
                    formData.append('receiverId', receiverId)
                    const data = await fetchesPost('chat', formData)

                    // Here we handle the message
                    if (data.Conversation !== null) {
                        let you = v.textContent
                        let me = document.querySelector('#ownerUsername').textContent
                        let tabMsg = data.Conversation.map((msg) => {
                            console.log("msg.Receiver_id : ", msg.Receiver_id, "msg.Sender_id : ", msg.Sender_id)
                            if (msg.Receiver_id == receiverId) {
                                return [msg.Message_id, `<div class="message-content s"><span>${me}</span><p>${msg.Content}</p><span>${msg.Date_Creation}</span></div>`]
                            }
                            return [msg.Message_id, `<div class="message-content r"><span>${you}</span><p>${msg.Content}</p><span>${msg.Date_Creation}</span></div>`]
                        })
                        // Tri du tableau de message selon l'id des messages
                        tabMsg.sort((a, b) => a[0] - b[0]);
                        tabMessManager.set(tabMsg)

                        let partFactor = 1
                        let latest = tabMessManager.get().slice(-10 * partFactor, tabMessManager.get().length)

                        // Affichage des messages contenus dans le tableau latest
                        msgArea.innerHTML = `${latest.map((msg) => {
                            return msg[1]
                        }).join('')}`
                        msgArea.scrollTo(0, msgArea.scrollHeight)

                        let started = false
                        msgArea.addEventListener('scroll', () => {
                            if (msgArea.scrollTop == 0 && msgArea.scrollHeight >= msgArea.clientHeight + 10 && started == false) {
                                started = true
                                idTimeoutScroll = setTimeout(() => {
                                    partFactor += 1
                                    let firstPos = msgArea.scrollHeight
                                    latest = tabMessManager.get().slice(-10 * partFactor, tabMessManager.get().length)
                                    // Affichage des messages contenus dans le tableau
                                    msgArea.innerHTML = `${latest.map((msg) => {
                                        return msg[1]
                                    }).join('')}`
                                    let finalPos = msgArea.scrollHeight - firstPos
                                    msgArea.scrollTo(0, finalPos)
                                    started = false
                                }, 1000)
                            }
                        })
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
                let me = document.querySelector('#ownerUsername').textContent
                try {
                    socketManager.get().send(sendInput.value + "\n" + senderArea.dataset.id)
                    let divMsg = `<div class="message-content s"><span>${me}</span><p>${sendInput.value}</p><span>${new Date().toISOString()}</span></div>`
                    msgArea.innerHTML += divMsg
                    tabMessManager.add(divMsg)
                    sendInput.value = ''
                    msgArea.scrollTo(0, msgArea.scrollHeight)
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });

        let exe = false
        let stopTimeOut, lastTime
        sendInput.addEventListener('keydown', () => {
            if (!exe) {
                lastTime = Date.now()

                socketManager.get().send("==typing==" + "\n" + senderArea.dataset.id)
                exe = true
            }
            let currentTime = Date.now()
            if (currentTime - lastTime <= 800) {
                if (stopTimeOut) clearTimeout(stopTimeOut)
                stopTimeOut = setTimeout(() => {
                    socketManager.get().send("==stop==" + "\n" + senderArea.dataset.id)
                    exe = false
                }, 800)
            }
            lastTime = currentTime
        })

    }

}