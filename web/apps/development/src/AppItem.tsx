import { useState } from "react";
import { AppItemType } from "./AppItemType";

export function AppItem({ label, href }: AppItemType) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <li className="launcher-card">
            <a href={href} target="_blank">
                <div className="spinner" style={{ display: isLoaded ? 'none' : 'block' }}>...</div>
                <img style={{ display: isLoaded ? 'block' : 'none' }} src={`${href}/favicon.ico`} onLoad={() => setIsLoaded(true)} />
                <div className="info">
                    <span>{label}</span>
                    <small>{href}</small>
                </div>
            </a>
        </li>
    );
}
