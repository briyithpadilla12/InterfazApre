import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { articulosViewModel } from "@/src/dependencias";
import { Articulo } from "@/src/models/articulo";
import Feather from '@expo/vector-icons/Feather';

export default function ArticuloDetalle() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const router = useRouter();
    const [articulo, setArticulo] = useState<Articulo | null>(null);

    const idValido = typeof id === "string" && id.trim() !== "";

    useEffect(() => {
        if (idValido) {
            articulosViewModel.obtenerArticuloPorId(id!).then(setArticulo);
        } else {
            router.replace("/(drawer)/(tabs)/homeScreen");
        }
    }, [id]);

    if (!idValido) {
        return null;
    }

    if (!articulo) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
                <Text>Cargando artículo...</Text>
            </View>
        );
    }
 
    return (
      
       <>
       
            <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
                {articulo.titulo}
            </Text>
            <Text style={{ fontSize: 16, lineHeight: 24 }}>
                {articulo.parrafos}
            </Text>

            <Link href={"/homeScreen"} style={{ alignSelf: "flex-end", margin: 20 }} asChild>

            <Feather name="arrow-left-circle" size={30} color="#085394"    />
            </Link>
            
        </ScrollView>
       </>
       
    );
}
