import React, { forwardRef } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { colors } from "@/constants/colors";

const InputComponent = forwardRef(({ generatedTime, setReference }, ref) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                ref={ref}
                readOnly
                value={generatedTime}
                style={[styles.textInput, { textAlign: "center", fontSize: 28, color: colors.darkGray }]}
                placeholder="Generated Time"
                focusable
            />
            <TextInput
                value={ref.current} // Use ref.current to get the value
                style={[styles.textInput, { textAlign: "center", fontSize: 22, borderColor: colors.blue, backgroundColor: colors.lightBlue }]}
                placeholder="(OPTIONAL) REFERENCE"
                onChangeText={setReference}
                clearTextOnFocus={true}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    textInput: {
        borderColor: colors.gray,
        borderWidth: 1,
        height: 50,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
});

export default InputComponent;
