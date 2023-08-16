import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Box, Grid, IconButton, Paper, Switch, Typography } from '@material-ui/core'
import 'fontsource-roboto'
import './popup.css'
import {
  getStoredOptions,
  LocalStorageOptions,
  setStoredOptions,
} from '../utils/storage'
import { Messages } from '../utils/messages'
import browser, { Tabs } from "webextension-polyfill";

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)
  const [checked, setChecked] = useState<boolean>(false)

  useEffect(() => {
    browser.runtime.onMessage.addListener(((message, sender, sendResponse) => {
      if(message.type === "backgroundScriptMessage") {
        setChecked(message.data)
      }
   }))
    getStoredOptions().then((options) => {
      setOptions(options)
    })
  }, [])


  const handleOverlayButtonClick = (event:React.ChangeEvent<HTMLInputElement>) => {
    browser.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs: Tabs.Tab[]) => {
        if (tabs.length > 0) {
          browser.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY)
          setStoredOptions({ hasOverlay : !options?.hasOverlay})
         }
    });

  }

  return (
    <Box mx="8px" my="16px">
      <Grid container justify-content="space-evenly">
        <Grid item>
          <Typography variant="h6"> Show/Hide Sidebar </Typography>
                <Switch
                  checked={checked}
                  onChange={handleOverlayButtonClick}
                />
        </Grid>
      </Grid>
      <Box height="16px" />
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
