'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var PropTypes = require('prop-types');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);

// Customer chat sdk: https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/sdk/

let isMounted = false; // added to be able to access debug mode outside component

let globalDebugModeFlag = false;
const MessengerChat = ({
  pageId,
  language = 'en_US',
  themeColor,
  height,
  autoExpand = true,
  loggedInGreeting,
  loggedOutGreeting,
  ref,
  onMessengerMounted,
  onMessengerLoad,
  onMessengerShow,
  onMessengerHide,
  onMessengerDialogShow,
  onMessengerDialogHide,
  debugMode = false,
  version = 'v11.0'
}) => {
  const initExpand = () => {
    if (debugMode) {
      console.log('[react-messenger-chat-plugin] expanding on init');
    }

    try {
      const cachedChatState = JSON.parse(localStorage.getItem('__fb_chat_plugin')); //https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type

      const samePageNavigation = performance?.getEntriesByType('navigation')[0]?.type !== 'navigate';

      if (cachedChatState && cachedChatState?.visibility === 'hidden' && !samePageNavigation) {
        FB.CustomerChat.show();
      }
    } catch (err) {
      console.warn('Probblem when autoexpanding messenger chatbox occured. Please file an issue on github.');
      throw new Error(err);
    }
  };

  const initMessenger = () => {
    if (debugMode) {
      console.log('[react-messenger-chat-plugin] initializing messenger plugin');
    }

    try {
      const chatbox = document.getElementById('fb-customer-chat');
      chatbox.setAttribute('page_id', pageId);
      chatbox.setAttribute('attribution', 'biz_inbox');

      if (themeColor) {
        chatbox.setAttribute('theme_color', themeColor);
      }

      if (loggedInGreeting) {
        chatbox.setAttribute('logged_in_greeting', loggedInGreeting);
      }

      if (loggedOutGreeting) {
        chatbox.setAttribute('logged_out_greeting', loggedOutGreeting);
      }

      if (autoExpand) {
        chatbox.setAttribute('greeting_dialog_display', 'show');
        chatbox.setAttribute('greeting_dialog_delay', 0);
      } else {
        chatbox.setAttribute('greeting_dialog_display', 'hide');
      }

      if (ref) {
        chatbox.setAttribute('ref', ref);
      }

      window.fbAsyncInit = function () {
        FB.init({
          xfbml: true,
          version: version
        });
        FB.Event.subscribe('customerchat.load', () => {
          if (onMessengerLoad) onMessengerLoad();
        });
        FB.Event.subscribe('xfbml.render', () => {
          // we check if not undefined, since 0 should still be a valid number
          if (height !== undefined) {
            setMessengerHeight(height);
          } //this is necessary to manually open chatbox on init when state (especially visibility=hidden) is cached in localStorage.


          if (autoExpand) {
            setTimeout(initExpand, 3000);
          }

          if (onMessengerMounted) {
            onMessengerMounted();
          }

          isMounted = true;
        });
        FB.Event.subscribe('customerchat.show', () => {
          if (onMessengerShow) onMessengerShow();
        });
        FB.Event.subscribe('customerchat.hide', () => {
          if (onMessengerHide) onMessengerHide();
        });
        FB.Event.subscribe('customerchat.dialogShow', () => {
          if (onMessengerDialogShow) onMessengerDialogShow();
        });
        FB.Event.subscribe('customerchat.dialogHide', () => {
          if (onMessengerDialogHide) onMessengerDialogHide();
        });
      };

      (function (d, s, id) {
        let js,
            // eslint-disable-next-line prefer-const
        fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return; // eslint-disable-next-line prefer-const

        js = d.createElement(s);
        js.id = id;
        js.src = `https://connect.facebook.net/${language}/sdk/xfbml.customerchat.js`;
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    } catch (err) {
      throw err;
    }
  };

  React.useEffect(() => {
    try {
      globalDebugModeFlag = debugMode;
      initMessenger();
    } catch (err) {
      console.log(err);
    }
  });
  return /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement("div", {
    id: "fb-root"
  }), /*#__PURE__*/React__default['default'].createElement("div", {
    id: "fb-customer-chat",
    className: "fb-customerchat"
  }));
}; //NOTE: THIS IS A VERY HACKY WAY OF MODIFYING ELEMENTS STYLE.

const setMessengerHeight = height => {
  if (globalDebugModeFlag) {
    console.log(`[react-messenger-chat-plugin] setting messenger height: ${height}`);
  }

  const tmpIconElement = document.getElementsByClassName('fb_customer_chat_icon');

  if (tmpIconElement && tmpIconElement.length > 0) {
    const iconElement = tmpIconElement[0];
    iconElement.style.bottom = `${height}px`;
  } else {
    console.warn('Could not set height of messenger button.');
  }

  const tmpChatElement = document.getElementsByClassName('anchor_right');

  if (tmpIconElement && tmpChatElement.length > 0) {
    const chatElement = tmpChatElement[0]; //if window width is md (tailwind) or smaller

    chatElement.style.bottom = `${height + 56}px`;
  } else {
    console.warn('Could not set height of messenger dialog container.');
  }
};
const showMessenger = shouldShowDialog => {
  if (globalDebugModeFlag) {
    console.log(`[react-messenger-chat-plugin] showing messenger with argument "shouldShowDialog": ${shouldShowDialog}`);
  }

  try {
    if (isMounted && FB?.CustomerChat) {
      FB.CustomerChat.show(shouldShowDialog);
    } else if (!isMounted) {
      console.warn('Messenger could not expand messenger due to the messenger chat not beeing mounted yet.');
    }
  } catch (err) {
    throw new Error(err);
  }
};
const hideMessenger = (shouldShowDialog = false) => {
  if (globalDebugModeFlag) {
    console.log(`[react-messenger-chat-plugin] hiding messenger with argument`);
  }

  try {
    if (isMounted && FB?.CustomerChat) {
      FB.CustomerChat.hide();
    } else if (!isMounted) {
      console.warn('Messenger could not hide messenger due to the messenger chat not beeing mounted yet.');
    }
  } catch (err) {
    throw new Error(err);
  }
};
const showDialog = () => {
  if (globalDebugModeFlag) {
    console.log(`[react-messenger-chat-plugin] showing dialog`);
  }

  try {
    if (isMounted && FB?.CustomerChat) {
      FB.CustomerChat.showDialog();
    } else if (!isMounted) {
      console.warn('Messenger could not show dialog due to the messenger chat not beeing mounted yet.');
    }
  } catch (err) {
    throw new Error(err);
  }
};
const hideDialog = () => {
  if (globalDebugModeFlag) {
    console.log(`[react-messenger-chat-plugin] hiding dialog`);
  }

  try {
    if (isMounted && FB?.CustomerChat) {
      FB.CustomerChat.hideDialog();
    } else if (!isMounted) {
      console.warn('Messenger could not hide dialog due to the messenger chat not beeing mounted yet.');
    }
  } catch (err) {
    throw new Error(err);
  }
};
MessengerChat.propTypes = {
  pageId: PropTypes__default['default'].string.isRequired,
  language: PropTypes__default['default'].string,
  themeColor: PropTypes__default['default'].string,
  height: PropTypes__default['default'].number,
  autoExpand: PropTypes__default['default'].bool,
  loggedInGreeting: PropTypes__default['default'].string,
  loggedOutGreeting: PropTypes__default['default'].string,
  ref: PropTypes__default['default'].string,
  onMessengerMounted: PropTypes__default['default'].func,
  onMessengerLoad: PropTypes__default['default'].func,
  onMessengerShow: PropTypes__default['default'].func,
  onMessengerHide: PropTypes__default['default'].func,
  onMessengerDialogShow: PropTypes__default['default'].func,
  onMessengerDialogHide: PropTypes__default['default'].func,
  debugMode: PropTypes__default['default'].bool,
  version: PropTypes__default['default'].string,
  custom: function (props) {
    console.log(props);
    const themeColor = props.themeColor;

    if (themeColor && !/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(themeColor)) {
      return new Error('Invalid hexcolor format on prop: themeColor');
    }
  }
};

exports.MessengerChat = MessengerChat;
exports.hideDialog = hideDialog;
exports.hideMessenger = hideMessenger;
exports.setMessengerHeight = setMessengerHeight;
exports.showDialog = showDialog;
exports.showMessenger = showMessenger;
