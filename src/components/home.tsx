import React from 'react';
import { IStreamer, WhoPGEvent } from '../misc/types'
import eventStyles from '../style/event.module.css'
import { IStreamerTab, Tab } from './app';

interface IStreamerProps
{
    streamer: IStreamer;
    eventId: number;
    callbacks: IHomeCallbacks;
}

function StreamerButton(props: IStreamerProps): JSX.Element
{
    function onClick()
    {
        if (props && props.callbacks)
        {
            props.callbacks.setTab(Tab.Streamer);
            props.callbacks.setStreamerPage({
                streamer: props.streamer,
                name: `WhoPG ${props.eventId} — ${props.streamer.name}`
            });
        }
    }

    return (<button className={eventStyles.streamer} style={ { color: `#${props.streamer.color}` }} onClick={onClick}>
        <div>
            { props.streamer.name }
        </div>
    </button>);
}

interface IWhoPGEventComponent
{
    event: WhoPGEvent;
    id: number;
    callbacks: IHomeCallbacks;
};

function EventComponent(props: IWhoPGEventComponent): JSX.Element
{
    return (<div id={eventStyles['wrapper']}>
        <div id={eventStyles['title']}>
            {
                `WhoPG ${props.id}`
            }
        </div>
        {
            props.event.length ?
            (<div className={eventStyles['streamer-list']}>
                {
                    props.event.map((streamer, index) => {
                        return (<StreamerButton streamer={streamer} key={`${streamer.name}-${index}`} callbacks={props.callbacks} eventId={props.id} />);
                    })
                }
            </div>)  :
            (<div id={eventStyles['not-available']}> Недоступно </div>)
        }
    </div>);
}

interface IHomeCallbacks
{
    setTab: (tab: Tab) => void;
    setStreamerPage: (streamerTab: IStreamerTab) => void;
}

interface IEventsProps
{
    events: Array<WhoPGEvent>;
    callbacks: IHomeCallbacks;
}

export function HomePage(props: IEventsProps): JSX.Element
{
    return (<div id={eventStyles.container}>
        {
            props.events.map((event, index) => {
                return (<EventComponent event={event} id={index+1} callbacks={props.callbacks} key={`event-${index}`} />);
            })
        }
    </div>);
}