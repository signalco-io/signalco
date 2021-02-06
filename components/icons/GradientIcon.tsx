import { SvgIconComponent } from "@material-ui/icons";
import { trimStartChar } from "../../src/helpers/StringHelpers";

const GradientIcon = ({ icon, gradient, fontSize }: { icon: SvgIconComponent, gradient?: string[], fontSize?: 'inherit' | 'large' | 'medium' | 'small' }) => {
    const IconComp = icon;
    if (!gradient)
        return <IconComp />
    return (
        <>
            <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true" focusable="false">
                <linearGradient id={`gradient-${trimStartChar(gradient[0], '#')}-${trimStartChar(gradient[1], '#')}`} x2="1" y2="1">
                    <stop offset="0%" stopColor={gradient[0]} />
                    <stop offset="80%" stopColor={gradient[1]} />
                    <stop offset="100%" stopColor={gradient[1]} />
                </linearGradient>
            </svg>
            <IconComp fontSize={fontSize} style={{ fill: `url(#${`gradient-${trimStartChar(gradient[0], '#')}-${trimStartChar(gradient[1], '#')}`}) ${gradient[0]}` }} />
        </>);
}

export default GradientIcon;