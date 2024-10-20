import { Ionicons } from "@expo/vector-icons"
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from "react-native"

import { colors } from "@/constants/colors"
import React, { useEffect, useState } from "react"

import { Product } from "@/schema/schema"
import { useDatabase } from "@/context/DatabaseProvider"

import { leadZeros, currencyFormat } from "@/utils/formaters"


const ProductItem = (props: any) => {
    return (
        <View style={styles.itemContainer} key={props.id}>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: colors.red }}>{`SKU - ${leadZeros(props.id, 10)}`}</Text>
                <Text style={{ color: colors.darkGray, fontWeight: "bold", fontSize: 20 }}>{props.productName}</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text>
                        {`Balance Qty. ${leadZeros((props.quantity - props.dispatched), 6)}`}
                    </Text>
                </View>
            </View>
            <View>
                <Text style={{ fontSize: 14 }}>{`Rs.`}</Text>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.blue }}>
                    {currencyFormat(props.price)}
                </Text>
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

    const [product, setProduct] = useState<string>("")
    const [products, setProducts] = useState<Product[]>([])

    const loadProducts = async () => {
        if (db) {
            const allRows: Product[] = await db.getAllAsync('SELECT * FROM products')
            setProducts(allRows)
        } else {
            console.log(`Database is not defined`)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [])

    const searchItems = () => {
        if (product.trim() === "") return
        console.log(`search item: ${product}`)
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={setProduct}
                    value={product}
                    placeholder="Product Name"
                    style={styles.textInput}
                />

                <TouchableOpacity
                    style={styles.newInvoiceButton}
                    onPress={searchItems}
                >
                    <Ionicons name='search-outline' size={32} color={colors.white} />
                </TouchableOpacity>

            </View>

            <FlatList
                horizontal={false}
                data={products}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item, index }) => (
                    <ProductItem
                        key={item.product_id}
                        id={item.product_id}
                        productName={item.name}
                        quantity={item.quantity}
                        dispatched={item.quantity_dispatched}
                        price={item.unit_price}
                    />
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
    newInvoiceButton: {
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