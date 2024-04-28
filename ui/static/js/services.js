let disconnected = false
export const disconnectedManager = {
    getState(){
        return disconnected
    },
    setState(newValue) {
        disconnected = newValue
    }
}

export async function fetches(page) {
    const response = await fetch(`http://0.0.0.0:4000/${page}`, { method: "GET" })
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
    }
    const data = await response.json()
    return data
}

export function invokeTag(name, event) {
    const body = document.querySelector('body')
    body.appendChild(document.createElement(name))
    body.querySelector('#website').innerHTML = ''
    event.preventDefault()
}