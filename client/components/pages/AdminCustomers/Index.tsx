"use client";

import { useCallback, useEffect, useState } from "react";
import { User } from "@/types/api";
import { useUsers } from "@/hooks/useUsers";
import AdminDeleteModal from "@/components/pages/admin/AdminDeleteModal";
import CustomersHeader from "./CustomersHeader";
import CustomerStatsCards from "./CustomerStatsCards";
import CustomersTable from "./CustomersTable";
import CustomerModal from "./CustomerModal";

export default function AdminCustomers() {
  const {
    users,
    userStats,
    pagination,
    isLoading,
    fetchUsers,
    fetchUserStats,
    updateUser,
    deleteUser,
  } = useUsers();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);

  const [activeUser, setActiveUser] = useState<{
    user: User;
    mode: "details" | "edit";
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id?: string;
    name?: string;
  }>({ open: false });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const loadUsers = useCallback(() => {
    fetchUsers({
      page,
      limit: 10,
      role: "customer",
      search: debouncedSearch,
      is_active: activeFilter === "" ? undefined : activeFilter === "true",
    });
  }, [fetchUsers, page, debouncedSearch, activeFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deleteUser(deleteConfirm.id);
      setDeleteConfirm({ open: false });
      loadUsers();
      fetchUserStats();
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-8">
      <CustomersHeader stats={userStats} />
      <CustomerStatsCards stats={userStats} />
      <CustomersTable
        users={users}
        isLoading={isLoading}
        search={search}
        activeFilter={activeFilter}
        page={pagination.page}
        totalPages={pagination.total_pages}
        total={pagination.total}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        onActiveFilterChange={(v) => { setActiveFilter(v); setPage(1); }}
        onViewDetails={(u) => setActiveUser({ user: u, mode: "details" })}
        onEdit={(u) => setActiveUser({ user: u, mode: "edit" })}
        onDelete={(id, name) => setDeleteConfirm({ open: true, id, name })}
        onPageChange={setPage}
      />

      {activeUser && (
        <CustomerModal
          user={activeUser.user}
          initialMode={activeUser.mode}
          onClose={() => setActiveUser(null)}
          onUpdate={updateUser}
          onSaved={() => {
            setActiveUser(null);
            loadUsers();
            fetchUserStats();
          }}
        />
      )}

      {deleteConfirm.open && (
        <AdminDeleteModal
          itemName={deleteConfirm.name}
          description="Tài khoản và dữ liệu liên quan sẽ bị xóa vĩnh viễn."
          onCancel={() => setDeleteConfirm({ open: false })}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
