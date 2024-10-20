import 'react-native-gesture-handler'
import { Drawer } from "expo-router/drawer"
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import CustomDrawerContent from '@/components/CustomDrawerContent'
import { colors } from '@/constants/colors'
import { DatabaseProvider } from '@/context/DatabaseProvider'

const DrawerLayout = () => {

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <DatabaseProvider>
                <Drawer
                    drawerContent={CustomDrawerContent}
                    screenOptions={{
                        drawerHideStatusBarOnOpen: false,
                        drawerActiveBackgroundColor: colors.blue,
                        drawerActiveTintColor: colors.white,
                        drawerLabelStyle: { marginLeft: -20 }
                    }}
                >
                    {/* name=<name of the page> drawerLable=<lable in the drawer> title=<page title> */}
                    <Drawer.Screen
                        name="index"
                        options={{
                            drawerLabel: 'Home',
                            title: 'Generate Tickets',
                            drawerIcon: ({ size, color }) => (<Ionicons name='home-outline' size={size} color={color} />)
                        }}
                    />
                    <Drawer.Screen
                        name="index_01"
                        options={{
                            drawerItemStyle: { display: 'none' },
                            drawerLabel: 'Home',
                            title: 'Home',
                            drawerIcon: ({ size, color }) => (<Ionicons name='home-outline' size={size} color={color} />)
                        }}
                    />
                    <Drawer.Screen
                        name="tickets"
                        options={{
                            drawerLabel: 'Tickets',
                            title: 'Parking Tickets',
                            drawerIcon: ({ size, color }) => (<Ionicons name='qr-code-outline' size={size} color={color} />)
                        }}
                    />
                    <Drawer.Screen
                        name="(sales)"
                        options={{
                            drawerItemStyle: { display: 'none' },
                            drawerLabel: 'Sales',
                            title: 'Sales',
                            drawerIcon: ({ size, color }) => (<Ionicons name='cash-outline' size={size} color={color} />)
                        }}
                    />
                </Drawer>
            </DatabaseProvider>
        </GestureHandlerRootView>
    )
}

export default DrawerLayout