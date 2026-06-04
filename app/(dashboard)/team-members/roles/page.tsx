"use client";
import Button from "@/components/button";
import { Input } from "@/components/inputs";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AddRoleForm from "./add-role";
import { useGetRoles } from "@/hooks/roles/getRole";
import { useGetPermissions } from "@/hooks/roles/getPermission";
import { useSuspendRole } from "@/hooks/roles/suspendRole";
import { useActiveRole } from "@/hooks/roles/activateRole";
import { notify } from "@/utils/toastStore";
import { useDeleteRole } from "@/hooks/roles/deleteRole";
import { permissionOptions } from "@/utils/utils";

const Roles = () => {
  const [openAddRole, setOpenAddRole] = useState(false);
  const [openEditRole, setOpenEditRole] = useState(false);
  // const [openDelete, setOpenDelete] = useState(false);
  // @ts-expect-error i will work on this later
  const [selectedRole, setSelectedRole] = useState<Roles | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const itemsPerPage = 10;

  const { data: permissionData } = useGetPermissions();
  console.log(permissionData?.data);
  const { data: roleData, isLoading } = useGetRoles();
  const roles = (roleData?.data ?? []).map((role) => ({
    ...role,
    id: role.role_id,
  }));

  const suspendRoleMutation = useSuspendRole();
  const activateRoleMutation = useActiveRole();
  const deleteRoleMutation = useDeleteRole();

  const handleOpenAddRole = () => {
    setOpenAddRole(true);
  };

  const handleCloseAddRole = () => {
    setOpenAddRole(false);
  };
  // @ts-expect-error i will work on this later
  const handleOpenEditRole = (role: Roles) => {
    setSelectedRole(role);
    setOpenEditRole(true);
  };

  const handleCloseEditRole = () => {
    setOpenEditRole(false);
    setSelectedRole(null);
  };

  // const handleOpenDeleteRole = (role: Roles) => {
  //   setSelectedRole(role);
  //   setOpenDelete(true);
  // };
  // const handleCloseDeleteRole = () => {
  //   setSelectedRole(null);

  //   setOpenDelete(false);
  // };
  // @ts-expect-error i will work on this later
  const handleDeleteConfirm = (role: Roles) => {
    setSelectedRole(role);
    notify({
      type: "danger",
      title: "Delete Role",
      message:
        "Are you sure you want to delete this role. Please note that this action is non-reversible.",
      onConfirm: () => deleteRoleMutation.mutate(role.role_id), // ✅ .mutate()
      confirmText: "Yes, Delete",
      cancelText: "No, Cancel",
    });
  };

  const columns = [
    {
      header: "Name",
      // @ts-expect-error i will work on this later
      accessor: "name" as keyof Roles,
    },
    {
      header: "Status",
      // @ts-expect-error i will work on this later
      accessor: "status" as keyof Roles,
      // @ts-expect-error i will work on this later
      render: (row: Roles) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.is_active === true
              ? "bg-success-100 text-success-600"
              : "bg-error-100 text-error-600"
          }`}
        >
          {row.is_active === true ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Description",
      // @ts-expect-error i will work on this later
      accessor: "description" as keyof Roles,
    },
    {
      header: "Actions",
      // @ts-expect-error i will work on this later
      accessor: "role_id" as keyof Roles,
      sortable: false,
      // @ts-expect-error i will work on this later
      render: (row: Roles) => (
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={row.is_active === true}
              onChange={() => {
                if (row.is_active === true) {
                  suspendRoleMutation.mutate(row.role_id);
                } else {
                  activateRoleMutation.mutate(row.role_id);
                }
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-800"></div>
          </label>

          <div
            className="text-brand-600 text-sm font-bold cursor-pointer"
            onClick={() => handleOpenEditRole(row)}
          >
            Edit
          </div>
          <div
            className="text-error-600 text-sm font-bold cursor-pointer"
            onClick={() => handleDeleteConfirm(row)}
          >
            Delete
          </div>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(roles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = roles.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    // if (checked) {
    //   setSelectedRows(paginatedData.map((row) => row.id));
    // } else {
    //   setSelectedRows([]);
    // }
    console.log(checked);
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <h1 className="text-grey-800 text-2xl font-bold font-figtree">Roles</h1>

        <Button
          hierarchy="primary"
          leftIcon={<PlusIcon size={16} />}
          onClick={handleOpenAddRole}
        >
          Create Role
        </Button>
      </div>

      <div>
        <div className="border border-grey-200 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Items per page dropdown */}
                <select
                  value={itemsPerPage}
                  onChange={() => {
                    setCurrentPage(1);
                  }}
                  className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800  px-3 py-4 text-sm"
                >
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                {/* Bulk Actions dropdown */}
                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={() => {
                      setCurrentPage(1);
                    }}
                    className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800  px-3 py-4 text-sm cursor-pointer"
                  >
                    <option value="">Bulk Action</option>
                    <option value="delete">Bulk Delete</option>
                    <option value="suspend">Bulk Suspend</option>
                  </select>
                </div>

                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                >
                  Apply
                </Button>
              </div>

              {/* Search */}
              <div className="flex items-center space-x-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={20} color="#667085" />}
                  name="search"
                  placeholder="search"
                  size="md"
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          <Table
            // @ts-expect-error i will work on this later
            columns={columns}
            data={paginatedData}
            selectable={true}
            selectedRows={selectedRows}
            //@ts-expect-error hhh
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={roles.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* {openDelete && (
        <Modal
          isOpen={openDelete}
          onClose={handleCloseDeleteRole}
          type="danger"
          title="Delete Role"
          message="Are you sure you want to delete this role. Please note that this action is non-reversible."
          onConfirm={() => handleDelete()}
          autoClose={false}
        />
      )} */}

      {/* Create Role Modal */}
      {openAddRole && (
        <AddRoleForm
          isOpen={openAddRole}
          onClose={handleCloseAddRole}
          mode="create"
        />
      )}

      {/* Edit Role Modal */}
      {openEditRole && selectedRole && (
        <AddRoleForm
          isOpen={openEditRole}
          onClose={handleCloseEditRole}
          mode="edit"
          editData={{
            id: selectedRole.role_id,
            roleName: selectedRole.name,
            description: selectedRole.description,
            permissions: selectedRole.permissions.reduce(
              (
                acc: Record<string, string[]>,
                perm: { name: string; actions: string[] },
              ) => {
                acc[perm.name] = perm.actions.includes("ALL")
                  ? [...permissionOptions]
                  : perm.actions.map(
                      (action) =>
                        action.charAt(0).toUpperCase() +
                        action.slice(1).toLowerCase(),
                    );
                return acc;
              },
              {},
            ),
          }}
        />
      )}
    </div>
  );
};

export default Roles;
