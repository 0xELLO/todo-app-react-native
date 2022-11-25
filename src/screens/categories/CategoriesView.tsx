import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StackParamList } from '../../../App';
import AddButton from '../../components/AddButton';
import ItemsList from '../../components/ItemsList';
import { ITodoCategories } from '../../domain/ITodoCategories';
import { ITodoTasks } from '../../domain/ITodoTasks';
import { BaseService } from '../../services/BaseService';
import { useStyles } from '../../styles/mainStyles';
import { Nameable } from '../../types/Nameable';
import { paths } from '../../types/Paths';

class CategoriesExtended implements ITodoCategories, Nameable {
  id: string;
  categoryName: string;
  categorySort: number;
  syncDt?: string | undefined;
  constructor(id: string, categoryName: string, categorySort: number, syncDt: string) {
    this.id = id;
    this.categoryName = categoryName;
    this.categorySort = categorySort;
    this.syncDt = syncDt;
  }
  getName(){return this.categoryName};
  setName(name: string){(this.categoryName = name)};
  getPosition(){return this.categorySort};
  getId(){return this.id};

}
type Props = StackScreenProps<StackParamList, 'Categories'>;
const CategoriesView = ({ navigation } : Props ) => {
  const mainStyles = useStyles();
  const [categories, setCategories] = useState([] as CategoriesExtended[])
  const categoriesService =  useMemo(() => new BaseService<ITodoCategories>(paths.todoCategories), []);

  const morfData = (data: ITodoCategories[]) : CategoriesExtended[] => {
    return data.flatMap(cat => new CategoriesExtended(cat.id as string, cat.categoryName, cat.categorySort, cat.syncDt as string))
  }

  const reloadCategories = useCallback(async () => {
    const data = await categoriesService.getAll('Categories');
    data!.sort((a, b) => (a.categorySort < b.categorySort) ? -1 : 1);
    setCategories(morfData(data as ITodoCategories[]));
  }, [categoriesService]);

  useEffect(() => {
    reloadCategories().catch();
  }, [reloadCategories]);

  const changePosition = async (data: ITodoCategories[]) => {
    let index = 1;
    for (const cat of data) {
      cat.categorySort = index;
      await updateCategory(cat);
      index++;
    }
    await reloadCategories();
  }

  const updateCategory = async (data: ITodoCategories) => {
    await categoriesService.change('Categories', data, data.id as string);
  }

  const deleteCategory = async (id: string) => {
    setCategories(curr => {return curr.filter(category => category.id !== id)})
    changePosition(categories)
    const tasksService = new BaseService<ITodoTasks>(paths.todoTasks);
    const tasks = await tasksService.getAll('Tasks');
    for(let task of tasks!) {
      if (task.todoCategoryId === id) {
        await tasksService.delete('Tasks', id);
      }
    }

    await categoriesService.delete('Categories', id);
    await reloadCategories();
  }

  const openPriorities = (id: string) => {
    navigation.push('Priorities', {categoryId: id})
  }

  const addNewCategory = async (name: string) => {
      const newCat = {
        categoryName: name,
        categorySort: categories.length + 1,
      };
      await categoriesService.add('Categories', newCat);
      await reloadCategories();
  }

  return (
    <>
      <View style={mainStyles.containerSecond}>
        <ItemsList<CategoriesExtended> data={categories} setData={setCategories} updateData={updateCategory} reloadData={reloadCategories} deleteData={deleteCategory} changePosition={changePosition} openChild={openPriorities} /> 
      </View>
      <AddButton addNew={addNewCategory} />
    </>
  );
};

export default CategoriesView;
