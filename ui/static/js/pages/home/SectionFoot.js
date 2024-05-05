
export class SectionFoot extends HTMLElement {
    connectedCallback() {
        this.constructSection();
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
        <div>
            <h4>Copyrigths <code>&#169;</code></h4>
            <p>
                2024 Tous droits réservés <code>&#128512;</code> realisé avec du <code>&#128150;</code> et un peu de
                <code>&#9749;</code>
            </p>
        </div>
        `;
    }

}
