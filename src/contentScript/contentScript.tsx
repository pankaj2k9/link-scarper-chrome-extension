import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { getStoredOptions, LocalStorageOptions } from './../utils/storage'
import { Messages } from './../utils/messages'
import './contentScript.css'
import { Box, Button, Card, CardActions, CardContent, Typography } from '@material-ui/core'
import browser from "webextension-polyfill";
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

type Link = {
    text: string;
    link: string;
}

const App: React.FC<{}> = () => {
    const [options, setOptions] = useState<LocalStorageOptions | null>(null)
    const [isActive, setIsActive] = useState<boolean>(false)
    const [links, setLinks] = useState<Link[] | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Link[] | null>(null)


    const overlayRef = useRef(null);

    useEffect(() => {
        if (overlayRef.current) {
            overlayRef.current.focus()
        }
    }, [overlayRef])


    useEffect(() => {
        getStoredOptions().then((options) => {
            setOptions(options)
            setIsActive(options.hasOverlay)
            collectAllExternalLinks()
        })
    }, [])

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);

        const tempLinks = [...links];

        const filteredData = tempLinks && tempLinks.filter(
            (item) => item.text.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredData);
    };

    const hideOverlayhandler = () => {
        setIsActive(false)
        browser.runtime.sendMessage({ type: "contentScriptMessage", data: false });
    }

    const collectAllExternalLinks = () => {
        const localLinks = []
        const aTags = document.getElementsByTagName("a")
        for (const tag of aTags) {
            const link = tag.getAttribute('href')
            const text = tag.textContent
            localLinks.push({ text, link })
        }
        setLinks(localLinks)
        setSearchResults(localLinks)
    }

    const handleMessages = (msg: Messages) => {
        if (msg === Messages.TOGGLE_OVERLAY) {
            browser.runtime.sendMessage({ type: "contentScriptMessage", data: !isActive });
            setIsActive(!isActive)
        }
    }


    useEffect(() => {
        browser.runtime.onMessage.addListener(handleMessages)
        return () => {
            browser.runtime.onMessage.removeListener(handleMessages)
        }
    }, [isActive])

    if (!options) {
        return null
    }

    const listedLinks = (links: Link[]) => {
        return links.map((link: Link, index: number) => {
            return <div key={link?.link + index}>
                {link?.text ? (<Box component="div" sx={{ p: 2, border: '1px solid grey' }}>
                    <a href={link.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {link.text}
                    </a>
                </Box>) : null}
            </div>
        })

    }


    return (
        <div ref={overlayRef}>
            {isActive && (
                <Card className="overlayCard">
                    <CardContent style={{ overflow: 'auto', height: "100%" }}>
                        <CardActions>
                            <Button color="primary" size="large" variant="contained" onClick={hideOverlayhandler}>
                                Hide
                            </Button>
                        </CardActions>

                        <TextField
                            label="Search"
                            variant="outlined"
                            value={searchQuery}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            style={{ marginBottom: '16px' }}
                        />
                        {searchResults?.length > 0 ? listedLinks(searchResults) : (
                            <Box component="span" sx={{ p: 2, border: '1px solid grey' }}>
                                <Typography>No external links found </Typography>
                            </Box>)
                        }
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
