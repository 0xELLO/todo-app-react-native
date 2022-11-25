import { View, Text, Pressable, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NestableDraggableFlatList, NestableScrollContainer, RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { ITodoTasks } from '../../domain/ITodoTasks';
import { useStyles } from '../../styles/mainStyles';
import AddButton from '../../components/AddButton';
import { BaseService } from '../../services/BaseService';
import { paths } from '../../util/Paths';
import { StackScreenProps } from '@react-navigation/stack';
import CheckBox from '@react-native-community/checkbox';
import { MainStackParamList } from '../../util/MainStackParamList';


type Props = StackScreenProps<MainStackParamList, 'Tasks'>;
const TasksView = ({ route } : Props) => {
  const {categoryId, priorityId} = route.params;

  const mainStyles = useStyles();
  const [tasks, setTasks] = useState([] as ITodoTasks[]);
  const [archivedTasks, setArchivedTasks] = useState([] as ITodoTasks[]);
  const TasksService =  useMemo(() => new BaseService<ITodoTasks>(paths.todoTasks), []);

  const reloadTasks = useCallback(async () => {
    let data = await TasksService.getAll('Tasks');
    data = data!.filter(task => task.todoCategoryId === categoryId && task.todoPriorityId === priorityId);
    const normal = data!.filter(task => !task.isArchived);
    const archive = data!.filter(task => task.isArchived);
    normal!.sort((a, b) => (a.taskSort < b.taskSort) ? -1 : 1);
    archive!.sort((a, b) => (a.taskSort < b.taskSort) ? -1 : 1);
    setTasks(normal as ITodoTasks[]);
    setArchivedTasks(archive as ITodoTasks[]);
  }, [TasksService, categoryId, priorityId]);

  useEffect(() => {
    reloadTasks().catch();
  }, [reloadTasks]);

  const changePosition = async (data: ITodoTasks[]) => {
    let index = 1;
    for (const cat of data) {
      cat.taskSort = index;
      await updateTask(cat);
      index++;
    }
    await reloadTasks();
  };

  const updateTask = async (data: ITodoTasks) => {
    await TasksService.change('Tasks', data, data.id as string);
    await reloadTasks();
  };

  const deleteTask = async (id: string) => {
    setTasks(curr => {return curr.filter(Task => Task.id !== id);});
    changePosition(tasks);
    await TasksService.delete('Tasks', id);
    await reloadTasks();
  };

  const addNewTask = async (name: string) => {
      const newCat = {
        taskName: name,
        taskSort: tasks.length + 1,
        createdDt: new Date().toISOString(),
        dueDt: new Date().toISOString(),
        isCompleted: false,
        isArchived: false,
        todoCategoryId: categoryId,
        todoPriorityId: priorityId,
      };
      await TasksService.add('Tasks', newCat);
      await reloadTasks();
  };


  const renderItem = ({ item, drag, isActive }: RenderItemParams<ITodoTasks>) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [name, setName] = useState(item.taskName);
    const [completed, setCompleted] = useState(item.isCompleted);

    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          disabled={isActive}>
          <View style={mainStyles.block}>
            {openEdit ?
            <>
              <TextInput autoFocus={true} style={styles.btn}  value={name} onChangeText={text => setName(text)} />
              <Pressable onPress={() => {setOpenEdit(false); item.taskName = name; updateTask(item);}}>
                <Text style={mainStyles.titleBlock}>Save</Text>
              </Pressable>
            </>
            :
            <>
              <Text style={[styles.btn, completed ? {textDecorationLine: 'line-through'} : {}]}>
                <Text style={mainStyles.titleBlock}>{name}</Text>
              </Text>
              <CheckBox disabled={false} value={completed} onValueChange={(val) => {setCompleted(val); item.isCompleted = val; updateTask(item);} } />
              <Pressable style={{marginRight: 10}} onPress={() => {setOpenEdit(!openEdit);}}>
                <Text style={mainStyles.titleBlock}>Edit</Text>
              </Pressable>
              <Pressable style={{marginRight: 10}} onPress={() => {item.isArchived = true; updateTask(item);} }>
                <Text style={mainStyles.titleBlock}>Archive</Text>
              </Pressable>
              <Pressable style={{width: 30, alignItems: 'center', marginRight: 10}} onPress={() => deleteTask(item.id as string)}>
                <Text style={mainStyles.titleBlock}>X</Text>
              </Pressable>
            </>}

          </View>
        </TouchableOpacity>
      </ScaleDecorator>
  );};

  const renderArchiveItem = ({ item, drag, isActive }: RenderItemParams<ITodoTasks>) => {
    const [name, setName] = useState(item.taskName);
    const [completed, setCompleted] = useState(item.isCompleted);
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          disabled={isActive}>
          <View style={mainStyles.block}>
            <>
              <Text style={[styles.btn, completed ? {textDecorationLine: 'line-through'} : {}]} >
                <Text style={mainStyles.titleBlock} >{name}</Text>
              </Text>
              <Pressable style={{width: 30, alignItems: 'center', marginRight: 10}} onPress={() => deleteTask(item.id as string)}>
                <Text style={mainStyles.titleBlock}>X</Text>
              </Pressable>
            </>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );};

  return (
    <>
      <View style={mainStyles.containerSecond}>
        <NestableScrollContainer>
          <Text style={[mainStyles.titleBlock, {marginBottom: 10}]}>TODO</Text>
          <NestableDraggableFlatList
            data={tasks}
            onDragEnd={({ data }) => { setTasks(data); changePosition(data);}}
            keyExtractor={(item) => item.id as string}
            renderItem={renderItem} />
          <Text style={[mainStyles.titleBlock, {marginBottom: 10}]}>ARCHIVE</Text>
          <NestableDraggableFlatList
            data={archivedTasks}
            onDragEnd={({ data }) => { setTasks(data); changePosition(data);}}
            keyExtractor={(item) => item.id as string}
            renderItem={renderArchiveItem} />
        </NestableScrollContainer>
      </View>
      <AddButton addNew={addNewTask} />
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
  },
});

export default TasksView;
