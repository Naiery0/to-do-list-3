import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal, TextInput, ToastAndroid } from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as FileSystem from 'expo-file-system';

const TaskInfo = ({ visible, onClose, task, onTaskUpdate }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskContent, setTaskContent] = useState('');
    const [goingSwitch, setGoingSwitch] = useState(false);
    const [taskIndex, setTaskIndex] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [taskViewDate, setTaskViewDate] = useState(null);

    useEffect(() => {
        if (task) {
            setTaskTitle(task.title);
            setTaskContent(task.content);
            setGoingSwitch(task.clear);
            setTaskIndex(task.index);
            setSelectedDate(task.date);
            const taskDate = new Date(task.date);
            const adjustedDate = new Date(taskDate.getTime() - 540 * 60000);
             setTaskViewDate(adjustedDate.toISOString());
        }
    }, [task]);

    const handleConfirm = () => {
        const updatedTask = {
            ...task,
            title: taskTitle,
            content: taskContent,
            clear: goingSwitch,
            index: taskIndex,
            date: selectedDate,
        };

        onTaskUpdate(updatedTask);

        ToastAndroid.show('수정이 완료되었습니다.', ToastAndroid.SHORT);
        onClose();
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDateConfirm = (date) => {
        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        const seeDate = new Date(date);
        console.log("저장: " + localDate);
        setTaskViewDate(seeDate.toISOString());
        setSelectedDate(localDate.toISOString());
        hideDatePicker();
    };

    const renderSelectedDate = () => {
        if (selectedDate != null) {
            const dateObj = new Date(taskViewDate);
            console.log("불러올 날짜"+dateObj);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            return <Text>{`${year}년 ${month}월 ${day}일`}</Text>;
        } else {
            return <Text style={styles.undefinedText}>날짜 미정</Text>;
        }
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="none"
            transparent={true}
        >
            <View style={styles.container}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>일정 확인</Text>
                    <TextInput
                        style={styles.inputTitle}
                        maxLength={11}
                        value={taskTitle}
                        onChangeText={setTaskTitle}
                    />
                    <TextInput
                        style={styles.inputContent}
                        multiline={true}
                        numberOfLines={10}
                        maxLength={100}
                        value={taskContent}
                        onChangeText={setTaskContent}
                    />
                    <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
                        {renderSelectedDate()}
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleDateConfirm}
                        onCancel={hideDatePicker}
                    />
                    <View style={{ marginTop: 20, marginBottom: 15 }}>
                        <SwitchToggle
                            switchOn={goingSwitch}
                            onPress={() => setGoingSwitch(!goingSwitch)}
                            circleColorOff="white"
                            circleColorOn="white"
                            backgroundColorOff="gray"
                            backgroundColorOn="yellowgreen"
                            backTextRight="Going"
                            backTextLeft="Clear!"
                            leftContainerStyle={{
                                position: 'absolute',
                                justifyContent: 'center',
                                start: 10,
                                paddingBottom: 1,
                            }}
                            rightContainerStyle={{
                                position: 'absolute',
                                justifyContent: 'center',
                                end: 10,
                                paddingBottom: 1,
                            }}
                            textLeftStyle={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                color: 'white',
                            }}
                            textRightStyle={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                color: 'white',
                            }}
                            containerStyle={{
                                width: 115,
                                height: 23,
                                borderRadius: 15,
                            }}
                            circleStyle={{
                                width: 58,
                                height: 23,
                                borderRadius: 15,
                                borderWidth: 1.5,
                                borderColor: '#cccccc',
                            }}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.completeButton} onPress={handleConfirm}>
                            <Text style={styles.buttonText}>수정 완료</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 5,
    },
    cancelButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
    },
    completeButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },
    inputTitle: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        height: 40,
    },
    inputContent: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        height: 170,
        marginTop: 10,
        marginBottom: 10,
        textAlignVertical: 'top',
    },
    dateButton: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    undefinedText: {
        color: 'gray',
    },
});

export default TaskInfo;
