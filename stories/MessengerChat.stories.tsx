import React, { useEffect } from "react";
import { storiesOf } from "@storybook/react";
import { MessengerChat } from "../src/MessengerChat";

const stories = storiesOf("App Test", module);

stories.add("App", () => {
  useEffect(() => {
    return window.localStorage.removeItem("__fb_chat_plugin");
  }, []);

  return (
    <MessengerChat
      pageId="109268111769502"
      language="sv_SE"
      themeColor={"#000000"}
      bottomSpacing={300}
      loggedInGreeting="loggedInGreeting"
      loggedOutGreeting="loggedOutGreeting"
      greetingDialogDisplay={"show"}
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
      onMessengerLoad={() => {
        console.log("onMessengerLoad");
      }}
    />
  );
});
