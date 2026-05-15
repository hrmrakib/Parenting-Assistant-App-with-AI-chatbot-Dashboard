"use client";

import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import {
  BookOpen,
  Check,
  UploadCloud,
  Edit,
  Trash2,
  ChevronDown,
  X,
  AlertTriangle,
  Plus,
  Video,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCreateContentMutation,
  useDeleteContentMutation,
  useGetAllContentQuery,
  useUpdateContentMutation,
} from "@/redux/features/content/contentAPI";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContentItem {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  slug: string;
  content_url: string;
  thumbnail_url: string;
  content_type: "VIDEO" | "ARTICLE" | "IMAGE";
  for_baby: boolean;
  for_mom: boolean;
  week_number: number | null;
  month_number: number | null;
}

interface FormState {
  title: string;
  description: string;
  content_type: "VIDEO" | "ARTICLE" | "IMAGE";
  category: "baby" | "mom";
  month_number: string;
  videoFile: File | null;
}

const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  content_type: "VIDEO",
  category: "baby",
  month_number: "3",
  videoFile: null,
};

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
// Rendered via createPortal directly onto document.body so it lives completely
// outside the DashboardLayout tree. This prevents the React reconciler from
// trying to insertBefore a node that isn't a child of the current fiber's DOM
// container — which was causing the NotFoundError hydration crash.

function DeleteModal({
  item,
  onConfirm,
  onCancel,
  isLoading,
}: {
  item: ContentItem;
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
            <h3 className='text-lg font-bold text-gray-900'>Delete Content</h3>
            <p className='text-sm text-gray-500'>
              This action cannot be undone
            </p>
          </div>
        </div>

        <p className='text-sm text-gray-600 mb-2'>
          You&apos;re about to permanently delete:
        </p>
        <div className='bg-gray-50 rounded-xl px-4 py-3 mb-6 border border-gray-100'>
          <p className='font-semibold text-gray-800 text-sm'>{item.title}</p>
          <p className='text-xs text-gray-400 mt-0.5'>
            {item.content_type} &middot; {item.for_baby ? "Baby" : "Mom"}{" "}
            &middot;{" "}
            {item.month_number != null
              ? `Month ${item.month_number}`
              : item.week_number != null
                ? `Week ${item.week_number}`
                : "N/A"}
          </p>
        </div>

        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='flex-1 rounded-lg h-10 text-sm font-medium border-gray-200'
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className='flex-1 rounded-lg h-10 text-sm font-medium bg-red-500 hover:bg-red-600 text-white border-none'
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className='flex items-center gap-2'>
                <span className='w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                Deleting
              </span>
            ) : (
              <span className='flex items-center gap-2'>
                <Trash2 className='h-4 w-4' />
                Delete Permanently
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Content Type Icon ────────────────────────────────────────────────────────

function ContentTypeIcon({ type }: { type: string }) {
  if (type === "VIDEO")
    return <Video className='h-3.5 w-3.5 text-purple-500' />;
  if (type === "IMAGE")
    return <ImageIcon className='h-3.5 w-3.5 text-blue-500' />;
  return <FileText className='h-3.5 w-3.5 text-emerald-500' />;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContentPage() {
  const [createContentMutation, { isLoading: isCreating }] =
    useCreateContentMutation();
  const [updateContentMutation, { isLoading: isUpdating }] =
    useUpdateContentMutation();
  const [deleteContentMutation, { isLoading: isDeleting }] =
    useDeleteContentMutation();

  const { data: contentsData } = useGetAllContentQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const contents: ContentItem[] = contentsData?.data || [];

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = editingId !== null;
  const isSaving = isCreating || isUpdating;

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditClick = (item: ContentItem) => {
    console.log({ item });
    setEditingId(item.id);

    setForm({
      title: item.title,
      description: item.description,
      content_type: item.content_type,
      category: item.for_baby ? "baby" : "mom",
      month_number:
        item.month_number?.toString() ?? item.week_number?.toString() ?? "3",
      videoFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildFormData = (): FormData => {
    const fd = new FormData();
    const payload = {
      title: form.title,
      description: form.description,
      month_number: parseInt(form.month_number, 10),
      ...(form.category === "baby"
        ? { for_baby: "true" }
        : { for_mom: "true" }),
      content_type: form.content_type,
    };
    fd.append("data", JSON.stringify(payload));
    if (form.videoFile) fd.append("video", form.videoFile);
    return fd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const fd = buildFormData();
    try {
      if (isEditMode) {
        console.log("update: ", editingId);
        await updateContentMutation({ id: editingId, data: fd }).unwrap();
      } else {
        await createContentMutation(fd).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error("Content save failed:", err);
    }
  };

  // TODO: test console
  // console.log({ editingId });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteContentMutation({ id: deleteTarget.id }).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <DashboardLayout>
      {/* Portal modal — mounted on document.body, not inside layout */}
      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isLoading={isDeleting}
        />
      )}

      <div className='flex flex-col gap-6'>
        {/* Form Card */}
        <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-8'>
          <div className='flex items-start gap-3 mb-8'>
            <BookOpen className='h-6 w-6 text-gray-800' />
            <div>
              <h2 className='text-xl font-bold text-gray-900 tracking-tight mb-1'>
                Content Management
              </h2>
              <p className='text-sm text-gray-500'>
                Upload, Edit, Delete and organize content by week or age group
              </p>
            </div>
          </div>

          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2'>
                {isEditMode ? (
                  <>
                    <Edit className='h-4 w-4 text-[#8fa38b]' />
                    Edit Content
                  </>
                ) : (
                  <>
                    <Plus className='h-4 w-4 text-[#8fa38b]' />
                    Add New Content
                  </>
                )}
              </h3>
              <p className='text-sm text-gray-500'>
                {isEditMode
                  ? "Modify the fields below and save your changes"
                  : "Text, photo or video"}
              </p>
            </div>
            {isEditMode && (
              <button
                type='button'
                onClick={resetForm}
                className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 rounded-lg px-3 py-1.5'
              >
                <X className='h-3.5 w-3.5' />
                Cancel Edit
              </button>
            )}
          </div>

          {isEditMode && (
            <div className='mb-6 flex items-center gap-3 bg-[#f0f4f0] border border-[#c5d4c2] rounded-xl px-4 py-3'>
              <div className='w-2 h-2 rounded-full bg-[#8fa38b] shrink-0' />
              <p className='text-sm text-[#5a7a57] font-medium'>
                Editing existing content — changes will overwrite the current
                version.
              </p>
            </div>
          )}

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-900'>
                  Title <span className='text-red-400'>*</span>
                </label>
                <input
                  type='text'
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder='e.g. Pelvic Floor Basics'
                  required
                  className='w-full h-11 rounded-full border border-gray-200 bg-gray-50/50 px-4 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-900'>
                  Type
                </label>
                <div className='relative'>
                  <select
                    value={form.content_type}
                    onChange={(e) =>
                      setField(
                        "content_type",
                        e.target.value as FormState["content_type"],
                      )
                    }
                    className='w-full h-11 appearance-none rounded-full border border-gray-200 bg-gray-50/50 px-4 pr-10 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
                  >
                    <option value='VIDEO'>Video</option>
                    <option value='ARTICLE'>Article</option>
                    <option value='IMAGE'>Image</option>
                  </select>
                  <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-900'>
                  Category
                </label>
                <div className='relative'>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setField(
                        "category",
                        e.target.value as FormState["category"],
                      )
                    }
                    className='w-full h-11 appearance-none rounded-full border border-gray-200 bg-gray-50/50 px-4 pr-10 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
                  >
                    <option value='baby'>Baby</option>
                    <option value='mom'>Mother / Mom</option>
                  </select>
                  <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-900'>
                  Month
                </label>
                <div className='relative'>
                  <select
                    value={form.month_number}
                    onChange={(e) => setField("month_number", e.target.value)}
                    className='w-full h-11 appearance-none rounded-full border border-gray-200 bg-gray-50/50 px-4 pr-10 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m} {m === 1 ? "Month" : "Months"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-900'>
                Description / Notes
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder='e.g. Gentle exercises to help strengthen neck and shoulder muscles.'
                className='w-full h-32 rounded-2xl border border-gray-200 bg-gray-50/50 p-4 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b] resize-none'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-900'>
                Video File{" "}
                {isEditMode && (
                  <span className='text-xs text-gray-400 font-normal'>
                    (leave empty to keep existing)
                  </span>
                )}
              </label>
              <div
                className='relative border-2 border-dashed border-gray-200 rounded-2xl px-6 py-5 flex items-center gap-4 cursor-pointer hover:border-[#8fa38b] hover:bg-[#f5f8f5] transition-all'
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className='h-5 w-5 text-gray-400 shrink-0' />
                <div className='flex-1 min-w-0'>
                  {form.videoFile ? (
                    <p className='text-sm text-gray-700 font-medium truncate'>
                      {form.videoFile.name}
                    </p>
                  ) : (
                    <p className='text-sm text-gray-400'>
                      Click to upload a video file (.mp4, .mov, .webm)
                    </p>
                  )}
                </div>
                {form.videoFile && (
                  <button
                    type='button'
                    className='shrink-0 text-gray-400 hover:text-gray-600'
                    onClick={(e) => {
                      e.stopPropagation();
                      setField("videoFile", null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type='file'
                accept='video/*'
                className='hidden'
                onChange={(e) =>
                  setField("videoFile", e.target.files?.[0] ?? null)
                }
              />
            </div>

            <div className='flex flex-wrap items-center gap-3 pt-2'>
              <Button
                type='submit'
                disabled={isSaving || !form.title.trim()}
                className='bg-[#1C1C1C] hover:bg-black rounded-lg h-10 px-5 flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSaving ? (
                  <>
                    <span className='w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                    {isEditMode ? "Updating" : "Saving"}
                  </>
                ) : (
                  <>
                    <Check className='h-4 w-4' />
                    {isEditMode ? "Update Content" : "Save Content"}
                  </>
                )}
              </Button>

              {isEditMode && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={resetForm}
                  className='rounded-lg h-10 px-5 flex items-center gap-2 text-sm font-medium bg-white text-gray-700 border-gray-200'
                >
                  <X className='h-4 w-4' />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Library */}
        <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-8'>
          <div className='mb-6'>
            <h3 className='text-lg font-bold text-gray-900 tracking-tight'>
              Library
            </h3>
            <p className='text-sm text-gray-500'>
              Manage existing items &middot; {contents.length} total
            </p>
          </div>

          {contents.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 text-center text-gray-400'>
              <BookOpen className='h-10 w-10 mb-3 opacity-30' />
              <p className='text-sm font-medium'>No content yet</p>
              <p className='text-xs mt-1'>
                Add your first item using the form above.
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
                      Category
                    </th>
                    <th className='pb-3 px-4 font-semibold text-center'>
                      Month
                    </th>
                    <th className='pb-3 px-4 font-semibold text-center'>
                      Created
                    </th>
                    <th className='pb-3 px-4 font-semibold text-center'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100 text-gray-600'>
                  {contents.map((item) => {
                    const isBeingEdited = editingId === item.id;
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isBeingEdited
                            ? "bg-[#f5f8f5] border-l-2 border-l-[#8fa38b]"
                            : "hover:bg-gray-50/50"
                        }`}
                      >
                        <td className='py-4 px-4 font-medium text-gray-800 max-w-[200px]'>
                          <div className='truncate'>{item.title}</div>
                          {isBeingEdited && (
                            <span className='inline-block text-[10px] text-[#8fa38b] font-semibold mt-0.5 uppercase tracking-wide'>
                              Editing
                            </span>
                          )}
                        </td>
                        <td className='py-4 px-4 text-center'>
                          <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600'>
                            <ContentTypeIcon type={item.content_type} />
                            {item.content_type.charAt(0) +
                              item.content_type.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className='py-4 px-4 text-center'>
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                              item.for_baby
                                ? "bg-blue-50 text-blue-600"
                                : "bg-pink-50 text-pink-600"
                            }`}
                          >
                            {item.for_baby ? "Baby" : "Mom"}
                          </span>
                        </td>
                        <td className='py-4 px-4 text-center text-gray-500'>
                          {item.month_number != null
                            ? `Month ${item.month_number}`
                            : item.week_number != null
                              ? `Week ${item.week_number}`
                              : "N/A"}
                        </td>
                        <td className='py-4 px-4 text-center text-gray-500 text-xs'>
                          {new Date(item.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className='py-4 px-4'>
                          <div className='flex items-center justify-center gap-3'>
                            <button
                              title='Edit'
                              onClick={() => handleEditClick(item)}
                              className={`transition-colors ${
                                isBeingEdited
                                  ? "text-[#8fa38b]"
                                  : "text-gray-400 hover:text-gray-800"
                              }`}
                            >
                              <Edit className='h-4 w-4' />
                            </button>
                            <button
                              title='Delete'
                              onClick={() => setDeleteTarget(item)}
                              className='text-[#d28b81] hover:text-red-500 transition-colors'
                            >
                              <Trash2 className='h-4 w-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

// "use client";

// import React, { useRef, useState } from "react";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { Card } from "@/components/ui/Card";
// import {
//   BookOpen,
//   Check,
//   UploadCloud,
//   Edit,
//   Trash2,
//   ChevronDown,
//   X,
//   AlertTriangle,
//   Plus,
//   Video,
//   FileText,
//   Image as ImageIcon,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   useCreateContentMutation,
//   useDeleteContentMutation,
//   useGetAllContentQuery,
//   useUpdateContentMutation,
// } from "@/redux/features/content/contentAPI";

// // ─── Types ───────────────────────────────────────────────────────────────────

// interface ContentItem {
//   id: string;
//   created_at: string;
//   updated_at: string;
//   title: string;
//   description: string;
//   slug: string;
//   content_url: string;
//   thumbnail_url: string;
//   content_type: "VIDEO" | "ARTICLE" | "IMAGE";
//   for_baby: boolean;
//   for_mom: boolean;
//   week_number: number | null;
//   month_number: number | null;
// }

// interface FormState {
//   title: string;
//   description: string;
//   content_type: "VIDEO" | "ARTICLE" | "IMAGE";
//   category: "baby" | "mom";
//   month_number: string;
//   videoFile: File | null;
// }

// const INITIAL_FORM: FormState = {
//   title: "",
//   description: "",
//   content_type: "VIDEO",
//   category: "baby",
//   month_number: "3",
//   videoFile: null,
// };

// function DeleteModal({
//   item,
//   onConfirm,
//   onCancel,
//   isLoading,
// }: {
//   item: ContentItem;
//   onConfirm: () => void;
//   onCancel: () => void;
//   isLoading: boolean;
// }) {
//   return (
//     <div className='fixed inset-0 z-50 flex items-center justify-center'>
//       {/* Backdrop */}
//       <div
//         className='absolute inset-0 bg-black/40 backdrop-blur-sm'
//         onClick={onCancel}
//       />
//       {/* Modal */}
//       <div className='relative z-10 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200'>
//         <div className='flex items-center gap-4 mb-5'>
//           <div className='shrink-0 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center'>
//             <AlertTriangle className='h-6 w-6 text-red-500' />
//           </div>
//           <div>
//             <h3 className='text-lg font-bold text-gray-900'>Delete Content</h3>
//             <p className='text-sm text-gray-500'>
//               This action cannot be undone
//             </p>
//           </div>
//         </div>

//         <p className='text-sm text-gray-600 mb-2'>
//           You&apos;re about to permanently delete:
//         </p>
//         <div className='bg-gray-50 rounded-xl px-4 py-3 mb-6 border border-gray-100'>
//           <p className='font-semibold text-gray-800 text-sm'>{item.title}</p>
//           <p className='text-xs text-gray-400 mt-0.5'>
//             {item.content_type} · {item.for_baby ? "Baby" : "Mom"} ·{" "}
//             {item.month_number
//               ? `Month ${item.month_number}`
//               : `Week ${item.week_number}`}
//           </p>
//         </div>

//         <div className='flex gap-3'>
//           <Button
//             variant='outline'
//             className='flex-1 rounded-lg h-10 text-sm font-medium border-gray-200'
//             onClick={onCancel}
//             disabled={isLoading}
//           >
//             Cancel
//           </Button>
//           <Button
//             className='flex-1 rounded-lg h-10 text-sm font-medium bg-red-500 hover:bg-red-600 text-white border-none'
//             onClick={onConfirm}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <span className='flex items-center gap-2'>
//                 <span className='w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin' />
//                 Deleting…
//               </span>
//             ) : (
//               <span className='flex items-center gap-2'>
//                 <Trash2 className='h-4 w-4' />
//                 Delete Permanently
//               </span>
//             )}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ContentTypeIcon({ type }: { type: string }) {
//   if (type === "VIDEO")
//     return <Video className='h-3.5 w-3.5 text-purple-500' />;
//   if (type === "IMAGE")
//     return <ImageIcon className='h-3.5 w-3.5 text-blue-500' />;
//   return <FileText className='h-3.5 w-3.5 text-emerald-500' />;
// }

// export default function ContentPage() {
//   const [createContentMutation, { isLoading: isCreating }] =
//     useCreateContentMutation();
//   const [updateContentMutation, { isLoading: isUpdating }] =
//     useUpdateContentMutation();
//   const [deleteContentMutation, { isLoading: isDeleting }] =
//     useDeleteContentMutation();

//   const { data: contentsData } = useGetAllContentQuery({});
//   const contents: ContentItem[] = contentsData?.data || [];

//   // ── Form  ──
//   const [form, setForm] = useState<FormState>(INITIAL_FORM);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const isEditMode = editingId !== null;
//   const isSaving = isCreating || isUpdating;

//   // ── Field Helpers ──
//   const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
//     setForm((prev) => ({ ...prev, [key]: value }));

//   // ── Reset Form ──
//   const resetForm = () => {
//     setForm(INITIAL_FORM);
//     setEditingId(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // ── Populate form for editing ──
//   const handleEditClick = (item: ContentItem) => {
//     setForm({
//       title: item.title,
//       description: item.description,
//       content_type: item.content_type,
//       category: item.for_baby ? "baby" : "mom",
//       month_number:
//         item.month_number?.toString() ?? item.week_number?.toString() ?? "3",
//       videoFile: null,
//     });
//     setEditingId(item.id);
//     // Scroll to form
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // ── Build FormData ──
//   const buildFormData = (): FormData => {
//     const fd = new FormData();
//     const payload = {
//       title: form.title,
//       description: form.description,
//       month_number: parseInt(form.month_number, 10),
//       // for_baby: form.category === "baby",
//       // for_mom: form.category === "mom",
//       ...(form.category === "baby"
//         ? { for_baby: "true" }
//         : { for_mom: "true" }),
//       content_type: form.content_type,
//     };
//     fd.append("data", JSON.stringify(payload));
//     if (form.videoFile) {
//       fd.append("video", form.videoFile);
//     }
//     return fd;
//   };

//   // ── Submit (create or update) ──
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.title.trim()) return;

//     const fd = buildFormData();

//     try {
//       if (isEditMode) {
//         await updateContentMutation({ id: editingId, data: fd }).unwrap();
//       } else {
//         await createContentMutation(fd).unwrap();
//       }
//       resetForm();
//       // refetch();
//     } catch (err) {
//       console.error("Content save failed:", err);
//     }
//   };

//   // ── Delete ──
//   const handleDeleteConfirm = async () => {
//     if (!deleteTarget) return;
//     try {
//       await deleteContentMutation({ id: deleteTarget.id }).unwrap();
//       setDeleteTarget(null);
//       // refetch();
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <DashboardLayout>
//       {/* Delete Confirmation Modal */}
//       {deleteTarget && (
//         <DeleteModal
//           item={deleteTarget}
//           onConfirm={handleDeleteConfirm}
//           onCancel={() => setDeleteTarget(null)}
//           isLoading={isDeleting}
//         />
//       )}

//       <div className='flex flex-col gap-6'>
//         {/* ── Form Card ── */}
//         <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-8'>
//           <div className='flex items-start gap-3 mb-8'>
//             <BookOpen className='h-6 w-6 text-gray-800' />
//             <div>
//               <h2 className='text-xl font-bold text-gray-900 tracking-tight mb-1'>
//                 Content Management
//               </h2>
//               <p className='text-sm text-gray-500'>
//                 Upload, Edit, Delete and organize content by week or age group
//               </p>
//             </div>
//           </div>

//           {/* Section header — changes based on mode */}
//           <div className='flex items-center justify-between mb-6'>
//             <div>
//               <h3 className='text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2'>
//                 {isEditMode ? (
//                   <>
//                     <Edit className='h-4 w-4 text-[#8fa38b]' />
//                     Edit Content
//                   </>
//                 ) : (
//                   <>
//                     <Plus className='h-4 w-4 text-[#8fa38b]' />
//                     Add New Content
//                   </>
//                 )}
//               </h3>
//               <p className='text-sm text-gray-500'>
//                 {isEditMode
//                   ? "Modify the fields below and save your changes"
//                   : "Text, photo or video"}
//               </p>
//             </div>

//             {/* Cancel edit button */}
//             {isEditMode && (
//               <button
//                 type='button'
//                 onClick={resetForm}
//                 className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 rounded-lg px-3 py-1.5'
//               >
//                 <X className='h-3.5 w-3.5' />
//                 Cancel Edit
//               </button>
//             )}
//           </div>

//           {/* Edit indicator banner */}
//           {isEditMode && (
//             <div className='mb-6 flex items-center gap-3 bg-[#f0f4f0] border border-[#c5d4c2] rounded-xl px-4 py-3'>
//               <div className='w-2 h-2 rounded-full bg-[#8fa38b] shrink-0' />
//               <p className='text-sm text-[#5a7a57] font-medium'>
//                 Editing existing content — changes will overwrite the current
//                 version.
//               </p>
//             </div>
//           )}

//           <form className='space-y-6' onSubmit={handleSubmit}>
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//               {/* Title */}
//               <div className='space-y-2'>
//                 <label className='text-sm font-medium text-gray-900'>
//                   Title <span className='text-red-400'>*</span>
//                 </label>
//                 <input
//                   type='text'
//                   value={form.title}
//                   onChange={(e) => setField("title", e.target.value)}
//                   placeholder='e.g. Pelvic Floor Basics'
//                   required
//                   className='w-full h-11 rounded-full border border-gray-200 bg-gray-50/50 px-4 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
//                 />
//               </div>

//               {/* Type */}
//               <div className='space-y-2'>
//                 <label className='text-sm font-medium text-gray-900'>
//                   Type
//                 </label>
//                 <div className='relative'>
//                   <select
//                     value={form.content_type}
//                     onChange={(e) =>
//                       setField(
//                         "content_type",
//                         e.target.value as FormState["content_type"],
//                       )
//                     }
//                     className='w-full h-11 appearance-none rounded-full border border-gray-200 bg-gray-50/50 px-4 pr-10 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
//                   >
//                     <option value='VIDEO'>Video</option>
//                     <option value='ARTICLE'>Article</option>
//                     <option value='IMAGE'>Image</option>
//                   </select>
//                   <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
//                 </div>
//               </div>

//               {/* Category */}
//               <div className='space-y-2'>
//                 <label className='text-sm font-medium text-gray-900'>
//                   Category
//                 </label>
//                 <div className='relative'>
//                   <select
//                     value={form.category}
//                     onChange={(e) =>
//                       setField(
//                         "category",
//                         e.target.value as FormState["category"],
//                       )
//                     }
//                     className='w-full h-11 appearance-none rounded-full border border-gray-200 bg-gray-50/50 px-4 pr-10 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
//                   >
//                     <option value='baby'>Baby</option>
//                     <option value='mom'>Mother / Mom</option>
//                   </select>
//                   <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
//                 </div>
//               </div>

//               {/* Month */}
//               <div className='space-y-2'>
//                 <label className='text-sm font-medium text-gray-900'>
//                   Month
//                 </label>
//                 <div className='relative'>
//                   <select
//                     value={form.month_number}
//                     onChange={(e) => setField("month_number", e.target.value)}
//                     className='w-full h-11 appearance-none rounded-full border border-gray-200 bg-gray-50/50 px-4 pr-10 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
//                   >
//                     {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
//                       <option key={m} value={m}>
//                         {m} {m === 1 ? "Month" : "Months"}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
//                 </div>
//               </div>
//             </div>

//             {/* Description */}
//             <div className='space-y-2'>
//               <label className='text-sm font-medium text-gray-900'>
//                 Description / Notes
//               </label>
//               <textarea
//                 value={form.description}
//                 onChange={(e) => setField("description", e.target.value)}
//                 placeholder='e.g. Gentle exercises to help strengthen neck and shoulder muscles.'
//                 className='w-full h-32 rounded-2xl border border-gray-200 bg-gray-50/50 p-4 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b] resize-none'
//               />
//             </div>

//             {/* Video File Upload */}
//             <div className='space-y-2'>
//               <label className='text-sm font-medium text-gray-900'>
//                 Video File{" "}
//                 {isEditMode && (
//                   <span className='text-xs text-gray-400 font-normal'>
//                     (leave empty to keep existing)
//                   </span>
//                 )}
//               </label>
//               <div
//                 className='relative border-2 border-dashed border-gray-200 rounded-2xl px-6 py-5 flex items-center gap-4 cursor-pointer hover:border-[#8fa38b] hover:bg-[#f5f8f5] transition-all'
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <UploadCloud className='h-5 w-5 text-gray-400 shrink-0' />
//                 <div className='flex-1 min-w-0'>
//                   {form.videoFile ? (
//                     <p className='text-sm text-gray-700 font-medium truncate'>
//                       {form.videoFile.name}
//                     </p>
//                   ) : (
//                     <p className='text-sm text-gray-400'>
//                       Click to upload a video file (.mp4, .mov, .webm)
//                     </p>
//                   )}
//                 </div>
//                 {form.videoFile && (
//                   <button
//                     type='button'
//                     className='shrink-0 text-gray-400 hover:text-gray-600'
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setField("videoFile", null);
//                       if (fileInputRef.current) fileInputRef.current.value = "";
//                     }}
//                   >
//                     <X className='h-4 w-4' />
//                   </button>
//                 )}
//               </div>
//               <input
//                 ref={fileInputRef}
//                 type='file'
//                 accept='video/*'
//                 className='hidden'
//                 onChange={(e) => {
//                   const file = e.target.files?.[0] ?? null;
//                   setField("videoFile", file);
//                 }}
//               />
//             </div>

//             {/* Actions */}
//             <div className='flex flex-wrap items-center gap-3 pt-2'>
//               <Button
//                 type='submit'
//                 disabled={isSaving || !form.title.trim()}
//                 className='bg-[#1C1C1C] hover:bg-black rounded-lg h-10 px-5 flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
//               >
//                 {isSaving ? (
//                   <>
//                     <span className='w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin' />
//                     {isEditMode ? "Updating…" : "Saving…"}
//                   </>
//                 ) : (
//                   <>
//                     <Check className='h-4 w-4' />
//                     {isEditMode ? "Update Content" : "Save Content"}
//                   </>
//                 )}
//               </Button>

//               {isEditMode && (
//                 <Button
//                   type='button'
//                   variant='outline'
//                   onClick={resetForm}
//                   className='rounded-lg h-10 px-5 flex items-center gap-2 text-sm font-medium bg-white text-gray-700 border-gray-200'
//                 >
//                   <X className='h-4 w-4' />
//                   Cancel
//                 </Button>
//               )}
//             </div>
//           </form>
//         </Card>

//         {/* ── Library Section ── */}
//         <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-8'>
//           <div className='mb-6'>
//             <h3 className='text-lg font-bold text-gray-900 tracking-tight'>
//               Library
//             </h3>
//             <p className='text-sm text-gray-500'>
//               Manage existing items · {contents.length} total
//             </p>
//           </div>

//           {contents.length === 0 ? (
//             <div className='flex flex-col items-center justify-center py-16 text-center text-gray-400'>
//               <BookOpen className='h-10 w-10 mb-3 opacity-30' />
//               <p className='text-sm font-medium'>No content yet</p>
//               <p className='text-xs mt-1'>
//                 Add your first item using the form above.
//               </p>
//             </div>
//           ) : (
//             <div className='overflow-x-auto'>
//               <table className='w-full text-left text-[14px]'>
//                 <thead>
//                   <tr className='border-b-2 border-gray-100 text-gray-900'>
//                     <th className='pb-3 px-4 font-semibold'>Title</th>
//                     <th className='pb-3 px-4 font-semibold text-center'>
//                       Type
//                     </th>
//                     <th className='pb-3 px-4 font-semibold text-center'>
//                       Category
//                     </th>
//                     <th className='pb-3 px-4 font-semibold text-center'>
//                       Month
//                     </th>
//                     <th className='pb-3 px-4 font-semibold text-center'>
//                       Created
//                     </th>
//                     <th className='pb-3 px-4 font-semibold text-center'>
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className='divide-y divide-gray-100 text-gray-600'>
//                   {contents.map((item) => {
//                     const isBeingEdited = editingId === item.id;
//                     return (
//                       <tr
//                         key={item.id}
//                         className={`transition-colors ${
//                           isBeingEdited
//                             ? "bg-[#f5f8f5] border-l-2 border-l-[#8fa38b]"
//                             : "hover:bg-gray-50/50"
//                         }`}
//                       >
//                         <td className='py-4 px-4 font-medium text-gray-800 max-w-50'>
//                           <div className='truncate'>{item.title}</div>
//                           {isBeingEdited && (
//                             <span className='inline-block text-[10px] text-[#8fa38b] font-semibold mt-0.5 uppercase tracking-wide'>
//                               Editing…
//                             </span>
//                           )}
//                         </td>
//                         <td className='py-4 px-4 text-center'>
//                           <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600'>
//                             <ContentTypeIcon type={item.content_type} />
//                             {item.content_type.charAt(0) +
//                               item.content_type.slice(1).toLowerCase()}
//                           </span>
//                         </td>
//                         <td className='py-4 px-4 text-center'>
//                           <span
//                             className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
//                               item.for_baby
//                                 ? "bg-blue-50 text-blue-600"
//                                 : "bg-pink-50 text-pink-600"
//                             }`}
//                           >
//                             {item.for_baby ? "Baby" : "Mom"}
//                           </span>
//                         </td>
//                         <td className='py-4 px-4 text-center text-gray-500'>
//                           {item.month_number != null
//                             ? `Month ${item.month_number}`
//                             : item.week_number != null
//                               ? `Week ${item.week_number}`
//                               : "—"}
//                         </td>
//                         <td className='py-4 px-4 text-center text-gray-500 text-xs'>
//                           {new Date(item.created_at).toLocaleDateString(
//                             "en-GB",
//                             {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric",
//                             },
//                           )}
//                         </td>
//                         <td className='py-4 px-4'>
//                           <div className='flex items-center justify-center gap-3'>
//                             <button
//                               title='Edit'
//                               onClick={() => handleEditClick(item)}
//                               className={`transition-colors ${
//                                 isBeingEdited
//                                   ? "text-[#8fa38b]"
//                                   : "text-gray-400 hover:text-gray-800"
//                               }`}
//                             >
//                               <Edit className='h-4 w-4' />
//                             </button>
//                             <button
//                               title='Delete'
//                               onClick={() => setDeleteTarget(item)}
//                               className='text-[#d28b81] hover:text-red-500 transition-colors'
//                             >
//                               <Trash2 className='h-4 w-4' />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// }
