import { Box, Paper } from "@mui/material";

import React from "react";

// TODO: May need to change the iframe url if we get actual urls for the websites
function PreviewPage()
{
    // Takes you to all of the other pages
    return(
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Box sx={{height: "10vh", textAlign: "center", lineHeight:"10vh", marginBottom: 3}}>
                <h1>Clock Preview</h1>
            </Box>
        
            <Box sx={{width: "70%"}}>
                <Paper elevation={7} sx={{padding: 1}}>
                    <iframe style={{aspectRatio: 16/9}} src="http://localhost:3000/" height="100%" width="100%" title="Clock Preview"></iframe> {/* May need to change 'src' for final build */}
                </Paper>
            </Box>
        </Box>
    );
}

export default PreviewPage;