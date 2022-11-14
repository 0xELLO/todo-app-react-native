import { useColorScheme } from "react-native";
import { darkPalette } from "./palette";
import { whitePalette } from "./palette";

interface ITheme {
  background : {
    primary: string,
    secondary: string,
    border: string,
    button: string,
  },
  font: {
    color: string,
    titleSize: number, 
    normalSize: number,
  }
}

const darkTheme : ITheme = {
  background : {
    primary: darkPalette.primary,
    secondary: darkPalette.secondary,
    border: darkPalette.primaryBorder,
    button: darkPalette.button
  },
  font: {
    color: darkPalette.fontPrimary,
    titleSize: 16, 
    normalSize: 14,
  }
}

const whiteTheme : ITheme = {
  background : {
    primary: whitePalette.primary,
    secondary: whitePalette.secondary,
    border: whitePalette.primaryBorder,
    button: whitePalette.button
  },
  font: {
    color: whitePalette.fontPrimary,
    titleSize: 16, 
    normalSize: 14,
  }
}

const navigationThemeDark = {
  dark: true,
  colors: {
    primary: darkPalette.fontPrimary,
    background: darkPalette.primary,
    card: darkPalette.secondary,
    text: darkPalette.fontPrimary,
    border: darkPalette.primaryBorder,
    notification: 'rgb(255, 69, 58)',
  },
};

const navigationThemeWhite = {
  dark: false,
  colors: {
    primary: whitePalette.primary,
    background: whitePalette.primary,
    card: whitePalette.secondary,
    text: whitePalette.fontPrimary,
    border: whitePalette.primaryBorder,
    notification: 'rgb(255, 69, 58)',
  },
};

export const useTheme = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : whiteTheme;
}

export const useNavigationTheme = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? navigationThemeDark : navigationThemeWhite;
}

// const [currTheme, setTheme] = useState("");

// const theme = colorScheme === 'dark' ? darkTheme : whiteTheme;
// export default theme;
