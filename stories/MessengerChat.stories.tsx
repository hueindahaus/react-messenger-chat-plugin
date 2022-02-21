import React from "react";
import { storiesOf } from "@storybook/react";
import { MessengerChat } from "../src/MessengerChat";

const stories = storiesOf("App Test", module);

stories.add("App", () => {
  return (
    <MessengerChat
      pageId="100580741804518"
      language="sv_SE"
      themeColor={"#000000"}
      height={200}
      loggedInGreeting="loggedInGreeting"
      loggedOutGreeting="loggedOutGreeting"
      autoExpand={true}
      debugMode={true}
      onMessengerShow={() => {
        console.log("onMessengerShow");
      }}
      onMessengerHide={() => {
        console.log("onMessengerHide");
      }}
      onMessengerDialogShow={() => {
        console.log("onMessengerDialogShow");
      }}
      onMessengerDialogHide={() => {
        console.log("onMessengerDialogHide");
      }}
      onMessengerMounted={() => {
        console.log("onMessengerMounted");
      }}
    />
  );
});
