"use strict";
const LINKS_ASIDE = [
    { text: "Test Async Value", href: "#", },
    { text: "Test Async Table", href: "#", },
    { text: "Test Model update 1", href: "#", },
    { text: "Test Model update 2", href: "#", },
];
class Sidebar {
    constructor() {
        this.items = LINKS_ASIDE;
        this.routes = new Routes();
        this.obj = SELECT.one("#sidebar");
        this.header = SELECT.one("header");
        this.list_items = SELECT.one("#container-aside-items");
        this.container_list_items = this.obj.querySelector("section");
        this.getHeader();
        const item_type = SELECT.one(".aside-item");
        this.item_type = item_type.cloneNode(true);
        item_type.remove();
        this.init_items();
        //this.getLogout()
        this.setRoutes();
    }
    getHeader() {
        const container_logo = new TAG_HTML("div").id("container-logo").obj;
        const logo = new TAG_HTML("img").obj;
        //logo.alt = "Logo"
        container_logo.append(logo);
        const divider = new TAG_HTML("div").class(["divider"]).obj;
        this.header.append(container_logo, divider);
    }
    init_items() {
        for (const item of this.items) {
            const element = this.item_type.cloneNode(true);
            this.style(element);
            const link = element.querySelector("a");
            link.textContent = item.text;
            link.href = item.href;
            this.list_items.append(element);
        }
    }
    setRoutes() {
        const routes_names = this.items.filter((item) => item.href == "#").map(e => e.text);
        for (const item of this.list_items.childNodes) {
            item.addEventListener("click", () => {
                const route = item.textContent.replaceAll(" ", "").toLowerCase().trim();
                this.routes[route]();
            });
        }
    }
    style(e) {
        e.addEventListener("mouseover", () => {
            const circle = e.querySelector(".circle");
            const link = e.querySelector("a");
            circle.style.background = SELECT.style("--light-blue");
            link.style.transform = "translateX(5px)";
        });
        e.addEventListener("mouseout", () => {
            const circle = e.querySelector(".circle");
            const link = e.querySelector("a");
            circle.style.background = "transparent";
            link.style.transform = "translateX(0)";
        });
        e.addEventListener("click", () => {
            for (const item of SELECT.all(".aside-item")) {
                item.setAttribute("active", "false");
            }
            e.setAttribute("active", "true");
        });
    }
}
new Sidebar();
