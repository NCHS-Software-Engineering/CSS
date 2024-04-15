import { Box, Paper } from "@mui/material";
import { useSearchParams } from 'react-router-dom';


import React from "react";

// TODO: May need to change the iframe url if we get actual urls for the websites
function PreviewPage()
{
    const [searchParams] = useSearchParams();

    // Takes you to all of the other pages
    return(  
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Box sx={{height: "10vh", textAlign: "center", lineHeight:"10vh", marginBottom: 3}}>
                <h1>Clock Preview</h1>
            </Box>
        
            <Box sx={{width: "70%"}}>
                <Paper elevation={7} sx={{padding: 3, pointerEvents:"none"}}>
                    <iframe style={{aspectRatio: 16/9, border: 0}} src={"http://localhost:3500?room="+searchParams.get("room")} height="100%" width="100%" title="Clock Preview"></iframe> {/* May need to change 'src' for final build */}
                </Paper>
            </Box>
        </Box>
    );
}

export default PreviewPage;