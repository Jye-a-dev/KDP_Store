"use client";

import { useCallback, useEffect, useState } from "react";
import { User } from "@/types/api";
import { useUsers } from "@/hooks/useUsers";
import AdminDeleteModal from "@/components/pages/admin/AdminDeleteModal";
import AdminsHeader from "./AdminsHeader";
import AdminStatsCards from "./AdminStatsCards";
import AdminsTable from "./AdminsTable";
import CustomerModal from "../AdminCustomers/CustomerModal";

export default function AdminAdmins() {
  const {
    users,
    userStats,
    pagination,
    isLoading,
    fetchUsers,
    fetchUserStats,
    updateUser,
    deleteUser,
    createUser,
  } = useUsers();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);

  const [activeUser, setActiveUser] = useState<{
    user?: User;
    mode: "details" | "edit" | "create";
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
      role: "admin",
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
      <AdminsHeader stats={userStats} onAddClick={() => setActiveUser({ mode: "create" })} />
      <AdminStatsCards stats={userStats} />
      <AdminsTable
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
          onCreate={createUser}
          defaultRole="admin"
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
          description="Tài khoản admin này sẽ bị xóa vĩnh viễn khỏi hệ thống."
          onCancel={() => setDeleteConfirm({ open: false })}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
