let socket
export let connectedPerson = []

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
            if (/##\d+##/.test(e.data)) {
                connectedPerson.push(e.data.match(/##(\d+)##/)[1])
            } else {
                if (msgArea == null) {
                    const counterMsg = document.querySelector('#messageBtn .msg-count')
                    counterMsg.textContent = `${parseInt(counterMsg.textContent)+1}`
                } else {
                    msgArea.innerHTML+= `<div class="message-content r"><p>${e.data.split('\n').slice(0,-1)}</p><span>${new Date().toISOString()}</span></div>`
                }
            }
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
    var newURL = window.location.origin + '/' + pageName;
    window.history.pushState({ page: pageName }, null, newURL);
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
            body: urlEncode.slice(0,-1)
        }).catch((reason)=>{
            console.log(reason)
            throw new Error('Erreur survenue lors de l envoie des données')
        })
    } else {
        response = await fetch(`http://localhost:4000/${page}`, {
            method: "POST",
            body: formData
        }).catch((reason)=>{
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
