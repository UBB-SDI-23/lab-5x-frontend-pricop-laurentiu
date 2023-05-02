import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { User } from "./types";
import { useQuery, useQueryClient } from "react-query";
import { axios, handleError, updateAxiosWithToken } from "./axios";
import { AxiosError } from "axios";
import CookieManager from "./cookie-manager";

export const UserContext = createContext<{
  user?: User;
  isLoading: boolean;
  invalidate: () => void;
  logout: () => Promise<void>;
}>({
  user: undefined,
  isLoading: true,
  invalidate: () => {},
  logout: () => Promise.resolve(),
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | undefined>(["user", "me"], () =>
    axios
      .get("/user/me")
      .then(data => data.data)
      .catch(err => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 403) return;
        }
        handleError(err);
      })
  );

  const invalidate = () => {
    queryClient.invalidateQueries(["user", "me"]);
  };

  const ctx = {
    user,
    isLoading,
    invalidate,
    async logout() {
      CookieManager.unset("token");
      updateAxiosWithToken("");
      invalidate();
    },
  };
  return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>;
}
