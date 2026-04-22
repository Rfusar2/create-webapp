"use strict";
class Page {
    createSections(n, classes) {
        const sections = [];
        for (let i = 0; i < n; i++) {
            const s = new TAG_HTML("section");
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
}
