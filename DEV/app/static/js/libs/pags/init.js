"use strict";
class Page {
    constructor(router) {
        this.router = router;
    }
    async connect() { }
    createSections(n, classes) {
        const sections = [];
        for (let i = 0; i < n; i++) {
            const s = new Section();
            if (classes)
                s.class(classes);
            sections.push(s);
        }
        return sections;
    }
    createTitle(title) {
        return new TAG_HTML("h1").props({ textContent: title });
    }
    createSpan(text) {
        return new TAG_HTML("span").props({ textContent: text });
    }
    async getDataLoadPage(url, body) {
        let res = await this.router.db.load(url, body);
        return res.ok ? await res.json() : await res.text();
    }
}
