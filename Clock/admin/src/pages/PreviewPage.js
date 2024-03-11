import { Box, Paper } from "@mui/material";
import AspectRatio from '@mui/joy/AspectRatio';

import React from "react";

// TODO: May need to change the iframe url if we get actual urls for the websites
function PreviewPage()
{
    // Takes you to all of the other pages
    return(
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Box sx={{height: "10vh", textAlign: "center", lineHeight:"10vh"}}>
                <h1>Clock Preview</h1>
            </Box>
        
            <AspectRatio ratio={16/9} variant="Solid" sx={{width: "70%"}}>
                <Box>
                    <Paper elevation={7} sx={{width: "95%", height: "95%", padding: 1}}>
                        <iframe src="http://localhost:3000/" height="100%" width="100%" title="Clock Preview"></iframe> {/* May need to change 'src' for final build */}
                    </Paper>
                </Box>
            </AspectRatio>
        </Box>
    );
}

export default PreviewPage;