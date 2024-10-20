import { StyleSheet, Text, SafeAreaView } from "react-native"
import * as Device from 'expo-device';
import { colors } from "@/constants/colors"
import { ScrollView } from "react-native-gesture-handler"

const Page = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* <Text>Home</Text> */}
                <Text>
                    {Device.manufacturer}: {Device.modelName} :  {Device.deviceYearClass}
                </Text>
                <Text>
                    {Device.osName}
                </Text>
                <Text>
                    {Device.osVersion}
                </Text>
                <Text>
                    {Device.osInternalBuildId}
                </Text>
                <Text>
                    {Device.deviceName}
                </Text>
                <Text>
                    {Device.productName}
                </Text>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})