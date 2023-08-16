import { Messages } from '../utils/messages';
import {
  setStoredOptions,
} from '../utils/storage'
import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(() => {
  setStoredOptions({
    hasOverlay: false,
  })
})

browser.runtime.onMessage.addListener(((message, sender, sendResponse) => {
   if(message.type === "contentScriptMessage") {
    browser.runtime.sendMessage({ type: "backgroundScriptMessage", data: message.data });
   }
}))