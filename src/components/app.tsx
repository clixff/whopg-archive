import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import appStyles from '../style/app.module.css';
import '../style/style.css';
import { IStreamer, WhoPGEvent } from '../misc/types';
import SearchIcon from '../assets/svg/search.svg'
import LoadingIcon from '../assets/svg/loading.svg'
import { HomePage } from './home';
import { StreamerPageComponent } from './streamer'
import { findGames, ISearchResult, SearchPage } from './search'


export enum Tab
{
    Home,
    Search,
    Streamer
}

export interface IStreamerTab
{
    streamer: IStreamer | null;
    name: string;
}


async function parseWhoPGEvents(): Promise<Array<WhoPGEvent>>
{
    try
    {
        const res = await fetch('data.json');
        
        const json = await res.json();
        
        return json;
    }
    catch (error)
    {
        console.error(error);
    }

    return [];
}

interface ISearchBarProps
{
    value: string;
    setValue: (value: string) => void;
    initSearch: () => void;
}

function SearchBar(props: ISearchBarProps): JSX.Element
{
    function onChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        if (props && typeof props.setValue === 'function')
        {
            props.setValue(event.target.value);
        }
    }

    function initSearch()
    {
        if (props)
        {
            props.initSearch();
        }
    }

    function onKeyPress(event: React.KeyboardEvent<HTMLInputElement>): void
    {
        if (event.key == 'Enter')
        {
            initSearch();
        }
    }

    return (<div id={appStyles['search-wrapper']}>
        <input type="text" value={props.value} onChange={onChange} placeholder="Поиск по играм" id={appStyles['search-input']} onKeyPress={onKeyPress}  />
        <button id={appStyles['search-button']} onClick={initSearch}>
            <SearchIcon />
        </button>
    </div>);
}

function App(): JSX.Element
{
    const [whoPGEvents, setWhoPGEvents] = useState<Array<WhoPGEvent>>([]);
    const [tab, setTab] = useState<Tab>(Tab.Home);
    const [searchValue, setSearchValue_] = useState<string>('');
    const [streamerPage, setStreamerPage] = useState<IStreamerTab>({
        streamer: null,
        name: ''
    });

    const [searchResults, setSearchResults] = useState<Array<ISearchResult>>([]);

    useEffect(() => {
        async function fetchAPI(): Promise<void>
        {
            const events = await parseWhoPGEvents();

            events.forEach((event) =>
            {
                event.forEach((streamer) =>
                {
                    if (!streamer.games)
                    {
                        streamer.games = [];
                    }

                    streamer.games.forEach((game) => {
                        game.key = game.name.toLowerCase();
                        game.key = game.key.replace(/[\-\:]/g, ' ').replace(/\s\s+/g, ' ').trim();
                    });
                })
            });

            // console.log(events);

            setWhoPGEvents(events);
        }

        fetchAPI();
        
    }, []);

    function setSearchValue(value: string)
    {
        setSearchValue_(value);
    }

    function onLogoClick()
    {
        setTab(Tab.Home);
    }

    function initSearch()
    {
        const searchValueFormatted = searchValue.toLowerCase().replace(/[\-\:]/g, ' ').replace(/\s\s+/g, ' ').trim();
        const searchResults_ = findGames(searchValueFormatted, whoPGEvents);

        setSearchResults(searchResults_);
        setTab(Tab.Search);
    }

    return (<div>
        <div id={appStyles['navbar']}>
            <div id={appStyles['navbar-logo']} onClick={onLogoClick}>
                Архив WhoPG
            </div>
        </div>

        <div id={appStyles['content']}>
            <div id={appStyles['content-container']}>
                <SearchBar value={searchValue} setValue={setSearchValue} initSearch={initSearch}/>

                {
                    whoPGEvents && Array.isArray(whoPGEvents) && whoPGEvents.length ?
                    (
                        tab == Tab.Home ?
                        (<HomePage events={whoPGEvents} callbacks={ { setTab: setTab, setStreamerPage: setStreamerPage } } />) : 
                        (tab == Tab.Streamer ?
                        (<StreamerPageComponent data={streamerPage} callbacks={ { setTab: setTab } } />) :
                        (<SearchPage results={searchResults} callbacks={ { setTab: setTab, setSearchValue: setSearchValue }  } />))
                    ) : (
                        <div id={appStyles['loading']}>
                            <LoadingIcon />
                        </div>
                    )
                }
            </div>
            
        </div>
    </div>);
}

ReactDOM.render(<App />, document.getElementById('root'));