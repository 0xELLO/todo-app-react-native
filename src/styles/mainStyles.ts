import { StyleSheet } from 'react-native';
import { useTheme } from './theme';

export const useStyles = () => {
  const theme = useTheme();

  const mainStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
      color: theme.font.color,
      paddingRight: 10,
      paddingLeft: 10,
    },
    navigation: {
      backgroundColor: theme.background.secondary,
    },
    textBlock: {
      color: theme.font.color,
      fontSize: theme.font.normalSize,
      fontWeight: 'bold'
    },
    titleBlock: {
      color: theme.font.color,
      fontSize: theme.font.titleSize,
      fontWeight: 'bold'
    },
    inputBlock: {
      backgroundColor: theme.background.secondary,
      borderWidth: 1,
      borderColor: theme.background.border,
      borderRadius: 10,
      height: 40,
      padding: 10,
      color: theme.font.color
    },
    button: {
      backgroundColor: theme.background.button,
      borderWidth: 1,
      borderColor: theme.background.border,
      borderRadius: 10,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 5,
      paddingBottom: 5,
    }

  })

  return mainStyles;
}