import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { articulosViewModel } from "@/src/dependencias";
import { Articulo } from "@/src/models/articulo";

export default function ArticuloDetalle() {
    const { id } = useLocalSearchParams();
    const [articulo, setArticulo] = useState<Articulo | null>(null);
    

    useEffect(() => {
        if (typeof id === "string") {
            articulosViewModel.obtenerArticuloPorId(id).then(setArticulo);
        }
    }, [id]);

    if (!articulo) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
                <Text>Cargando artículo...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
                {articulo.titulo}
            </Text>
            <Text style={{ fontSize: 16, lineHeight: 24 }}>
                {articulo.parrafos}
            </Text>
        </ScrollView>
    );
}
