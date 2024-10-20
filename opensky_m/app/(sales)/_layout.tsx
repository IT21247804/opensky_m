import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons'
import { colors } from "@/constants/colors";

const Page = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveBackgroundColor: colors.blue,
                tabBarActiveTintColor: colors.white,
            }}
        >

            <Tabs.Screen
                name="invoices"
                options={{
                    tabBarLabel: 'Invoices',
                    tabBarIcon: ({ color, size }) => <Ionicons name='documents-outline' size={size} color={color} />,
                    // tabBarBadge: 3
                }}
            />

            <Tabs.Screen
                name="items"
                options={{
                    tabBarLabel: 'Poducts',
                    tabBarIcon: ({ color, size }) => <Ionicons name='cube-outline' size={size} color={color} />,
                    // tabBarBadge: 3
                }}
            />

            <Tabs.Screen
                name="customers"
                options={{
                    tabBarLabel: 'Customers',
                    tabBarIcon: ({ color, size }) => <Ionicons name='people-outline' size={size} color={color} />,
                }}
            />
        </Tabs>
    )
}

export default Page