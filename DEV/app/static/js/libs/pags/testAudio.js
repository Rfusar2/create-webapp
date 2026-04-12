"use strict";
class AudioPage {
    constructor(parent) {
        this.audio = [
            "static/etc/idea8.mp3.mpeg",
        ];
        //BASE
        //const container = new TAG_HTML("div").class(["card-container"]).obj;
        //const audio = new TAG_HTML("audio").props({controls:true}).obj;
        //const source = new TAG_HTML("source").props({type:"audio/mpeg", src:"static/etc/idea8.mp3.mpeg"}).obj;
        //audio.append(source);
        //container.append(audio);
        //parent.append(container);
        const [s1, s2] = ["section", "section"].map((e) => new TAG_HTML(e).obj);
        parent.classList.add("page-audio");
        parent.append(s1, s2);
        const [container, title] = ["div", "h1"].map((e) => new TAG_HTML(e).obj);
        container.classList.add("s2-header");
        container.append(title);
        s2.append(container);
        for (const src of this.audio) {
            this.createRow(s1, title, src);
        }
    }
    createRow(s1, title, src) {
        const box = new TAG_HTML("div").class(["row"]).obj;
        const [d1, d2] = ["div", "div"].map((e) => new TAG_HTML(e).obj);
        const audio = new TAG_HTML("audio").props({ src: src }).obj;
        const btn1 = new TAG_HTML("div").class([]).obj;
        btn1.setAttribute("play", "false");
        const icon = new TAG_HTML("i").class(["fa-solid", "fa-play"]).obj;
        btn1.append(icon);
        d1.append(btn1);
        const range = new TAG_HTML("input").class(["range"]).props({ type: "range", min: "0", max: "100", value: "0" }).obj;
        d2.append(range);
        box.append(audio, d2, d1);
        s1.append(box);
        btn1.addEventListener("click", () => {
            if (audio.paused) {
                audio.play();
                icon.classList = "";
                icon.classList.add("fa-solid", "fa-stop");
                title.textContent = src;
            }
            else {
                audio.pause();
                icon.classList = "";
                icon.classList.add("fa-solid", "fa-play");
            }
        });
        audio.addEventListener('timeupdate', () => {
            range.value = (audio.currentTime / audio.duration) * 100;
        });
        range.addEventListener('input', () => {
            audio.currentTime = (range.value / 100) * audio.duration;
        });
    }
}
