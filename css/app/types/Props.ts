import { Config } from "./Config";
import { ID } from "./ID";
import { Size } from "./Size";

export interface Props extends ID, Partial<Size> {
    config: Config;
}