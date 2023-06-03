import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as FileSystem from 'expo-file-system';

const CalendarScreen = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [scheduleList, setScheduleList] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleSchedulePress = (schedule) => {
        setSelectedSchedule(schedule);
        setModalVisible(true);
    };

    useEffect(() => {
        const fetchScheduleList = async () => {
            try {
                const cacheUri = FileSystem.documentDirectory + 'cache.txt';
                const content = await FileSystem.readAsStringAsync(cacheUri);
                if (content) {
                    const scheduleData = content
                        .split('\n')
                        .filter((line) => line.trim().length > 0)
                        .map((line) => {
                            try {
                                return JSON.parse(line);
                            } catch (error) {
                                console.error('유효하지 않은 JSON:', line);
                                return null;
                            }
                        })
                        .filter((schedule) => schedule !== null);

                    setScheduleList(scheduleData);

                    const markedDatesData = {};
                    scheduleData.forEach((schedule) => {
                      if(schedule.date!=null){
                        const formattedDate = schedule.date.split('T')[0]; // "YYYY-MM-DD" 형식으로 변환
                        markedDatesData[formattedDate] = { marked: true, dotColor: 'red' };
                      }
                    });
                    setMarkedDates(markedDatesData);
                } else {
                    setScheduleList([]);
                    setMarkedDates({});
                }
            } catch (error) {
                console.error('일정 가져오기 오류:', error);
            }
        };

        fetchScheduleList();
    }, []);

    const getScheduleByDate = (date) => {
        return scheduleList.filter((schedule) => schedule.date && schedule.date.includes(date));
    };

    useEffect(() => {
        console.log(markedDates);
    }, [markedDates]);

    return (
        <View style={styles.container}>
            <View style={styles.calendarContainer}>
                <Calendar onDayPress={(day) => handleDateSelect(day.dateString)}
                    markedDates={{
                        ...markedDates,
                        [selectedDate]: {
                            ...markedDates[selectedDate],
                            selected: true,
                            selectedColor: 'rgba(0, 0, 0, 0.4)', // 선택한 날짜의 배경 색상
                            dotColor: 'red',
                            textColor: 'black', // 선택한 날짜의 텍스트 색상
                        },
                    }}
                />
            </View>
            <View style={styles.listContainer}>
                <Text style={styles.selectedDateText}>{selectedDate}</Text>
                {selectedDate && (
                    <ScrollView>
                        <View>
                            {getScheduleByDate(selectedDate).map((schedule, index) => (
                                <TouchableOpacity key={index} onPress={() => handleSchedulePress(schedule)}>
                                    <View style={styles.titleContainer}>
                                        <Text style={schedule.clear ? styles.crossedOutText : null}>{schedule.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
            {selectedSchedule && (
                <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} transparent={true}>
                    <View style={styles.modalBackContainer}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>{selectedSchedule.title}</Text>
                            <Text>{selectedSchedule.content}</Text>
                            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalCloseButtonText}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    calendarContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    selectedDateText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    crossedOutText: {
        textDecorationLine: 'line-through',
    },
    titleContainer: {
        width: 320,
        height: 40,
        backgroundColor: '#eeeeee',
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#eeeeee',
        justifyContent: 'center',
        marginBottom: 10,
        padding: 5,
    },
    modalBackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    modalCloseButton: {
        marginTop: 30,
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
    },
    modalCloseButtonText: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CalendarScreen;
