import React from "react";

// TODO: May need to change the iframe url if we get actual urls for the websites
function HomePage()
{
    // Takes you to all of the other pages
    return(
        <div className="Content">
            <header className="App-header">
                <h1>Clock Preview</h1>
            </header>
            <div className="List">
                <iframe src="http://localhost:3000/" height="450" width="800" title="Clock Preview"></iframe> {/* May need to change 'src' for final build */}
            </div>
        </div>
    );
}

export default HomePage;