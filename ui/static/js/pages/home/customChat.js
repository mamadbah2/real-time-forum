
export class customChat extends HTMLElement {
    connectedCallback() {
        this.constructChat()
        this.#makeEventListener()
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
    
                <div class="message one"></div>
                <div class="message two"></div>
                <div class="message three"></div>
                <div class="message four"></div>
                <div class="message five"></div>
                <div class="message six"></div>
            </div>
            <div class="sender-area" style="display: none;">
                <div class="input-place">
                    <input placeholder="Send a message." class="send-input" type="text">
                    <div class="send">
                        <svg class="send-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                        this.remove()xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512"
                            style="enable-background:new 0 0 512 512;" xml:space="preserve">
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
    </div>`;
    }

    #makeEventListener() {
        const closeBtn = this.querySelector('.close')
        const senderArea = this.querySelector('.sender-area')

        closeBtn.addEventListener('click', () => {
            this.remove()
        })

        
    }
}