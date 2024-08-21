export enum COMMAND {
    SAVE = "save",
    DISPLAY = "display",
}
export interface IMsg {
    command: COMMAND;
    value: string | {};
}
