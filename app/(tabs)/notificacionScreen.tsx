import { Text, View, StyleSheet } from 'react-native';
import style from "../Styles";

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
