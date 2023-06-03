import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet, Image, Button } from 'react-native';
import { useState } from 'react';

import Home from './screens/Home';
import List from './screens/List';
import CalendarScreen from './screens/CalendarScreen';
const Stack = createStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home}
                    options={{
                        title: 'Do My List',
                        headerRight: () => (
                            <Button
                                color='black'
                                onPress={() => alert(
                                    "1.일정 초기화 버튼을 2초간 누르면 일정이\n   모두 초기화됩니다.\n\n2.일정 관리하기에서 휴지통 버튼은 1초 이상\n   눌러야 작동합니다.")}
                                title='앱 안내'
                            />
                        )
                    }}
                />
                <Stack.Screen name="List" component={List}
                    options={{
                        title: 'To Do List'
                    }}
                />
                <Stack.Screen name="CalendarScreen" component={CalendarScreen}
                    options={{
                        title: 'Calendar'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

