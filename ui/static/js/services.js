export function fetchTest() {
    fetch("http://0.0.0.0:4000/home", {method: "GET"})
        .then((resp) => resp.json())
        .then((data) => console.log(data))
}