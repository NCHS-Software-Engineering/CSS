import React, { useState, useEffect } from "react";

import "../styles/App.css";
import WidgetBox from "../components/WidgetBox";
import CountdownConfig from "../components/CountdownConfig";
import ClockConfig from "../components/ClockConfig";
import PeriodName from "../components/PeriodNameConfig";


// TODO: add dragging at corners
// TODO: of the widget itself
// TODO: fix the table to make sure that all compnents stay the same size (NOTE: done?)
// TODO: add "config components" for more widgets
function LayoutPage() 
{
    // The size of the grid
    const numColumns = 16;
    const numRows = 9;

    // The currently selected entry's position
    const [selectedRow, setSelectedRow] = useState(-1);
    const [selectedCol, setSelectedCol] = useState(-1);

    const [selectedDraggable, setSelectedDraggable] = useState(0); // 0 == null, 1 == up, 2 == right, 3 == down, 4 == left

    const [selectedWidget, setSelectedWidget] = useState(null);


    // TODO: widgetList must be stored on the server
    const [widgetList, setWidgetList] = useState([]); // The list of all widget locations/data


    const baseURL = "http://localhost:8500/"; // This will likely need to be changed for a production build

    // TODO: and authorization header can be used to make sure that this user has admin credentials
    function updateServerLayout(info) // Sends the schedules to the server 
    {
        console.log(info);

        fetch(`${baseURL}layout`,
        {
            method:"PUT",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        });
    }

    // gets defaultWeek JSON object from server
    useEffect(() => {
        fetch(`${baseURL}layout`)
        .then((res) => res.json())
        .then((data) => {setWidgetList(data);}
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
                
                const specialStyle = selected ? {backgroundColor:"red"} : {};

                // search to see if the location contains a widget
                for (const w of widgetList) // for each of the widgets on the table
                {
                    if (r === w.row && c === w.col) // display the widget
                    {
                        const rectWidth = 50 * w.width + (w.width - 1) * 3; // td width + borders in between        (This one too)
                        const rectHeight = 50 * w.height + (w.height - 1) * 3; // TODO: This must change when CSS changes ^^^

                        colList.push(<td id={r + "." + c} style={{... specialStyle, width:rectWidth, height:rectHeight}} onClick={ () => 
                            {
                                setSelectedRow(r);
                                setSelectedCol(c);
                            }
                        } rowSpan={w.height} colSpan={w.width}>{renderDraggables(r, c, rectWidth, rectHeight)}{w.type}</td>);
                        
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
                    colList.push(<td style={specialStyle} onClick={ () => 
                        {
                            setSelectedRow(r);
                            setSelectedCol(c);
                        }
                    } onMouseUp={ () =>
                        {
                            if (selectedWidget)
                            {
                                const widgetListCopy = [... widgetList];
                                widgetListCopy.push({"type":selectedWidget, "row":r,"col":c,"width":1,"height":1});
                                setWidgetList(widgetListCopy);

                                setSelectedRow(r);
                                setSelectedCol(c);
                            }
                        }
                    }></td>);
                }
            }
            rowList.push(<tr>{colList}</tr>); // add this column to the list of rows
        }

        return rowList; // return the table information
    }

    function renderDraggables(row, col, rectWidth, rectHeight) // render icons for resizeing the selected widget at the 4 edges
    {
        if (row !== selectedRow || col !== selectedCol) return; // only render if this is the selected element

        const draggableSize = 10; // TODO: set as a circle with a diameter of 10px temporarily (make it look nicer)
        // svg images are cool
        return(
                [<svg onMouseDown={()=>setSelectedDraggable(1)} id="topDrag" fill="green" height={draggableSize} width={draggableSize} style={{zIndex:"2", position:"absolute", top:(-(draggableSize / 2)), left:(-(draggableSize / 2)) + rectWidth / 2}}><circle cx={draggableSize / 2} cy={draggableSize / 2} r={draggableSize / 2}></circle></svg>,
                <svg onMouseDown={()=>setSelectedDraggable(2)} id="rightDrag" fill="green" height={draggableSize} width={draggableSize} style={{zIndex:"2", position:"absolute", top:(-(draggableSize / 2)) + rectHeight / 2, left:(-(draggableSize / 2)) + rectWidth}}><circle cx={draggableSize / 2} cy={draggableSize / 2} r={draggableSize / 2}></circle></svg>,
                <svg onMouseDown={()=>setSelectedDraggable(3)} id="bottomDrag" fill="green" height={draggableSize} width={draggableSize} style={{zIndex:"2", position:"absolute", top:(-(draggableSize / 2)) + rectHeight, left:(-(draggableSize / 2)) + rectWidth / 2}}><circle cx={draggableSize / 2} cy={draggableSize / 2} r={draggableSize / 2}></circle></svg>,
                <svg onMouseDown={()=>setSelectedDraggable(4)} id="leftDrag" fill="green" height={draggableSize} width={draggableSize} style={{zIndex:"2", position:"absolute", top:(-(draggableSize / 2)) + rectHeight / 2, left:(-(draggableSize / 2))}}><circle cx={draggableSize / 2} cy={draggableSize / 2} r={draggableSize / 2}></circle></svg>]
        );
    }

    // deselect any draggables when the mouse button is raised
    document.body.onmouseup = function() {
        setSelectedDraggable(0);
        setSelectedWidget(null);
    }

    // check to see if mouse movement is sufficient to resize the selected widget
    document.body.onmousemove = function(e) {
        if (selectedDraggable === 0) return; // nothing is selected for resizeing
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

        // check to see if resizeing should be attempted
        if (selectedDraggable === 1) // check if the element must be resized (UP)
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
        else if (selectedDraggable === 2) // check if the element must be resized (RIGHT)
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
        else if (selectedDraggable === 3) // check if the element must be resized (DOWN)
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
        else if (selectedDraggable === 4) // check if the element must be resized (LEFT)
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
        } else (console.log("ERROR: This should not print"));

        // check if new location is valid
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

        // update the widget-list
        const widgetListCopy = [... widgetList]; // shallow copy
        const oldWidget = widgetList[currentWidgetIndex]; // the old widget information
        widgetListCopy.splice(currentWidgetIndex, 1); // remove the old widget
        widgetListCopy.push({... oldWidget,"row":newYPos, "col":newXPos, "width":newWidth, "height":newHeight}); // add the widget back with the modifed size / scale

        setSelectedRow(newYPos); // yPos of selection may have changed
        setSelectedCol(newXPos); // ^ same goes for xPos

        setWidgetList(widgetListCopy);
    }

    function generateConfigurationForm() // The form for modifying the selected widget (e.g. changing the color of the widget)
    {
        // go through all widgets to find the selected widget
        for (let i = 0; i < widgetList.length; i++)
        {
            const w = {... widgetList[i]};

            if (selectedRow === w.row && selectedCol === w.col)
            {
                switch (w.type)
                {
                    case "countdown": 
                        return <CountdownConfig config={w.config} callback={(res) => {changeWidgetConfig(w, res, i)}}/>;
                    case "clock":
                        return <ClockConfig config={w.config} callback={(res) => {changeWidgetConfig(w, res, i)}}/>;
                    case "periodName":
                        return <PeriodName config={w.config} callback={(res) => {changeWidgetConfig(w, res, i)}}/>;
                    case "default": console.log("Widget Type ERROR (This should not print)");
                }
            }
        }

        function changeWidgetConfig(widget, config, index)
        {
            widget.config = config;
            const widgetListCopy = [... widgetList];
            widgetListCopy.splice(index, 1);
            widgetListCopy.push(widget);

            setWidgetList(widgetListCopy);
        }
    }

    return(
        <div className="Content">
            <header className="App-header">
                <h1>Layout Editor</h1>
            </header>

            <div className="List">
                <table>
                    <tbody>
                        {generateTable()}
                    </tbody>
                </table>
            </div>

            <div className="Widget-Menu">
                <WidgetBox img={"Countdown"} type={"countdown"} callback={setSelectedWidget}/>
                <WidgetBox img={"Clock"} type={"clock"} callback={setSelectedWidget}/>
                <WidgetBox img={"Period Name"} type={"periodName"} callback={setSelectedWidget}/>
                <WidgetBox img={"TextBox"} type={"textbox"} callback={setSelectedWidget}/>
                <WidgetBox img={"Weather"} type={"weather"} callback={setSelectedWidget}/>
            </div>

            <div>
                {generateConfigurationForm()}
            </div>

            <button onClick={() => {updateServerLayout(widgetList);}}>Temporary Save Button</button>
        </div>
    );
}

export default LayoutPage;