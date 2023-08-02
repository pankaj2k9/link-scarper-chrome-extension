import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { getStoredOptions, LocalStorageOptions } from './../utils/storage'
import { Messages } from './../utils/messages'
import './contentScript.css'
import { Box, Button, Card, CardActions, CardContent, Typography } from '@material-ui/core'

type Link = {
    text: string;
    link: string;
}

const App: React.FC<{}> = () => {
    const [options, setOptions] = useState<LocalStorageOptions | null>(null)
    const [isActive, setIsActive] = useState<boolean>(false)
    const [links, setLinks] = useState<Link[] | null>(null)


    useEffect(() => {
        getStoredOptions().then((options) => {
            setOptions(options)
            setIsActive(options.hasAutoOverlay)
            collectAllExternalLinks()
        })
    }, [])

    const collectAllExternalLinks = () => {
        const localLinks = []
        const aTags = document.getElementsByTagName("a")
        for (const tag of aTags) {
            const link = tag.getAttribute('href')
            const text = tag.textContent
            localLinks.push({ text, link })
        }
        setLinks(localLinks)
    }

    const handleMessages = (msg: Messages) => {
        if (msg === Messages.TOGGLE_OVERLAY) {
            setIsActive(!isActive)
        }
    }

    const removeOverlay = () => {
        setIsActive(false)
    }

    useEffect(() => {
        chrome.runtime.onMessage.addListener(handleMessages)
        return () => {
            // clean up event listener, bug fix from: https://www.udemy.com/course/chrome-extension/learn/#questions/14694484/
            chrome.runtime.onMessage.removeListener(handleMessages)
        }
    }, [isActive])

    if (!options) {
        return null
    }

    const listedLinks = (links: Link[]) => {
        return links.map((link: Link, index: number) => {
            return <div key={link?.link + index}>
                {link?.text ? (<Box component="div" sx={{ p: 2, border: '1px solid grey' }}>
                    <a href={link?.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {link?.text}
                    </a>
                </Box>) : null}
            </div>
        })

    }


    return (
        <>
            {isActive && (

                <Card className="overlayCard">
                    <CardContent style={{ overflow: 'auto', height: "100%" }}>
                        <CardActions>
                            <Button color="secondary" onClick={removeOverlay}>
                                <Typography className="weatherCard-body">Hide</Typography>
                            </Button>
                        </CardActions>
                        {links?.length > 0 ? listedLinks(links) : (
                            <Box component="span" sx={{ p: 2, border: '1px solid grey' }}>
                                <Typography>No external links found </Typography>
                            </Box>)
                        }
                    </CardContent>
                </Card>
            )}
        </>
    )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
