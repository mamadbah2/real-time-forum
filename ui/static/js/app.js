import { HomeSection, SectionFoot } from "./pages/home.js";
import { customHeader } from "./portion/header.js";

customElements.define('custom-header', customHeader)
customElements.define('custom-home', HomeSection);
customElements.define("custom-section", SectionFoot)

// customElements.define('post-list', PostList);
