import { Props } from "../types/Props";

export default function RTC({ id, row, col, width, height, config }: Props) {
    const [crow, setRow] = useState((row ?? 0) + 1);
    const [ccol, setCol] = useState((col ?? 0) + 1);
    const [cwidth, setWidth] = useState(width ?? 1);
    const [cheight, setHeight] = useState(height ?? 1);
}