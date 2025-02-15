import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";
import { updateCategory } from "../../../../backend/controllers/categoryController";

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query: (data) => ({
                url: `${CATEGORY_URL}`,
                method: "POST",
                body: data,
            }),
        }),
        getAllCategories: builder.query({
            query: () => ({
                url: `${CATEGORY_URL}/categories`,
                method: "GET",
            }),
        }),
        getCategoryById: builder.query({
            query: (categoryId) => ({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: "GET",
            }),
        }),
        updateCategory : builder.mutation({
            query: ({categoryId, data}) => ({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: "PUT",
                body: data,
            }),
        }),
        deleteCategory : builder.mutation({
            query: (categoryId) => ({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const { useCreateCategoryMutation, useGetAllCategoriesQuery, useGetCategoryByIdQuery, useUpdateCategoryMutation, useDeleteCategoryMutation } = categoryApiSlice;