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
      Alert.alert('??????????????????????', '', [
        {
          stlye: 'cancel', //???????????? ???????????? ???????????? ?????? ????????? ????????? ??????
          text: '?????????',
        },
        {
          text: '???',
          onPress: () => removeTodo(todo.id), //cancel??? ??????????????? onPress ?????? ????????????
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
    flatList??? style??? flex: 1 ??? ???????????? ????????? ????????? ????????? ?????? ??????
    ????????? flex ????????? ???????????? ???????????? ??????.
    ?????? ?????? ????????? ???????????? y?????? ???????????? ????????? ???????????????
    */
    }
    setTimeout(() => {
      flatListRef.current?.scrollToEnd(); //?????????????????? setTimeout??? ???????????????
    }, 200); //200????????? ???????????????
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
    ???????????? ??????????????? ?????? ????????? ??????????????? ???????????? ????????? ?????? ????????? ????????????.
    TouchableOpacity?????? activeOpacity??? 1??? ???????????? ??????.

    <Pressable onPress={Keyboard.dismiss}>
    =
    <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
    
    TouchableOpacity?????? touch?????????(=active) opacity??? ??????????????? ??????????????? ?????? ?????????.
    ????????? ????????? ????????? ??????????????? ?????? ?????? ???????????????, activeOpacity??? 1??? ????????? ??? ??????.
    
    ++KeyboardAvoidingView ????????? ?????? ???????????? dismiss??????.
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
      KeyboardAvoidingView: ????????? ????????? ?????? ???????????? ??????????????? react-native ??????
      ????????? ???????????? ????????? ???????????? ????????? ??????. 
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
              flex: 1, //?????? ?????? scrollToEnd?????? ?????? ?????????
            }}
          />

          <AddTodoinput
            value={input}
            onChangeText={setInput}
            placeholder={`${dayjs(selectedDate).format('M.D')}??? ????????? ??????`}
            onPressAdd={onPressAdd}
            onSubmitEditing={onSubmitEditing}
            onFocus={onFocus}
          />
        </View>
      </KeyboardAvoidingView>

      {/* KeyboardAvoidingView ????????? ???????????? bottomSpace?????? ????????????
      ???????????? ???????????? bottomSpace?????? ??????????????? ??????. (????????? ?????? ??????)  */}
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
