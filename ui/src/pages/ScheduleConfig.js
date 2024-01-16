import React, { useState } from 'react';
import './App.css';
import x from '../x.png';


function ScheduleConfig() {
    const [selectedOption, setSelectedOption] = useState('');

    return (
        <div className="Content">
            <header className="App-header">
                <h1>Configure Schedules</h1>
            </header>
            <div className="Dropdown">
                <select className="select" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                    <option value="">Select Option</option>
                    <option value="Regular">Regular</option>
                    <option value="SOAR">SOAR</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Add New">Add New</option>
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
                <button className="button">Save</button>
            </div>
            <div>
                
            </div>
        </div>
    );
    
    /*
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
    */
}

export default ScheduleConfig;