import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid, SafeAreaView, Platform, Share } from "react-native"

import * as FileSystem from 'expo-file-system'

import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/colors"
import { useDatabase } from "@/context/DatabaseProvider"
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { ScrollView } from "react-native-gesture-handler"
import AsyncStorage from '@react-native-async-storage/async-storage'

import { params } from "@/constants/system"

import * as Print from 'expo-print'

import { thilakawardena_logo_long } from "@/constants/images"

import { currencyFormat } from "@/utils/formaters"
import { useEffect, useState } from "react"
import { Keyboard } from 'react-native'


const FormattedTimeNow = (timeZone = 'UTC') => {
    const now = new Date()
    const zonedTime = toZonedTime(now, timeZone)

    return format(zonedTime, 'yyyy-MM-dd HH:mm:ss')
}

const CurrentTime = (timeZone = 'UTC') => {
    const now = new Date()
    const zonedTime = toZonedTime(now, timeZone)
    const timestamp = zonedTime.getTime()
    const formattedTime = format(zonedTime, 'yyyy-MM-dd HH:mm:ss')

    return { timestamp, formattedTime }
}

const Page = () => {
    const db = useDatabase()

    const [generatedTime, setGeneratedTime] = useState(FormattedTimeNow("Asia/Colombo"))
    const [ref, setReference] = useState("")
    const [busy, setBusy] = useState(false)

    useEffect(() => {

        const timer = setInterval(() => {
            setGeneratedTime(FormattedTimeNow("Asia/Colombo"))
        }, 1000)

        return (() => clearInterval(timer))

    }, [])

    // Utility function to fetch and return barcode as base64
    const BarcodeBase64 = async (value: string, type: string = 'code128') => {
        try {
            // API URL to generate the barcode
            const url = `https://bwipjs-api.metafloor.com/?bcid=${type}&text=${value}&scale=3&includetext&guardwhitespace`

            // Fetch the barcode image
            const response = await FileSystem.downloadAsync(url, `${FileSystem.documentDirectory}barcode.png`)

            // Read the file and convert it to base64
            const base64 = await FileSystem.readAsStringAsync(response.uri, { encoding: FileSystem.EncodingType.Base64 })

            return `data:image/png;base64,${base64}`
        } catch (error) {
            console.error('Error fetching barcode:', error)
            return undefined
        }
    }


    // NEW ONE PRESS FUNCTION TO CREATE PARKING TOKEN
    const GenerateParkingToken = async () => {

        Keyboard.dismiss();
        // HOLD NEW PRINT REQUEST UNTIL FINISHES THE LAST
        setBusy(true)

        const key = Date.now()
        const { timestamp, formattedTime } = CurrentTime("Asia/Colombo")
        const barcodeData = await BarcodeBase64(`${timestamp}`)

        // UPDATE DISPLAY
        // setGeneratedTime(formattedTime)
        // setQrValue(`${timestamp}`)

        await PrintToken({ barCodeValue: `${timestamp}`, generatedTime: formattedTime, barcodeImage: barcodeData })
    }

    const saveFile = async (uri: string, filename: string, mimetype: string): Promise<void> => {
        try {
          if (Platform.OS === 'android') {
            let directoryUri = await AsyncStorage.getItem('directoryUri');
      
            // If no directory is stored, request permission and store the chosen directory
            if (!directoryUri) {
              const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
              if (permissions.granted) {
                directoryUri = permissions.directoryUri;
                await AsyncStorage.setItem('directoryUri', directoryUri); // Store the directory URI
              } else {
                await Share.share({ url: uri, title: 'Share PDF' });
                return; // If permissions are not granted, share the PDF
              }
            }
      
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      
            // Save the file to the chosen/stored directory
            await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, filename, mimetype)
              .then(async (fileUri) => {
                await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
                console.log(`File saved to: ${fileUri}`);
                Alert.alert('Success', `PDF saved to: ${fileUri}`);
              })
              .catch((e) => console.log(`Error creating file: ${e}`));
          } else {
            // Fallback for iOS
            await Share.share({ url: uri, title: 'Share PDF' });
          }
        } catch (error) {
          console.error('Error saving file:', error);
        }
      };
      

    const PrintToken = async ({ barCodeValue, generatedTime, barcodeImage }: { barCodeValue: string, generatedTime: string, barcodeImage: string | undefined }) => {
        try {
            const html = `<html>
                            <head>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                <style>
                                    body {
                                        font-family: monospace;
                                        text-align: center;
                                        margin: 0;
                                        padding: 0;
                                        width: 100vw;
                                        white-space: nowrap;
                                    }
                                    h2 { font-size: 18px; margin: 10px 0; }
                                    .content { font-size: 12px; margin: 10px 0; }
                                    .separator { font-size: 20px; margin: 5px 0; }
                                    .bc-container { width: 100vw; display: block; margin: 0 auto 10px; }
                                    p { font-size: 12px; margin: 0 0 10px; white-space: normal; }
                                </style>
                            </head>
                          <body>
                            <img src="${thilakawardena_logo_long}" width="350" style="margin-bottom: 10px;" />
                            <div class="separator" style="font-weight: bold">PARKING TOKEN</div>
                            <div style="font-size: 22px; margin-bottom: 10px;">${generatedTime}</div>
                            <div style="font-size: 32px; margin-bottom: 5px;">${barCodeValue.toUpperCase()}</div>
                            <div class="bc-container">
                              <img src="${barcodeImage}" width="320"/>
                            </div>
                            <p>&nbsp;</p>
                            <div class="content">
                              <span style="font-size: 32px; font-weight: bold">Rs. ${currencyFormat(params.tktValue)}</span><br/>
                              <span style="font-size: 16px;">Please submit this token </span><br/>
                              <span style="font-size: 16px;">to the cashier for refund</span><br/>
                              <span style="font-size: 20px; margin-top:10px;">PARKING AT YOUR OWN RISK</span><br/>
                            </div>
                            <div class="separator">*********************************</div>
                          </body>
                        </html>`;
            
            // Generate the PDF
            const pdfUri = await Print.printToFileAsync({ html });
            
            // Save the PDF without previewing
            await saveFile(pdfUri.uri, `ParkingToken_${generatedTime}.pdf`, 'application/pdf');
            
            // Perform other tasks (e.g., updating API, showing a toast)
            await ParkingEntryRecord({ barCodeValue, generatedTime });
            await UpdateAPI({ barCodeValue, generatedTime });
            
            ToastAndroid.show(`Parking Ticket Created !! ${generatedTime}`, ToastAndroid.SHORT);
            
            // Reset and ready for next token
            setReference('');
            setBusy(false);
            
          } catch (error) {
            Alert.alert("Print Error", `Failed to print parking ticket. \n ${error}`);
          }
    }

    const ParkingEntryRecord = async ({ ...props }) => {
        console.log(`${props.generatedTime} [${props.barCodeValue}]: ${(params.tktValue).toFixed(2)}`)
        if (db) {
            const statement = await db.prepareAsync("INSERT INTO parking_ticket (ticket_id, ticket_time, ticket_ref, amount) VALUES ($ticket_id, $ticket_time, $ticket_ref, $amount);")
            try {
                let result = await statement.executeAsync({ $ticket_id: props.barCodeValue, $ticket_time: props.generatedTime, $ticket_ref: (ref.trim() === "" ? null : ref), $amount: (params.tktValue).toFixed(2) })
                 console.log(`${props.generatedTime} [${props.qrValue}]: Cashbook entry posted -> REC# ${result.lastInsertRowId} -> AFFECTED ${result.changes} ROWS ${(params.tktValue).toFixed(2)}`)
            } finally {
                await statement.finalizeAsync()
            }
        } else {
            ToastAndroid.show(`Database as not been initialized`, ToastAndroid.LONG)
        }
    }

    const UpdateAPI = async ({ ...props }) => {
        try {
            const response = await fetch('https://ttl.biscare.live/api/services/app/parkingAreaTicket/CreateParkingAreaTicket', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "deviceId": params.deviceId,
                    "paidAmount": params.tktValue,
                    "issuedTime": props.generatedTime,
                    "vehicleBarCode": props.barCodeValue,
                    "referenceNumber": ref,
                }),
            })

            const json = await response.json()
            // console.log("****************************: response message", json)
            // Alert.alert("NEW TICKET PUSHED\n", `ID: ${qrValue},\n${json.result.message}`)
            if (json.result.isSuccess === true) ToastAndroid.show(`TICKET UPDATED !!\n${json.result.message}`, ToastAndroid.SHORT)

        } catch (error) {
            Alert.alert("Push API Error", `Failed to update API.\n${error}`)
        }
    }
    const shouldSetResponse = () => true;
const onRelease = () => (
  Keyboard.dismiss()
);

    return (
        <SafeAreaView style={styles.container}>
              <View
    onResponderRelease={ onRelease }
    onStartShouldSetResponder={ shouldSetResponse }
    style={ { height: '100%',width: "100%" } }
  >
            <View style={{ width: "100%", gap: 10, marginBottom: 10, paddingHorizontal: 20 }}>
                <TextInput
                    readOnly
                    value={generatedTime}
                    style={[styles.textInput, { width: "100%", textAlign: "center", fontSize: 28, color: colors.darkGray, borderColor: colors.white, marginBottom: 25 }]}
                    placeholder="Generated Time"
                    focusable
                />
                <TextInput
                    readOnly={busy}
                    value={ref}
                    style={[styles.textInput, { width: "100%", textAlign: "center", fontSize: 22, borderColor: colors.blue, backgroundColor: colors.lightBlue }]}
                    placeholder="(OPTIONAL) REFERENCE"
                    onChangeText={setReference}
                    clearTextOnFocus={true}
                />

            </View>
            
            <ScrollView style={{ width: "100%" }}>
                {/* <View style={styles.barcodeContainer}> */}
                {/* <Barcode value={qrValue.toUpperCase()} onBase64Generated={onBarcodeData} /> */}
                {/* <QRCode
                        value={`ID#:${qrValue}, TIME:${generatedTime}, REF:${ref.trim() === "" ? "NOT-DEFINED" : ref}`}
                        size={350}
                        logo={require("../assets/images/thilakawardana_square.jpg")}
                        getRef={(c: any) => (svgRef.current = c)}
                    /> */}
                {/* </View> */}

                <View style={{ width: "100%", paddingHorizontal: 20, marginTop: 10, gap: 10 }}
                
                
                >
                    <TouchableOpacity

                        disabled={busy}

                        // onPress={PrintQR}
                        onPress={GenerateParkingToken}
                        style={[styles.printButton]}
                    >
                        <View style={{ flexDirection: "row", gap: 20, padding: 20, justifyContent: "center" }}>
                            <Ionicons
                                color={colors.white}
                                name={(busy) ? 'ban-outline' : 'print-outline'}
                                size={36}
                            />
                            <Text style={{ fontSize: 24, color: colors.white }}>{busy ? "Printing ..." : "Print Token"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        // flex: 1,
        // justifyContent: "center",
        alignItems: "center"
    },
    regenerateButton: {
        justifyContent: "center",
        backgroundColor: colors.blue,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: colors.white,
    },
    printButton: {
        justifyContent: "center",
        backgroundColor: colors.red,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: colors.white,
    },
    textInput: {
        borderColor: colors.gray,
        borderWidth: 1,
        height: 50,
        padding: 10,
        borderRadius: 10,
    },
    barcodeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})