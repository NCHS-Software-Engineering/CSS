import React from "react";
import Box from '@mui/material/Box';

// TODO: May need to change the iframe url if we get actual urls for the websites
function HomePage()
{
    // Takes you to all of the other pages
    return(
        <Box className='Box'>
            <header className="App-header">
                <h1>Clock Preview</h1>
            </header>
            <div className="List">
                <iframe src="http://localhost:3000/" height="450" width="800" title="Clock Preview"></iframe> {/* May need to change 'src' for final build */}
            </div>
        </Box>
    );
}

export default HomePage;