import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Box, Grid, IconButton, Paper, Switch, Typography } from '@material-ui/core'
import 'fontsource-roboto'
import './popup.css'
import {
  getStoredOptions,
  LocalStorageOptions,
} from '../utils/storage'
import { Messages } from '../utils/messages'

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)
  const [checked, setChecked] = useState<boolean>(false)

  useEffect(() => {
    getStoredOptions().then((options) => setOptions(options))
  }, [])


  const handleOverlayButtonClick = () => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY)
          setChecked(!checked)
        }
      }
    )
  }

  return (
    <Box mx="8px" my="16px">
      <Grid container justify-content="space-evenly">
        <Grid item>
          <Typography variant="h6"> Show/Hide Sidebar </Typography>
            <Box py="4px">
                <Switch
                  checked={checked}
                  onChange={handleOverlayButtonClick}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
            </Box>
        </Grid>
      </Grid>
      <Box height="16px" />
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
