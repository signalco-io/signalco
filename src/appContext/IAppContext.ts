import { AppTheme } from "../theme";

export default interface IAppContext {
    theme: AppTheme,
    setTheme: (theme: AppTheme) => void;
    isDark: boolean
}
