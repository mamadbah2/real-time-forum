let socket, tabMess
export let connectedPerson = []
export let notificatedPerson = []

export const tabMessManager = {
    get() {
        return tabMess
    },
    set(value) {
        tabMess = value
    },
    add(value) {
        if (tabMess) {
            let lastId = parseInt(tabMess[tabMess.length - 1][0])
            tabMess.push([lastId + 1, value])

        }
    }
}


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
            let trace = e.data.split('\n')
            let ids = trace[trace.length - 1].split('-')
            const msgArea = document.querySelector('#chatBox .container .messages-area')

            // Decryptage de la reponse du server voir si c'est la first connection
            if (/##(.*?)##/g.test(e.data)) {
                let text = e.data
                let serie = text.match(/##(.*?)##/)[1]
                if (/^(\d+)(?:-\d+)*$/g.test(serie)) {
                    connectedPerson = serie.split('-').map(Number)
                    console.log("Connected Pers : ", connectedPerson);

                }

            } else if (/==(.*?)==/g.test(e.data)) { // Decryptage de la reponse du server voir le typing progr.
                let text = e.data
                let serie = text.match(/==(.*?)==/)[1]
                console.log(serie)
                if (msgArea != null) {
                    if (msgArea.querySelector('.list-user') == null) {
                        const navNode = document.querySelector('#chatBox .nav-bar a');
                        let trueId = navNode.dataset.id
                        let you = navNode.textContent
                        if (ids[1] == parseInt(trueId)) {
                            if (serie == "typing") {
                                msgArea.innerHTML += `<div class="message-content r lasta" style="background:#828E9E">
                                <span>${you}<span>
                                <div class="loading-wave">
                                    <div class="loading-bar"></div>
                                    <div class="loading-bar"></div>
                                    <div class="loading-bar"></div>
                                    <div class="loading-bar"></div>
                                </div>
                              </div>`
                                msgArea.scrollTo(0, msgArea.scrollHeight)

                            } else if (serie == "stop") {
                                // msgArea.lastChild.remove()
                                msgArea.querySelector('.lasta').remove()
                            }
                        }

                    } else {
                        // Lorsqu'il tape et qu'on a la list d'user en face
                        const div = msgArea.querySelector(`div[data-id='${ids[1]}']`)
                        const span = div.querySelector('span')
                        if (serie == "typing") {
                            const subdiv = document.createElement('p')
                            subdiv.textContent = 'écrit...'
                            div.appendChild(subdiv)
                            span.style.visibility = 'hidden'
                        } else if (serie == "stop") {
                            div.querySelector('p').remove()
                            span.style.visibility = 'visible'
                        }
                    }
                }

            } else {
                if (msgArea == null) {
                    const counterMsg = document.querySelector('#messageBtn .msg-count')
                    counterMsg.textContent = `${parseInt(counterMsg.textContent) + 1}`
                    notificatedPerson.push(ids[1])
                    console.log("notifPers", notificatedPerson)
                } else if (msgArea.querySelector('.list-user') == null) {
                    const navNode = document.querySelector('#chatBox .nav-bar a')
                    let trueId = navNode.dataset.id
                    let you = navNode.textContent
                    if (parseInt(trueId) == ids[1]) {
                        let divMsg = `<div class="message-content r"><span>${you}</span><p>${trace[0]}</p><span>${new Date().toISOString()}</span></div>`
                        msgArea.innerHTML += divMsg
                        tabMessManager.add(divMsg)
                        msgArea.scrollTo(0, msgArea.scrollHeight)
                    } else {
                        notificatedPerson.push(parseInt(ids[1]))
                    }
                } else if (msgArea.querySelector('.list-user') != null) {
                    notificatedPerson.push(parseInt(ids[1]))
                    const div = msgArea.querySelector(`div[data-id='${ids[1]}']`)
                    
                    const cloneDiv = document.createElement(`div`)
                    cloneDiv.innerHTML = div.innerHTML
                    cloneDiv.dataset.id = `${ids[1]}`
                    cloneDiv.className='list-user'
                    msgArea.insertBefore(cloneDiv, msgArea.firstChild)
                    div.remove()
                    setTimeout(() => {
                        const span = msgArea.querySelector(`div[data-id='${ids[1]}'] span`)
                        span.className ='o'
                    }, 400);
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
    console.log(pageName)
    /* var newURL = window.location.origin + '/' + pageName;
    window.history.pushState({ page: pageName }, null, newURL); */
}

// En cas de reactualisation du navigateur
/* window.addEventListener('beforeunload', async (e) => {
    e.preventDefault()
    await fetches('logout')
}) */

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

export async function start() {
    fetches('home').then((data) => {
        if (data.Disconnected) {
            document.querySelector('body').innerHTML = `<div id="website"></div>
        <custom-login></custom-login>`;
            disconnectedManager.setState(true)
        } else {
            socketManager.set('ws://localhost:4000/chat')
            disconnectedManager.setState(false)
            document.querySelector('body').innerHTML = `<div id="website">
            <custom-header></custom-header>
            <main>
                <custom-home></custom-home>
            </main>
            <custom-section></custom-section>
        </div>`
        }
    })
}