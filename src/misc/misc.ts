export function formatTrackerTime(totalTime: number): string
{
    let hours: string | number = Math.floor(totalTime);
    let minutes: string | number = Math.round((totalTime - hours) * 60);
    
    if (hours < 10)
    {
        hours = `0${hours}`;
    }

    if (minutes < 10)
    {
        minutes = `0${minutes}`;
    }

    return `${hours}:${minutes}:00`;
}