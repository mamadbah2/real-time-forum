import { fetches, fetchesPost } from "../../utils.js"

export class customChat extends HTMLElement {
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
            <div class="sender-area"  style="display:none">
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
        fetches('home').then((data) => {
            msgArea.innerHTML = data.UserList.map((u) => {
                return `
                <div class="list-user" data-id="${u.User_id}">${u.Username}</div>
                `
            }).join('')
        }).then(() => {this.#makeEventListener()})

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
        console.log(listUser);
        listUser.forEach(v => {
            v.addEventListener('click', async () => {
                let receiverId = v.dataset.id
                senderArea.style.display="block"
                console.log('sadou');
                try {
                    const formData = new FormData()
                    formData.append('receiverId', receiverId)
                    console.log(formData);
                    const data = await fetchesPost('chat', formData)
                    console.log(data);
                    msgArea.innerHTML = data.Conversation.map(msg => `
                        <div class="message-content">${msg.Content}</div>
                    `).join('')
                } catch (error) {
                    console.error('Erreur:', error)
                }
            })

        })

        //submit
        const senderIcone = this.querySelector('.send-icon');
        senderIcone.addEventListener('click', async () => {
            const sendInput = this.querySelector('.send-input');
            const chat = sendInput.value; // Assuming chat is the message content
            try {
                const formData = new FormData();
                formData.append('message', chat);
                const data = await fetchesPost('chat', formData);
                // Handle response as needed
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

}