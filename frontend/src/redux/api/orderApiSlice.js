import {apiSlice} from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({ 
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: order
            }),
        }),
        getPayPalClientId: builder.query({ 
            query: () => ({
                url: PAYPAL_URL
            })
        }),
        getOrderDetails: builder.query({ 
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`
            }),
        }),
        payOrder: builder.mutation({ 
            query: ({orderId, details}) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: details
            }),            
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT',
            }),       
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/mine`,
            }),
            keepUnusedDataFor: 5
        }),
        getOrders : builder.query({
            query: () => ({
                url: ORDERS_URL,
            }),
        }),
        getTotalOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/total-orders`,
            })
        }),
        getTotalSales: builder.query({ 
            query: () => ({
                url: `${ORDERS_URL}/total-sales`,
            })
        }),
        getTotalSalesByDate: builder.query({ 
            query: () => ({
                url: `${ORDERS_URL}/total-sales-by-date`,
            })
        }),
    })
})

export const {
    useCreateOrderMutation,
    useGetPayPalClientIdQuery,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useDeliverOrderMutation,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    // ------------------------ for dashboard
    useGetTotalOrdersQuery,
    useGetTotalSalesQuery,
    useGetTotalSalesByDateQuery
} = orderApiSlice