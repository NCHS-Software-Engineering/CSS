import React, { useState } from 'react';
import './App.css';

function WeekConfig() {
    const [selectedWeek, setSelectedWeek] = useState(1);

    const generateWeekOptions = () => {
        const options = [];
        const currentWeek = new Date(); // Assuming you have a function to get the current week number

        for (let i = 0; i < 10; i++) {
            const startDate = new Date(currentWeek.getFullYear(), currentWeek.getMonth(), currentWeek.getDate() + (i * 7));
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6);
            const optionText = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
            options.push(<option key={i} value={i}>{optionText}</option>);
        }

        return options;
    };

    const handleWeekChange = (event) => {
        setSelectedWeek(event.target.value);
    };

    const sendAlert = () => {
        alert('Saved!');
    }

    return (
        <div className="Content">
            <header className="App-header">
                <h1>Configure Week</h1>
            </header>
            <div className="Dropdown">
                <select className="select" value={selectedWeek} onChange={handleWeekChange}>
                    {generateWeekOptions()}
                </select>
            </div>
            <div className="List">
                <table className="Table">
                    <tbody>
                        <tr>
                            <td>Monday</td>
                            
                            <td>
                                <select className="select">
                                    <option value=""></option>
                                    <option value="Regular">Regular</option>
                                    <option value="SOAR">SOAR</option>
                                    <option value="Half Day">Half Day</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Tuesday</td>
                            <td>
                                <select className="select">
                                    <option value=""></option>
                                    <option value="Regular">Regular</option>
                                    <option value="SOAR">SOAR</option>
                                    <option value="Half Day">Half Day</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Wednesday</td>
                            <td>
                                <select className="select">
                                    <option value=""></option>
                                    <option value="Regular">Regular</option>
                                    <option value="SOAR">SOAR</option>
                                    <option value="Half Day">Half Day</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Thursday</td>
                            <td>
                                <select className="select">
                                    <option value=""></option>
                                    <option value="Regular">Regular</option>
                                    <option value="SOAR">SOAR</option>
                                    <option value="Half Day">Half Day</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Friday</td>
                            <td>
                                <select className="select">
                                    <option value=""></option>
                                    <option value="Regular">Regular</option>
                                    <option value="SOAR">SOAR</option>
                                    <option value="Half Day">Half Day</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='List'>
                <button className="button">Use Default</button>
                <button type="button" className="button" onClick={sendAlert}>Save</button>
            </div>
        </div>
    );
}

export default WeekConfig;
