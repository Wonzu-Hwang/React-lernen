///completed: !newTodos[key].completed 이거 궁금합니다..

import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./color";
import { Fontisto, Entypo } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [todoText, setTodoText] = useState("");
  const [toDos, setTodos] = useState("Loading....");

  ///Loading Datas
  useEffect(() => {
    loadTodos();
    loadWorking();
  }, []);

  ///select mode
  const travel = () => {
    setWorking(false);
    const saveWork = false;
    saveWorking(saveWork);
  };
  const work = () => {
    setWorking(true);
    const saveWork = true;
    saveWorking(saveWork);
  };

  const onChangeText = event => setTodoText(event);

  ///Saving List
  const saveTodos = async toSave => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {}
  };

  ///Remembering which tap was used last time
  const saveWorking = async event => {
    try {
      await AsyncStorage.setItem("@working", event.toString());
    } catch (e) {
      console.log("error from saveWorking", e);
    }
  };
  const loadWorking = async () => {
    try {
      const workingValue = await AsyncStorage.getItem("@working");
      return workingValue === "true" ? setWorking(true) : setWorking(false);
    } catch (e) {
      console.log("error from loadWorking");
    }
  };

  ///loading the list
  const loadTodos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    return s != null ? setTodos(JSON.parse(s)) : null;
  };

  ///Adding new thing to the ordinary List
  const addTodo = async () => {
    if (todoText === "") {
      return;
    }
    const newTodos = Object.assign({}, toDos, {
      [Date.now()]: { todoText, working },
    });
    ///만일 Object.assign이 어렵다면
    ///const newTodos = {...toDos, [Date.now()]: {todoText, work:working}}
    setTodos(newTodos);
    setTodoText("");
    await saveTodos(newTodos);
  };

  ///Deleting what the user chose
  const deleteTodo = async key => {
    if (Platform.OS === "web") {
      const ok = confirm("Do you want to delete this Todo?");
      if (ok) {
        const newTodos = { ...toDos }; ///web에서도 구동이 되도록 하는 if구문 2개
        delete newTodos[key];
        setTodos(newTodos);
        await saveTodos(newTodos);
      }
    } else {
      Alert.alert("Delete To do?", "Are you sure?", [
        {
          text: "Yes,please",
          style: "destructive",
          onPress: async () => {
            const newTodos = { ...toDos }; ///toDos의 내용을 건든다는 의미로...를 붙임 아주 중요
            delete newTodos[key];
            setTodos(newTodos);
            await saveTodos(newTodos);
          },
        },
        { text: "Cancel" },
      ]);
    }
  };

  ///Making a complete Icon
  const completeTodo = async key => {
    const newTodos = { ...toDos };
    newTodos[key] = { ...newTodos[key], completed: !newTodos[key].completed };
    setTodos(newTodos);
    saveTodos(newTodos);
    console.log(newTodos[key]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        returnKeyType="done"
        onSubmitEditing={addTodo}
        onChangeText={onChangeText}
        keyboardType="email-address"
        placeholder={working ? "Add a To-Do" : "Wo gehst du gerne?"}
        style={styles.input}
        value={todoText}
      />
      <ScrollView>
        {Object.keys(toDos).map(key =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <TouchableOpacity onPress={() => completeTodo(key)}>
                {toDos[key].completed ? (
                  <Entypo name="check" size={24} color="black" />
                ) : (
                  <Entypo name="check" size={24} color="white" />
                )}
              </TouchableOpacity>
              <Text
                style={{
                  ...styles.todoText,
                  textDecorationLine: toDos[key].completed
                    ? "line-through"
                    : "none",
                  color: toDos[key].completed ? theme.grey : "white",
                }}
              >
                {toDos[key].todoText}
              </Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto name="trash" size={18} color={theme.white} />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    fontSize: 18,
    marginVertical: 20,
  },
  toDo: {
    backgroundColor: theme.todoBg,
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
});
