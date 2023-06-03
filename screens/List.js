import { Text, View, TouchableOpacity, StyleSheet, ScrollView, ToastAndroid, Vibration } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useState, useEffect } from 'react';
import AddTask from '../components/AddTask';
import TaskInfo from '../components/TaskInfo';
import * as FileSystem from 'expo-file-system';

const List = (props) => {
    const [taskList, setTaskList] = useState([]);
    const [addModal, setAddModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        settingList();
    }, []);

    const openAdd = () => {
        setAddModal(true);
    };

    const closeAdd = () => {
        setAddModal(false);
    };

    const openInfo = (task) => {
        setInfoModal(true);
        setSelectedTask(task);
    };

    const closeInfo = () => {
        setInfoModal(false);
    };

    const handleTaskUpdate = (updatedTask) => {
        setTaskList((prevTaskList) => {
            const updatedTaskList = prevTaskList.map((task) => {
                if (task.index === updatedTask.index) {
                    return updatedTask;
                }
                return task;
            });
            reCache(updatedTaskList);
            return updatedTaskList;
        });
    };

    const removeTask = (index) => {
        setTaskList((prevTaskList) => {
            const updatedTaskList = prevTaskList.filter((task) => task.index !== index);

            const reIndex = updatedTaskList.map((task, idx) => ({
                ...task,
                index: idx,
            }));
            reCache(reIndex);
            Vibration.vibrate(400);
            ToastAndroid.show('일정이 삭제되었습니다.', ToastAndroid.SHORT);
            return updatedTaskList;
        });
    };

    const reCache = async (updatedTaskList) => {
        try {
            const cacheUri = FileSystem.documentDirectory + 'cache.txt';
            const cacheData = updatedTaskList
                .map((task) => JSON.stringify(task) + '\n')
                .join('');

            await FileSystem.writeAsStringAsync(cacheUri, cacheData);
            console.log('캐시 파일 업데이트 완료');
        } catch (error) {
            console.error('캐시 파일 업데이트 중 오류가 발생했습니다.', error);
        }
    };

    const settingList = async () => {
        try {
            const cacheUri = FileSystem.documentDirectory + 'cache.txt';
            let cacheData = '';

            try {
                cacheData = await FileSystem.readAsStringAsync(cacheUri);
            } catch (error) {
                console.error('기존 파일 내용을 읽는 중 오류가 발생했습니다.', error);
            }

            const taskSet = parseCacheData(cacheData);
            taskSet.forEach((task, index) => {
                const { title, content, clear, date } = task;
                newTask(title, content, clear, date, index);
            });

            console.log('캐시 파일에서 읽은 데이터:', taskSet);
        } catch (error) {
            console.error('캐시 파일 읽기 중 오류가 발생했습니다.', error);
        }
    };

    const newTask = (title, content, clear, date, index) => {
        setTaskList((prevTaskList) => [
            ...prevTaskList,
            { title, content, clear, date, index },
        ]);
    };

    const parseCacheData = (cacheData) => {
        const regex = /}[^{]/g;
        const taskList = [];

        let startIndex = 0;
        let endIndex = 0;

        while ((endIndex = cacheData.indexOf('}', startIndex)) !== -1) {
            endIndex++;
            const jsonStr = cacheData.substring(startIndex, endIndex);

            try {
                const task = JSON.parse(jsonStr);
                taskList.push(task);
            } catch (error) {
                console.error('JSON 파싱 오류:', error);
            }

            startIndex = endIndex;
        }

        return taskList;
    };

    const toggleTaskClear = (index, isChecked) => {
        setTaskList((prevTaskList) => {
            const updatedTaskList = prevTaskList.map((task) => {
                if (task.index === index) {
                    return {
                        ...task,
                        clear: !task.clear,
                    };
                }
                return task;
            });
            reCache(updatedTaskList);
            return updatedTaskList;
        });
    };
    
    const startVibration = () => {
      Vibration.vibrate(100); // 100밀리초 동안 진동 울리기
    };
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <TouchableOpacity onPress={openAdd}>
                    <View style={styles.addTask}>
                        <Text style={styles.taskText}>일정 추가하기 +</Text>
                    </View>
                </TouchableOpacity>
                <AddTask
                    visible={addModal}
                    onClose={closeAdd}
                    create={(title, content, clear, date) => {
                        newTask(title, content, clear, date, taskList.length);
                    }}
                />
                {taskList.slice(0).reverse().map((item, idx) => {
                    return (
                        <View key={item.index} style={styles.taskContainer}>
                            <View style={styles.taskSide}>
                                <BouncyCheckbox
                                    size={25}
                                    fillColor="#2c2c2c"
                                    unfillColor="#FFFFFF"
                                    text={item.title}
                                    textStyle={styles.taskText}
                                    innerIconStyle={{
                                        borderWidth: 2,
                                        borderRadius: 5,
                                    }}
                                    iconStyle={{
                                        borderColor: '#2c2c2c',
                                        borderRadius: 5,
                                    }}
                                    disableBuiltInState={true}
                                    isChecked={item.clear}
                                    onPress={(isChecked) => {
                                        toggleTaskClear(item.index, isChecked ? 'true' : 'false');
                                    }}
                                />
                            </View>
                            <View style={styles.taskSide}>
                                <TouchableOpacity onPress={() => openInfo(item)}>
                                    <Text style={{ fontSize: 20, margin: 5 }}>⋮</Text>
                                </TouchableOpacity>
                                <TaskInfo
                                    visible={infoModal}
                                    onClose={closeInfo}
                                    task={selectedTask}
                                    onTaskUpdate={handleTaskUpdate}
                                />
                                <Text> </Text>
                                <TouchableOpacity 
                                  onPressIn={startVibration}
                                  delayLongPress={1000} 
                                  onLongPress={() => removeTask(item.index)}
                                >
                                    <Text style={{ fontSize: 17, margin: 5 }}>🗑</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingBottom: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 15,
        borderWidth: 3,
        margin: 10,
    },
    addTask: {
        width: 300,
        height: 50,
        backgroundColor: '#ededed',
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#4c4c4c',
        justifyContent: 'center',
        marginBottom: 10,
        padding: 10,
    },
    taskText: {
        fontSize: 17,
        color: '#2c2c2c',
        fontWeight: 'bold',
    },
    taskContainer: {
        width: 300,
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginTop: 5,
        marginBottom: 5,
    },
    taskSide: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default List;
