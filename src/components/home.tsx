import React from 'react';
import { IStreamer, WhoPGEvent } from '../misc/types'
import eventStyles from '../style/event.module.css'

interface IStreamerProps
{
    streamer: IStreamer;
}

function StreamerButton(props: IStreamerProps): JSX.Element
{
    return (<button className={eventStyles.streamer} style={ { color: `#${props.streamer.color}` }}>
        <div>
            { props.streamer.name }
        </div>
    </button>);
}

interface IWhoPGEventComponent
{
    event: WhoPGEvent;
    id: number;
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
                        return (<StreamerButton streamer={streamer} key={`${streamer.name}-${index}`} />);
                    })
                }
            </div>)  :
            (<div id={eventStyles['not-available']}> Недоступно </div>)
        }
    </div>);
}

interface IEventsProps
{
    events: Array<WhoPGEvent>;
}

export function HomePage(props: IEventsProps): JSX.Element
{
    return (<div id={eventStyles.container}>
        {
            props.events.map((event, index) => {
                return (<EventComponent event={event} id={index+1} />);
            })
        }
    </div>);
}