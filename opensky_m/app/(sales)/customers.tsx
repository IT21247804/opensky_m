import { Ionicons } from "@expo/vector-icons"
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from "react-native"

import { colors } from "@/constants/colors"
import React, { useEffect, useState } from "react"

import { Customer } from "@/schema/schema"
import { useDatabase } from "@/context/DatabaseProvider"

import { leadZeros } from "../../utils/formaters"

const CustomerItem = (props: any) => {
    return (
        <View style={styles.itemContainer} key={props.id}>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: colors.red }}>{`CUS - ${leadZeros(props.id, 10)}`}</Text>
                <Text style={{ color: colors.darkGray, fontWeight: "bold", fontSize: 20 }}>{props.customerName}</Text>
            </View>
            <View>
                <TouchableOpacity
                    style={styles.updateCustomerButton}
                    onPress={props.updateInvoice}
                >
                    <Ionicons name='open-outline' size={18} color={colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}


const Page: React.FC = () => {
    const db = useDatabase()

    const [customer, setCustomer] = useState<string>("")
    const [customers, setCustomers] = useState<Customer[]>([])

    const loadCustomers = async () => {
        if (db) {
            const allRows: Customer[] = await db.getAllAsync('SELECT * FROM customers')
            setCustomers(allRows)
        } else {
            console.log(`Database is not defined`)
        }
    }

    useEffect(() => {
        loadCustomers()
    }, [])

    const searchCustomer = () => {
        if (customer.trim() === "") return
        console.log(`search customer: ${customer}`)
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={setCustomer}
                    value={customer}
                    placeholder="Customer Name"
                    style={styles.textInput}
                />

                <TouchableOpacity
                    style={styles.newCustomerButton}
                    onPress={searchCustomer}
                >
                    <Ionicons name='search-outline' size={32} color={colors.white} />
                </TouchableOpacity>

            </View>

            <FlatList
                horizontal={false}
                data={customers}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item, index }) => (
                    <CustomerItem id={item.customer_id} customerName={item.name} />
                )}
            />
        </SafeAreaView >
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 5,
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomColor: colors.darkGray,
        gap: 10,
        backgroundColor: '#fff'
    },
    textInput: {
        flex: 1,
        borderColor: colors.gray,
        borderWidth: 1,
        height: 50,
        padding: 10,
        borderRadius: 10,
    },
    newCustomerButton: {
        justifyContent: "center",
        backgroundColor: colors.blue,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: colors.white,
    },
    itemContainer: {
        flex: 1,
        gap: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.gray,
        padding: 10,
        borderRadius: 5,
        backgroundColor: colors.white
    },
    updateCustomerButton: {
        justifyContent: "center",
        backgroundColor: colors.darkGray,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: colors.white,
    },
})