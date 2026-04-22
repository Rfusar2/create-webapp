class Home extends Page {
    constructor(router: Routes){
        super();
        router.init("page-home");

        const sections = this.createSections(10, ["section-page"]);

        sections.forEach((e:TAG_HTML, i:number)=> e.obj.id = i )

        router.main.append(...sections.map((e:TAG_HTML)=>e.obj))

        new Card({ parent: sections[0].obj, title: "Card1" });
        new Card({ parent: sections[0].obj, title: "Card2" });
        new Card({ parent: sections[0].obj, title: "Card3" });

        new Card({ parent: sections[1].obj, title: "Card4" }).class(["flex-full"]);

        new Card({ parent: sections[2].obj, title: "Card5" });
        new Card({ parent: sections[2].obj, title: "Card6" });
        new Card({ parent: sections[2].obj, title: "Card7" });

        new Card({ parent: sections[3].obj, title: "Card1" });
        new Card({ parent: sections[3].obj, title: "Card2" });
        new Card({ parent: sections[3].obj, title: "Card3" });

        new Card({ parent: sections[4].obj, title: "Card4" }).class(["flex-full"]);

        new Card({ parent: sections[5].obj, title: "Card5" });
        new Card({ parent: sections[5].obj, title: "Card6" });
        new Card({ parent: sections[5].obj, title: "Card7" });

        new Card({ parent: sections[6].obj, title: "Card2" });
        new Card({ parent: sections[6].obj, title: "Card3" });

        new Card({ parent: sections[7].obj, title: "Card2" });
        new Card({ parent: sections[7].obj, title: "Card3" });
        
        new Card({ parent: sections[8].obj, title: "Card2" });
        new Card({ parent: sections[8].obj, title: "Card3" });
    }
}
