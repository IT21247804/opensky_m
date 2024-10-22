import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { TextInput, View, StyleSheet } from 'react-native';
import { colors } from "@/constants/colors";

// Forward the ref and use PropTypes for prop validation
const InputComponent = forwardRef(({ generatedTime, setReference }, ref) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                ref={ref} // Use the forwarded ref
                value={generatedTime}
                style={[styles.textInput, { textAlign: "center", fontSize: 28, color: colors.darkGray }]}
                placeholder="Generated Time"
                editable={false} // Set editable to false instead of readOnly
            />
            <TextInput
                style={[styles.textInput, { textAlign: "center", fontSize: 22, borderColor: colors.blue, backgroundColor: colors.lightBlue }]}
                placeholder="(OPTIONAL) REFERENCE"
                onChangeText={setReference}
                clearTextOnFocus={true}
            />
        </View>
    );
});

// Define prop types for validation
InputComponent.propTypes = {
    generatedTime: PropTypes.string.isRequired,
    setReference: PropTypes.func.isRequired,
};

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
