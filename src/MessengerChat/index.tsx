// Customer chat sdk: https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/sdk/
// Chat plugin: https://developers.facebook.com/docs/messenger-platform/discovery/facebook-chat-plugin/

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

export interface HideMessengerFunction extends VoidFunction {}
export interface ShowDialogFunction extends VoidFunction {}
export interface HideDialogFunction extends VoidFunction {}

/* eslint-disable no-undef */
import React, { LegacyRef, useEffect } from "react";

// flag to identify wether or not messenger chat is mounted
let isMounted = false;

// added to be able to access debug mode outside component
let globalDebugModeFlag = false;

export const MessengerChat = React.forwardRef<React.FC, Props>(
  (
    {
      pageId,
      language = "en_US",
      themeColor,
      height,
      autoExpand = true,
      loggedInGreeting,
      loggedOutGreeting,
      onMessengerMounted,
      onMessengerLoad,
      onMessengerShow,
      onMessengerHide,
      onMessengerDialogShow,
      onMessengerDialogHide,
      debugMode = false,
      version = "v11.0",
    },
    ref
  ) => {
    const initExpand = () => {
      if (debugMode) {
        console.log("[react-messenger-chat-plugin] expanding on init");
      }

      try {
        const localStorageObject = localStorage.getItem("__fb_chat_plugin");
        const cachedChatState = localStorageObject
          ? JSON.parse(localStorageObject)
          : null;

        //https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type
        const samePageNavigation = //@ts-ignore
          performance?.getEntriesByType("navigation")[0]?.type !== "navigate";

        if (
          cachedChatState &&
          cachedChatState?.visibility === "hidden" &&
          !samePageNavigation
        ) {
          FB.CustomerChat.show();
        }
      } catch (err: any) {
        console.warn(
          "Probblem when autoexpanding messenger chatbox occured. Please file an issue on github."
        );
        throw new Error(err);
      }
    };

    const initMessenger = () => {
      if (debugMode) {
        console.log(
          "[react-messenger-chat-plugin] initializing messenger plugin"
        );
      }

      try {
        const chatbox = document.getElementById("fb-customer-chat")!;

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
        } else {
          chatbox.setAttribute("greeting_dialog_display", "hide");
        }

        if (height != undefined) {
          setMessengerHeight(height);
        }

        window.fbAsyncInit = function () {
          FB.init({
            xfbml: true,
            version: version,
          });

          FB.Event.subscribe("customerchat.load", () => {
            // we check if not undefined, since 0 should still be a valid number
            if (onMessengerLoad) onMessengerLoad();
          });

          FB.Event.subscribe("xfbml.render", () => {
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
            if (onMessengerShow) onMessengerShow();
          });

          FB.Event.subscribe("customerchat.hide", () => {
            if (onMessengerHide) onMessengerHide();
          });

          FB.Event.subscribe("customerchat.dialogShow", () => {
            if (onMessengerDialogShow) onMessengerDialogShow();
          });

          FB.Event.subscribe("customerchat.dialogHide", () => {
            if (onMessengerDialogHide) onMessengerDialogHide();
          });
        };

        (function (d, s, id) {
          let js,
            // eslint-disable-next-line prefer-const
            fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          // eslint-disable-next-line prefer-const
          js = d.createElement(s) as HTMLScriptElement;
          js.id = id;
          js.src = `https://connect.facebook.net/${language}/sdk/xfbml.customerchat.js`;
          fjs?.parentNode?.insertBefore(js, fjs);
        })(document, "script", "facebook-jssdk");
      } catch (err: any) {
        throw err;
      }
    };

    useEffect(() => {
      try {
        globalDebugModeFlag = debugMode;
        initMessenger();
      } catch (err: any) {
        console.log(err);
      }
    });

    return (
      <div ref={ref as LegacyRef<HTMLDivElement>}>
        <div id="fb-root"></div>
        <div id="fb-customer-chat" className="fb-customerchat"></div>
      </div>
    );
  }
);

//NOTE: THIS IS A VERY HACKY WAY OF MODIFYING ELEMENTS STYLE.
export const setMessengerHeight: SetMessengerHeightFunction = (height) => {
  if (globalDebugModeFlag) {
    console.log(
      `[react-messenger-chat-plugin] setting messenger height: ${height}`
    );
  }

  const css = `
  .fb-customerchat {
    display: none !important;
    visibility: hidden !important;
  }

  [data-testid="bubble_iframe"] {
    bottom: ${height}px !important;
  }

  [data-testid='dialog_iframe'] {
    bottom: ${height + 56}px !important;
  }
  `;
  const style = document.createElement("style");
  document.head.appendChild(style);
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
};

export const showMessenger: ShowMessengerFunction = (shouldShowDialog) => {
  if (globalDebugModeFlag) {
    console.log(
      `[react-messenger-chat-plugin] showing messenger with argument "shouldShowDialog": ${shouldShowDialog}`
    );
  }

  try {
    if (isMounted && FB?.CustomerChat) {
      FB.CustomerChat.show(shouldShowDialog);
    } else if (!isMounted) {
      console.warn(
        "Messenger could not expand messenger due to the messenger chat not beeing mounted yet."
      );
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

export const hideMessenger: HideMessengerFunction = () => {
  if (globalDebugModeFlag) {
    console.log(`[react-messenger-chat-plugin] hiding messenger with argument`);
  }

  try {
    if (isMounted && FB?.CustomerChat) {
      FB.CustomerChat.hide();
    } else if (!isMounted) {
      console.warn(
        "Messenger could not hide messenger due to the messenger chat not beeing mounted yet."
      );
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

export const showDialog: ShowDialogFunction = () => {
  if (globalDebugModeFlag) {
    console.log(`[react-messenger-chat-plugin] showing dialog`);
  }

  try {
    if (isMounted && FB?.CustomerChat) {
      FB.CustomerChat.showDialog();
    } else if (!isMounted) {
      console.warn(
        "Messenger could not show dialog due to the messenger chat not beeing mounted yet."
      );
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

export const hideDialog: HideDialogFunction = () => {
  if (globalDebugModeFlag) {
    console.log(`[react-messenger-chat-plugin] hiding dialog`);
  }

  try {
    if (isMounted && FB?.CustomerChat) {
      FB.CustomerChat.hideDialog();
    } else if (!isMounted) {
      console.warn(
        "Messenger could not hide dialog due to the messenger chat not beeing mounted yet."
      );
    }
  } catch (err: any) {
    throw new Error(err);
  }
};
