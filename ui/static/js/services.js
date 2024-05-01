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

export async function fetchesPost(page, formData, enctyped = false) {
    // Conversion du format JSON en format URL encoded
    let urlEncode = ""
    for (let [k, v] of formData.entries()) {
        urlEncode += `${k}=${v}&`
    }
    let response;
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
            throw new Error('Erreur survenue lors de l envoie des données');
        })
    } else {
        response = await fetch(`http://localhost:4000/${page}`, {
            method: "POST",
            headers: {
                "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
            },
            body: formData
        }).catch((reason)=>{
            console.log(reason)
            throw new Error('Erreur survenue lors de l envoie des données');
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