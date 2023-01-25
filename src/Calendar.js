import React from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import dayjs from 'dayjs';
import { SimpleLineIcons } from '@expo/vector-icons';

import { getDayColor, getDayText } from './util';

const columnSize = 35;

const Column = ({ text, color, opacity, disabled, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        width: columnSize,
        height: columnSize,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isSelected ? '#eaeaea' : 'transparent',
        borderRadius: columnSize / 2,
      }}
    >
      <Text style={{ color, opacity }}>{text}</Text>
    </TouchableOpacity>
  );
};

const ArrowButton = ({ iconName, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ paddingVertical: 20, paddingHorizontal: 15 }}
    >
      <SimpleLineIcons name={iconName} size={15} color="#404040" />
    </TouchableOpacity>
  );
};

export default ({
  columns,
  selectedDate,
  onPressLeftArrow,
  onPressRightArrow,
  onPressHeaderDate,
  onPressDate,
}) => {
  const ListHeaderComponent = () => {
    const currentDateText = dayjs(selectedDate).format('YYYY.MM.DD');

    return (
      <View>
        {/* < YYYY.MM.DD > */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ArrowButton iconName="arrow-left" onPress={onPressLeftArrow} />

          <TouchableOpacity onPress={onPressHeaderDate}>
            <Text style={{ fontSize: 20, color: '#404040' }}>
              {currentDateText}
            </Text>
          </TouchableOpacity>

          <ArrowButton iconName="arrow-right" onPress={onPressRightArrow} />
        </View>

        {/* 일 ~ 토 */}
        <View style={{ flexDirection: 'row' }}>
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            const dayText = getDayText(day);
            const color = getDayColor(day);
            return (
              <Column
                key={`day-${day}`}
                text={dayText}
                color={color}
                opacity={1}
                disabled={true}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const renderItem = ({ item: date }) => {
    const dateText = dayjs(date).get('date');
    const day = dayjs(date).get('day');
    const color = getDayColor(day);
    const isCurrentMonth = dayjs(date).isSame(selectedDate, 'month');
    const onPress = () => onPressDate(date);
    const isSelected = dayjs(date).isSame(selectedDate, 'date');

    return (
      <Column
        text={dateText}
        color={color}
        opacity={isCurrentMonth ? 1 : 0.4}
        onPress={onPress}
        isSelected={isSelected}
      />
    );
  };

  return (
    <FlatList
      data={columns}
      scrollEnabled={false}
      keyExtractor={(_, index) => `column-${index}`}
      renderItem={renderItem}
      numColumns={7}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};
