import { App } from "./components/App.js";
import { List } from "./components/List.js";
import { Footer } from "./components/Footer.js";

window.customElements.define("todomvc-app", App);
window.customElements.define("todomvc-list", List);
window.customElements.define("todomvc-footer", Footer);
