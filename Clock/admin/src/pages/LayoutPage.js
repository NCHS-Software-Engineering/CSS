import React, { useState, useEffect } from "react";

import "../styles/App.css";
import WidgetMenuItem from "../components/WidgetMenuItem";
import WidgetDraggableItem from "../components/WidgetDraggableItem";


// TODO: fix dragging so that the dragging indicators stay with the selected widget better
// TODO: fix the table to make sure that all compnents stal the same size
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

    function addWidget() // TODO NOTE: temporary function
    {
        const widgetListCopy = [... widgetList];
        widgetListCopy.push({"row":selectedRow,"col":selectedCol,"width":1,"height":1,"data":<p>temp</p>})
        setWidgetList(widgetListCopy);
    }
    
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
                        } rowSpan={w.height} colSpan={w.width}>{renderDraggables(r, c, rectWidth, rectHeight)}{w.data}</td>);
                        
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
                [<svg onMouseDown={()=>setSelectedDraggable(1)} id="topDrag" fill="green" height={draggableSize} width={draggableSize} style={{position:"absolute", top:(-(draggableSize / 2)), left:(-(draggableSize / 2)) + rectWidth / 2}}><circle cx={draggableSize / 2} cy={draggableSize / 2} r={draggableSize / 2}></circle></svg>,
                <svg onMouseDown={()=>setSelectedDraggable(2)} id="rightDrag" fill="green" height={draggableSize} width={draggableSize} style={{position:"absolute", top:(-(draggableSize / 2)) + rectHeight / 2, left:(-(draggableSize / 2)) + rectWidth}}><circle cx={draggableSize / 2} cy={draggableSize / 2} r={draggableSize / 2}></circle></svg>,
                <svg onMouseDown={()=>setSelectedDraggable(3)} id="bottomDrag" fill="green" height={draggableSize} width={draggableSize} style={{position:"absolute", top:(-(draggableSize / 2)) + rectHeight, left:(-(draggableSize / 2)) + rectWidth / 2}}><circle cx={draggableSize / 2} cy={draggableSize / 2} r={draggableSize / 2}></circle></svg>,
                <svg onMouseDown={()=>setSelectedDraggable(4)} id="leftDrag" fill="green" height={draggableSize} width={draggableSize} style={{position:"absolute", top:(-(draggableSize / 2)) + rectHeight / 2, left:(-(draggableSize / 2))}}><circle cx={draggableSize / 2} cy={draggableSize / 2} r={draggableSize / 2}></circle></svg>]
        );
    }

    // deselect any draggables when the mouse button is raised
    document.body.onmouseup = function() {
        setSelectedDraggable(0);
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

    function selectWidget(key)
    {
        console.log(key);
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

            <button onClick={addWidget}>add-temp</button>

            <div>
                <WidgetMenuItem img={"./images/logo.png"} name={"hello!"} callback={selectWidget}/>
                <WidgetDraggableItem img={"hi"} name={"hi!"} />
            </div>
        </div>
    );
}

export default LayoutPage;