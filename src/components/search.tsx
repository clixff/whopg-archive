import React from 'react';
import { EGameStatus, IGame, IStreamer, WhoPGEvent } from '../misc/types';
import searchStyle from '../style/search.module.css';
import ArrowSVG from '../assets/svg/arrow.svg'
import { Tab } from './app';

export interface ISearchResult
{
    event: number;
    streamer: IStreamer;
    game: IGame;
}

export function findGames(searchRequest: string, events: Array<WhoPGEvent>): Array<ISearchResult>
{
    const foundGames: Array<ISearchResult> = [];

    events.forEach((event, nEvent) =>
    {
        event.forEach((streamer) =>
        {
            if (streamer.games)
            {
                streamer.games.forEach((game) =>
                {
                    if (game.key.includes(searchRequest))
                    {
                        const searchResult: ISearchResult = 
                        {
                            event: nEvent + 1,
                            streamer: streamer,
                            game: game
                        };

                        foundGames.push(searchResult);
                    }
                });
            }
        });
    });

    return foundGames;
}

interface ISearchResultComponentProps
{
    result: ISearchResult;
}

function SearchResultComponent(props: ISearchResultComponentProps): JSX.Element
{
    function getStatusName(status: EGameStatus): string
    {
        switch (status) {
            case EGameStatus.Completed:
                return 'Пройдено';
            case EGameStatus.Drop:
                return 'Дроп';
            case EGameStatus.Reroll:
                return 'Реролл';
            default:
                return '';
        }
    }

    function getStatusClass(status: EGameStatus): string
    {
        switch (status) {
            case EGameStatus.Completed:
                return 'game-status-completed';
            case EGameStatus.Drop:
                return 'game-status-drop';
            case EGameStatus.Reroll:
                return 'game-status-reroll';
            default:
                return 'game-status-completed';
        }
    }

    return (<div className={searchStyle.result}>
        <div> <b> Ивент: </b> WhoPG { props.result.event }  </div>
        <div style={ { color: `#${props.result.streamer.color}` } } > <b> Стример: </b> { props.result.streamer.name }  </div>
        <div> <b> Игра: </b> <a href={props.result.game.url || ''} target="_blank" rel="noopener noreferrer"> { props.result.game.name } </a> </div>
        <div className={searchStyle[getStatusClass(props.result.game.status)]}> <b> Статус: </b> { getStatusName(props.result.game.status) }  </div>
        <div> <b> Комментарий: </b> { props.result.game.comment }  </div>
    </div>);
}

interface ISearchPageProps
{
    results: Array<ISearchResult>;
    callbacks: {
        setTab: (tab: Tab) => void;
        setSearchValue: (value: string) => void;
    }
}

export function SearchPage(props: ISearchPageProps): JSX.Element
{
    function onBackClick()
    {
        if (props && props.callbacks)
        {
            props.callbacks.setTab(Tab.Home);
            props.callbacks.setSearchValue('');
        }
    }

    return (<div id={searchStyle.wrapper}>
<       div id={searchStyle['back-wrapper']}>
            <button onClick={onBackClick}>
                <ArrowSVG />
            </button>
            {
                `Результаты поиска`
            }
        </div>
        <div id={searchStyle['search-container']}>
            {
                props.results.map((result, index) =>
                {
                    return (<SearchResultComponent result={result} key={`${result.game.key}-${index}`} />)
                })
            }
        </div>
    </div>);
}