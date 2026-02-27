import { StyleSheet, Text, View } from 'react-native';
import style from "@/src/components/Styles";
export default function DiarioScreen() {
  return (
    <View style={style.container}>
      <Text style={style.title}>Diario</Text>
    </View>
  );
}

const styles = StyleSheet.create({
 
  text: {
    color: '#0f0d0dff',
  },
});
