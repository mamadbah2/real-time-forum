import { HomeSection } from "./pages/home/home.js";
import { SectionFoot } from "./pages/home/SectionFoot.js";
import { PostForm } from "./pages/create/post.js";
import { customHeader } from "./portion/header/customHeader.js";
import { customLogin } from "./pages/connexion/customLogin.js";
import { customRegister } from "./pages/connexion/customRegister.js";
import { CommentSection } from "./pages/comment/comment.js";
import { customChat } from "./pages/home/customChat.js";
import { start } from "./utils.js";
import { Duplicata } from "./pages/home/duplicata.js";

customElements.define('custom-header', customHeader)
customElements.define('custom-home', HomeSection)
customElements.define("custom-section", SectionFoot)
customElements.define('custom-login', customLogin)
customElements.define('custom-register', customRegister)
customElements.define('custom-comment', CommentSection)
customElements.define('custom-chat', customChat)
customElements.define('custom-duplicata', Duplicata)
// customElements.define('post-list', PostList);
customElements.define('post-form', PostForm);

await start();
