class TAG_HTML {
    obj: HTMLElement;
        
    constructor(tag: string){
        this.obj = document.createElement(tag) as HTMLElement;
    }
    id(id: string){this.obj.id = id;return this;}
    class(classes: string[]){this.obj.classList.add(...classes);return this;}
    props(props: object){Object.assign(this.obj, props);return this;}
    style(styles: object){Object.assign(this.obj.style, styles);return this;}
    attr(attr: object){Object.assign(this.obj.dataset, attr);return this; }
    event(type:string, func:EventListener){this.obj.addEventListener(type, func); return this;}
}
class Section extends TAG_HTML {
    constructor(){ super("section"); }
}
class Container extends TAG_HTML {
    constructor(){ super("div"); }
}
class Span extends TAG_HTML {
    constructor(){ super("span"); }
}
class Title extends TAG_HTML {
    constructor(){ super("h1"); }
}
class Spinner {
    constructor(color){
        this.obj = new Container().class(["spinner", color]).obj
        this.container = new Container().obj
        this.container.append(this.obj)
    }
}

class SELECT {
    static one(e:string):HTMLElement {return document.querySelector(e)!}

    static style = (v:string)=>window.getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    static all(e:string):HTMLElement[] {return Array.from(document.querySelectorAll(e)!)}
}




const texts = {
    full_without_special:()=>"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    full:()=>"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%",
    number:()=>"0123456789",
    upper:()=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower:()=>"abcdefghijklmnopqrstuvwxyz",
    special:()=>"!@#$%",
}
class GENERATE {
    static get(choices:string[]): string | undefined {
        const n_choices = choices.length;
        const temp = Math.random() * n_choices;

        for(let i=1; i < n_choices+1; i++){
            if(temp < i){ return choices[i-1] }
        }
    }
    static number(max:number){
        return (Math.random() * max).toFixed(0)
    }
    static number_string(length=5){
        const chars = texts.number();
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }


    static string(length = 8) {
        const chars = texts.full_without_special();
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
    static date(start:Date, end:Date) {
        const startTs = start.getTime();
        const endTs = end.getTime();
        
        const randomTs = startTs + Math.random() * (endTs - startTs);
        return new Intl.DateTimeFormat('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(randomTs);
    }

    static price():string {
        return (Math.random() * 100).toFixed(2).replace(".", ",") + "€";
    }

    static securePassword(length = 12): string {
        const chars = texts.full();
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        return Array.from(array, n => chars[n % chars.length]).join('');
    }
}
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//from api
type Data = object[];
