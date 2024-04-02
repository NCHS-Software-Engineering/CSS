import React, { useState, useEffect } from "react";

import "../styles/App.css";
import WidgetBox from "../components/WidgetBox";
import CountdownConfig from "../components/CountdownConfig";
import DateConfig from "../components/DateConfig";
import ClockConfig from "../components/ClockConfig";
import PeriodNameConfig from "../components/PeriodNameConfig";
import SiteConfig from "../components/SiteConfig";
import TextboxConfig from "../components/TextboxConfig";
import WeatherConfig from "../components/WeatherConfig";
import { Box, Button, Card, Divider, Paper } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AbcIcon from '@mui/icons-material/Abc';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { positions } from "@mui/system";


// TODO: add overlay toggle
function LayoutPage() 
{
    // The size of the grid
    const numColumns = 16;
    const numRows = 9;

    const [overlay, setOverlay] = useState(true); // is there an iframe overlay

    // The currently selected entry's position
    const [selectedRow, setSelectedRow] = useState(-1);
    const [selectedCol, setSelectedCol] = useState(-1);

    const [downX, setDownX] = useState(-1);
    const [downY, setDownY] = useState(-1);

    const [selectedDraggable, setSelectedDraggable] = useState(-1); // 0 == movement, 1 == up, 2 == right, 3 == down, 4 == left, 5 == top-right, 6 == bottom-right, 7 == bottom-left, 8 == top-left

    const [selectedWidget, setSelectedWidget] = useState(null);


    const [widgetList, setWidgetList] = useState([]); // The list of all widget locations/data
    const [siteLayout, setSiteLayout] = useState({backgroundColor:"#000000"});

    const [loading, setLoading] = useState(true);

    const [cursor, setCursor] = useState("auto");


    const baseURL = "http://localhost:8500/"; // This will likely need to be changed for a production build

    // TODO: and authorization header can be used to make sure that this user has admin credentials
    function updateServerLayout(siteData, widgetData) // Sends the schedules to the server 
    { 
        fetch(`${baseURL}layout`,
        {
            method:"PUT",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({site: siteData, widgetList: widgetData})
        });
    }

    // gets defaultWeek JSON object from server
    useEffect(() => {
        fetch(`${baseURL}layout`)
        .then((res) => res.json())
        .then((data) => {setWidgetList(data.widgetList); setSiteLayout(data.site); setLoading(false);}
        );
    }, []);
    

    function generateTable() // the table that represents the layout of the widgets
    {
        const rowList = []; // list of all rows
        for (let r = 0; r < numRows; r++)
        {
            const colList = []; // list of all columns for this particular row
            for (let c = 0; c < numColumns; c++)
            {
                const selected = (r === selectedRow && c === selectedCol); // boolean value for wether this entry is selected
                var empty = true; // boolean value for wether this positions contians a widget (false if it contains a widget)
                
                const specialStyle = selected ? {backgroundColor:"silver"} : {};

                // search to see if the location contains a widget
                for (const w of widgetList) // for each of the widgets on the table
                {
                    if (r === w.row && c === w.col) // display the widget
                    {                        
                        const selectMargin = 10; // number of pixels for selecting the element // TODO: this should maybe be relative to the viewport


                        colList.push(<td id={r + "." + c} style={{...specialStyle, border: "1px solid", textAlign: "center", lineHeight: "100%", cursor: cursor}} 
                            onMouseLeave={ () => 
                            {
                                setCursor("auto");
                            }}
                            onMouseMove={ (e) =>
                            {
                                var cursorDisplay = "move";

                                const rect = document.getElementById(r + "." + c).getBoundingClientRect();

                                const top = (e.clientY < rect.top + selectMargin) ? true : false;
                                const right = (e.clientX > rect.right - selectMargin) ? true : false;
                                const bottom = (e.clientY > rect.bottom - selectMargin) ? true : false;
                                const left = (e.clientX < rect.left + selectMargin) ? true : false;

                                if (top) 
                                {
                                    if (right) 
                                    {
                                        cursorDisplay = "nesw-resize";
                                    }
                                    else if (left) {
                                        cursorDisplay = "nwse-resize";
                                    }
                                    else 
                                    {
                                        cursorDisplay = "ns-resize";
                                    }
                                }
                                else if (right) 
                                {
                                    if (bottom) {
                                        cursorDisplay = "nwse-resize";
                                    }
                                    else
                                    {
                                        cursorDisplay = "ew-resize";
                                    }
                                }
                                else if (bottom) 
                                {
                                    if (left) {
                                        cursorDisplay = "nesw-resize";
                                    }
                                    else
                                    {
                                        cursorDisplay = "ns-resize";
                                    }
                                }
                                else if (left) cursorDisplay = "ew-resize";

                                setCursor(cursorDisplay);
                            }}
                            onMouseDown={ (e) => 
                            {
                                setSelectedRow(r);
                                setSelectedCol(c);
                                setDownX(e.clientX);
                                setDownY(e.clientY);

                                const rect = document.getElementById(r + "." + c).getBoundingClientRect();

                                const top = (e.clientY < rect.top + selectMargin) ? true : false;
                                const right = (e.clientX > rect.right - selectMargin) ? true : false;
                                const bottom = (e.clientY > rect.bottom - selectMargin) ? true : false;
                                const left = (e.clientX < rect.left + selectMargin) ? true : false;

                                var draggableNum = 0;
                                if (top) 
                                {
                                    draggableNum = 1;
                                    if (right) 
                                    {
                                        draggableNum = 5;
                                        setCursor("nesw-resize");
                                    }
                                    else if (left) {
                                        draggableNum = 8;
                                        setCursor("nwse-resize");
                                    }
                                }
                                else if (right) 
                                {
                                    draggableNum = 2;
                                    if (bottom) {
                                        draggableNum = 6;
                                        setCursor("nwse-resize");
                                    }
                                }
                                else if (bottom) 
                                {
                                    draggableNum = 3;
                                    if (left) {
                                        draggableNum = 7;
                                        setCursor("nesw-resize");
                                    }
                                }
                                else if (left) draggableNum = 4;
                                
                                setSelectedDraggable(draggableNum);
                            }}
                        rowSpan={w.height} colSpan={w.width} > {overlay === false ? typeToImage(w.type) : <></>} </td>);
                        
                        empty = false;
                        break;
                    }
                }

                // search to see if the location is occupied
                if (empty)
                {
                    for (const w of widgetList)
                    {
                        if (r >= w.row && r < w.row + w.height && c >= w.col && c < w.col + w.width)
                        {
                            empty = false;
                            break;
                        }
                    }
                }

                // the location is empty
                if (empty)
                {
                    colList.push(<td style={{...specialStyle, border: "1px solid"}} onClick={ () => 
                        {
                            setSelectedRow(r);
                            setSelectedCol(c);
                        }
                    } onMouseUp={ () =>
                        {
                            if (selectedWidget)
                            {
                                const widgetListCopy = [...widgetList];
                                widgetListCopy.push({"type":selectedWidget, "row":r,"col":c,"width":1,"height":1});
                                setWidgetList(widgetListCopy);

                                setSelectedRow(r);
                                setSelectedCol(c);
                            }
                        }
                    }> <br/> </td>);
                }
            }
            rowList.push(<tr style={{height:"11.111%"}}>{colList}</tr>); // add this column to the list of rows
        }

        return rowList; // return the table information
    }


    // deselect any draggables when the mouse button is raised
    document.body.onmouseup = function() {
        setSelectedDraggable(-1);
        setSelectedWidget(null);

        setDownX(-1);
        setDownY(-1);
    }

    // check to see if mouse movement is sufficient to resize the selected widget
    document.body.onmousemove = function(e) {
        if (selectedDraggable === -1) return; // nothing is selected for resizeing
        const selectedTD = document.getElementById(selectedRow + "." + selectedCol); // find the seledted td element
        if (!selectedTD) return; // don't do anything if a widget isn't selected

        const rect = selectedTD.getBoundingClientRect(); // the bounding rect for the td element representing the widget
        const xThreshold = (rect.width / selectedTD.colSpan) * 0.6;
        const yThreshold = (rect.height / selectedTD.rowSpan) * 0.6;
        
        // the new size / position of the widget upon resizeing
        var newXPos = selectedCol;
        var newYPos = selectedRow;
        var newWidth = selectedTD.colSpan;
        var newHeight = selectedTD.rowSpan;

        // the desired movement if selectedDraggable === 0
        var xDiff = 0;
        var yDiff = 0;

        // check to see if resizeing should be attempted
        if (selectedDraggable === 0 && downX !== -1 && downY !== -1)
        {
            xDiff = (e.clientX - downX) / (rect.width / selectedTD.colSpan); xDiff = (xDiff < 0) ? Math.ceil(xDiff) : Math.floor(xDiff);
            yDiff =(e.clientY - downY) / (rect.height / selectedTD.rowSpan); yDiff = (yDiff < 0) ? Math.ceil(yDiff) : Math.floor(yDiff);

            newXPos += xDiff;
            newYPos += yDiff;
        }
        if (selectedDraggable === 1 || selectedDraggable === 8 || selectedDraggable === 5) // check if the element must be resized (UP)
        {
            if (e.clientY < rect.top - yThreshold) // attempt to expand
            {
                newYPos--;
                newHeight++;
            }
            else if (e.clientY > rect.top + yThreshold) // attempt to contract
            {
                newYPos++;
                newHeight--;
            }
        }
        if (selectedDraggable === 2 || selectedDraggable === 5 || selectedDraggable === 6) // check if the element must be resized (RIGHT)
        {
            if (e.clientX > rect.right + xThreshold) // attempt to expand
            {
                newWidth++;
            }
            else if (e.clientX < rect.right - xThreshold) // attempt to contract
            {
                newWidth--;
            }
        }
        if (selectedDraggable === 3 || selectedDraggable === 6 || selectedDraggable === 7) // check if the element must be resized (DOWN)
        {
            if (e.clientY > rect.bottom + yThreshold) // attempt to expand
            {
                newHeight++;
            }
            else if (e.clientY < rect.bottom - yThreshold) // attempt to contract
            {
                newHeight--;
            }
        }
        if (selectedDraggable === 4 || selectedDraggable === 7|| selectedDraggable === 8) // check if the element must be resized (LEFT)
        {
            if (e.clientX < rect.left - xThreshold) // attempt to expand
            {
                newXPos--;
                newWidth++
            }
            else if (e.clientX > rect.left + xThreshold) // attempt to contract
            {
                newXPos++;
                newWidth--;
            }
        }

        // check if new location is valid
        if (newXPos === selectedCol && newYPos === selectedRow && newWidth === selectedTD.colSpan && newHeight === selectedTD.rowSpan) return; // no changes in layout
        if (newXPos < 0 || newXPos + newWidth - 1 >= numColumns || newYPos < 0 || newYPos + newHeight - 1 >= numRows) return; // widget can't go outside of table bounds
        if (newWidth < 1 || newHeight < 1) return; // invalid width or height

        var isValid = true;
        var currentWidgetIndex = -1;

        for (let i = 0; i < widgetList.length; i++) // check for collisions with all widgets
        {
            const w = widgetList[i];

            if (w.row === selectedRow && w.col === selectedCol) // disregard collisions with itself (logically)
            {
                currentWidgetIndex = i;
                break;
            } 
            if (!(newXPos > w.col + w.width - 1 || newXPos + newWidth - 1 < w.col) && !(newYPos > w.row + w.height - 1 || newYPos + newHeight - 1 < w.row)) // rect collision check
            {
                isValid = false;
            }
        }

        if (isValid === false) return; // can't resize if it would overlap with another widget

        if (selectedDraggable === 0) // The cursor "ancor" position for dragging needs to be updated
        {
            setDownX(downX + (xDiff * (rect.width / selectedTD.colSpan)));
            setDownY(downY + (yDiff * (rect.height / selectedTD.rowSpan)));
        }

        // update the widget-list
        const widgetListCopy = [...widgetList]; // shallow copy
        const oldWidget = widgetList[currentWidgetIndex]; // the old widget information
        widgetListCopy.splice(currentWidgetIndex, 1); // remove the old widget
        widgetListCopy.push({...oldWidget,"row":newYPos, "col":newXPos, "width":newWidth, "height":newHeight}); // add the widget back with the modifed size / scale

        setSelectedRow(newYPos); // yPos of selection may have changed
        setSelectedCol(newXPos); // ^ same goes for xPos

        setWidgetList(widgetListCopy);
        updateServerLayout(siteLayout, widgetListCopy);
    }

    function generateConfigurationForm() // The form for modifying the selected widget (e.g. changing the color of the widget)
    {
        // go through all widgets to find the selected widget
        for (let i = 0; i < widgetList.length; i++)
        {
            const w = {...widgetList[i]};

            if (selectedRow === w.row && selectedCol === w.col)
            {
                switch (w.type)
                {
                    case "countdown": 
                        return <CountdownConfig id={i} config={w.config} callback={(res) => {changeWidgetConfig(w, res, i)}}/>;
                    case "date":
                        return <DateConfig id={i} config={w.config} callback={(res) => {changeWidgetConfig(w, res, i)}}/>;
                    case "clock":
                        return <ClockConfig id={i} config={w.config} callback={(res) => {changeWidgetConfig(w, res, i)}}/>;
                    case "periodName":
                        return <PeriodNameConfig id={i} config={w.config} callback={(res) => {changeWidgetConfig(w, res, i)}}/>;
                    case "textbox":
                        return <TextboxConfig id={i} config={w.config} callback={(res) => {changeWidgetConfig(w, res, i)}}/>;
                    case "weather":
                        return <WeatherConfig id={i} config={w.config} callback={(res) => {changeWidgetConfig(w, res, i)}}/>;
                    default: 
                        console.log("Widget Type ERROR (This should not print)");
                        return <h1>ERROR: unrecognized widget type</h1>
                }
            }
        }

        // if no widget is selected, allow modification of site config (e.g. the background color of the site)
        return <SiteConfig config={siteLayout} callback={(res) => {setSiteLayout(res); updateServerLayout(res, widgetList)}}/>;

        function changeWidgetConfig(widget, config, index)
        {
            widget.config = config;
            const widgetListCopy = [...widgetList];
            widgetListCopy.splice(index, 1);
            widgetListCopy.push(widget);

            setWidgetList(widgetListCopy);
            updateServerLayout(siteLayout, widgetListCopy);
        }
    }

    function generateDeleteButton()
    {
        // go through all widgets to find the selected widget
        for (let i = 0; i < widgetList.length; i++)
        {
            const w = {...widgetList[i]};

            if (selectedRow === w.row && selectedCol === w.col)
            {
                return <Box sx={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Divider sx={{width: "90%", marginBottom: 1}}/> 
                    <Button variant="contained" size="large"
                    onClick={ () => {
                        const widgetListCopy = [...widgetList];
                        widgetListCopy.splice(i, 1);
                        setWidgetList(widgetListCopy);
                        updateServerLayout(siteLayout, widgetListCopy);
                    }}
                >remove widget</Button>
                </Box>
            }
        }
    }

    function typeToImage(type)
    {
        switch (type)
        {
            case "countdown": 
                return <AccessAlarmIcon/>;
            case "date":
                return <AccessTimeIcon/>;
            case "clock":
                return <AccessTimeIcon/>;
            case "periodName":
                return <AbcIcon/>;
            case "textbox":
                return <TextFieldsIcon/>;
            case "weather":
                return <WbSunnyIcon/>;
            default: 
                return <h1>ERROR: no icon</h1>
        }
    }



    if (loading) return <></>; // don't render anything if info hasn't come from the server yet

    return(
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Box sx={{height: "10vh", textAlign: "center", lineHeight:"10vh", marginBottom: 3}}>
                <h1>Layout Editor</h1>
            </Box>

            <Paper elevation={7} sx={{width: "80%", padding: 1.5, display: "flex", flexDirection: "row"}}>
                <Box sx={{width: "70%", marginRight: 1}}>
                    <Box sx={{position: "relative", width: "100%", aspectRatio: 16/9}}>
                        {overlay ?
                        <Box sx={{zIndex:"1", pointerEvents:"none", opacity: 0.85, position: "absolute", width: "100%", height: "100%"}}>
                            <iframe src="http://localhost:3500/" style={{border: 0}} height="100%" width="100%" title="Clock Preview"></iframe> {/* May need to change 'src' for final build */}
                        </Box> : <></> }
                        <table style={{tableLayout: "fixed", borderCollapse: "collapse", width: "100%", height: "100%", userSelect: "none"}}>
                            <tbody>
                                {generateTable()}
                            </tbody>
                        </table>
                    </Box>
                
                    <Box sx={{width: "100%", display: "flex", flexDirection: "row", overflowX: "auto", padding: 1}}>
                        <WidgetBox image={typeToImage("countdown")} subtitle={"Countdown"} type={"countdown"} callback={setSelectedWidget}/>
                        <WidgetBox image={typeToImage("date")} subtitle={"date"} type={"date"} callback={setSelectedWidget}/>
                        <WidgetBox image={typeToImage("clock")} subtitle={"Clock"} type={"clock"} callback={setSelectedWidget}/>
                        <WidgetBox image={typeToImage("periodName")} subtitle={"Period Name"} type={"periodName"} callback={setSelectedWidget}/>
                        <WidgetBox image={typeToImage("textbox")} subtitle={"Text Box"} type={"textbox"} callback={setSelectedWidget}/>
                        <WidgetBox image={typeToImage("weather")} subtitle={"Weather"} type={"weather"} callback={setSelectedWidget}/>
                    </Box>
                </Box>

                <Card sx={{ width: "30%", minHeight: "100%", display: "flex", flexDirection: "column", padding: 1}}>
                    <Box sx={{height:"90%"}}>
                        {generateConfigurationForm()}
                    </Box>
                    {generateDeleteButton()}
                </Card>
            </Paper>

            

        </Box>
    );
}

export default LayoutPage;