import { Text, View, TouchableOpacity, StyleSheet, Modal, TextInput, ToastAndroid } from 'react-native'
import { useState, useEffect } from 'react'
import * as FileSystem from 'expo-file-system';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AddTask = ({ visible, onClose, create }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskContent, setTaskContent] = useState('');
    const [taskClear, setTaskClear] = useState(false);
    const [taskDate, setTaskDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [taskViewDate, setTaskViewDate] = useState(null);
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    
 
    const handleConfirm = (date) => {
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        const seeDate = new Date(date);
        console.log("저장: " + localDate);
        console.log("저저장" + seeDate);
        setTaskDate(localDate.toISOString());
        setTaskViewDate(seeDate.toISOString());
        hideDatePicker();
    };

    const renderSelectedDate = () => {
        if (taskDate) {
            const dateObj=new Date(taskViewDate);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            return <Text>{`${year}년 ${month}월 ${day}일`}</Text>;
        } else {
            return <Text style={styles.undefinedText}>날짜 미정</Text>;
        }
    };

    const onChangeTitle = (event) => {
        setTaskTitle(event)
    }

    const onChangeContent = (event) => {
        setTaskContent(event)
    }

    const createTask = async () => {
        try {
            const cacheUri = FileSystem.documentDirectory + 'cache.txt';

            let cacheData = '';
            try {
                cacheData = await FileSystem.readAsStringAsync(cacheUri) + '\n';
            } catch (error) {
                console.error('기존 파일 내용을 읽는 중 오류가 발생했습니다.', error);
            }

            const newData = cacheData + JSON.stringify({ title: taskTitle, content: taskContent, clear: taskClear, date: taskDate });
            setTaskContent('');
            setTaskTitle('');
            setTaskDate(null);
            await FileSystem.writeAsStringAsync(cacheUri, newData);

            console.log('작업이 저장되었습니다.');
            console.log('새로운 내용:', newData);

            ToastAndroid.show('작업이 저장되었습니다.', ToastAndroid.SHORT);
        } catch (error) {
            console.error('작업 저장 중 오류가 발생했습니다.', error);
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
                    <Text style={styles.title}>일정 추가</Text>
                    <TextInput
                        style={styles.inputTitle}
                        placeholder="제목을 입력하세요."
                        maxLength={11}
                        onChangeText={onChangeTitle}
                    />
                    <TextInput
                        style={styles.inputContent}
                        placeholder="내용을 입력하세요."
                        multiline={true}
                        maximumLine={10}
                        maxLength={100}
                        onChangeText={onChangeContent}
                    />
                    <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
                        {renderSelectedDate()}
                    </TouchableOpacity>
                    <View style={{ marginBottom: 10 }}>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
                    {/* 모달 내부에 추가할 내용을 작성합니다 */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancleButton} onPress={onClose}>
                            <Text style={styles.cancleButtonText}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.completeButton}
                            onPress={() => {
                                if (taskTitle === '') {
                                    // 제목이 비어있으면 토스트 메시지 표시
                                    ToastAndroid.show('제목을 입력해주세요.', ToastAndroid.SHORT);
                                } else {
                                    createTask();
                                    create(taskTitle, taskContent, taskClear, taskDate);
                                    onClose();
                                }
                            }}>
                            <Text style={styles.buttonText}>입력 완료</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // 배경을 어둡게 설정하여 모달 이외의 영역을 흐리게 만듭니다.
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%', // 모달의 너비를 조정합니다.
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
    cancleButton: {
        tintColor: 'black',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
    },
    completeButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },
    cancleButtonText: {
        fontSize: 15,
        color: 'black',
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

export default AddTask;
