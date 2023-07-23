import { UserProps } from "@app/interfaces/users";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  refetchOnFocus: true, // when the window is refocused, refetch the data
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/v1",
    prepareHeaders: (headers) => {
      const token: string | null = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<UserProps[], null>({
      query: () => "/users",
    }),
    getUserById: builder.query<UserProps, { id: string }>({
      query: ({ id }) => `/users/${id}`,
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = userApi;