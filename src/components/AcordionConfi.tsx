import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Collapsible from "react-native-collapsible";
import Feather from "@expo/vector-icons/Feather";

interface Props {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export default function Accordion({ title, icon, children }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <View >

            <TouchableOpacity
                style={styles.header}
                onPress={() => setOpen(!open)}
                activeOpacity={0.7}
            >
                <View style={styles.titleContainer}>
                    {icon}
                    <Text style={styles.title}>{title}</Text>
                </View>

                <Feather
                    name={open ? "chevron-up" : "chevron-down"}
                    size={22}
                    color="#333"
                />
            </TouchableOpacity>


            <Collapsible collapsed={!open}>
                <View style={styles.content}>{children}</View>
            </Collapsible>
        </View>
    );
}

const styles = StyleSheet.create({

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    title: {
        fontSize: 16,
        color: "#000",
    },
    arrow: {
        fontSize: 16,
        color: "#333",
    },
    content: {
        paddingVertical: 8,
        paddingLeft: 5,
        gap: 6,
    },
});
