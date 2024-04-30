import React, { useState, useEffect } from "react";
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { Box, Button, Divider, Grid, Modal, Paper, TextField } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';


function HomePage()
{
    const [rooms, setRooms] = useState([]); // the rooms with their own layout, schedules, calendar, etc.

    const [selection, setSelection] = useState(null); // the name of the currently selected room
    const [tempName, setTempName] = useState(""); // the in edit name of the currenlty selected room
    const [overlay, setOverlay] = useState(false); // is the overlay visible
    
    const baseURL = "http://localhost:8500/"; // This will likely need to be changed for a production build


    // TODO: and authorization header can be used to make sure that this user has admin credentials
    function updateServerRooms(info) // Sends the room changes to the server 
    {
        fetch(`${baseURL}rooms`,
        {
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data:info, token:document.cookie.substring(document.cookie.indexOf("token=")+6, document.cookie.indexOf("token=")+27)})
        });
    }

    // gets the list of rooms from the server
    useEffect(() => {
        console.log("fetching!");
        fetch(`${baseURL}rooms`)
        .then((res) => res.json())
        .then((data) => {setRooms(data); console.log("done!");}
        );
    }, []);


    // allows for the selection of rooms
    function generateRoomCards()
    {
        const resList = [];

        const orderedNames = []; // the room names in order by ASCII character
        for (const entry in rooms)
        {
            orderedNames.push(rooms[entry]+"");
        }
        // bubble sort
        var changed = true;
        while (changed)
        {
            changed = false;
            for (let i = 0; i < orderedNames.length - 1; i++)
            {
                if (orderedNames[i] > orderedNames[i+1])
                {
                    changed = true;
                    const temp = orderedNames[i+1];
                    orderedNames[i+1] = orderedNames[i];
                    orderedNames[i] = temp;
                }
            }
        }

        // generate the cards for all existing rooms
        for (const i in orderedNames)
        {
            const entry = orderedNames[i];

            resList.push(
                <Grid item xs={2}>
                    <Paper elevation={10} sx={{aspectRatio: 1, display: "flex", flexDirection: "column"}}>
                        <Box sx={{textAlign: "center", alignContent: "center", height: "20%"}}>
                            <h2>{entry}</h2>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column", height: "80%"}}>
                            <Divider />
                            <Link component={RouterLink} to={"/selection/preview?room=" + entry} sx={{width: "100%", height:"50%"}}><Button variant="text" sx={{width:"100%", height:"100%"}}>Select</Button></Link>
                            <Divider />
                            <Box sx={{display: "flex", flexDirection: "row", height: "50%"}}>
                                <Button sx={{width: "50%", height:"100%"}} variant="text" onClick={() => {setSelection(entry); setTempName(entry); setOverlay(true);}}>Rename</Button>
                                <Divider orientation="vertical" />
                                <Button sx={{width: "50%", height:"100%"}} variant="text"
                                    onClick={() => {
                                    if (window.confirm("Are you sure that you want to delete \"" + entry + "\" ?"))
                                    {
                                        updateServerRooms({old:entry, new:null}); // update the server
                                        
                                        const copiedRooms = [...orderedNames]; // shallow copy
                                        copiedRooms.splice(i, 1); // delete the selected room from the list
                                        setRooms(copiedRooms);
                                    }
                                }}>Delete</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            )
        }

        // generate a card for adding a new room
        resList.push(
            <Grid item xs={2}>
                <Box sx={{aspectRatio: 1, display: "flex", flexDirection: "column", border: 5, borderStyle: "dashed", borderRadius: 4}}>
                    <Button variant="text" sx={{width: "100%", height: "100%"}}
                        onClick={() => {
                        setSelection(null);
                        setTempName(""); 
                        setOverlay(true);
                    }}><AddRoundedIcon sx={{width: "50%", height: "50%"}}/></Button>
                </Box>
            </Grid>
        )

        // return the cards
        return resList;
    }

    function submitRoomEdit()
    {
        if (tempName.length === 0) // no name entered
        {
            window.alert("Please enter a room name!");
            return;
        }
        for (let i = 0; i < rooms.length; i++) // check if the room name exists
        {
            if (tempName !== selection && tempName.toLowerCase() === rooms[i].toLowerCase())
            {
                window.alert("Invalid Room Name!\nThe Room \"" + tempName + "\" Already Exists!");
                return;
            }
        }
        for (let i = 0; i < tempName.length; i++) // check if the room name is made up of valid characters
        {
            if (!((tempName.charCodeAt(i) >= 48 && tempName.charCodeAt(i) <= 57) || (tempName.charCodeAt(i) >= 65 && tempName.charCodeAt(i) <= 90) || (tempName.charCodeAt(i) >= 97 && tempName.charCodeAt(i) <= 122) || tempName.charCodeAt(i) === 95))
            {
                window.alert("Invalid room name \"" + tempName + "\"!\nInvalid characters detected!");
                return;
            }
        }

        if (selection === null) // this is a new room
        {
            updateServerRooms({old:null, new:tempName}); // update the server

            const copiedRooms = [...rooms];
            copiedRooms.push(tempName);
            setRooms(copiedRooms);
        }
        else // this room is being renamed
        {
            updateServerRooms({old:selection, new:tempName}); // update the server

            const copiedRooms = [...rooms]; // shallow copy
            copiedRooms.splice(copiedRooms.indexOf(selection), 1); // delete the selected room from the list
            copiedRooms.push(tempName);
            setRooms(copiedRooms);
        }
        setOverlay(false);
    }

    // TODO: actualy check if there were any changes before prompting
    function closeOverlay()
    {
        if (window.confirm("Unsaved changes will be lost.\nAre you sure you want to exit?"))
        {
            setOverlay(false);
        }
    }


    return(
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Box sx={{height: "10vh", textAlign: "center", lineHeight:"10vh", marginBottom: 3}}>
                <h1>Room Select Page</h1>
            </Box>
            
            <Box sx={{width: "100%", paddingLeft: 5, paddingRight: 5}}>
                <Grid container spacing={2}>
                    {generateRoomCards()}
                </Grid>
            </Box>

            <Modal
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflowY: "scroll"
                }}
                open={overlay}
                onClose={() => closeOverlay()}
            >
                <Box sx={{display: "flex", flexDirection: "column", width: "14cm", maxWidth: "90%"}}>
                    <Paper elevation={7} sx={{display: "flex", flexDirection: "column", alignItems: "center", padding: 1, width: "100%"}}>
                        <TextField variant="filled" label="Room Name" value={tempName} onInput={(e) => setTempName(e.target.value)}></TextField>
                        <Divider sx={{marginTop: 1, marginBottom: 1, width:"100%"}}/>
                        <Button variant="contained" size="large" onClick={() => {submitRoomEdit()}}>Save</Button>
                    </Paper>
                </Box>
            </Modal>
        </Box>
    );
}

export default HomePage;