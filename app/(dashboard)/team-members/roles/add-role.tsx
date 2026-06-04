"use client";
import { Input } from "@/components/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormModal from "@/components/modal";
import z from "zod";
import { FloppyDiskIcon, PlusIcon, UserIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useAddRole } from "@/hooks/roles/addRole";
import { useEditRole } from "@/hooks/roles/editRole";
import { notify } from "@/utils/toastStore";

const permissionOptions = [
  "All",
  "Index",
  "Create",
  "Read",
  "Update",
  "Delete",
] as const;

const permissionCategories = [
  "Roles",
  "Team Members",
  "Tickets",
  "Operators",
  "Operator Documents",
  "Services",
  "Features",
  "SOS",
  "Lost Items",
  "Operator Reviews",
  "Customers",
] as const;

const AddRolesSchema = z.object({
  roleName: z.string().min(1, { message: "Please enter role name" }),
  permissions: z.record(z.string(), z.array(z.string())),
  description: z.string().min(1, { message: "please enter description" }),
});

type AddRolesProps = z.infer<typeof AddRolesSchema>;

interface RoleData {
  id?: string;
  roleName: string;
  permissions: Record<string, string[]>;
  description: string;
}

interface AddRoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: RoleData | null;
  mode?: "create" | "edit";
}

const AddRoleForm = ({
  isOpen,
  onClose,
  editData = null,
  mode = "create",
}: AddRoleFormProps) => {
  const addRoleMutation = useAddRole();
  const editRoleMutation = useEditRole();
  const isLoading = addRoleMutation.isPending || editRoleMutation.isPending;

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddRolesProps>({
    resolver: zodResolver(AddRolesSchema),
    defaultValues: {
      roleName: editData?.roleName || "",
      description: editData?.description || "",
      permissions:
        editData?.permissions ||
        permissionCategories.reduce(
          (acc, category) => {
            acc[category] = [];
            return acc;
          },
          {} as Record<string, string[]>,
        ),
    },
  });

  useEffect(() => {
    if (editData) {
      setValue("roleName", editData.roleName);
      setValue("permissions", editData.permissions);
      setValue("description", editData.description);
    } else {
      reset({
        roleName: "",
        permissions: permissionCategories.reduce(
          (acc, category) => {
            acc[category] = [];
            return acc;
          },
          {} as Record<string, string[]>,
        ),
      });
    }
  }, [editData, setValue, reset]);

  const permissions = watch("permissions") as Record<string, string[]>;

  const handlePermissionToggle = (category: string, permission: string) => {
    const currentPermissions = permissions[category] || [];

    if (permission === "All") {
      if (currentPermissions.includes("All")) {
        setValue("permissions", {
          ...permissions,
          [category]: [],
        });
      } else {
        setValue("permissions", {
          ...permissions,
          [category]: [...permissionOptions],
        });
      }
    } else {
      const withoutAll = currentPermissions.filter((p) => p !== "All");

      if (currentPermissions.includes(permission)) {
        setValue("permissions", {
          ...permissions,
          [category]: withoutAll.filter((p) => p !== permission),
        });
      } else {
        const newPermissions = [...withoutAll, permission];
        const specificPermissions = permissionOptions.filter(
          (p) => p !== "All",
        );

        if (specificPermissions.every((p) => newPermissions.includes(p))) {
          setValue("permissions", {
            ...permissions,
            [category]: [...permissionOptions],
          });
        } else {
          setValue("permissions", {
            ...permissions,
            [category]: newPermissions,
          });
        }
      }
    }
  };

  const areAllPermissionsSelected = () => {
    return permissionCategories.every(
      (category) => permissions[category]?.length === permissionOptions.length,
    );
  };

  const handleSelectAllPermissionsToggle = () => {
    if (areAllPermissionsSelected()) {
      const emptyPermissions = permissionCategories.reduce(
        (acc, category) => {
          acc[category] = [];
          return acc;
        },
        {} as Record<string, string[]>,
      );
      setValue("permissions", emptyPermissions);
    } else {
      const allPermissions = permissionCategories.reduce(
        (acc, category) => {
          acc[category] = [...permissionOptions];
          return acc;
        },
        {} as Record<string, string[]>,
      );
      setValue("permissions", allPermissions);
    }
  };

  const isPermissionChecked = (category: string, permission: string) => {
    return permissions[category]?.includes(permission) || false;
  };

  const handleSaveAddRole = async (data: AddRolesProps) => {
    // ✅ transform permissions to API format
    const transformedPermissions = Object.entries(data.permissions)
      .filter(([, actions]) => actions.length > 0) // ✅ only include categories with permissions
      .map(([name, actions]) => ({
        permission_slug: name.toLowerCase().replace(/\s+/g, "_"), // ✅ e.g. "Team Members" -> "team_members"
        actions: actions
          .filter((action) => action !== "All") // ✅ remove "All" meta option
          .map((action) => action.toUpperCase()), // ✅ e.g. "Create" -> "CREATE"
      }));

    const payload = {
      name: data.roleName,
      description: data.description,
      permissions: transformedPermissions,
      ...(mode === "create" && {
        slug: data.roleName.toLowerCase().replace(/\s+/g, "_"), // ✅ e.g. "Operations Manager" -> "operations_manager"
      }),
      ...(mode === "edit" && { is_active: true }),
    };

    if (mode === "edit") {
      if (!editData?.id) {
        notify({
          type: "danger",
          title: "Error",
          message: "Role ID is missing",
          autoClose: true,
          autoCloseDelay: 3000,
        });
        return;
      }

      await editRoleMutation.mutateAsync(
        //@ts-expect-error will work on it later
        { id: editData.id, values: payload },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        },
      );
    } else {
      //@ts-expect-error i will work on this later
      await addRoleMutation.mutateAsync(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title={mode === "edit" ? "Edit Role" : "Create Role"}
      saveButtonText={mode === "edit" ? "Save" : "Create Role"}
      saveIcon={
        mode === "edit" ? <FloppyDiskIcon size={20} /> : <PlusIcon size={20} />
      }
      onCancel={onClose}
      onSave={handleSubmit(handleSaveAddRole)}
      isLoading={isLoading}
      className="max-w-4xl"
    >
      <div className="flex flex-col gap-6">
        <Input
          inputType="iconLeading"
          icon={<UserIcon size={16} />}
          label="Role Name"
          name="roleName"
          placeholder="Enter Role Name"
          register={formRegister}
          destructive={!!errors.roleName}
          hintText={errors.roleName?.message}
        />
        <Input
          inputType="iconLeading"
          icon={<UserIcon size={16} />}
          label="Description"
          name="description"
          placeholder="Enter Description"
          register={formRegister}
          destructive={!!errors.description}
          hintText={errors.description?.message}
        />

        <h2 className="text-grey-800 text-base font-bold">Permission</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="select-all-permissions"
              checked={areAllPermissionsSelected()}
              onChange={handleSelectAllPermissionsToggle}
              className="w-4 h-4 rounded-[20rem] border-grey-300 focus:ring-brand-600 focus:ring-2 cursor-pointer transition-all checked:bg-brand-600 checked:border-brand-600 accent-brand-600"
            />
            <label
              htmlFor="select-all-permissions"
              className="text-sm font-semibold text-grey-800 cursor-pointer"
            >
              Select All Permissions
            </label>
          </div>

          {/* Permissions Table */}
          <div className=" overflow-hidden">
            <div className=" overflow-y-auto">
              {permissionCategories.map((category, index) => (
                <div
                  key={category}
                  className={`grid grid-cols-[200px_repeat(6,1fr)] ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <div className="px-4 py-3 text-sm text-grey-800 font-bold">
                    {category}
                  </div>
                  {permissionOptions.map((permission) => (
                    <div
                      key={permission}
                      className="px-4 py-3 flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        id={`${category}-${permission}`}
                        checked={isPermissionChecked(category, permission)}
                        onChange={() =>
                          handlePermissionToggle(category, permission)
                        }
                        className="w-4 h-4 rounded-[20rem] border-grey-300 focus:ring-brand-600 focus:ring-2 cursor-pointer transition-all checked:bg-brand-600 checked:border-brand-600 accent-brand-600"
                      />
                      <label
                        htmlFor={`${category}-${permission}`}
                        className="text-sm cursor-pointer text-grey-800 font-bold"
                      >
                        {permission}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default AddRoleForm;
