import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";

async function fetchUser(): Promise<User | null> {
  const response = await fetch("/api/auth/user", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

interface AdminStatus {
  isAdmin: boolean;
  noAdmins: boolean;
}

async function fetchAdminStatus(): Promise<AdminStatus> {
  const response = await fetch("/api/auth/admin", {
    credentials: "include",
  });

  if (!response.ok) {
    return { isAdmin: false, noAdmins: false };
  }

  return response.json();
}

async function logout(): Promise<void> {
  window.location.href = "/api/logout";
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: adminStatus, isLoading: isAdminLoading } = useQuery<AdminStatus>({
    queryKey: ["/api/auth/admin"],
    queryFn: fetchAdminStatus,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.setQueryData(["/api/auth/admin"], { isAdmin: false, noAdmins: false });
    },
  });

  return {
    user,
    isLoading: isLoading || isAdminLoading,
    isAuthenticated: !!user,
    isAdmin: !!adminStatus?.isAdmin,
    noAdmins: !!adminStatus?.noAdmins,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
