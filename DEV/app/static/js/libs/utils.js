"use strict";
class TAG_HTML {
    constructor(tag) {
        this.obj = document.createElement(tag);
    }
    id(id) { this.obj.id = id; return this; }
    class(classes) { this.obj.classList.add(...classes); return this; }
    props(props) { Object.assign(this.obj, props); return this; }
    style(styles) { Object.assign(this.obj.style, styles); return this; }
    attr(attr) { Object.assign(this.obj.dataset, attr); return this; }
}
class SELECT {
    static one(e) { return document.querySelector(e); }
    static all(e) { return Array.from(document.querySelectorAll(e)); }
}
SELECT.style = (v) => window.getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const texts = {
    full_without_special: () => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    full: () => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%",
    number: () => "0123456789",
    upper: () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: () => "abcdefghijklmnopqrstuvwxyz",
    special: () => "!@#$%",
};
class GENERATE {
    static get(choices) {
        const n_choices = choices.length;
        const temp = Math.random() * n_choices;
        for (let i = 1; i < n_choices + 1; i++) {
            if (temp < i) {
                return choices[i - 1];
            }
        }
    }
    static number(max) {
        return (Math.random() * max).toFixed(0);
    }
    static number_string(length = 5) {
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
    static date(start, end) {
        const startTs = start.getTime();
        const endTs = end.getTime();
        const randomTs = startTs + Math.random() * (endTs - startTs);
        return new Intl.DateTimeFormat('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(randomTs);
    }
    static price() {
        return (Math.random() * 100).toFixed(2).replace(".", ",") + "€";
    }
    static securePassword(length = 12) {
        const chars = texts.full();
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, n => chars[n % chars.length]).join('');
    }
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
