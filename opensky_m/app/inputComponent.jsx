//inputComponent.tsx
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { TextInput, View, StyleSheet } from 'react-native';
import { colors } from "@/constants/colors";

// Forward the ref and use PropTypes for prop validation
const InputComponent = forwardRef(({ generatedTime, setReference }, ref) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                value={generatedTime}
                style={[styles.textInput, { textAlign: "center", fontSize: 28, color: colors.darkGray }]}
                placeholder="Generated Time"
                editable={false}
            />
            <TextInput
                ref={ref}  // Make sure the ref is forwarded to the reference field
                onChangeText={setReference}  // Update the reference state
                style={[styles.textInput, { textAlign: "center", fontSize: 22, borderColor: colors.blue, backgroundColor: colors.lightBlue }]}
                placeholder="Enter reference"
            />
        </View>
    );
});

InputComponent.propTypes = {
    generatedTime: PropTypes.string.isRequired,
    setReference: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 10,
    },
    textInput: {
        borderColor: colors.gray,
        borderWidth: 1,
        height: 50,
        padding: 10,
        borderRadius: 10,
    },
});

export default InputComponent;
