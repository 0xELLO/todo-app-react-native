import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useStyles } from '../../styles/mainStyles';
import { BaseService } from '../../services/BaseService';
import { paths } from '../../types/Paths';
import { ITodoCategories } from '../../domain/ITodoCategories';
import AddButton from '../../components/AddButton';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { CategoriesCallbackContext, CategoriesChangeContext, CategoriesContext, CategoriesDeleteContext, CategoriesUpdateContext } from '../../../App';

// params: {categories: ITodoCategories[], setCategories: React.Dispatch<React.SetStateAction<ITodoCategories[]>>, updateCategories: () => {}}
const CategoriesView = () => {
  const categories = useContext(CategoriesContext);
  const setCategories = useContext(CategoriesUpdateContext);
  const updateCategories = useContext(CategoriesCallbackContext);
  const changePosition = useContext(CategoriesChangeContext);
  const deleteCategory = useContext(CategoriesDeleteContext);

  const mainStyles = useStyles();
  const renderItem = ({ item, drag, isActive }: RenderItemParams<ITodoCategories>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          onPress={() => console.log('PRESS')}
          disabled={isActive}>
            <View style={mainStyles.block}>
              <Text style={styles.btn}><Text style={mainStyles.titleBlock} >{item.categoryName}</Text></Text>
              <Pressable style={{width: 20}} onPress={() => deleteCategory(item.id!)}><Text style={mainStyles.titleBlock}>X</Text></Pressable>
            </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const addNewCategory = async (name: string) => {
      const newCat = {
        categoryName: name,
        categorySort: categories.length + 1,
      };
      const categoriesService = new BaseService<ITodoCategories>(paths.todoCategories);
      await categoriesService.add('Categories', newCat);
      await updateCategories();
  }

  return (
    <>
      <View style={mainStyles.containerSecond}>
        <DraggableFlatList
          data={categories}
          onDragEnd={({ data }) => { setCategories(data); changePosition(data);}}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderItem}
        />
      </View>
      <AddButton addNew={addNewCategory} />
    </>
  );
};

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

export default CategoriesView;
