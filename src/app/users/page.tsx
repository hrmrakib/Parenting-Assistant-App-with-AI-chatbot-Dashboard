"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown, Loader2 } from "lucide-react";
import { useGetAllUsersQuery } from "@/redux/features/user/userAPI";
import GlobalPagination from "@/components/pagination/GlobalPagination";
import Image from "next/image";
import { getImageUrl } from "@/utils/imagePath";
import { useDebounce } from "@/hooks/useDebounce";

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  last_login_at: string | null;
  role: UserRole;
  email: string;
  is_verified: boolean;
  is_active: boolean;
  is_admin: boolean;
  is_deleted: boolean;
  otp_id: number;
  avatar: string;
  name: string;
  gender: Gender;
  balance: number;
  stripe_customer_id: string | null;
  stripe_account_id: string | null;
  is_stripe_connected: boolean;
  current_account_id: string | null;
}

type AccountType = "MOM" | "BABY" | "";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("");
  const debounceSearch = useDebounce(search, 500);
  const [timeLength, setTimeLength] = useState<number>(0);

  // Integrating the RTK Query hook with dynamic keys
  const {
    data: usersResponse,
    isLoading,
    isFetching,
  } = useGetAllUsersQuery({
    page,
    limit: 10,
    search: debounceSearch,
    account_type: accountType || undefined,
    // Conditionally pass current_week or current_month based on accountType
    ...(accountType === "MOM" && timeLength
      ? { current_week: timeLength }
      : {}),
    ...(accountType === "BABY" && timeLength
      ? { current_month: timeLength }
      : {}),
  });

  const users = usersResponse?.data || [];
  const totalPages = usersResponse?.meta?.pagination?.totalPages || 1;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountType(e.target.value as AccountType);
    setTimeLength(0); // Reset timeLength selection on account type change
    setPage(1); // Reset page to 1 when changing filters
  };

  return (
    <DashboardLayout>
      <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-8'>
        <div className='mb-6'>
          <h2 className='text-xl font-bold text-gray-900 tracking-tight mb-1'>
            All Users
          </h2>
          <p className='text-sm text-gray-500'>
            View users, manage subscriptions, approve gift requests
          </p>
        </div>

        {/* Filters */}
        <div className='flex flex-wrap gap-4 mb-8'>
          <div className='w-full sm:w-64'>
            <input
              type='text'
              placeholder='Search by name or email'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className='h-9 w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
            />
          </div>
          <div className='w-full sm:w-48 relative'>
            <select
              value={accountType}
              onChange={handleChange}
              className='h-9 w-full appearance-none rounded-md border border-gray-200 bg-gray-50/50 px-3 pr-8 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
            >
              <option value=''>Account Type</option>
              <option value='BABY'>BABY</option>
              <option value='MOM'>MOM</option>
            </select>
            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
          </div>

          {/* Render ONLY if an accountType is explicitly selected */}
          {accountType && (
            <div className='w-full sm:w-48 relative'>
              <select
                value={timeLength}
                onChange={(e) => {
                  setTimeLength(+e.target.value);
                  setPage(1);
                }}
                className='w-full h-9 appearance-none rounded-md border border-gray-200 bg-gray-50/50 px-4 pr-10 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
              >
                <option value={0}>
                  Select {accountType === "MOM" ? "Week" : "Month"}
                </option>
                {accountType === "MOM"
                  ? Array.from({ length: 40 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m} {m === 1 ? "Week" : "Weeks"}
                      </option>
                    ))
                  : Array.from({ length: 24 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m} {m === 1 ? "Month" : "Months"}
                      </option>
                    ))}
              </select>
              <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
            </div>
          )}
        </div>

        <div className='overflow-x-auto relative'>
          {/* Loading Overlay for Pagination/Fetching */}
          {isFetching && !isLoading && (
            <div className='absolute inset-0 bg-white/50 z-10 flex items-center justify-center'>
              <Loader2 className='animate-spin text-[#8fa38b]' />
            </div>
          )}

          <table className='w-full text-left text-[14px]'>
            <thead>
              <tr className='border-b-2 border-gray-100 text-gray-900 font-bold'>
                <th className='pb-3 px-4 font-semibold'>User</th>
                <th className='pb-3 px-4 font-semibold'>Email</th>
                <th className='pb-3 px-4 font-semibold text-center'>Role</th>
                <th className='pb-3 px-4 font-semibold text-center'>Status</th>
                <th className='pb-3 px-4 font-semibold text-center'>Gender</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 text-gray-600'>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className='py-10 text-center'>
                    <Loader2 className='animate-spin mx-auto text-gray-400' />
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user: User) => (
                  <tr
                    key={user.id}
                    className='hover:bg-gray-50/50 transition-colors'
                  >
                    <td className='py-4 px-4 font-medium text-gray-800'>
                      <div className='flex items-center gap-3'>
                        <div className='relative h-8 w-8 rounded-full overflow-hidden bg-gray-100'>
                          <Image
                            src={
                              getImageUrl(user?.avatar) ||
                              "/images/placeholder.png"
                            }
                            alt={user.name}
                            fill
                            className='object-cover'
                          />
                        </div>
                        {user.name || "N/A"}
                      </div>
                    </td>
                    <td className='py-4 px-4'>{user.email}</td>
                    <td className='py-4 px-4 text-center'>
                      <Badge variant='outline' className='capitalize'>
                        {user.role.toLowerCase()}
                      </Badge>
                    </td>
                    <td className='py-4 px-4 text-center'>
                      <Badge
                        variant='dark'
                        className={`px-4 py-1 font-medium ${user.is_active ? "bg-[#1B1B1B]" : "bg-red-500"} hover:opacity-90`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className='py-4 px-4 text-center capitalize'>
                      {user.gender.toLowerCase()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className='py-10 text-center text-gray-500'>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className='mt-8'>
            <GlobalPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
