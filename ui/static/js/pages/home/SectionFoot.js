import { disconnectedManager } from "../../utils.js";

export class SectionFoot extends HTMLElement {
    connectedCallback() {
        this.constructSection();
        this.#makeEventListener();
    }

    constructSection() {
        this.innerHTML = `
        <div>
            <h2>About Us <code>&#9940;</code></h2>
            <p>
                Les gars, les gars... <code>&#128683;</code> <code>&#128683;</code> <code>&#9888;</code> <br />
                Tout fail a ce forum sera condamné sous peine de mort.
                En cas de fail, Vous avez le droit de garder le silence.
                Tout ce que vous direz pourra être retenu contre vous devant un tribunal.
                Vous avez le droit à un avocat. Si vous n'avez pas les moyens de
                vous en offrir un, un avocat vous sera désigné d'office.
            </p>
        </div>

        <div id="messageBtn">
            <button class="inbox-btn">
                <svg viewBox="0 0 512 512" height="16" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z">
                    </path>
                </svg>
                <span class="msg-count">0</span>
            </button>
        </div>

        <div>
            <h4>Copyrigths <code>&#169;</code></h4>
            <p>
                2024 Tous droits réservés <code>&#128512;</code> realisé avec du <code>&#128150;</code> et un peu de
                <code>&#9749;</code>
            </p>
        </div>
        `;
    }

    #makeEventListener() {
        const msgBtn = this.querySelector('#messageBtn .inbox-btn')
        
        
        msgBtn.addEventListener('click', (e)=>{
            e.preventDefault()
            if (!disconnectedManager.getState()) {
                const cc = this.querySelector('custom-chat')
                if  (cc !== null) {
                    cc.remove()
                }
                this.appendChild(document.createElement('custom-chat'))
                
                // On enleve le notif counter
                const msgCount = this.querySelector('.inbox-btn .msg-count')
                if (msgCount.textContent != '0') {
                    msgCount.textContent = '0'
                }
            } 

        })
    }

}
