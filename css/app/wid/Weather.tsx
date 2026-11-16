const SVG = {
    sun: <svg width="100%" height="100%">
        <defs>
            <radialGradient id="rad">
                <stop offset="0%" stopColor="#ffaa00"/>
                <stop offset="90%" stopColor="#ff8000"/>
            </radialGradient>
        </defs>
        <circle cx="50%" cy="50%" r="32%" fill={`url("#rad")`} stroke="#000" strokeWidth="2%"/>
    </svg>,
    moon: <svg width="100%" height="100%" viewBox="-9.411 -9.411 49.279 47.279">
        <defs>
            <radialGradient id="rad">
                <stop offset="0%" stopColor="#97b0cf"/>
                <stop offset="45%" stopColor="#a7c0df"/>
                <stop offset="90%" stopColor="#d0e5ff"/>
            </radialGradient>
        </defs>
        <path fill={`url("#rad")`} stroke="#000" strokeWidth="2%" d="M29.693,14.49c-0.469-0.174-1-0.035-1.32,0.353c-1.795,2.189-4.443,3.446-7.27,3.446c-5.183,0-9.396-4.216-9.396-9.397
        c0-2.608,1.051-5.036,2.963-6.835c0.366-0.347,0.471-0.885,0.264-1.343c-0.207-0.456-0.682-0.736-1.184-0.684
        C5.91,0.791,0,7.311,0,15.194c0,8.402,6.836,15.238,15.238,15.238c8.303,0,14.989-6.506,15.219-14.812
        C30.471,15.118,30.164,14.664,29.693,14.49z"/>
    </svg>
} as const;
export default function Weather() {}