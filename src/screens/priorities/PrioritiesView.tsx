import { View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BaseService } from '../../services/BaseService';
import { paths } from '../../util/Paths';
import { ITodoPriorities } from '../../domain/ITodoPriorities';
import AddButton from '../../components/AddButton';
import ItemsList from '../../components/ItemsList';
import { useStyles } from '../../styles/mainStyles';
import { StackScreenProps } from '@react-navigation/stack';
import { ITodoTasks } from '../../domain/ITodoTasks';
import { MainStackParamList } from '../../util/MainStackParamList';
import PrioritiesListItem from '../../util/ListItems/PrioritiesListItem';

type Props = StackScreenProps<MainStackParamList, 'Priorities'>;

const PrioritiesView = ({ route, navigation } : Props) => {
  const categoryId = route.params.categoryId;

  const mainStyles = useStyles();
  const [Priorities, setPriorities] = useState([] as PrioritiesListItem[]);
  const PrioritiesService =  useMemo(() => new BaseService<ITodoPriorities>(paths.todoPriorities), []);

  const morfData = (data: ITodoPriorities[]) : PrioritiesListItem[] => {
    return data.flatMap(cat => new PrioritiesListItem(cat.id as string, cat.priorityName, cat.prioritySort, cat.syncDt as string));
  };

  const reloadPriorities = useCallback(async () => {
    const data = await PrioritiesService.getAll('Priorities');
    data!.sort((a, b) => (a.prioritySort < b.prioritySort) ? -1 : 1);
    setPriorities(morfData(data as ITodoPriorities[]));
  }, [PrioritiesService]);

  useEffect(() => {
    reloadPriorities().catch();
  }, [reloadPriorities]);

  const changePosition = async (data: ITodoPriorities[]) => {
    let index = 1;
    for (const cat of data) {
      cat.prioritySort = index;
      await updatePriority(cat);
      index++;
    }
    await reloadPriorities();
  };

  const updatePriority = async (data: ITodoPriorities) => {
    await PrioritiesService.change('Priorities', data, data.id as string);
  };

  const deletePriority = async (id: string) => {
    setPriorities(curr => {return curr.filter(Priority => Priority.id !== id);});
    changePosition(Priorities);
    const tasksService = new BaseService<ITodoTasks>(paths.todoTasks);
    const tasks = await tasksService.getAll('Tasks');
    for (let task of tasks!) {
      if (task.todoPriorityId === id) {
        await tasksService.delete('Tasks', id);
      }
    }
    await PrioritiesService.delete('Priorities', id);
    await reloadPriorities();
  };

  const openTasks = (id: string) => {
    navigation.navigate('Tasks', {categoryId: categoryId, priorityId: id});
  };

  const addNewPriority = async (name: string) => {
      const newCat = {
        priorityName: name,
        prioritySort: Priorities.length + 1,
      };
      await PrioritiesService.add('Priorities', newCat);
      await reloadPriorities();
  };

  return (
    <>
      <View style={mainStyles.containerSecond}>
        <ItemsList<PrioritiesListItem> data={Priorities} setData={setPriorities} updateData={updatePriority} reloadData={reloadPriorities} deleteData={deletePriority} changePosition={changePosition} openChild={openTasks} />
      </View>
      <AddButton addNew={addNewPriority} />
    </>
  );
};

export default PrioritiesView;
