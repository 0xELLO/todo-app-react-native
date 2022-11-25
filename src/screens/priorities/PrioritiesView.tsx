import { View, Text, TouchableOpacity, TextInput, Pressable, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BaseService } from '../../services/BaseService';
import { paths } from '../../types/Paths';
import { ITodoPriorities } from '../../domain/ITodoPriorities';
import AddButton from '../../components/AddButton';
import ItemsList from '../../components/ItemsList';
import { Nameable } from '../../types/Nameable';
import { useStyles } from '../../styles/mainStyles';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParamList } from '../../../App';
import { ITodoTasks } from '../../domain/ITodoTasks';

class PrioritiesExtended implements ITodoPriorities, Nameable {
  id: string;
  priorityName: string;
  prioritySort: number;
  syncDt?: string | undefined;
  constructor(id: string, PriorityName: string, PrioritySort: number, syncDt: string) {
    this.id = id;
    this.priorityName = PriorityName;
    this.prioritySort = PrioritySort;
    this.syncDt = syncDt;
  }
  getName(){return this.priorityName};
  setName(name: string){(this.priorityName = name)};
  getPosition(){return this.prioritySort};
  getId(){return this.id};

}

type Props = StackScreenProps<StackParamList, 'Priorities'>;
const PrioritiesView = ({ route, navigation } : Props) => {
  const categoryId = route.params.categoryId;

  const mainStyles = useStyles();
  const [Priorities, setPriorities] = useState([] as PrioritiesExtended[])
  const PrioritiesService =  useMemo(() => new BaseService<ITodoPriorities>(paths.todoPriorities), []);

  const morfData = (data: ITodoPriorities[]) : PrioritiesExtended[] => {
    return data.flatMap(cat => new PrioritiesExtended(cat.id as string, cat.priorityName, cat.prioritySort, cat.syncDt as string))
  }

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
  }

  const updatePriority = async (data: ITodoPriorities) => {
    await PrioritiesService.change('Priorities', data, data.id as string);
  }

  const deletePriority = async (id: string) => {
    setPriorities(curr => {return curr.filter(Priority => Priority.id !== id)})
    changePosition(Priorities);
    const tasksService = new BaseService<ITodoTasks>(paths.todoTasks);
    const tasks = await tasksService.getAll('Tasks');
    for(let task of tasks!) {
      if (task.todoPriorityId === id) {
        await tasksService.delete('Tasks', id);
      }
    }
    await PrioritiesService.delete('Priorities', id);
    await reloadPriorities();
  }

  const openTasks = (id: string) => {
  // Tasks: {categoryId: string, priorityId: string}
    console.log("HEREEE" + categoryId)
    navigation.navigate('Tasks', {categoryId: categoryId, priorityId: id})
  }

  const addNewPriority = async (name: string) => {
      const newCat = {
        priorityName: name,
        prioritySort: Priorities.length + 1,
      };
      await PrioritiesService.add('Priorities', newCat);
      await reloadPriorities();
  }

  return (
    <>
      <View style={mainStyles.containerSecond}>
        <ItemsList<PrioritiesExtended> data={Priorities} setData={setPriorities} updateData={updatePriority} reloadData={reloadPriorities} deleteData={deletePriority} changePosition={changePosition} openChild={openTasks} /> 
      </View>
      <AddButton addNew={addNewPriority} />
    </>
  );
};

export default PrioritiesView;
