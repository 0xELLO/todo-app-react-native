import { View, Text } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useStyles } from '../styles/mainStyles';
import { BaseService } from '../services/BaseService';
import { paths } from '../types/Paths';
import { ITodoCategories } from '../domain/ITodoCategories';

const CategoriesView = () => {
  const mainStyles = useStyles();
  const [categories, setCategories] = useState([] as ITodoCategories[])

  const fetchData = useCallback(async () => {
    const categoryService = new BaseService(paths.todoCategories);
    const data = await categoryService.getAll('') as ITodoCategories[];
    setCategories(data)
  }, []);


  useEffect(() => {
    fetchData().catch((e) => {console.log(e);});
  }, [fetchData]);

  return (
    <View style={mainStyles.container}>
      <Text style={mainStyles.titleBlock}>Categories</Text>
      {categories.map((category) => {
        return (
          <View>
            <Text>{category.categoryName}</Text>
          </View>
          )
      })}
    </View>
  );
};

export default CategoriesView;
