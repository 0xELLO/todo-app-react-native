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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
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
      color: theme.font.color,
      width: '66%',
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
      width: '100%',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center'
    },
    buttonSecond : {
      backgroundColor: theme.background.button,
      marginBottom: 10
    },
    block: {
      width: '100%',
      flexDirection: 'row',
      backgroundColor: theme.background.secondary,
      borderWidth: 1,
      borderColor: theme.background.border,
      borderRadius: 10,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 5,
      paddingBottom: 5,
      marginBottom: 10,
      height: 50,
      alignItems: 'center',
      flex: 1,
    },
    row: {
      marginRight: 10,
      marginLeft: 10,
      marginBottom: 15,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backgroundSecond: {
      backgroundColor: theme.background.secondary
    },
    containerSecond: {
      flex: 1,
      backgroundColor: theme.background.primary,
      color: theme.font.color,
      paddingRight: 10,
      paddingLeft: 10,
      flexDirection: 'column',
      width: '100%',
      marginTop: 20,
    },
    plusButton: {
      backgroundColor: theme.background.button,
      height: 100,
      width: 100,
      alignItems: 'center',
      justifyContent: 'center',
      border: 1,
      borderRadius: 50,
      marginRight: 10,
      marginBottom: 10,
    },
    inputAdd : {
      backgroundColor: theme.background.secondary,
      borderWidth: 1,
      borderColor: theme.background.border,
      borderRadius: 10,
      height: 40,
      padding: 10,
      color: theme.font.color,
      flexGrow: 1,
    },
    buttonAdd: {
      backgroundColor: theme.background.button,
      borderRadius: 10,
      border: 1,
      width: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 20,
    }


  })

  return mainStyles;
}