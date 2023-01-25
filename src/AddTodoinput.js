import React from 'react';
import { AntDesign } from '@expo/vector-icons';

import { TextInput, TouchableOpacity, View } from 'react-native';
import { ITEM_WIDTH } from './util';

export default ({ value, onChangeText, placeholder, onPressAdd }) => {
  return (
    <View
      style={{
        width: ITEM_WIDTH,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
      }}
    >
      {/* ios 시뮬레이터에서 키보드 띄우기: cmd + shift + k */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={{ flex: 1, padding: 5, color: '#595959' }}
      />
      <TouchableOpacity onPress={onPressAdd} style={{ padding: 5 }}>
        <AntDesign name="plus" size={10} color="#595959" />
      </TouchableOpacity>
    </View>
  );
};
