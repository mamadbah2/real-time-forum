export async function fetches(page) {
        const response = await fetch(`http://0.0.0.0:4000/${page}`, {method:"GET"})
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }
        console.log(response);
        const data = await response.json()
        return data
    }