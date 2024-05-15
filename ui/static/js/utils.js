let socket
export let connectedPerson = []
export let notificatedPerson = []

export const socketManager = {
    get() {
        return socket
    },
    set(url) {
        socket = new WebSocket(url)
        socket.addEventListener('open', () => {
            console.log('connexion chat ouverte')
        })
        socket.addEventListener('message', (e) => {
            console.log("Message entrant : ", e.data)
            const msgArea = document.querySelector('#chatBox .container .messages-area')
            let trace = e.data.split('\n')

            // Decryptage de la reponse du server voir si c'est la first connection
            if (/##(.*?)##/g.test(e.data)) {
                let text = e.data
                let serie = text.match(/##(.*?)##/)[1]
                if (/^(\d+)(?:-\d+)*$/g.test(serie)) {
                    connectedPerson = serie.split('-').map(Number)
                    console.log("Connected Pers : ", connectedPerson);
                }
            } else if (/==(.*?)==/g.test(e.data)) {
                let text = e.data
                let serie = text.match(/==(.*?)==/)[1]
                console.log(serie)
                if (msgArea != null) {
                    if (msgArea.querySelector('.list-user') == null) {
                        if (serie == "typing") {
                            msgArea.innerHTML += `<div class="message-content r"><p> <div class="loading-wave">
                            <div class="loading-bar"></div>
                            <div class="loading-bar"></div>
                            <div class="loading-bar"></div>
                            <div class="loading-bar"></div>
                          </div>
                          </p></div>`
                        } else if (serie == "stop") {
                            msgArea.lastChild.remove()
                        }

                    } else {
                         // Lorsqu'il tape et qu'on a la list d'user en face
                    }
                }
            } else {
                if (msgArea == null) {
                    const counterMsg = document.querySelector('#messageBtn .msg-count')
                    counterMsg.textContent = `${parseInt(counterMsg.textContent) + 1}`
                    
                    notificatedPerson.push(trace[trace.length - 1])
                    console.log("notifPers", notificatedPerson)
                } else if (msgArea.querySelector('.list-user') == null) {
                    msgArea.innerHTML += `<div class="message-content r"><p>${e.data.split('\n').slice(0, -1)}</p><span>${new Date().toISOString()}</span></div>`

                    // A chaque fois qu'on reçoi un mess alors on enleve un message pour avoir un max de 10 
                    /* const msgDivs = msgArea.querySelectorAll('.message-content')
                    if (msgDivs.length >= 10) {
                        msgArea.querySelector('.message-content').remove()
                    } */
                } else if (msgArea.querySelector('.list-user') != null) {
                    const div = msgArea.querySelector(`div[data-id='${trace[trace.length - 1]}'] span`)
                    div.className = 'o'
                }
            }

            msgArea.scrollTo(0, msgArea.scrollHeight)
        })
    }
}

let disconnected = true
export const disconnectedManager = {
    getState() {
        return disconnected
    },
    setState(newValue) {
        disconnected = newValue
    }
}

// Update the URL when the user clicks on a page
export function updateURL(pageName) {
    console.log(pageName)
    /* var newURL = window.location.origin + '/' + pageName;
    window.history.pushState({ page: pageName }, null, newURL); */
}

export async function fetches(page) {
    const response = await fetch(`http://localhost:4000/${page}`, { method: "GET" })
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données")
    }
    const data = await response.json()
    return data
}

export async function fetchesPost(page, formData, enctyped = false) {
    // Conversion du format JSON en format URL encoded
    let urlEncode = ""
    for (let [k, v] of formData.entries()) {
        urlEncode += `${k}=${v}&`
    }
    let response
    // Envoie de la requete post au go 
    if (!enctyped) {
        response = await fetch(`http://localhost:4000/${page}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlEncode.slice(0, -1)
        }).catch((reason) => {
            console.log(reason)
            throw new Error('Erreur survenue lors de l envoie des données')
        })
    } else {
        response = await fetch(`http://localhost:4000/${page}`, {
            method: "POST",
            body: formData
        }).catch((reason) => {
            console.log(reason)
            throw new Error('Erreur survenue lors de l envoie des données')
        })
    }

    let data = response.json()
    return data
}

export function invokeTag(name, event) {
    const body = document.querySelector('body')
    body.appendChild(document.createElement(name))
    body.querySelector('#website').innerHTML = ''
    event.preventDefault()
}
