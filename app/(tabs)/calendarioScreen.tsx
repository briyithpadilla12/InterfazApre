import { StyleSheet, Text, View } from 'react-native';
import style from "../../src/components/Styles";

export default function CalendarioScreen() {
  return (
    <View style={style.container}>
      <Text style={style.title}>Calendario</Text>
    </View>
  );
}

const styles = StyleSheet.create({
 
  text: {
    color: '#0f0d0dff',
  },
});
