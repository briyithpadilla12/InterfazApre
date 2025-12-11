import { StyleSheet, Text, View } from 'react-native';
import style from "../../src/components/Styles";

export default function NotificacionScreen() {
  return (
    <View style={style.container}>
      <Text style={style.title}>Notificaciones</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  
  text: {
    color: '#0f0d0dff',
  },
});
