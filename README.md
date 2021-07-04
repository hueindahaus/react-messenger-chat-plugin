# react-messenger-chat-plugin :speech_balloon: [![npm](https://img.shields.io/npm/v/react-messenger-chat-plugin.svg)](https://www.npmjs.com/package/react-messenger-chat-plugin) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) ![size](https://img.shields.io/bundlephobia/min/react-messenger-chat-plugin?color=success) ![language](https://img.shields.io/github/languages/top/hueindahaus/react-messenger-chat-plugin?color=ff69b4)
 
 <p align="center">
 <img width="220" src="https://user-images.githubusercontent.com/45295311/124386303-16e4b280-dcda-11eb-9470-2ee68e7fc209.png">
 <img width="220" src="https://user-images.githubusercontent.com/45295311/124386301-164c1c00-dcda-11eb-83fe-aa50c9297a7f.png">
 <img width="220" height="400" src="https://user-images.githubusercontent.com/45295311/124386300-164c1c00-dcda-11eb-8992-b0b96bf32f53.png">
 <img width="220" height="400" src="https://user-images.githubusercontent.com/45295311/124386299-15b38580-dcda-11eb-9e3d-19e368d1cfc1.png">
</p>

<br />

## Table of contents

* [Installation](#installation)
* [Usage](#usage)
    * [MessengerChat Component](#messenger-chat-component)
    * [MessengerChat Control Functions](#messenger-chat-control-functions)
* [Official docs](#official-docs)

<br />

## Installation <a name="installation"/>

First, **whitelist** your domain to be eligible to use the messenger chat in facebooks page settings:

**Facebook page** > **Settings** > **Messaging** (in sidebar) > **Add messenger to your website** > **Whitelist domain**

> :warning: **NOTE:** Facebook doesn't allow whitelisting localhost, so for dev-mode use a wrapper like [ngrok](https://ngrok.com/).

### npm
```sh
npm install react-messenger-chat-plugin
```

### yarn

```sh
yarn add react-messenger-chat-plugin
```

<br />

## Usage <a name="usage" />

### MessengerChat Component<a name="messenger-chat-component" />

```js
import React from 'react';
import ReactDOM from 'react-dom';
import MessengerChat from 'react-messenger-customer-chat';

ReactDOM.render(
  <MessengerChat 
    pageId='123456789101112' 
    language='en_US'
    themeColor={'#F2F3G2'} 
    height={24} 
    loggedInGreeting='Hello logged in user!' 
    loggedOutGreeting='Hello stranger!' 
    autoExpand={true} 
    debugMode={false}
    onMessengerShow={() => {console.log('onMessengerShow')}}
    onMessengerHide={() => {console.log('onMessengerHide')}}
    onMessengerDialogShow={() => {console.log('onMessengerDialogShow')}}
    onMessengerDialogHide={() => {console.log('onMessengerDialogHide')}}
    />;,
  document.getElementById('demo')
);
```

| Attribute     |  Description       |
| ------------- |:-------------:|
| pageId (string) **Required** | Id of page which can be found on the facebook page |are neat      |
| language (string)  | Language locale, e.g. 'en_US' for english or 'sv_SE' for swedish |
| themeColor (string) | Hexcode color of the theme color   |
| height (integer) | Pixel height from bottom of the page |     
| autoExpand (bool) | Smart autoexpanding feature which expands the dialog for each new session. NOTE: Will not expand on refresh or back/forward-load, but will remember UI state |     
| loggedInGreeting (string) | Greeting message displayed if user is logged in |     
| loggedOutGreeting (string) | Greeting message displayed if user is logged out  |     
| ref (string) |  Addittional context to be passed in requests |     
| onMessengerMounted (function) | Callback which is called when the messenger chat is mounted |     
| onMessengerLoad (function) | Callback which is called on load |     
| onMessengerShow (function) | Callback which is called when the component is shown.   |     
| onMessengerHide (function)| Callback which is called when the component is hidden    |     
| onMessengerDialogShow (function)| Callback which is called each time the dialog is expanded  |     
| onMessengerDialogHide (function)| Callback which is called each time the dialog is hidden   |     
| debugMode (bool) |  Enables debug mode which console.logs every event in the component  |     
| version | Version of the messenger chat |   

> :warning: **NOTE:** some attributes can be controlled from your facebook page messenger chat plugin configurations. These are by default overriden by the props, so if you want more control from facebook -> populate less props.

<br />

### MessengerChat Control Functions <a name="messenger-chat-control-functions" />
This package also supports control functions for the messenger chat which can be accessed globally. The control functions will only work after the messenger chat has succesfully mounted.
```js
import MessengerChat, {showMessenger, hideMessenger, showDialog, hideDialog, setMessengerHeight} from './MessengerChat';

function App() {

  return (
    <div className="App">
      <button onClick={() => {showMessenger(true)}}>show messenger</button>
      <button onClick={() => {hideMessenger()}}>hide messenger</button>
      <button onClick={() => {showDialog()}}>show dialog</button>
      <button onClick={() => {hideDialog()}}>hide dialog</button>
      <button onclick={() => {setMessengerHeight(100)}}>set chat 100px from bottom<button>

      <MessengerChat pageId='123456789101112' />
    </div>
  );
}

export default App;
```

| Function        | Description           |
| ------------- |:-------------:|
| setMessengerHeight(height: integer)     | Immediately sets height of messenger chat in pixels from bottom of the page |
| showMessenger(shouldShowDialog: bool) | Shows the whole component |
| hideMessenger() | Hides the whole component |
| showDialog() | Expands dialog |
| hideDialog() | Hides dialog |

<br />

## Official docs <a name="official-docs" />
Facebook provides official docs for [messenger customer chat plugin](https://developers.facebook.com/docs/messenger-platform/discovery/facebook-chat-plugin/) and [chat plugin sdk](https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/sdk/) which are the bases for this package.
