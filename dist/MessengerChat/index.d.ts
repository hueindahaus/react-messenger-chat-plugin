export interface Props {
    pageId: string;
    language?: string;
    themeColor: string;
    height: number;
    autoExpand?: boolean;
    loggedInGreeting: string;
    loggedOutGreeting: string;
    onMessengerMounted?: () => void;
    onMessengerLoad?: () => void;
    onMessengerShow?: () => void;
    onMessengerHide?: () => void;
    onMessengerDialogShow?: () => void;
    onMessengerDialogHide?: () => void;
    debugMode?: boolean;
    version?: string;
}
export declare const FB: any;
export declare const window: any;
export interface SetMessengerHeightFunction {
    (height: number): void;
}
export interface ShowMessengerFunction {
    (shouldShowDialog: boolean): void;
}
export interface HideMessengerFunction extends VoidFunction {
}
export interface ShowDialogFunction extends VoidFunction {
}
export interface HideDialogFunction extends VoidFunction {
}
import React from "react";
export declare const MessengerChat: React.ForwardRefExoticComponent<Props & React.RefAttributes<React.FC<{}>>>;
export declare const setMessengerHeight: SetMessengerHeightFunction;
export declare const showMessenger: ShowMessengerFunction;
export declare const hideMessenger: HideMessengerFunction;
export declare const showDialog: ShowDialogFunction;
export declare const hideDialog: HideDialogFunction;
