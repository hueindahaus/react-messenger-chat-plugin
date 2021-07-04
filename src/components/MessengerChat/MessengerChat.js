// Customer chat sdk: https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/sdk/
// Chat plugin: https://developers.facebook.com/docs/messenger-platform/discovery/facebook-chat-plugin/

/* eslint-disable no-undef */
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

// flag to identify wether or not messenger chat is mounted
let isMounted = false;

// added to be able to access debug mode outside component
let globalDebugModeFlag = false;

const MessengerChat = ({
    pageId, 
    themeColor, 
    height,
    autoExpand = true,
    loggedInGreeting, 
    loggedOutGreeting, 
    ref, 
    onMessengerMounted, 
    onMessengerLoad,
    onMessengerExpand,
    onMessengerHide,
    onMessengerDialogShow,
    onMessengerDialogHide,
    debugMode = false

}) => {
  
    const initExpand = () => {
        if(debugMode){
            console.log('[react-messenger-chat-plugin] expanding on init')
        }

        try{
            const cachedChatState = JSON.parse(localStorage.getItem('__fb_chat_plugin'));
  
            //https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type
            const samePageNavigation = performance?.getEntriesByType('navigation')[0]?.type !== 'navigate';
        
            if (cachedChatState && cachedChatState?.visibility === 'hidden' && !samePageNavigation) {
                FB.CustomerChat.show();
            }
        } catch (err){
            console.warn('Probblem when autoexpanding messenger chatbox occured. Please file an issue on github.')
            throw new Error(err);
        }
      
    };
  
    const initMessenger = () => {
        if(debugMode){
            console.log('[react-messenger-chat-plugin] initializing messenger plugin')
        }

      try {
        const chatbox = document.getElementById('fb-customer-chat');

        chatbox.setAttribute('page_id', pageId);
        chatbox.setAttribute('attribution', 'biz_inbox');

        if(themeColor){
            chatbox.setAttribute('theme_color', themeColor);
        }

        if(loggedInGreeting){
            chatbox.setAttribute('logged_in_greeting', loggedInGreeting);
        }

        if(loggedOutGreeting){
            chatbox.setAttribute('logged_out_greeting', loggedOutGreeting);
        }

        if(autoExpand){
            chatbox.setAttribute('greeting_dialog_display', 'show');
            chatbox.setAttribute('greeting_dialog_delay', 0);
        } else {
            chatbox.setAttribute('greeting_dialog_display', 'hide');
        }


        if(ref){
            chatbox.setAttribute('ref', ref);
        }
  
        window.fbAsyncInit = function () {
          FB.init({
            xfbml: true,
            version: 'v11.0',
          });

          FB.Event.subscribe('customerchat.load', () => {if(onMessengerLoad) onMessengerLoad()});

          FB.Event.subscribe('xfbml.render', () => {

            // we check if not undefined, since 0 should still be a valid number
            if(height !== undefined){
                setMessengerHeight(height)
            }  

            //this is necessary to manually open chatbox on init when state (especially visibility=hidden) is cached in localStorage.
            if(autoExpand){
                setTimeout(initExpand, 3000);
            }

            if(onMessengerMounted){
                onMessengerMounted();
            }

            isMounted = true;
          });

          FB.Event.subscribe('customerchat.show', () => {if(onMessengerExpand) onMessengerExpand()});

          FB.Event.subscribe('customerchat.hide', () => {if(onMessengerHide) onMessengerHide()});

          FB.Event.subscribe('customerchat.dialogShow', () => {if(onMessengerDialogShow) onMessengerDialogShow()});

          FB.Event.subscribe('customerchat.dialogHide', () => {if(onMessengerDialogHide) onMessengerDialogHide()});

        };
  
        (function (d, s, id) {
          let js,
            // eslint-disable-next-line prefer-const
            fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          // eslint-disable-next-line prefer-const
          js = d.createElement(s);
          js.id = id;
          js.src = 'https://connect.facebook.net/sv_SE/sdk/xfbml.customerchat.js';
          fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
      } catch (err) {
        throw (err);
      }
    };
  
    useEffect(() => {
      try {
          globalDebugModeFlag = debugMode;
        initMessenger();
      } catch (err) {
        console.log(err);
      }
    });

    return (
      <div>  
        <div id="fb-root"></div>
        <div id="fb-customer-chat" className="fb-customerchat"></div>
      </div>
    );
};


//NOTE: THIS IS A VERY HACKY WAY OF MODIFYING ELEMENTS STYLE.
export const setMessengerHeight = (height) => {
    if(globalDebugModeFlag){
        console.log(`[react-messenger-chat-plugin] setting messenger height: ${height}`)
    }

    const tmpIconElement = document.getElementsByClassName('fb_customer_chat_icon');
    if (tmpIconElement && tmpIconElement.length > 0) {
      const iconElement = tmpIconElement[0];
      iconElement.style.bottom = `${height}px`;
    } else {
        console.warn('Could not set height of messenger button.')
    }

    const tmpChatElement = document.getElementsByClassName('anchor_right');
    if (tmpIconElement && tmpChatElement.length > 0) {
      const chatElement = tmpChatElement[0];
      //if window width is md (tailwind) or smaller
      chatElement.style.bottom = `${height + 56}px`;
    } else {
        console.warn('Could not set height of messenger dialog container.')
    }
};

export const expandMessenger = (shouldShowDialog) => {
    if(globalDebugModeFlag){
        console.log(`[react-messenger-chat-plugin] expanding messenger with argument "shouldShowDialog": ${shouldShowDialog}`)
    }

    try {
        if(isMounted && FB?.CustomerChat){
            FB.CustomerChat.show(shouldShowDialog);
        } else if(!isMounted){
            console.warn('Messenger could not expand messenger due to the messenger chat not beeing mounted yet.')
        }
    } catch (err){
        throw new Error(err);
    }
    
}

export const hideMessenger = (shouldShowDialog = false) => {
    if(globalDebugModeFlag){
        console.log(`[react-messenger-chat-plugin] hiding messenger with argument`)
    }

    try {
        if(isMounted && FB?.CustomerChat){
            FB.CustomerChat.hide();
        } else if(!isMounted){
            console.warn('Messenger could not hide messenger due to the messenger chat not beeing mounted yet.')
        }
    } catch (err){
        throw new Error(err);
    }
}

export const showDialog = () => {
    if(globalDebugModeFlag){
        console.log(`[react-messenger-chat-plugin] showing dialog`)
    }

    try {
        if(isMounted && FB?.CustomerChat){
            FB.CustomerChat.showDialog();
        } else if(!isMounted){
            console.warn('Messenger could not show dialog due to the messenger chat not beeing mounted yet.')
        }
    } catch (err){
        throw new Error(err);
    }
}

export const hideDialog = () => {
    if(globalDebugModeFlag){
        console.log(`[react-messenger-chat-plugin] hiding dialog`)
    }

    try {
        if(isMounted && FB?.CustomerChat){
            FB.CustomerChat.hideDialog();
        } else if(!isMounted){
            console.warn('Messenger could not hide dialog due to the messenger chat not beeing mounted yet.')
        }
    } catch (err){
        throw new Error(err);
    }
}

MessengerChat.propTypes = {
    pageId: PropTypes.string.isRequired,
    themeColor: PropTypes.string,
    height: PropTypes.number,
    autoExpand: PropTypes.bool,
    loggedInGreeting: PropTypes.string,
    loggedOutGreeting: PropTypes.string,
    ref: PropTypes.string,
    onMessengerMounted: PropTypes.func,
    onMessengerLoad: PropTypes.func,
    onMessengerExpand: PropTypes.func,
    onMessengerHide: PropTypes.func,
    onMessengerDialogShow: PropTypes.func,
    onMessengerDialogHide: PropTypes.func,
    debugMode: PropTypes.bool,


    custom: function(props) {
        console.log(props)
        const themeColor = props.themeColor;
        if(themeColor && !/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(themeColor)){
            return new Error('Invalid hexcolor format on prop: themeColor');
        }
    }
}

  export default MessengerChat;