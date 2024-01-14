import React, { useState } from 'react';
import './App.css';

function WeekConfig() {
    const [selectedWeek, setSelectedWeek] = useState(1);

    const generateWeekOptions = () => {
        const options = [];
        const currentWeek = new Date(); // Assuming you have a function to get the current week number

        for (let i = 0; i < 10; i++) {
            options.push(<option key={i} value={i}>Week {i}</option>);
        }

        return options;
    };

    const handleWeekChange = (event) => {
        setSelectedWeek(event.target.value);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Configure Week</h1>
            </header>
            <div className="Dropdown">
                <select value={selectedWeek} onChange={handleWeekChange}>
                    {generateWeekOptions()}
                </select>
            </div>
            <div className="List">
                <table className="Table">
                    <tbody>
                        <tr>
                            <td>Monday</td>
                            <td>
                                <select>
                                    <option value=""></option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Tuesday</td>
                            <td>
                                <select>
                                    <option value=""></option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Wednesday</td>
                            <td>
                                <select>
                                    <option value=""></option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Thursday</td>
                            <td>
                                <select>
                                    <option value=""></option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Friday</td>
                            <td>
                                <select>
                                    <option value=""></option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Saturday</td>
                            <td>
                                <select>
                                    <option value=""></option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Sunday</td>
                            <td>
                                <select>
                                    <option value=""></option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WeekConfig;