import {apiSlice} from "./apiSlice.js";
import { CHATBOT_URL } from "../constants.js";

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: (data) => ({
                url: `${CHATBOT_URL}`,
                method: 'POST',
                body: data
            })
        })
    })
})

export const {useSendMessageMutation} = chatApiSlice