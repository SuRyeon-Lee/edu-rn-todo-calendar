import dayjs from 'dayjs';
import { useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';

import {
  getCalendarColumns,
  statusBarHeight,
  bottomSpace,
  ITEM_WIDTH,
} from './src/util';
import { useCalendar } from './src/hook/use-calendar';
import { useTodoList } from './src/hook/use-todo-list';
import Calendar from './src/Calendar';
import Margin from './src/Margin';
import AddTodoinput from './src/AddTodoinput';

export default function App() {
  const now = dayjs();

  const {
    selectedDate,
    setSelectedDate,
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleConfirm,
    subtract1Month,
    add1Month,
  } = useCalendar(now);

  const {
    filteredTodoList,
    todoList,
    addTodo,
    removeTodo,
    toggleTodo,
    input,
    setInput,
    resetInput,
  } = useTodoList(selectedDate);

  const columns = getCalendarColumns(selectedDate);

  const flatListRef = useRef(null);

  const onPressLeftArrow = subtract1Month;
  const onPressHeaderDate = showDatePicker;
  const onPressRightArrow = add1Month;
  const onPressDate = setSelectedDate;

  const ListHeaderComponent = () => (
    <View>
      <Calendar
        columns={columns}
        todoList={todoList}
        selectedDate={selectedDate}
        onPressLeftArrow={onPressLeftArrow}
        onPressHeaderDate={onPressHeaderDate}
        onPressRightArrow={onPressRightArrow}
        onPressDate={onPressDate}
      />
      <Margin height={15} />

      <View
        style={{
          width: 4,
          height: 4,
          borderRadius: 4 / 2,
          backgroundColor: '#a3a3a3',
          alignSelf: 'center',
        }}
      ></View>
      <Margin height={15} />
    </View>
  );

  const renderItem = ({ item: todo }) => {
    const isSuccess = todo.isSuccess;
    const onPress = () => toggleTodo(todo.id);
    const onLongPress = () => {
      Alert.alert('삭제하겠습니까?', '', [
        {
          stlye: 'cancel', //스타일이 캔슬이면 자동으로 버튼 누르면 모달이 닫힘
          text: '아니오',
        },
        {
          text: '네',
          onPress: () => removeTodo(todo.id), //cancel이 아닌경우는 onPress 함수 정의하기
        },
      ]);
    };
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={{
          flexDirection: 'row',
          width: ITEM_WIDTH,
          alignSelf: 'center',
          paddingVertical: 10,
          paddingHorizontal: 5,
          borderBottomWidth: 0.2,
          borderBottomColor: '#a6a6a6',
        }}
      >
        <Text style={{ flex: 1, fontSize: 14, color: '#595959' }}>
          {todo.content}
        </Text>
        <Ionicons
          name="ios-checkmark"
          size={17}
          color={isSuccess ? '#595959' : '#bfbfbf'}
        />
      </Pressable>
    );
  };
  const scrollToEnd = () => {
    {
      /* 
    flatList의 style이 flex: 1 로 꽉차있지 않으면 스크롤 제어시 오류 생김
    그리고 flex 먹여도 완벽하게 해결되진 않음.
    가장 좋은 방법은 끝지점의 y값을 알아오고 거길로 보내주는것
    */
    }
    setTimeout(() => {
      flatListRef.current?.scrollToEnd(); //시간차있어서 setTimeout에 넣어줘야함
    }, 200); //200정도는 되야되는듯
  };

  const onPressAdd = () => {
    addTodo();
    resetInput();
    scrollToEnd();
  };

  const onSubmitEditing = () => {
    addTodo();
    resetInput();
    scrollToEnd();
  };

  const onFocus = () => {
    scrollToEnd();
  };

  {
    /*
    Pressable:
    키보드가 켜져있다면 다른 공간을 클릭했을때 자동으로 꺼지게 하는 범위를 감싸준다.
    TouchableOpacity에서 activeOpacity를 1로 해준것과 같음.

    <Pressable onPress={Keyboard.dismiss}>
    =
    <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
    
    TouchableOpacity에서 touch했을때(=active) opacity가 기본적으로 설정되었어 깜빡 거린다.
    하지만 터지는 되지만 터치됐다고 티는 내고 싶지않을떄, activeOpacity를 1로 설정할 수 있다.
    
    ++KeyboardAvoidingView 안쪽은 원래 자동으로 dismiss된다.
    */
  }
  return (
    <Pressable
      // onPress={() => {
      //   Keyboard.dismiss();
      // }}
      onPress={Keyboard.dismiss}
      style={styles.container}
    >
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1596367407372-96cb88503db6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      />

      {/* 
      KeyboardAvoidingView: 인풋창 올려도 화면 보이도록 보장해주는 react-native 기능
      내부는 컴포넌트 하나로 이루어져 있어야 한다. 
      */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View>
          <FlatList
            ref={flatListRef}
            data={filteredTodoList}
            contentContainerStyle={{ paddingTop: statusBarHeight + 30 }}
            ListHeaderComponent={ListHeaderComponent}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1, //요게 없음 scrollToEnd에서 오류 일으킴
            }}
          />

          <AddTodoinput
            value={input}
            onChangeText={setInput}
            placeholder={`${dayjs(selectedDate).format('M.D')}에 추가할 투두`}
            onPressAdd={onPressAdd}
            onSubmitEditing={onSubmitEditing}
            onFocus={onFocus}
          />
        </View>
      </KeyboardAvoidingView>

      {/* KeyboardAvoidingView 밖에서 인풋창을 bottomSpace만큼 띄워줘야
      키보드가 올라와도 bottomSpace만큼 떨어져있지 않다. (키보드 바로 위로)  */}
      <Margin height={bottomSpace} />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
