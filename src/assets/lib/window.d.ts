declare var Intense: any;

declare module RongIMLib {
    class Expression {
        static retrievalEmoji(a: any, b: any): string
        static getEmojiObjByEnglishNameOrChineseName(obj: any): any
        static getAllExpression(number: any, start: any): any
    }
    class RongIMEmoji {
        static emojis: any[]
        static init(): void

        static emojiToSymbol(str: string): string
        static symbolToEmoji(str: string): string
        static symbolToHTML(str: string): string
        static emojiToHTML(str: string): string
    }
    class RongIMVoice {
        static init(): void
        static preLoaded(data: string): void
        static play(data: string, duration: number): void
        static stop(data?: string): void
        static onprogress(): void
    }
}

interface JQuery {
    rebox(target: any): JQuery
}

interface Window {
    webkitURL: URL
    // URL: URL
    Notification: Notification
    [index: string]: any
    Electron: any
    _open_account_settings: any
    upload_base64: any
}
interface Document {
    selection: any
}

declare var window: Window

interface Notification extends Function {
    title: string;
    dir: string;
    lang: string;
    body: string;
    tag: string;
    icon: string;
    data: any;
    slient: boolean;

    onclick: (ev: MouseEvent) => any;
    onerror: () => any;
    onshow: () => any;
    onclose: () => any;
    close: () => any;
}

declare var Notification: {
    new (title: string, config: any): Notification
    requestPermission(fun: any): void
    permission: any
}


declare var Electron: any
interface Electron {
    ipcRenderer: {
        send(event: string, num: number): void
    }
}
