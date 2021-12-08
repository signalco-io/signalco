import { useEffect, useState } from "react";

const useHashParam = () => {
    const [lastHash, setLastHash] = useState<string | undefined>(location.hash);

    useEffect(() => {
        const onHashChanged = () => {
            setLastHash(location.hash);
        };

        window.addEventListener("hashchange", onHashChanged);

        if (lastHash !== location.hash) {
            setLastHash(location.hash);
        }

        return () => {
            window.removeEventListener("hashchange", onHashChanged);
        };
    }, [lastHash]);

    return lastHash;
};

export default useHashParam;