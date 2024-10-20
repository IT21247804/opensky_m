import { Ionicons } from "@expo/vector-icons"
import { FlatList, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, TextInput } from "react-native"
import React, { useEffect, useState } from "react"


import { colors } from "@/constants/colors"
import { ParkingTicket } from "@/schema/schema"
import { useDatabase } from "@/context/DatabaseProvider"
import { currencyFormat, leadZeros } from "@/utils/formaters"


const TicketItem = (props: any) => {
    return (
        <View key={props.id} style={styles.ticketItem}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ color: colors.darkGray, fontSize: 20 }}>{props.timestamp}</Text>
                    {/* <Text style={{ textTransform: "uppercase", fontSize: 20, fontWeight: "bold" }}>{`TKT - ${leadZeros(props.id, 10)}`}</Text> */}
                    <Text style={{ color: colors.darkGray, fontSize: 20, fontWeight: "bold" }}>{`Rs. ${props.amount}`}</Text>
                </View>
                <Text style={{ textTransform: "uppercase", fontSize: 16, color: colors.red }}>{props.tktRef}</Text>
                {/* <Text style={{ marginBottom: 10, color: colors.darkGray, fontSize: 20 }}>{props.timestamp}</Text> */}
            </View>
        </View>
    )
}

interface Total {
    total: number
}

const Page: React.FC = () => {
    const [dayTotal, setDayTotal] = useState<Total | undefined>(undefined)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [tickets, setTickets] = useState<ParkingTicket[]>([])

    const db = useDatabase()

    const loadTickets = async () => {
        if (db) {
            // DELETE OLD TICKETS
            await db.execAsync("DELETE FROM parking_ticket WHERE DATE(ticket_time) != DATE('now');")

            // LOAD TODAY TICKETS
            setTickets(await db.getAllAsync("SELECT * FROM parking_ticket WHERE DATE(ticket_time) = DATE('now') ORDER BY transaction_id DESC LIMIT '100'"))
            setDayTotal(await db.getFirstAsync("SELECT SUM(amount) AS total FROM parking_ticket WHERE DATE(ticket_time) = DATE('now')") || undefined)
            // console.log(dayTotal?.total ?? 0)
        } else {
            console.log(`Database is not defined`)
        }
    }

    const handleSearchTickets = () => {
        console.log(searchQuery)
        // need to handle search tickets depend on search query
    }

    useEffect(() => {
        loadTickets()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.inputContainer, { backgroundColor: colors.gray, alignItems: "center" }]}>
                {/* <TextInput
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    placeholder="Search"
                    style={styles.textInput}
                    clearButtonMode="always"
                /> */}

                <Text style={{ fontWeight: "bold", fontSize: 22, textTransform: "uppercase" }}>Total:</Text>
                <Text style={{ fontWeight: "bold", fontSize: 22, textTransform: "uppercase", marginStart: "auto" }}>{`Rs. ${currencyFormat((dayTotal?.total ?? 0))}`}</Text>
                <TouchableOpacity
                    style={[styles.searchTicketButton, { paddingVertical: 15 }]}
                    onPress={loadTickets}
                >
                    <Ionicons name='reload-outline' size={24} color={colors.white} />
                </TouchableOpacity>
            </View>

            <FlatList
                horizontal={false}
                data={tickets}
                contentContainerStyle={styles.listContainer}
                onScrollBeginDrag={loadTickets}
                onScrollEndDrag={loadTickets}
                renderItem={({ item, index }) => (
                    <TicketItem
                        key={index}
                        id={item.transaction_id}
                        tktRef={`${item.ticket_id}  -  ${item.ticket_ref?.toUpperCase().replaceAll(" ", "") || ""}`}
                        amount={currencyFormat(item.amount)}
                        timestamp={item.ticket_time} />
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
        padding: 10,
        borderRadius: 10,
    },
    searchTicketButton: {
        justifyContent: "center",
        backgroundColor: colors.red,
        borderRadius: 10,
        paddingHorizontal: 15,
        color: colors.white,
    },
    ticketItem: {
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