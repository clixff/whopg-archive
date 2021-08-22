import React, { useEffect, useState } from 'react';
import streamerStyle from '../style/streamer.module.css'
import { IStreamerTab, Tab } from './app';
import ArrowSVG from '../assets/svg/arrow.svg'
import { EGameStatus, IGame } from '../misc/types';

interface IGameComponentProps
{
    game: IGame;
}


function GameComponent(props: IGameComponentProps): JSX.Element
{
    const [bRevealed, setRevealed] = useState(false);
    const [bHiddenFull, setHiddenFull] = useState(true);
    const [timeoutValue, setTimeoutValue] = useState<number | null>(null);

    useEffect(() =>
    {
        return (() =>
        {
            if (timeoutValue && window)
            {
                window.clearTimeout(timeoutValue);
            }
        });
    }, []);

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

    function onButtonClick()
    {
        if (props.game.comment)
        {
            if (timeoutValue && window)
            {
                window.clearTimeout(timeoutValue);
                setTimeoutValue(null);
            }

            if (bRevealed && window)
            {
                const timer = window.setTimeout(() =>
                {
                    setHiddenFull(true);
                }, 1000);
                setTimeoutValue(timer);
            }

            setRevealed(!bRevealed);
            setHiddenFull(false);
        }
    }

    function onLinkClick(e: React.MouseEvent<HTMLAnchorElement>): void
    {
        if (e && typeof e.stopPropagation == 'function')
        {
            e.stopPropagation();
        }
    }

    return (<div className={streamerStyle['game-wrapper']}>
    <button className={streamerStyle['game-wrapper-button']} onClick={onButtonClick}>
        <div className={streamerStyle['game-button-name']}>
            <a href={props.game.url || ''} target="_blank" rel="noopener noreferrer" onClick={onLinkClick}>
            {
                props.game.name
            }
            </a>
        </div>
        <div className={`${streamerStyle['game-button-status']} ${streamerStyle[getStatusClass(props.game.status)]}`}>
            {
                getStatusName(props.game.status)
            }
        </div>
    </button>
    {
        bHiddenFull ?
        null :
        (
            <div className={`${streamerStyle['game-comment']} ${bRevealed ? streamerStyle['game-comment-revealed'] : ''}`}>
                <div>
                    {
                        props.game.comment || ''
                    }
                </div>
            </div>
        )
    }
    </div>);
}

interface IStreamerPageCallbacks
{
    setTab: (tab: Tab) => void;
}

interface IStreamerPageProps
{
    data: IStreamerTab;
    callbacks: IStreamerPageCallbacks;
}

export function StreamerPageComponent(props: IStreamerPageProps): JSX.Element
{
    function onBackClick()
    {
        if (props && props.callbacks)
        {
            props.callbacks.setTab(Tab.Home);
        }
    }

    return (<div id={streamerStyle['wrapper']}>
        <div id={streamerStyle['back-wrapper']}>
            <button onClick={onBackClick}>
                <ArrowSVG />
            </button>
            {
                props.data.name
            }
        </div>
        <div id={streamerStyle['games-list-wrapper']}>
            <div id={streamerStyle['games-list-head']}>
                <div id={streamerStyle['games-list-head-name']}>
                    Название
                </div>
                <div id={streamerStyle['games-list-head-status']}>
                    Статус
                </div>
            </div>
            <div id={streamerStyle['games-list-container']}>
                {
                    props.data.streamer ?
                    (
                        props.data.streamer.games.map((game, index) =>
                        {
                            return <GameComponent key={`${game.key}-${index}`} game={game} />
                        })
                    ) : null
                }
            </div>
        </div>
    </div>);
}