import { Modal, StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { useEffect, useState } from "react"
import { colors } from "@/constants/colors"
import { useDatabase } from "@/context/DatabaseProvider"
import { Customer, Product } from "@/schema/schema"
import { Picker } from "@react-native-picker/picker"
import { currencyFormat } from "@/utils/formaters"

const InvoiceLine = (props: any) => {
    return (
        <View style={styles.itemContainer} key={props.key}>
            <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.gray, paddingBottom: 5 }}>
                <Text style={{ flex: 1, color: colors.darkGray, fontWeight: "bold", fontSize: 20 }}>{props.productName}</Text>
                <View style={{ flex: 0 }}>
                    <TouchableOpacity
                        style={styles.removeItemButton}
                        onPress={props.removeItem}
                    >
                        <Ionicons name='trash-bin-outline' size={18} color={colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <Text>Qty.</Text>
                    <Text style={{ fontSize: 20 }}>{props.dispatched}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: "right" }}>Rate</Text>
                    <Text style={{ fontSize: 20, textAlign: "right" }}>{props.price}</Text>
                </View>
                <View style={{ flex: 3 }}>
                    <Text style={{ textAlign: "right" }}>&nbsp;</Text>
                    <Text style={{ fontSize: 20, textAlign: "right", fontWeight: "bold" }}>{currencyFormat(((props.dispatched) * props.price))}</Text>
                </View>
                <View style={{ flex: 1, borderStartColor: colors.darkGray, borderStartWidth: 1, marginStart: 5 }}>
                    <Text style={{ textAlign: "right" }}>Rtn.</Text>
                    <Text style={{ fontSize: 20, textAlign: "right", color: colors.red, fontWeight: "bold" }}>{props.returned}</Text>
                </View>
            </View>
        </View>
    )
}

const NewInvoice = (props: any) => {

    const db = useDatabase()

    const [invItems, setInvItems] = useState<Product[]>([])

    const [customer, setCustomer] = useState("")
    const [customers, setCustomers] = useState<Customer[]>([])

    const [product, setProduct] = useState("")
    const [products, setProducts] = useState<Product[]>([])

    const [dispatchQty, setDispatchQty] = useState<string>("")
    const [returnQty, setReturnQty] = useState<string>("")

    const loadCustomers = async () => {
        if (db) {
            setCustomers(await db.getAllAsync('SELECT * FROM customers'))
            setProducts(await db.getAllAsync('SELECT * FROM products'))
        } else {
            console.log(`Database is not defined`)
        }
    }

    const cancelInvoice = () => {
        console.log("Cancel invoice ...")
        props.cancelInvoice()
    }

    const addItem = () => {
        const item = products.filter((p) => p.product_id === parseInt(product))
        const cus = customers.find(c => c.customer_id === parseInt(customer))
        console.log(cus?.name, "|", item[0]?.name, "|", dispatchQty, "|", returnQty)

        if (item[0]) {
            setInvItems((prevItems) => {
                if (!prevItems.some((invItem) => invItem.product_id === item[0].product_id)) {
                    return [item[0], ...prevItems]
                }
                return prevItems
            })
        }
    }

    const removeItem = (itemId: number) => {
        const item = products.filter((p) => p.product_id === itemId)
        console.log("remove |", item[0]?.name, "|", dispatchQty, "|", returnQty)

        if (item[0]) {
            setInvItems((prevItems) => {
                return prevItems.filter((invItem) => invItem.product_id !== itemId)
            })
        }
    }

    const saveInvoice = () => {
        return false
    }

    useEffect(() => {
        loadCustomers()
    }, [])


    return (
        <Modal visible={props.showModal} animationType="slide">
            <View style={styles.container}>
                {/* SELECT CUSTOMER */}
                <View style={styles.inputContainer}>
                    <Text style={{ textTransform: "uppercase", fontWeight: "bold", color: colors.blue, paddingLeft: 10, fontSize: 20, borderBottomColor: colors.blue, borderBottomWidth: 1, marginBottom: 10 }}>New Invoice</Text>
                    <View style={[styles.pickerContainer, { marginTop: 0 }]}>
                        <Picker
                            selectedValue={customer}
                            onValueChange={(item, index) => {
                                setCustomer(item)
                            }}
                            style={styles.pickerInput}
                        >
                            <Picker.Item label="-- SELECT CUSTOMER --" value={`0`} style={{ color: colors.gray }} />
                            {
                                products?.length > 0 ?
                                    customers.map((item) => {
                                        return (
                                            <Picker.Item label={`${item.name?.toUpperCase()}`} value={`${item.customer_id}`} />
                                        )
                                    })
                                    :
                                    <Picker.Item enabled={false} label="-- NO PRODUCTS LISTED --" value={`0`} />
                            }
                        </Picker>
                    </View>
                </View>

                {/* ADD INVOICE ITEMS */}
                <View style={[styles.inputContainer, { borderColor: colors.gray, borderWidth: 1, backgroundColor: colors.lightBlue, padding: 10, borderRadius: 10, gap: 10 }]}>
                    <View style={[styles.pickerContainer, { marginTop: 0 }]}>
                        <Text style={{ textTransform: "uppercase", fontWeight: "bold", color: colors.darkGray, paddingLeft: 15 }}>Invoice Item:</Text>
                        <Picker
                            selectedValue={product}
                            onValueChange={(item, index) => {
                                setProduct(item)
                            }}
                            style={styles.pickerInput}
                        >
                            <Picker.Item label="-- SELECT INVOICE ITEM --" value={`SKU-0000000000`} style={{ color: colors.gray }} />
                            {
                                products?.length > 0 ?
                                    products.map((item) => {
                                        return (
                                            <Picker.Item label={`${item.name} | Rs.${currencyFormat(item.unit_price)}`} value={`${item.product_id}`} />
                                        )
                                    })
                                    :
                                    <Picker.Item enabled={false} label="-- NO PRODUCTS LISTED --" value={`SKU-0000000000`} />
                            }

                        </Picker>
                    </View>

                    <View style={{ flexDirection: "row", gap: 5 }}>
                        <TextInput
                            keyboardType="numeric"
                            style={[styles.textInput, { flex: 1 }]}
                            placeholder="Dispatch Quantity"
                            inputMode="decimal"
                            value={dispatchQty}
                            onChangeText={setDispatchQty}
                            selectTextOnFocus
                        />
                        <TextInput
                            keyboardType="numeric"
                            style={[styles.textInput, { flex: 1 }]}
                            placeholder="Return Quantity"
                            inputMode="decimal"
                            value={returnQty}
                            onChangeText={setReturnQty}
                            selectTextOnFocus
                        />
                        <TouchableOpacity
                            style={styles.addItemButton}
                            onPress={addItem}
                        >
                            <Ionicons name='add-outline' size={32} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* INVOICE ITEMS LIST */}
                <View style={[styles.invoiceBodyContainer]}>
                    {
                        invItems?.length > 0 ?
                            <FlatList
                                contentContainerStyle={styles.listContainer}
                                data={invItems}
                                keyExtractor={(item) => `INV-${item.product_id}`}
                                renderItem={({ item, index }) => (
                                    <InvoiceLine
                                        key={item.product_id}
                                        productName={item.name}

                                        price={item.unit_price}
                                        dispatched={20}
                                        returned={10}

                                        removeItem={() => removeItem(item.product_id)}
                                    />
                                )}
                            />
                            :
                            <Text style={{ color: colors.gray, fontSize: 20, textTransform: "uppercase", padding: 5, textAlign: "center" }}>--- No Items Added yet ---</Text>
                    }
                </View>

                {/* SAVE AND CANCEL BUTTONS */}
                <View style={[styles.inputContainer, { flexGrow: 1, justifyContent: "flex-end" }]}>
                    <View style={{ flexDirection: "row-reverse", gap: 5 }}>
                        <TouchableOpacity
                            style={[styles.addItemButton, { padding: 10, paddingRight: 20 }]}
                            onPress={saveInvoice}
                        >
                            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                <Ionicons name='save-outline' size={32} color={colors.white} />
                                <Text style={{ color: colors.white, fontSize: 18, textTransform: "uppercase" }}>Create</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.addItemButton, { padding: 10, paddingRight: 20, backgroundColor: colors.darkGray }]}
                            onPress={cancelInvoice}
                        >
                            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                <Ionicons name='arrow-undo-outline' size={32} color={colors.white} />
                                <Text style={{ color: colors.white, fontSize: 18, textTransform: "uppercase" }}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default NewInvoice

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 10
    },
    inputContainer: {
        gap: 5,
        paddingVertical: 10
    },
    addItemButton: {
        justifyContent: "center",
        backgroundColor: colors.blue,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: colors.white,
    },
    textInput: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: colors.gray,
        backgroundColor: colors.white
    },
    invoiceBodyContainer: {
        gap: 5,
        paddingVertical: 10
    },
    itemContainer: {
        // flex: 1,
        gap: 10,
        flexDirection: 'column',
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
    removeItemButton: {
        justifyContent: "center",
        backgroundColor: colors.red,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: colors.white,
    },
    listContainer: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 10,
        padding: 10,
        gap: 10,
    },
    pickerInput: {
        borderBlockColor: colors.darkGray,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: colors.white
    },
    pickerContainer: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.gray,
        backgroundColor: colors.white,
        padding: 5,
    },
})


/**
 * const handleSearch = (query: string, isBackspace: boolean = false) => {
        if (isBackspace) setSearchQuery(query.toLocaleUpperCase())
        else {
            var cus = customers.filter(customer => customer.name.toLowerCase().includes(query.toLocaleLowerCase()))

            if (cus.length === 1) {
                console.log(cus[0])
                setSearchQuery(cus[0].name.toUpperCase())
            } else {
                setSearchQuery(query.toLocaleUpperCase())
            }
        }
    }

    const handleKeyPress = ({ nativeEvent }: any) => {

        if (nativeEvent.key === 'Backspace') {
            // Handle backspace
            setSearchQuery(prevQuery => prevQuery.slice(0, -1))
        } else if (nativeEvent.key.length === 1) {
            // Handle regular character input (not control keys)
            setSearchQuery(prevQuery => prevQuery + nativeEvent.key)
            var cus = customers.filter(customer => customer.name.toLowerCase().includes((searchQuery).toLocaleLowerCase()))
            if (cus.length === 1) {
                console.log(cus[0])
                setSearchQuery(cus[0].name.toUpperCase())
            }
        }
    }
 */