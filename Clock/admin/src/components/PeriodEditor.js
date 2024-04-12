import { Box, Button, Card, TextField } from "@mui/material";
import DragHandleIcon from '@mui/icons-material/DragHandle';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers';
import React, { useState, useEffect } from "react";


function PeriodEditor(props = null) // props.item.id, props.item.name, props.item.start, props.item.end, props.commonProps
{
    const [name, setName] = useState(""); // The name of this period
    const [start, setStart] = useState("00:00"); // the start time of this period
    const [end, setEnd] = useState("23:59"); // the end time of this period

    // runs once at startup, initializes states as per the parameters passed by the parent component
    useEffect(() => {
        setName(props.item.name);
        setStart(props.item.start);
        setEnd(props.item.end);
    },[props]);

    // The following functions are called when an edit to the period is made. A callback is sent to the parent component.
    function updateName(e)
    {
        const value = e.target.value;

        setName(value);
        
        const res = {"id":props.item.id, "name":value, "start":start, "end":end};
        props.commonProps(res);
    }
    function updateStart(value)
    {
        setStart(value);
        
        const res = {"id":props.item.id, "name":name, "start":value, "end":end};
        props.commonProps(res);
    }
    function updateEnd(value)
    {
        setEnd(value);
        
        
        const res = {"id":props.item.id, "name":name, "start":start, "end":value};
        props.commonProps(res);
    }

    // DesktopTimePicker uses dayjs time and date format, which needs to be converted to 'HH:mm' when stored and vice versa when displayed.
    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Box sx={{display:"flex"}}>
                    <Box {...props.dragHandleProps} sx={{cursor: "move"}}>
                        <DragHandleIcon/>
                    </Box>
                    <Box sx={{marginRight: 1}}>
                        <TextField value={name} placeholder="Period Name" onInput={updateName}></TextField>
                    </Box>
                    <Box sx={{width: "40%"}}>
                        <DesktopTimePicker value={dayjs(`0000-00-00T${start}`)} onChange={(newValue) => updateStart(newValue.format('HH:mm'))}/>
                    </Box>
                    <Box sx={{width: "40%", marginRight: 1}}>
                        <DesktopTimePicker value={dayjs(`0000-00-00T${end}`)} onChange={(newValue) => updateEnd(newValue.format('HH:mm'))}/>
                    </Box>
                    <Box>
                        <Button sx={{height: "100%"}} variant="outlined" onClick={() => {props.commonProps({"delete":true, "id":props.item.id});}}> X </Button>
                    </Box>
                </Box>
            </Box>
        </LocalizationProvider>
    );
}

export default PeriodEditor;