import { Text, View, TouchableOpacity, StyleSheet, ToastAndroid,Vibration } from 'react-native'
import * as FileSystem from 'expo-file-system';

const clearApp = async () => {
    try {
        const cacheUri = FileSystem.documentDirectory + 'cache.txt';
        await FileSystem.writeAsStringAsync(cacheUri, '');
        console.log('앱 초기화 완료');
        Vibration.vibrate(400);
        ToastAndroid.show('일정이 모두 초기화되었습니다.', ToastAndroid.SHORT);
    } catch (error) {
        console.error('작업 저장 중 오류가 발생했습니다.', error);
    }
};


const Home = (props) => {
  const startVibration = () => {
    Vibration.vibrate(100); // 100밀리초 동안 진동 울리기
  };
    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}></View>
            <View style={styles.titleContainer}>
                <Text style={{
                    fontSize: 35,
                    color: 'white',
                    fontWeight: 'bold',
                    margin: 10,
                }}>
                    Do My List
                </Text>
            </View>
            <View style={{ flex: 1 }}></View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("List")}
                >
                    <Text style={{
                        fontSize: 30,
                        color: 'black',
                        fontWeight: 'bold',
                        margin: 10,
                    }}>
                        일정 관리하기
                    </Text>
                </TouchableOpacity>
                <Text>  </Text>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("CalendarScreen")}
                >
                    <Text style={{
                        fontSize: 30,
                        color: 'black',
                        fontWeight: 'bold',
                        margin: 10,
                    }}>
                        캘린더 확인
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.resetContainer}>
                <TouchableOpacity
                    onPressIn={startVibration}
                    delayLongPress={2000}
                    onLongPress={clearApp}
                >
                    <Text style={{
                        fontSize: 20,
                        color: 'black',
                        fontWeight: 'bold',
                        margin: 10,
                    }}>
                        일정 초기화
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 15,
        borderWidth: 3,
        margin: 10,
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        margin: 10,
        borderRadius: 50,

    },
    buttonContainer: {
        flex: 3.6,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        margin: 10,
    },
    resetContainer: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        margin: 10,
        padding: 10,
    },
})

export default Home