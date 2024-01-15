import React, { useState } from 'react';
import './App.css';


function ScheduleConfig() {
    return (
        <div className="Content">
            <header className="App-header">
                <h1>Configure Schedules</h1>
            </header>
            <div className="Dropdown">
                <select>
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
                            <td><input type="text" placeholder = "period name"/></td>
                            <td><input type="time" /></td>
                            <td><input type="time" /></td>
                            <td><button>Delete</button></td>
                        </tr>
                        <tr>
                            <td><input type="text" placeholder = "period name"/></td>
                            <td><input type="time" /></td>
                            <td><input type="time" /></td>
                            <td><button>Delete</button></td>
                        </tr>
                        <tr>
                            <td><input type="text" placeholder = "period name"/></td>
                            <td><input type="time" /></td>
                            <td><input type="time" /></td>
                            <td><button>Delete</button></td>
                        </tr>
                        <tr>
                            <td><input type="text" placeholder = "period name"/></td>
                            <td><input type="time" /></td>
                            <td><input type="time" /></td>
                            <td><button>Delete</button></td>
                        </tr>
                        <tr>
                            <td><input type="text" placeholder = "period name"/></td>
                            <td><input type="time" /></td>
                            <td><input type="time" /></td>
                            <td><button>Delete</button></td>
                        </tr>
                        <tr>
                            <td><input type="text" placeholder = "period name"/></td>
                            <td><input type="time" /></td>
                            <td><input type="time" /></td>
                            <td><button>Delete</button></td>
                        </tr>
                        <tr>
                            <td><input type="text" placeholder = "period name"/></td>
                            <td><input type="time" /></td>
                            <td><input type="time" /></td>
                            <td><button>Delete</button></td>
                        </tr>
                        <tr>
                            <td><input type="text" placeholder = "period name"/></td>
                            <td><input type="time" /></td>
                            <td><input type="time" /></td>
                            <td><button>Delete</button></td>
                        </tr>
                    </tbody>
                </table>
                
            </div>
            <div className='List'>
                <button>Add Period</button>
            </div>
        </div>
    );
}

export default ScheduleConfig;