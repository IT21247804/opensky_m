export interface Customer {
    customer_id: number
    name: string
    email: string,
    phone: string,
    address: string
}

export interface Product {
    product_id: number
    name: string
    description: string
    unit_price: number
    quantity: number
    quantity_dispatched: number
}

export interface Invoice {
    invoice_id: number
    customer_id: number
    invoice_date: number    // converted as timestamp
    total_amount: number
    status: string
}

export interface InvoiceItem {
    item_id: number
    invoice_id: number
    product_id: number
    description: string
    quantity: number
    unit_price: number
    line_total: number
}

export interface Transaction {
    transaction_id: number
    invoice_id: number
    transaction_date: number // converted as timestamp
    amount: number
    transaction_type: string
}

export interface ParkingTicket {
    transaction_id: number
    ticket_id: string
    ticket_time: string
    ticket_ref: string
    amount: number
}