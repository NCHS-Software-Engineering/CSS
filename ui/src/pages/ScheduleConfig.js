import React, { useState } from 'react';
import './App.css';
import x from '../x.png';


function ScheduleConfig() {
    return (
        <div className="Content">
            <header className="App-header">
                <h1>Configure Schedules</h1>
            </header>
            <div className="Dropdown">
                <select className="select">
                    <option value=""></option>
                </select>
            </div>
            <div className="List">
                <table className="Table">
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input className="box" type="text" placeholder = "Period Name"/></td>
                            <td><input className="box" type="time" /></td>
                            <td><input className="box" type="time" /></td>
                            <td><button className="button">
                                <img className="x-png" src={x} alt="x.png" border="0" />
                                </button></td>
                        </tr>
                        <tr>
                            <td><input className="box" type="text" placeholder = "Period Name"/></td>
                            <td><input className="box" type="time" /></td>
                            <td><input className="box" type="time" /></td>
                            <td><button className="button">
                                <img className="x-png" src={x} alt="x.png" border="0" />
                                </button></td>
                        </tr>
                        <tr>
                            <td><input className="box" type="text" placeholder = "Period Name"/></td>
                            <td><input className="box" type="time" /></td>
                            <td><input className="box" type="time" /></td>
                            <td><button className="button">
                                <img className="x-png" src={x} alt="x.png" border="0" />
                                </button></td>
                        </tr>
                        <tr>
                            <td><input className="box" type="text" placeholder = "Period Name"/></td>
                            <td><input className="box" type="time" /></td>
                            <td><input className="box" type="time" /></td>
                            <td><button className="button">
                                <img className="x-png" src={x} alt="x.png" border="0" />
                                </button></td>
                        </tr>
                        <tr>
                            <td><input className="box" type="text" placeholder = "Period Name"/></td>
                            <td><input className="box" type="time" /></td>
                            <td><input className="box" type="time" /></td>
                            <td><button className="button">
                                <img className="x-png" src={x} alt="x.png" border="0" />
                                </button></td>
                        </tr>
                        <tr>
                            <td><input className="box" type="text" placeholder = "Period Name"/></td>
                            <td><input className="box" type="time" /></td>
                            <td><input className="box" type="time" /></td>
                            <td><button className="button">
                                <img className="x-png" src={x} alt="x.png" border="0" />
                                </button></td>
                        </tr>
                        <tr>
                            <td><input className="box" type="text" placeholder = "Period Name"/></td>
                            <td><input className="box" type="time" /></td>
                            <td><input className="box" type="time" /></td>
                            <td><button className="button">
                                <img className="x-png" src={x} alt="x.png" border="0" />
                                </button></td>
                        </tr>
                        <tr>
                            <td><input className="box" type="text" placeholder = "Period Name"/></td>
                            <td><input className="box" type="time" /></td>
                            <td><input className="box" type="time" /></td>
                            <td><button className="button">
                                <img className="x-png" src={x} alt="x.png" border="0" />
                                </button></td>
                        </tr>
                    </tbody>
                </table>
                
            </div>
            <div className='List'>
                <button className="button">Add Period</button>
            </div>
        </div>
    );
}

export default ScheduleConfig;