// ActionComponent.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

const ActionComponent = ({ busy, onPress }) => {
    return (
        <View style={styles.actionContainer}>
            <TouchableOpacity
                disabled={busy}
                onPress={onPress}
                style={styles.printButton}
            >
                <View style={{ flexDirection: "row", gap: 20, padding: 20, justifyContent: "center" }}>
                    <Ionicons
                        color={colors.white}
                        name={busy ? 'ban-outline' : 'print-outline'}
                        size={36}
                    />
                    <Text style={{ fontSize: 24, color: colors.white }}>{busy ? "Printing ..." : "Print Token"}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    actionContainer: {
        width: "100%",
        paddingHorizontal: 20,
    },
    printButton: {
        justifyContent: "center",
        backgroundColor: colors.red,
        borderRadius: 10,
        color: colors.white,
    },
});

export default ActionComponent;
