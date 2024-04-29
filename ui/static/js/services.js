let disconnected = false
export const disconnectedManager = {
    getState() {
        return disconnected
    },
    setState(newValue) {
        disconnected = newValue
    }
}

export async function fetches(page) {
    const response = await fetch(`http://localhost:4000/${page}`, { method: "GET" })
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
    }
    const data = await response.json()
    return data
}

export async function fetchesPost(page, formData) {
    // Conversion du format JSON en format URL encoded
    let urlEncode = ""
    for (let [k, v] of formData.entries()) {
        urlEncode += `${k}=${v}&`
    }
    
    // Envoie de la requete post au go 
    const response = await fetch(`http://localhost:4000/${page}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncode.slice(0,-1)
    })
    if (!response.ok) {
        throw new Error('Erreur survenue lors de l envoie des données');
    }
    let data = await response.json()
    console.log(response)
    console.log(data)
    return data


}

export function invokeTag(name, event) {
    const body = document.querySelector('body')
    body.appendChild(document.createElement(name))
    body.querySelector('#website').innerHTML = ''
    event.preventDefault()
}