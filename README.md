## 📆day.js

- 날짜를 좀더 쉽게 다를 수 있도록 해주는 패키지
- [day.js](https://github.com/iamkun/dayjs) 참조

```js
npm install dayjs --save
```

<br/>

## 🪄JSON Pretty Print

- [json formatter](https://jsonformatter.org/json-pretty-print)
- 콘솔창에서 json 자료를 보기 힘들때 여기 복붙해서 확인하면 좋다.

<br/>

## 💉날짜 선택하기

- [React Native DateTimePicker](https://github.com/react-native-datetimepicker/datetimepicker)
- [React Native Modal DateTimePicker](https://github.com/mmazzarolo/react-native-modal-datetime-picker)

<br/>

## 🧳Async Storage

- [Async Storage 설치 방법](https://docs.expo.dev/versions/latest/sdk/async-storage/)
- [Async Storage 사용 방법](https://react-native-async-storage.github.io/async-storage/docs/usage/)
- 어플을 삭제 후 재설치 하지 않는 한 데이터가 남아있도록 한다.
- 모든 데이터를 string으로만 저장할 수 있어 `JSON.stringify()` 시킨후 저장하고 `JSON.parse()`로 꺼내와야 한다.

```js
npx expo install @react-native-async-storage/async-storage
```
