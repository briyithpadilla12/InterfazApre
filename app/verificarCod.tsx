import { useEnviarCodViewModel } from "@/src/viewModels/enviarCodViewModels";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";


export default function VerificarCodigo() {

    const { numeroDocumento } = useLocalSearchParams<{ numeroDocumento: string }>();
    const { Confirmar, error, exito, cargando,
        cargandoReenvio, errorReenvio, exitoReenvio, Reenviar,  resetExito  } = useEnviarCodViewModel();

    
    const [codigo, setCodigo] = useState("");

    const confirmar = async () => {
        await Confirmar({
            aprendizId: numeroDocumento,
            codigo: codigo.trim()
        });
    };

    useEffect(() => {
        if (exito) {
            const timer = setTimeout(() => {
                router.replace("/");
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [exito]);

    const reenviar = async () => {
        await Reenviar(numeroDocumento);

        if(exito){
           resetExito()
        }
    };

    return (
        <View style={styles.contenedor}>

            <View style={styles.card}>

                <Text style={styles.titulo}>Verificación de cuenta</Text>

                <Text style={styles.descripcion}>
                    Ingrese el código que fue enviado a su correo electrónico para activar su cuenta.
                </Text>

                <TextInput
                    style={styles.input}
                    value={codigo}
                    onChangeText={setCodigo}
                    keyboardType="numeric"
                    placeholder="Ingrese el código"
                    placeholderTextColor="#888"
                />

                <Pressable
                    style={[styles.boton, cargando && styles.botonDeshabilitado]}
                    onPress={confirmar}
                    disabled={cargando}
                >
                    {cargando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.textoBoton}>Verificar</Text>
                    )}
                </Pressable>

                {error && <Text style={styles.error}>{error}</Text>}
                {exito && <Text style={styles.exito}>Cuenta verificada correctamente</Text>}


                <View style={{ height: 20 }} />

                <Pressable
                    onPress={reenviar}
                    disabled={cargandoReenvio}
                >
                    {cargandoReenvio ? (
                        <ActivityIndicator />
                    ) : (
                        <Text style={styles.reenviarTexto}>
                            ¿No recibiste el código? Reenviar
                        </Text>
                    )}
                </Pressable>



              


                {exitoReenvio && <Text style={styles.exito}>Código reenviado correctamente</Text>}


                {errorReenvio && (
                    <Text style={styles.error}>{errorReenvio}</Text>
                )}

            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    contenedor: {
        flex: 1,
        backgroundColor: "#f4f6f8",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    card: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 24,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },

    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "#222",
    },

    descripcion: {
        fontSize: 14,
        color: "#555",
        marginBottom: 20,
        textAlign: "center",
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 20,
    },

    boton: {
        backgroundColor: "#085394",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    botonDeshabilitado: {
        backgroundColor: "#9bbce5",
    },

    textoBoton: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

    error: {
        color: "#d9534f",
        marginTop: 15,
        textAlign: "center",
        fontSize: 14,
    },

    exito: {
        color: "#28a745",
        marginTop: 15,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "500",
    },

    reenviarTexto: {
        marginTop: 15,
        textAlign: "center",
        color: "#085394",
        fontWeight: "500",
    },
});