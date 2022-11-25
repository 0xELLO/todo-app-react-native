import { View, Text, TouchableOpacity, TextInput, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { useStyles } from '../styles/mainStyles';
import { Nameable } from '../types/Nameable';


const ItemsList = <TEntity extends Nameable, >(props: {
    data: TEntity[],
    setData: (data: TEntity[]) => void,
    updateData: (entity: TEntity) => void,
    openChild: (id: string) => void,
    reloadData: () => void,
    deleteData: (id: string) => void,
    changePosition: (data: TEntity[]) => void }) => {

    const mainStyles = useStyles();

    const renderItem = ({ item, drag, isActive }: RenderItemParams<TEntity>) => {
        const [openEdit, setOpenEdit] = useState(false);
        const [name, setName] = useState(item.getName())

        return (
            <ScaleDecorator>
            <TouchableOpacity
                activeOpacity={1}
                onLongPress={drag}
                onPress={() => props.openChild(item.getId())}
                disabled={isActive}>
                <View style={mainStyles.block}>
                    {openEdit ?
                    <>
                    <TextInput autoFocus={true} style={styles.btn}  value={name} onChangeText={text => setName(text)}></TextInput>
                    <Pressable onPress={() => {setOpenEdit(false); item.setName(name); props.updateData(item)}}><Text style={mainStyles.titleBlock}>Save</Text></Pressable>
                    </>
                    : 
                    <>
                    <Text style={styles.btn}><Text style={mainStyles.titleBlock} >{name}</Text></Text>
                    <Pressable  onPress={() => setOpenEdit(!openEdit)}><Text style={mainStyles.titleBlock}>Edit</Text></Pressable>
                    <Pressable style={{width: 30, alignItems: 'center', marginRight: 10}} onPress={() => props.deleteData(item.getId())}><Text style={mainStyles.titleBlock}>X</Text></Pressable>
                    </>}

                </View>
            </TouchableOpacity>
            </ScaleDecorator>
        );}

  return (
    <DraggableFlatList
        data={props.data}
        onDragEnd={({ data }) => { props.setData(data); props.changePosition(data);}}
        keyExtractor={(item) => item.getId()}
        renderItem={renderItem}
  />
  )
}

const styles = StyleSheet.create({
    block: {
      flex: 1,
      width: '100%',
      flexDirection: 'row',
    },
    btn: {
      flex: 1,
      flexGrow: 1,
    }
  })

export default ItemsList;