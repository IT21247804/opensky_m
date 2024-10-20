import { colors } from "@/constants/colors"
import { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native"

interface AutoCompleteProps {
    collection: any[]
    placeholder?: string
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ collection, placeholder = "Auto Complete" }) => {

    const [searchQuery, setSearchQuery] = useState("")
    const [filtered, setFiltered] = useState<any[] | undefined>([])

    const handleSearch = (query: string) => {
        setSearchQuery(query.toUpperCase())

        setFiltered(
            query.trim() !== ""
                ? collection.filter(item =>
                    item.name.toLowerCase().includes(query.toLowerCase())
                )
                : []
        )
    }

    return (
        <SafeAreaView>
            <TextInput
                style={styles.textInput}
                placeholder={placeholder}
                clearButtonMode="always"
                value={searchQuery}
                onChangeText={(query) => handleSearch(query)}
            />

            {(filtered && filtered?.length > 0) ? <FlatList
                contentContainerStyle={styles.listContainer}
                horizontal={false}
                data={filtered}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.listItem}
                        key={index}
                        onPress={() => {
                            setSearchQuery(item.name.toUpperCase())
                            setFiltered([])
                        }}>
                        <Text>{item.name.toUpperCase()}</Text>
                    </TouchableOpacity>
                )} />
                :
                <></>
            }

        </SafeAreaView>
    )
}

export default AutoComplete

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: colors.gray,
        backgroundColor: colors.white
    },
    listContainer: {
        paddingVertical: 10,
        paddingHorizontal: 0,
        gap: 5,
    },
    listItem: {
        padding: 5,
        borderColor: colors.gray,
        borderWidth: 1,
        backgroundColor: colors.lightBlue,
        borderRadius: 5
    }
})