import React from 'react';
import {storiesOf} from '@storybook/react';
import MessengerChat from '../components/MessengerChat/MessengerChat';

const stories = storiesOf('App Test', module);

stories.add('App', () => {
    return <MessengerChat 
    pageId='100580741804518' 
    language='sv_SE'
    themeColor={'#000000'} 
    height={24} 
    loggedInGreeting='loggedInGreeting' 
    loggedOutGreeting='loggedOutGreeting' 
    autoExpand={true} 
    debugMode={false}
    onMessengerExpand={() => {console.log('onMessengerExpand')}}
    onMessengerHide={() => {console.log('onMessengerHide')}}
    onMessengerDialogShow={() => {console.log('onMessengerDialogShow')}}
    onMessengerDialogHide={() => {console.log('onMessengerDialogHide')}}
    />;
})