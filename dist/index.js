import React, { useEffect } from 'react';

/* eslint-disable no-undef */
// flag to identify wether or not messenger chat is mounted
let isMounted = false;
// added to be able to access debug mode outside component
let globalDebugModeFlag = false;
const MessengerChat = React.forwardRef(({ pageId, language = "en_US", themeColor, bottomSpacing, greetingDialogDisplay, greetingDialogDelay = 0, loggedInGreeting, loggedOutGreeting, onMessengerMounted, onMessengerLoad, onMessengerShow, onMessengerHide, onMessengerDialogShow, onMessengerDialogHide, debugMode = false, version = "v13.0", }, ref) => {
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
            if (greetingDialogDisplay) {
                chatbox.setAttribute("greeting_dialog_display", greetingDialogDisplay);
            }
            if (greetingDialogDelay) {
                chatbox.setAttribute("greeting_dialog_delay", greetingDialogDelay.toString());
            }
            window.fbAsyncInit = function () {
                if (bottomSpacing != undefined) {
                    const css = `
              .fb_reset {
                visibility: hidden !important;
              }
            `;
                    const style = document.createElement("style");
                    document.head.appendChild(style);
                    style.type = "text/css";
                    style.appendChild(document.createTextNode(css));
                    FB.Event.subscribe("customerchat.load", () => {
                        setTimeout(() => setMessengerBottomSpacing(bottomSpacing), 1500);
                    });
                }
                FB.init({
                    xfbml: true,
                    version: version,
                });
                FB.Event.subscribe("customerchat.load", () => {
                    // we check if not undefined, since 0 should still be a valid number
                    if (onMessengerLoad)
                        onMessengerLoad();
                    if (bottomSpacing != undefined) {
                        setTimeout(() => setMessengerBottomSpacing(bottomSpacing), 1500);
                    }
                });
                FB.Event.subscribe("xfbml.render", () => {
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
    }, []);
    return (React.createElement("div", { ref: ref },
        React.createElement("div", { id: "fb-root" }),
        React.createElement("div", { id: "fb-customer-chat", className: "fb-customerchat" })));
});
const setMessengerBottomSpacing = (bottomSpacing) => {
    if (globalDebugModeFlag) {
        console.log(`[react-messenger-chat-plugin] setting messenger bottom spacing: ${bottomSpacing}`);
    }
    const css = `
  .fb_reset {
    visibility: visible !important;
  }

  [data-testid="bubble_iframe"] {
    visibility: visible !important;
    bottom: 0 !important;
    transform: translateY(${-bottomSpacing}px) !important;
    transition: transform 0.3s !important;
  }

  [data-testid='dialog_iframe'] {
    bottom: ${bottomSpacing + 56}px !important;
  }
  `;
    const style = document.createElement("style");
    document.head.appendChild(style);
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
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

export { MessengerChat, hideDialog, hideMessenger, setMessengerBottomSpacing, showDialog, showMessenger };
