import { colors } from "@/constants/colors"
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer"
import { useRouter } from "expo-router"
import { Image, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const CustomDrawerContent = (props: any) => {

    const router = useRouter()
    const { top, bottom } = useSafeAreaInsets()

    return (
        <View style={styles.container}>
            <DrawerContentScrollView
                {...props}
                scrollEnabled={false}
                contentContainerStyle={{ backgroundColor: colors.white }}
            >
                <View style={styles.drawerHeader}>
                    <Image
                        source={require("../assets/splash.png")}
                        style={styles.image}
                    />
                </View>
                <DrawerItemList {...props} />
                {/* <DrawerItem label={"Logout"} onPress={() => router.replace('/')} /> */}
            </DrawerContentScrollView>

            {/* drawer footer */}
            <View style={[styles.drawerFooter, { paddingBottom: (20 + bottom) }]}>
                <Text style={{ textTransform: "uppercase", fontWeight: "bold", color: colors.darkGray }}>{`© Cipher Labz (Pvt) Ltd`}</Text>
                <Text style={{ color: colors.gray }}>{`www.cipherlabz.com`}</Text>
            </View>
        </View>
    )
}

export default CustomDrawerContent

const styles = StyleSheet.create({
    drawerFooter: {
        borderTopColor: colors.gray,
        borderTopWidth: 1,
        padding: 20,
        alignItems: "center",
    },
    drawerHeader: {
        borderBottomColor: colors.gray,
        borderBottomWidth: 2,
        paddingBottom: 10,
        marginBottom: 20,
    },
    container: {
        flex: 1,
        paddingTop: 20
    },
    image: {
        width: 'auto',
        height: 50,
        backgroundColor: colors.white,
    },
})