import React from "react";
export interface Props {
    pageId: string;
    language?: string;
    themeColor: string;
    greetingDialogDisplay?: "hide" | "show" | "fade" | "icon";
    greetingDialogDelay?: number;
    bottomSpacing?: number;
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
export interface SetMessengerBottomSpacingFunction {
    (bottomSpacing: number): void;
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
export declare const MessengerChat: React.ForwardRefExoticComponent<Props & React.RefAttributes<React.FC<{}>>>;
export declare const setMessengerBottomSpacing: SetMessengerBottomSpacingFunction;
export declare const showMessenger: ShowMessengerFunction;
export declare const hideMessenger: HideMessengerFunction;
export declare const showDialog: ShowDialogFunction;
export declare const hideDialog: HideDialogFunction;
