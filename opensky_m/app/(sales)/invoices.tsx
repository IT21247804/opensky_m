import { Ionicons } from "@expo/vector-icons"
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, Alert } from "react-native"

import { colors } from "@/constants/colors"
import React, { useEffect, useState } from "react"
import NewInvoice from "@/components/InvoiceModal"

import { currencyFormat, leadZeros } from "../../utils/formaters"

import { Invoice } from "@/schema/schema"
import { useDatabase } from "../../context/DatabaseProvider"

const InvoiceItem = (props: any) => {
    return (
        <View key={props.id} style={styles.invoiceItem}>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: colors.red }}>{`INV - ${leadZeros(props.id, 10)}`}</Text>
                <Text style={{ marginBottom: 10, color: colors.gray }}>{`${new Date().toDateString()} ${new Date().toLocaleTimeString()}`}</Text>
                <Text style={{ color: colors.blue, fontSize: 20, fontWeight: "bold" }}>{`Rs. ${props.amount}`}</Text>
                <Text style={{ textTransform: "uppercase", color: colors.darkGray }}>{props.customerName}</Text>
            </View>
            <View>
                <TouchableOpacity
                    style={styles.updateInvoiceButton}
                    onPress={props.updateInvoice}
                >
                    <Ionicons name='open-outline' size={18} color={colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const Page: React.FC = () => {
    const [customer, setCustomer] = useState<string>("")
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)

    const db = useDatabase()

    const loadInvoices = async () => {
        if (db) {
            const allRows: Invoice[] = await db.getAllAsync('SELECT * FROM invoice_master')
            setInvoices(allRows)
        } else {
            console.log(`Database is not defined`)
        }
    }

    useEffect(() => {
        loadInvoices()
    }, [])

    const showNewInvoiceWindow = () => {
        // if (customer.trim() === "") {
        //     Alert.alert("New Invoice", "Customer is required to create a new invoice!")
        //     return
        // }
        // console.log(`creating new invoice for: ${customer}`)
        setShowModal(true)
    }

    const hideNewInvoiceWindow = () => {
        setShowModal(false)
        setCustomer("")
    }

    return (
        <SafeAreaView style={styles.container}>
            <NewInvoice customerName={customer} showModal={showModal} cancelInvoice={hideNewInvoiceWindow} />
            <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={setCustomer}
                    value={customer}
                    placeholder="Customer | Invoice Number"
                    style={styles.textInput}
                    clearButtonMode="always"
                />

                <TouchableOpacity
                    style={styles.newInvoiceButton}
                    onPress={showNewInvoiceWindow}
                >
                    <Ionicons name='search-outline' size={24} color={colors.white} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.newInvoiceButton}
                    onPress={showNewInvoiceWindow}
                >
                    <Ionicons name='add-outline' size={24} color={colors.white} />
                </TouchableOpacity>
            </View>

            <FlatList
                horizontal={false}
                data={invoices}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item, index }) => (
                    <InvoiceItem key={index} id={item.invoice_id} customerName={item.status} amount={currencyFormat(item.total_amount)} />
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
        gap: 10,
        backgroundColor: '#fff'
    },
    textInput: {
        flex: 1,
        borderColor: colors.gray,
        borderWidth: 1,
        // height: 50,
        padding: 10,
        borderRadius: 10,
    },
    newInvoiceButton: {
        justifyContent: "center",
        backgroundColor: colors.blue,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: colors.white,
    },
    updateInvoiceButton: {
        justifyContent: "center",
        backgroundColor: colors.darkGray,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: colors.white,
    },
    removeInvoiceButton: {
        justifyContent: "center",
        backgroundColor: colors.red,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    invoiceItem: {
        flex: 1,
        gap: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.gray,
        padding: 10,
        borderRadius: 5,
        backgroundColor: colors.white
    }
})