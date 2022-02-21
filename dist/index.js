import React, { useEffect } from 'react';

// Customer chat sdk: https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/sdk/
// flag to identify wether or not messenger chat is mounted
let isMounted = false;
// added to be able to access debug mode outside component
let globalDebugModeFlag = false;
const MessengerChat = React.forwardRef(({ pageId, language = "en_US", themeColor, height, autoExpand = true, loggedInGreeting, loggedOutGreeting, onMessengerMounted, onMessengerLoad, onMessengerShow, onMessengerHide, onMessengerDialogShow, onMessengerDialogHide, debugMode = false, version = "v11.0", }, ref) => {
    const initExpand = () => {
        var _a, _b;
        if (debugMode) {
            console.log("[react-messenger-chat-plugin] expanding on init");
        }
        try {
            const cachedChatState = JSON.parse((_a = localStorage.getItem("__fb_chat_plugin")) !== null && _a !== void 0 ? _a : "");
            //https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type
            const samePageNavigation = //@ts-ignore
             ((_b = performance === null || performance === void 0 ? void 0 : performance.getEntriesByType("navigation")[0]) === null || _b === void 0 ? void 0 : _b.type) !== "navigate";
            if (cachedChatState &&
                (cachedChatState === null || cachedChatState === void 0 ? void 0 : cachedChatState.visibility) === "hidden" &&
                !samePageNavigation) {
                FB.CustomerChat.show();
            }
        }
        catch (err) {
            console.warn("Probblem when autoexpanding messenger chatbox occured. Please file an issue on github.");
            throw new Error(err);
        }
    };
    const initMessenger = () => {
        if (debugMode) {
            console.log("[react-messenger-chat-plugin] initializing messenger plugin");
        }
        try {
            const chatbox = document.getElementById("fb-customer-chat");
            chatbox.setAttribute("page_id", pageId);
            chatbox.setAttribute("attribution", "biz_inbox");
            if (themeColor) {
                chatbox.setAttribute("theme_color", themeColor);
            }
            if (loggedInGreeting) {
                chatbox.setAttribute("logged_in_greeting", loggedInGreeting);
            }
            if (loggedOutGreeting) {
                chatbox.setAttribute("logged_out_greeting", loggedOutGreeting);
            }
            if (autoExpand) {
                chatbox.setAttribute("greeting_dialog_display", "show");
                chatbox.setAttribute("greeting_dialog_delay", "0");
            }
            else {
                chatbox.setAttribute("greeting_dialog_display", "hide");
            }
            window.fbAsyncInit = function () {
                FB.init({
                    xfbml: true,
                    version: version,
                });
                FB.Event.subscribe("customerchat.load", () => {
                    if (onMessengerLoad)
                        onMessengerLoad();
                });
                FB.Event.subscribe("xfbml.render", () => {
                    // we check if not undefined, since 0 should still be a valid number
                    if (height !== undefined) {
                        setMessengerHeight(height);
                    }
                    //this is necessary to manually open chatbox on init when state (especially visibility=hidden) is cached in localStorage.
                    if (autoExpand) {
                        setTimeout(initExpand, 3000);
                    }
                    if (onMessengerMounted) {
                        onMessengerMounted();
                    }
                    isMounted = true;
                });
                FB.Event.subscribe("customerchat.show", () => {
                    if (onMessengerShow)
                        onMessengerShow();
                });
                FB.Event.subscribe("customerchat.hide", () => {
                    if (onMessengerHide)
                        onMessengerHide();
                });
                FB.Event.subscribe("customerchat.dialogShow", () => {
                    if (onMessengerDialogShow)
                        onMessengerDialogShow();
                });
                FB.Event.subscribe("customerchat.dialogHide", () => {
                    if (onMessengerDialogHide)
                        onMessengerDialogHide();
                });
            };
            (function (d, s, id) {
                var _a;
                let js, 
                // eslint-disable-next-line prefer-const
                fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id))
                    return;
                // eslint-disable-next-line prefer-const
                js = d.createElement(s);
                js.id = id;
                js.src = `https://connect.facebook.net/${language}/sdk/xfbml.customerchat.js`;
                (_a = fjs === null || fjs === void 0 ? void 0 : fjs.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(js, fjs);
            })(document, "script", "facebook-jssdk");
        }
        catch (err) {
            throw err;
        }
    };
    useEffect(() => {
        try {
            globalDebugModeFlag = debugMode;
            initMessenger();
        }
        catch (err) {
            console.log(err);
        }
    });
    return (React.createElement("div", { ref: ref },
        React.createElement("div", { id: "fb-root" }),
        React.createElement("div", { id: "fb-customer-chat", className: "fb-customerchat" })));
});
//NOTE: THIS IS A VERY HACKY WAY OF MODIFYING ELEMENTS STYLE.
const setMessengerHeight = (height) => {
    if (globalDebugModeFlag) {
        console.log(`[react-messenger-chat-plugin] setting messenger height: ${height}`);
    }
    const tmpIconElement = document.querySelectorAll("[data-testid='bubble_iframe']");
    if (tmpIconElement && tmpIconElement.length > 0) {
        const iconElement = tmpIconElement[0];
        iconElement.style.bottom = `${height}px`;
    }
    else {
        console.warn("Could not set height of messenger button.");
    }
    const tmpChatElement = document.querySelectorAll("[data-testid='dialog_iframe']");
    if (tmpIconElement && tmpChatElement.length > 0) {
        const chatElement = tmpChatElement[0];
        //if window width is md (tailwind) or smaller
        chatElement.style.bottom = `${height + 56}px`;
    }
    else {
        console.warn("Could not set height of messenger dialog container.");
    }
};
const showMessenger = (shouldShowDialog) => {
    if (globalDebugModeFlag) {
        console.log(`[react-messenger-chat-plugin] showing messenger with argument "shouldShowDialog": ${shouldShowDialog}`);
    }
    try {
        if (isMounted && (FB === null || FB === void 0 ? void 0 : FB.CustomerChat)) {
            FB.CustomerChat.show(shouldShowDialog);
        }
        else if (!isMounted) {
            console.warn("Messenger could not expand messenger due to the messenger chat not beeing mounted yet.");
        }
    }
    catch (err) {
        throw new Error(err);
    }
};
const hideMessenger = () => {
    if (globalDebugModeFlag) {
        console.log(`[react-messenger-chat-plugin] hiding messenger with argument`);
    }
    try {
        if (isMounted && (FB === null || FB === void 0 ? void 0 : FB.CustomerChat)) {
            FB.CustomerChat.hide();
        }
        else if (!isMounted) {
            console.warn("Messenger could not hide messenger due to the messenger chat not beeing mounted yet.");
        }
    }
    catch (err) {
        throw new Error(err);
    }
};
const showDialog = () => {
    if (globalDebugModeFlag) {
        console.log(`[react-messenger-chat-plugin] showing dialog`);
    }
    try {
        if (isMounted && (FB === null || FB === void 0 ? void 0 : FB.CustomerChat)) {
            FB.CustomerChat.showDialog();
        }
        else if (!isMounted) {
            console.warn("Messenger could not show dialog due to the messenger chat not beeing mounted yet.");
        }
    }
    catch (err) {
        throw new Error(err);
    }
};
const hideDialog = () => {
    if (globalDebugModeFlag) {
        console.log(`[react-messenger-chat-plugin] hiding dialog`);
    }
    try {
        if (isMounted && (FB === null || FB === void 0 ? void 0 : FB.CustomerChat)) {
            FB.CustomerChat.hideDialog();
        }
        else if (!isMounted) {
            console.warn("Messenger could not hide dialog due to the messenger chat not beeing mounted yet.");
        }
    }
    catch (err) {
        throw new Error(err);
    }
};

export { MessengerChat, hideDialog, hideMessenger, setMessengerHeight, showDialog, showMessenger };
