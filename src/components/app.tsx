import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import appStyles from '../style/app.module.css';
import '../style/style.css';
import { WhoPGEvent } from '../misc/types';
import SearchIcon from '../assets/svg/search.svg'
import LoadingIcon from '../assets/svg/loading.svg'
import { HomePage } from './home';


enum Tab
{
    Home,
    Search,
    Streamer
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

    return (<div id={appStyles['search-wrapper']}>
        <input type="text" value={props.value} onChange={onChange} placeholder="Поиск по играм" id={appStyles['search-input']} />
        <button id={appStyles['search-button']}>
            <SearchIcon />
        </button>
    </div>);
}

function App(): JSX.Element
{
    const [whoPGEvents, setWhoPGEvents] = useState<Array<WhoPGEvent>>([]);
    const [tab, setTab] = useState<Tab>(Tab.Home);
    const [searchValue, setSearchValue_] = useState<string>('');

    useEffect(() => {
        async function fetchAPI(): Promise<void>
        {
            const events = await parseWhoPGEvents();

            console.log(events);

            setWhoPGEvents(events);
        }

        fetchAPI();
        
    }, []);

    function setSearchValue(value: string)
    {
        setSearchValue_(value);
    }

    return (<div>
        <div id={appStyles['navbar']}>
            <div id={appStyles['navbar-logo']}>
                Игры WhoPG
            </div>
        </div>

        <div id={appStyles['content']}>
            <div id={appStyles['content-container']}>
                <SearchBar value={searchValue} setValue={setSearchValue}/>

                {
                    whoPGEvents && Array.isArray(whoPGEvents) && whoPGEvents.length ?
                    (
                        tab == Tab.Home ?
                        (<HomePage events={whoPGEvents} />) : null
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