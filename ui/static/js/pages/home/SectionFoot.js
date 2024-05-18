

export class SectionFoot extends HTMLElement {
    connectedCallback() {
        this.constructSection();
        this.#makeEventListener();
    }

    constructSection() {
        this.innerHTML = `
    
        <custom-chat></custom-chat>

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
        /* const msgBtn = this.querySelector('#messageBtn .inbox-btn')
        
        
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

        }) */
    }

}
