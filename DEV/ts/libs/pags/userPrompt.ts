class UserPromptPage {
    constructor(parent:HTMLElement){
        const [ s1, s2, c1, c2, b1, b2, mb1, mb2,] = [
            "div", "div", "div", "div", "div", "div", "div", "div",
        ].map((e:string)=>new TAG_HTML(e).obj);

        const [btn1. btn2. btn3, save] = [
            "Effetto 1", "Effetto 2", "popup", "salva file",
        ].map((e:string)=>new TAG_HTML("button").class(["btn", "btn-primary"]).props({textContent: e}).obj)

        const loadfile = new MyInput({tag: "loadfile", label:"carica file"}).obj
        const savefile = new MyInput({tag: "savefile", label:"salva file"}).obj

        s1.classList.add("section-user")
        parent.classList.add("page-playwithinput")
        parent.append(s1, s2);
        c1.classList.add("container-user-prompt")
        c2.classList.add("container-spinners")
        s1.append(c1, c2);
        b2.classList.add("box-user-prompt")
        c1.append(b1, b2)
        mb1.classList.add("user-prompt")
        mb2.classList.add("user-prompt-btns")
        b2.append(mb1, mb2)
        b1.append(new TAG_HTML("h1").props({textContent: "Effetti Input"}).obj)
        mb2.append(btn1, btn2, btn3, savefile, loadfile)
        const textarea = new TAG_HTML("textarea").obj
        mb1.append(textarea)

        const colors = ["green", "red", "blue", "black", "yellow"]
        for(let i = 0; i < colors.length; i++){
            const spinner = new TAG_HTML("div").class(["spinner"]).obj
            spinner.style.borderTop = `5px solid ${colors[i]}`
            const container = new TAG_HTML("div").obj
            container.append(spinner)
            c2.append(container)
        }

        btn1.addEventListener("click", async ()=>{
            const value = textarea.value
            for(const c of value){
                s2.textContent += c
                await sleep(50)
            }
        })
        btn2.addEventListener("click", ()=>{
            s2.textContent = textarea.value

        })
        btn3.addEventListener("click", ()=>{
            new Popup({type: "right", text: "è il contenuto", status: 0})
        })

        savefile.addEventListener("click", ()=>{
            new Model({
                title: "Salvataggio file",
                send: async(inputs)=>{
                    const filename = inputs[0].value
                    const file = new Blob([textarea.value], {
                        type: "text/plain"
                    })
                    const a = new TAG_HTML("a").props({download:filename, href: URL.createObjectURL(file)}).obj
                    document.body.append(a)
                    a.click()

                    URL.revokeObjectURL(file)
                    a.remove()
                },
                type: "center",
                dimension: "small",
                inputs: [
                    new MyInput({
                        label: "nome file"
                    })
                ]

                
            })

        })

    }

}
