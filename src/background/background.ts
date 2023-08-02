import {
  setStoredOptions,
} from '../utils/storage'
// import browser from "webextension-polyfill";

chrome.runtime.onInstalled.addListener(() => {
  setStoredOptions({
    hasAutoOverlay: false,
  })
})
