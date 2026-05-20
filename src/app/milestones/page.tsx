"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import {
  Flag,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Baby,
  Heart,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetAllMilestonesQuery,
  useDeleteMilestoneMutation,
  useCreateMilestoneTodoMutation,
  useUpdateMilestoneTodoMutation,
  useDeleteMilestoneTodoMutation,
} from "@/redux/features/milestones/milestonesAPI";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

// ─── Types ────────────────────────────────────────────────────────────────────

type TodoType =
  | "FEEDING"
  | "DIAPER"
  | "SLEEP"
  | "WEIGHT"
  | "HEIGHT"
  | "EXERCISE";

interface MilestoneTodo {
  id: string;
  todo_type: TodoType;
  instructions: string;
  milestone_id: string;
}

interface Milestone {
  id: string;
  title: string;
  instructions: string;
  milestone_type: "for_baby" | "for_mom";
  month_number: number | null;
  week_number: number | null;
  is_deleted: boolean;
  created_at: string;
  milestone_todos: MilestoneTodo[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TODO_TYPES: TodoType[] = [
  "FEEDING",
  "DIAPER",
  "SLEEP",
  "WEIGHT",
  "HEIGHT",
  "EXERCISE",
];

const TODO_BADGE: Record<TodoType, string> = {
  FEEDING: "bg-orange-50 text-orange-600",
  DIAPER: "bg-yellow-50 text-yellow-600",
  SLEEP: "bg-indigo-50 text-indigo-600",
  WEIGHT: "bg-rose-50 text-rose-600",
  HEIGHT: "bg-teal-50 text-teal-600",
  EXERCISE: "bg-green-50 text-green-600",
};

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({
  label,
  onConfirm,
  onCancel,
  isLoading,
}: {
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onCancel}
      />
      <div className='relative z-10 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4'>
        <div className='flex items-center gap-4 mb-5'>
          <div className='shrink-0 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center'>
            <AlertTriangle className='h-6 w-6 text-red-500' />
          </div>
          <div>
            <h3 className='text-lg font-bold text-gray-900'>Confirm Delete</h3>
            <p className='text-sm text-gray-500'>
              This action cannot be undone
            </p>
          </div>
        </div>
        <div className='bg-gray-50 rounded-xl px-4 py-3 mb-6 border border-gray-100'>
          <p className='font-semibold text-gray-800 text-sm truncate'>
            {label}
          </p>
        </div>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='flex-1 rounded-lg h-10 text-sm border-gray-200'
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className='flex-1 rounded-lg h-10 text-sm bg-red-500 hover:bg-red-600 text-white border-none'
            onClick={onConfirm}
            disabled={isLoading}
          >
            <span className='flex items-center gap-2'>
              {isLoading ? (
                <span className='w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin' />
              ) : (
                <Trash2 className='h-4 w-4' />
              )}
              {isLoading ? "Deleting…" : "Delete"}
            </span>
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Todo Section ─────────────────────────────────────────────────────────────
// Todos come from the embedded `milestone_todos` on the milestone object.
// Creating/updating/deleting invalidates ["Milestone"] which refetches the list.

function TodoSection({
  milestoneId,
  todos,
}: {
  milestoneId: string;
  todos: MilestoneTodo[];
}) {
  const [createTodo, { isLoading: isCreating }] =
    useCreateMilestoneTodoMutation();
  const [updateTodo, { isLoading: isUpdating }] =
    useUpdateMilestoneTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] =
    useDeleteMilestoneTodoMutation();

  const [form, setForm] = useState({
    instructions: "",
    todo_type: "FEEDING" as TodoType,
  });
  const [editingTodo, setEditingTodo] = useState<MilestoneTodo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MilestoneTodo | null>(null);

  const isSaving = isCreating || isUpdating;

  const resetForm = () => {
    setForm({ instructions: "", todo_type: "FEEDING" });
    setEditingTodo(null);
  };

  const handleEditClick = (todo: MilestoneTodo) => {
    setEditingTodo(todo);
    setForm({ instructions: todo.instructions, todo_type: todo.todo_type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.instructions.trim()) return;
    try {
      if (editingTodo) {
        await updateTodo({
          milestone_todo_id: editingTodo.id,
          instructions: form.instructions,
          todo_type: form.todo_type,
        }).unwrap();
      } else {
        await createTodo({
          milestone_id: milestoneId,
          instructions: form.instructions,
          todo_type: form.todo_type,
        }).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error("Todo save failed:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTodo({ milestone_todo_id: deleteTarget.id }).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Todo delete failed:", err);
    }
  };

  return (
    <div className='px-4 pb-4 pt-3 bg-gray-50 border-t border-gray-100'>
      {deleteTarget && (
        <DeleteModal
          label={deleteTarget.instructions}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isLoading={isDeleting}
        />
      )}

      {/* Add / Edit form */}
      <form
        onSubmit={handleSubmit}
        className='flex flex-wrap items-end gap-3 mb-4'
      >
        <div className='flex-1 min-w-[200px]'>
          <label className='text-xs font-medium text-gray-500 mb-1 block'>
            {editingTodo ? "Edit instruction" : "New todo instruction"}
          </label>
          <input
            type='text'
            value={form.instructions}
            onChange={(e) =>
              setForm((f) => ({ ...f, instructions: e.target.value }))
            }
            placeholder='e.g. Track feedings every 2–3 hours'
            required
            className='w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
          />
        </div>

        <div>
          <label className='text-xs font-medium text-gray-500 mb-1 block'>
            Type
          </label>
          <select
            value={form.todo_type}
            onChange={(e) =>
              setForm((f) => ({ ...f, todo_type: e.target.value as TodoType }))
            }
            className='h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
          >
            {TODO_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <Button
          type='submit'
          disabled={isSaving || !form.instructions.trim()}
          className='h-9 px-4 text-sm rounded-lg bg-[#1C1C1C] hover:bg-black text-white flex items-center gap-1.5 disabled:opacity-50'
        >
          {isSaving ? (
            <span className='w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin' />
          ) : (
            <Check className='h-3.5 w-3.5' />
          )}
          {editingTodo ? "Update" : "Add Todo"}
        </Button>

        {editingTodo && (
          <button
            type='button'
            onClick={resetForm}
            className='h-9 px-3 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-gray-900 flex items-center gap-1'
          >
            <X className='h-3.5 w-3.5' /> Cancel
          </button>
        )}
      </form>

      {/* Todo list */}
      {todos.length === 0 ? (
        <p className='text-xs text-gray-400 py-1'>
          No todos yet — add one above.
        </p>
      ) : (
        <div className='space-y-2'>
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 border ${
                editingTodo?.id === todo.id
                  ? "border-[#8fa38b] bg-[#f5f8f5]"
                  : "border-gray-100 bg-white"
              }`}
            >
              <div className='flex items-start gap-2 min-w-0'>
                <span
                  className={`shrink-0 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${TODO_BADGE[todo.todo_type]}`}
                >
                  {todo.todo_type}
                </span>
                <p className='text-sm text-gray-700 leading-snug'>
                  {todo.instructions}
                </p>
              </div>
              <div className='flex items-center gap-2 shrink-0'>
                <button
                  onClick={() => handleEditClick(todo)}
                  className='text-gray-400 hover:text-gray-700 transition-colors'
                  title='Edit'
                >
                  <Edit className='h-3.5 w-3.5' />
                </button>
                <button
                  onClick={() => setDeleteTarget(todo)}
                  className='text-[#d28b81] hover:text-red-500 transition-colors'
                  title='Delete'
                >
                  <Trash2 className='h-3.5 w-3.5' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MilestonePage() {
  const router = useRouter();

  const { data: milestonesData } = useGetAllMilestonesQuery({
    page: 1,
    limit: 50,
  });
  const milestones: Milestone[] = (milestonesData?.data ?? []).filter(
    (m: Milestone) => !m.is_deleted,
  );

  const [deleteMilestone, { isLoading: isDeleting }] =
    useDeleteMilestoneMutation();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Milestone | null>(null);

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMilestone({ milestone_id: deleteTarget.id }).unwrap();
      if (expandedId === deleteTarget.id) setExpandedId(null);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Milestone delete failed:", err);
    }
  };

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <DashboardLayout>
        {deleteTarget && (
          <DeleteModal
            label={deleteTarget.title}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
            isLoading={isDeleting}
          />
        )}

        <div className='flex flex-col gap-6'>
          <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-8'>
            {/* Header */}
            <div className='flex items-start justify-between gap-4 mb-8'>
              <div className='flex items-start gap-3'>
                <Flag className='h-6 w-6 text-gray-800 mt-0.5' />
                <div>
                  <h2 className='text-xl font-bold text-gray-900 tracking-tight mb-1'>
                    Milestone Management
                  </h2>
                  <p className='text-sm text-gray-500'>
                    Create and manage baby &amp; mom milestones with their todos
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/milestones/create")}
                className='bg-[#1C1C1C] hover:bg-black rounded-lg h-10 px-5 flex items-center gap-2 text-sm font-medium shrink-0'
              >
                <Plus className='h-4 w-4' />
                Add Milestone
              </Button>
            </div>

            {/* Stat chips */}
            <div className='flex flex-wrap gap-3 mb-6'>
              <div className='px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium'>
                {milestones.length} Total
              </div>
              <div className='px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium flex items-center gap-1.5'>
                <Baby className='h-3.5 w-3.5' />
                {
                  milestones.filter((m) => m.milestone_type === "for_baby")
                    .length
                }{" "}
                Baby
              </div>
              <div className='px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 text-sm font-medium flex items-center gap-1.5'>
                <Heart className='h-3.5 w-3.5' />
                {
                  milestones.filter((m) => m.milestone_type === "for_mom")
                    .length
                }{" "}
                Mom
              </div>
            </div>

            {/* Table */}
            {milestones.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-16 text-center text-gray-400'>
                <Flag className='h-10 w-10 mb-3 opacity-30' />
                <p className='text-sm font-medium'>No milestones yet</p>
                <p className='text-xs mt-1'>
                  Click &quot;Add Milestone&quot; to get started.
                </p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full text-left text-[14px]'>
                  <thead>
                    <tr className='border-b-2 border-gray-100 text-gray-900'>
                      <th className='pb-3 px-4 font-semibold'>Title</th>
                      <th className='pb-3 px-4 font-semibold text-center'>
                        Type
                      </th>
                      <th className='pb-3 px-4 font-semibold text-center'>
                        Month / Week
                      </th>
                      <th className='pb-3 px-4 font-semibold text-center'>
                        Todos
                      </th>
                      <th className='pb-3 px-4 font-semibold text-center'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='text-gray-600'>
                    {milestones.map((item) => {
                      const isExpanded = expandedId === item.id;
                      return (
                        <React.Fragment key={item.id}>
                          <tr
                            className={`border-b border-gray-100 transition-colors ${
                              isExpanded
                                ? "bg-[#f5f8f5]"
                                : "hover:bg-gray-50/50"
                            }`}
                          >
                            {/* Title */}
                            <td className='py-4 px-4 max-w-[240px]'>
                              <div className='font-medium text-gray-800 truncate'>
                                {item.title}
                              </div>
                              <p className='text-xs text-gray-400 mt-0.5 truncate'>
                                {item.instructions}
                              </p>
                            </td>

                            {/* Type */}
                            <td className='py-4 px-4 text-center'>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                  item.milestone_type === "for_baby"
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-pink-50 text-pink-600"
                                }`}
                              >
                                {item.milestone_type === "for_baby" ? (
                                  <Baby className='h-3 w-3' />
                                ) : (
                                  <Heart className='h-3 w-3' />
                                )}
                                {item.milestone_type === "for_baby"
                                  ? "Baby"
                                  : "Mom"}
                              </span>
                            </td>

                            {/* Month / Week */}
                            <td className='py-4 px-4 text-center text-gray-500'>
                              {item.month_number != null
                                ? `Month ${item.month_number}`
                                : item.week_number != null
                                  ? `Week ${item.week_number}`
                                  : "—"}
                            </td>

                            {/* Todos toggle */}
                            <td className='py-4 px-4 text-center'>
                              <button
                                onClick={() => toggleExpand(item.id)}
                                className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600 hover:bg-[#e8ede8] transition-colors'
                              >
                                <ListChecks className='h-3.5 w-3.5' />
                                {item.milestone_todos?.length ?? 0} Todos
                                {isExpanded ? (
                                  <ChevronUp className='h-3 w-3' />
                                ) : (
                                  <ChevronDown className='h-3 w-3' />
                                )}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className='py-4 px-4'>
                              <div className='flex items-center justify-center gap-3'>
                                <button
                                  title='Edit milestone'
                                  onClick={() =>
                                    router.push(`/milestones/edit/${item.id}`)
                                  }
                                  className='text-gray-400 hover:text-gray-800 transition-colors'
                                >
                                  <Edit className='h-4 w-4' />
                                </button>
                                <button
                                  title='Delete milestone'
                                  onClick={() => setDeleteTarget(item)}
                                  className='text-[#d28b81] hover:text-red-500 transition-colors'
                                >
                                  <Trash2 className='h-4 w-4' />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded todo section */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={5} className='p-0'>
                                <TodoSection
                                  milestoneId={item.id}
                                  todos={item.milestone_todos ?? []}
                                />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </DashboardLayout>
    </RoleRedirect>
  );
}
