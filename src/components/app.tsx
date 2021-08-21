import React from 'react';
import ReactDOM from "react-dom";

function App(): JSX.Element
{
    return (<div>
        <h1>
            React 1
        </h1>
        <h2>
            Test
        </h2>
    </div>);
}

ReactDOM.render(<App />, document.getElementById('root'));