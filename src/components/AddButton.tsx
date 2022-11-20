import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useStyles } from '../styles/mainStyles'
import { TextInput } from 'react-native-gesture-handler';
import { useBackHandler } from '@react-native-community/hooks';

const AddButton = (props: {addNew: (value: string) => {}}) => {
  const mainStyles = useStyles();
  const [renderInput, setRenderInput] = useState(false);

  const backActionHandler = () => {
    setRenderInput(false);
    return true;
  }

  useBackHandler(backActionHandler);

  return (
    <View style={styles.main}>
      {renderInput ? <InputAdd setRenderInput={setRenderInput}  addNew={props.addNew} /> : 
      <Pressable style={mainStyles.plusButton} onPress={() => setRenderInput(true)} ><Text style={{fontSize: 30}} >+</Text></Pressable>}
    </View>
  )
}

const InputAdd = (props: {setRenderInput: (value: boolean) => void, addNew: (value: string) => void}) => {
  const mainStyles = useStyles();
  const [value, setValue] = useState('');
  return (
    <>
        <TextInput value={value} onChangeText={text => setValue(text)} placeholder='Name' autoFocus={true} style={mainStyles.inputAdd} />
        <Pressable onPress={() => {props.addNew(value); props.setRenderInput(false)}} style={mainStyles.buttonAdd}><Text>Add</Text></Pressable>
    </>
  )
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },

})

export default AddButton