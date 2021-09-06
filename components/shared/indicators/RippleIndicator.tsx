import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { spring, TransitionMotion } from 'react-motion';
import { useTheme } from '@mui/material/styles';
import { NoSsr } from '@mui/material';

const leavingSpringConfig = { stiffness: 60, damping: 15 };
const leavingSpringBackgroundConfig = { stiffness: 140, damping: 20 };
const willLeave = (styleCell: any) => {
    return {
        ...styleCell.style,
        opacity: spring(0, leavingSpringConfig),
        scale: spring(2, leavingSpringConfig),
        background: spring(0, leavingSpringBackgroundConfig)
    };
};

export interface IRippleIndicatorProps {
    size?: number,
    interval?: number
}

export interface IRippleIndicatorRef {
    trigger: () => void
}

const RippleIndicator = forwardRef((props: IRippleIndicatorProps, ref: React.ForwardedRef<IRippleIndicatorRef | undefined>) => {
    const theme = useTheme();
    const [refresh, setRefresh] = useState<number>(0);
    useImperativeHandle(ref, () => ({ trigger() { setRefresh(Date.now()); } }));
    useEffect(() => {
        if (props.interval != null && props.interval > 0) {
            const token = setInterval(() => {
                setRefresh(Date.now());
            }, props.interval);

            return () => clearInterval(token);
        }
    }, [props.interval]);

    const { size = 42 } = props;

    const styles = [{
        key: refresh.toString(),
        style: {
            opacity: spring(1),
            scale: spring(0),
            background: spring(0.4)
        }
    }];

    return (
        <NoSsr>
            <TransitionMotion willLeave={willLeave} styles={styles}>
                {circles =>
                    <div style={{ position: "relative", width: `${size}px`, height: `${size}px` }}>
                        {circles.map(({ key, style: { opacity, scale, background } }) =>
                            <div
                                key={key}
                                style={{
                                    width: `${size / 2}px`,
                                    height: `${size / 2}px`,
                                    top: `${size / 4}px`,
                                    left: `${size / 4}px`,
                                    borderRadius: `${size - 1}px`,
                                    position: "absolute",
                                    border: theme.palette.mode === 'dark' ? "1px solid white" : "1px solid black",
                                    backgroundColor: theme.palette.mode === 'dark' ? `rgba(255,255,255,${background})` : `rgba(0,0,0,${background})`,
                                    opacity: opacity,
                                    scale: scale,
                                    transform: `scale(${scale})`,
                                    WebkitTransform: `scale(${scale})`,
                                }} />
                        )}
                    </div>
                }
            </TransitionMotion>
        </NoSsr>
    );
});

export default RippleIndicator;