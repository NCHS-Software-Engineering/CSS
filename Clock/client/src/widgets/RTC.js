import '../App.css';
import React, { useState, useEffect, useRef} from "react";

function RTC()
{
    const tempDate = new Date();
    setCountdown(tempDate.getHours().toString().padStart(2, "0") + ":" + tempDate.getMinutes().toString().padStart(2, "0") + ":" + tempDate.getSeconds().toString().padStart(2, "0"));
}