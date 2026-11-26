"use client";
import type { ReactNode } from "react";

type ActionHandler<T> = () => T | Promise<T>;

interface ActionOpt<T> {
    children?: ReactNode;
    read?: ActionHandler<T>;
    write?: ActionHandler<T>;
    update?: ActionHandler<T>;
    delete?: ActionHandler<T>;
}

export default function Action<T>({
    children,
    read,
    write,
    update,
    delete: onDelete
}: ActionOpt<T>) {
    return <div>
        {children}
        <div>
            {read && <button type="button" onClick={read}>Read</button>}
            {write && <button type="button" onClick={write}>Write</button>}
            {update && <button type="button" onClick={update}>Update</button>}
            {onDelete && <button type="button" onClick={onDelete}>Delete</button>}
        </div>
    </div>;
}