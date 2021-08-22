import React, { useState } from 'react';
import streamerStyle from '../style/streamer.module.css'
import { IStreamerTab, Tab } from './app';
import ArrowSVG from '../assets/svg/arrow.svg'
import { EGameStatus, IGame } from '../misc/types';

interface IGameComponentProps
{
    game: IGame;
}

interface IGameComponentState
{
    bRevealed: boolean;
    bHiddenFull: boolean;
}

class GameComponent extends React.Component<IGameComponentProps, IGameComponentState>
{
    timeout: number | null;
    constructor(props: IGameComponentProps)
    {
        super(props);
        this.state = {
            bRevealed: false,
            bHiddenFull: true
        };

        this.timeout = null;
        this.onButtonClick = this.onButtonClick.bind(this);
        this.getStatusName = this.getStatusName.bind(this);
        this.getStatusClass = this.getStatusClass.bind(this);
        this.onLinkClick = this.onLinkClick.bind(this);
    }

    componentWillUnmount()
    {
        if (this.timeout && window)
        {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    getStatusName(status: EGameStatus): string
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

    getStatusClass(status: EGameStatus): string
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

    onButtonClick()
    {
        if (this.props.game.comment)
        {
            this.setState((prevState) =>
            {
                
                if (this.timeout && window)
                {
                    window.clearTimeout(this.timeout);
                    this.timeout = null;
                }

                if (prevState.bRevealed && window)
                {
                    this.timeout = window.setTimeout(() => 
                    {
                        this.setState({
                            bHiddenFull: true
                        })
                    }, 1000);
                }

                return {
                    bRevealed: !prevState.bRevealed,
                    bHiddenFull: false
                };
            });
        }
    }

    onLinkClick(e: React.MouseEvent<HTMLAnchorElement>): void
    {
        if (e)
        {
            e.stopPropagation();
        }
    }

    render(): JSX.Element
    {
        return (<div className={streamerStyle['game-wrapper']}>
        <button className={streamerStyle['game-wrapper-button']} onClick={this.onButtonClick}>
            <div className={streamerStyle['game-button-name']}>
                <a href={this.props.game.url || ''} target="_blank" rel="noopener noreferrer" onClick={this.onLinkClick}>
                {
                    this.props.game.name
                }
                </a>
            </div>
            <div className={`${streamerStyle['game-button-status']} ${streamerStyle[this.getStatusClass(this.props.game.status)]}`}>
                {
                    this.getStatusName(this.props.game.status)
                }
            </div>
        </button>
        {
            this.state.bHiddenFull ?
            null :
            (
                <div className={`${streamerStyle['game-comment']} ${this.state.bRevealed ? streamerStyle['game-comment-revealed'] : ''}`}>
                    <div>
                        {
                            this.props.game.comment || ''
                        }
                    </div>
                </div>
            )
        }
    </div>);
    }
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