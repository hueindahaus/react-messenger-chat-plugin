/* eslint-disable no-undef */
import React, { LegacyRef, useEffect } from "react";

// Customer chat sdk: https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/sdk/
// Chat plugin: https://developers.facebook.com/docs/messenger-platform/discovery/facebook-chat-plugin/

export interface Props {
  pageId: string;
  language?: string;
  themeColor?: string;
  greetingDialogDisplay?: "hide" | "show" | "fade" | "icon";
  greetingDialogDelay?: number;
  bottomSpacing?: number;
  loggedInGreeting?: string;
  loggedOutGreeting?: string;
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

export interface HideMessengerFunction extends VoidFunction {}
export interface ShowDialogFunction extends VoidFunction {}
export interface HideDialogFunction extends VoidFunction {}

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
      bottomSpacing,
      greetingDialogDisplay,
      greetingDialogDelay = 0,
      loggedInGreeting,
      loggedOutGreeting,
      onMessengerMounted,
      onMessengerLoad,
      onMessengerShow,
      onMessengerHide,
      onMessengerDialogShow,
      onMessengerDialogHide,
      debugMode = false,
      version = "v13.0",
    },
    ref
  ) => {
    // [DEPRECATED]
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
          "Problem when autoexpanding messenger chatbox occured. Please file an issue on github."
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

        if (greetingDialogDisplay) {
          chatbox.setAttribute(
            "greeting_dialog_display",
            greetingDialogDisplay
          );
        }

        if (greetingDialogDelay) {
          chatbox.setAttribute(
            "greeting_dialog_delay",
            greetingDialogDelay.toString()
          );
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
            if (onMessengerLoad) onMessengerLoad();

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
    }, []);

    return (
      <div ref={ref as LegacyRef<HTMLDivElement>}>
        <div id="fb-root"></div>
        <div id="fb-customer-chat" className="fb-customerchat"></div>
      </div>
    );
  }
);

export const setMessengerBottomSpacing: SetMessengerBottomSpacingFunction = (
  bottomSpacing
) => {
  if (globalDebugModeFlag) {
    console.log(
      `[react-messenger-chat-plugin] setting messenger bottom spacing: ${bottomSpacing}`
    );
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
