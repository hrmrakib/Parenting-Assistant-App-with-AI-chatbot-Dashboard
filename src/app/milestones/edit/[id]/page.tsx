/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Flag, ArrowLeft, Check, ChevronDown, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetMilestoneByIdQuery,
  useCreateMilestoneMutation,
  useUpdateMomMilestoneMutation,
  useUpdateBabyMilestoneMutation,
} from "@/redux/features/milestones/milestonesAPI";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

// ─── Types ────────────────────────────────────────────────────────────────────

type MilestoneType = "for_baby" | "for_mom";

interface FormState {
  title: string;
  instructions: string;
  milestone_type: MilestoneType;
  period: string; // month_number for baby, week_number for mom
}

const INITIAL_FORM: FormState = {
  title: "",
  instructions: "",
  milestone_type: "for_baby",
  period: "1",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MilestoneFormPage() {
  const router = useRouter();
  const params = useParams();

  const milestoneId =
    params?.id && params.id !== "new" ? (params.id as string) : null;
  const isEditMode = !!milestoneId;

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const [createMilestone, { isLoading: isCreating }] =
    useCreateMilestoneMutation();
  const [updateMomMilestone, { isLoading: isUpdatingMom }] =
    useUpdateMomMilestoneMutation();
  const [updateBabyMilestone, { isLoading: isUpdatingBaby }] =
    useUpdateBabyMilestoneMutation();

  const isSaving = isCreating || isUpdatingMom || isUpdatingBaby;
  const isBaby = form.milestone_type === "for_baby";

  // Fetch milestone data when editing
  const { data: milestoneData } = useGetMilestoneByIdQuery(milestoneId, {
    skip: !isEditMode,
  });

  useEffect(() => {
    const m = milestoneData?.data;
    if (!m) return;
    setForm({
      title: m.title,
      instructions: m.instructions,
      milestone_type: m.milestone_type,
      period: m.month_number?.toString() ?? m.week_number?.toString() ?? "1",
    });
  }, [milestoneData]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const periodNum = parseInt(form.period, 10);

    try {
      if (isEditMode) {
        // Use the correct mutation depending on milestone type
        if (isBaby) {
          await updateBabyMilestone({
            milestone_id: milestoneId,
            title: form.title,
            instructions: form.instructions,
            month_number: periodNum,
          }).unwrap();
        } else {
          await updateMomMilestone({
            milestone_id: milestoneId,
            title: form.title,
            instructions: form.instructions,
            week_number: periodNum,
          }).unwrap();
        }
      } else {
        await createMilestone({
          title: form.title,
          instructions: form.instructions,
          milestone_type: form.milestone_type,
          ...(isBaby
            ? { month_number: periodNum }
            : { week_number: periodNum }),
        }).unwrap();
      }

      router.push("/milestones");
    } catch (err) {
      console.error("Milestone save failed:", err);
    }
  };

  const maxPeriod = isBaby ? 24 : 60;
  const periodLabel = isBaby ? "Month" : "Week";

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <DashboardLayout>
        <div className='flex flex-col gap-6 max-w-2xl'>
          {/* Back */}
          <button
            onClick={() => router.push("/milestones")}
            className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Milestones
          </button>

          <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-8'>
            {/* Header */}
            <div className='flex items-start gap-3 mb-8'>
              <Flag className='h-6 w-6 text-gray-800 mt-0.5' />
              <div>
                <h2 className='text-xl font-bold text-gray-900 tracking-tight mb-1 flex items-center gap-2'>
                  {isEditMode ? (
                    <>
                      <Edit className='h-4 w-4 text-[#8fa38b]' />
                      Edit Milestone
                    </>
                  ) : (
                    <>
                      <Plus className='h-4 w-4 text-[#8fa38b]' />
                      New Milestone
                    </>
                  )}
                </h2>
                <p className='text-sm text-gray-500'>
                  {isEditMode
                    ? "Update the milestone details below"
                    : "Fill in the details to create a new milestone"}
                </p>
              </div>
            </div>

            {isEditMode && (
              <div className='mb-6 flex items-center gap-3 bg-[#f0f4f0] border border-[#c5d4c2] rounded-xl px-4 py-3'>
                <div className='w-2 h-2 rounded-full bg-[#8fa38b] shrink-0' />
                <p className='text-sm text-[#5a7a57] font-medium'>
                  Editing existing milestone — changes will overwrite the
                  current version.
                </p>
              </div>
            )}

            <form className='space-y-6' onSubmit={handleSubmit}>
              {/* Title */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-900'>
                  Title <span className='text-red-400'>*</span>
                </label>
                <input
                  type='text'
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder='e.g. Month 1 - Newborn Period'
                  required
                  className='w-full h-11 rounded-full border border-gray-200 bg-gray-50/50 px-4 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
                />
              </div>

              {/* Type + Period */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-900'>
                    For
                  </label>
                  <div className='relative'>
                    <select
                      value={form.milestone_type}
                      disabled={isEditMode}
                      onChange={(e) => {
                        setField(
                          "milestone_type",
                          e.target.value as MilestoneType,
                        );
                        setField("period", "1");
                      }}
                      className='w-full h-11 appearance-none rounded-full border border-gray-200 bg-gray-50/50 px-4 pr-10 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b] disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                      <option value='for_baby'>Baby</option>
                      <option value='for_mom'>Mom</option>
                    </select>
                    <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                  </div>
                  {isEditMode && (
                    <p className='text-xs text-gray-400'>
                      Type cannot be changed after creation.
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-900'>
                    {periodLabel} Number
                  </label>
                  <div className='relative'>
                    <select
                      value={form.period}
                      onChange={(e) => setField("period", e.target.value)}
                      className='w-full h-11 appearance-none rounded-full border border-gray-200 bg-gray-50/50 px-4 pr-10 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
                    >
                      {Array.from({ length: maxPeriod }, (_, i) => i + 1).map(
                        (n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? periodLabel : `${periodLabel}s`}
                          </option>
                        ),
                      )}
                    </select>
                    <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-900'>
                  Instructions
                </label>
                <textarea
                  value={form.instructions}
                  onChange={(e) => setField("instructions", e.target.value)}
                  placeholder='e.g. Focus on feeding every 2–3 hours, umbilical cord care...'
                  className='w-full h-36 rounded-2xl border border-gray-200 bg-gray-50/50 p-4 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b] resize-none'
                />
              </div>

              {/* Actions */}
              <div className='flex flex-wrap items-center gap-3 pt-2'>
                <Button
                  type='submit'
                  disabled={isSaving || !form.title.trim()}
                  className='bg-[#1C1C1C] hover:bg-black rounded-lg h-10 px-5 flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <span className='flex items-center gap-2'>
                    {isSaving ? (
                      <span className='w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                    ) : (
                      <Check className='h-4 w-4' />
                    )}
                    {isSaving
                      ? isEditMode
                        ? "Updating…"
                        : "Saving…"
                      : isEditMode
                        ? "Update Milestone"
                        : "Save Milestone"}
                  </span>
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.push("/milestones")}
                  className='rounded-lg h-10 px-5 text-sm font-medium bg-white text-gray-700 border-gray-200'
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </DashboardLayout>
    </RoleRedirect>
  );
}
