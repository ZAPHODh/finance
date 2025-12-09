"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { useMultiStepForm } from "@/hooks/use-multi-step-viewer";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion, type MotionProps } from "motion/react";
import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { useScopedI18n } from "@/locales/client";

const NextButton = (
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) => {
  const { isLastStep, goToNext } = useMultiStepForm();
  if (isLastStep) return null;
  return (
    <Button size="sm" type="button" onClick={() => goToNext()} {...props} />
  );
};

const PreviousButton = (
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) => {
  const { isFirstStep, goToPrevious } = useMultiStepForm();
  if (isFirstStep) return null;
  return (
    <Button
      size="sm"
      type="button"
      variant="outline"
      onClick={() => goToPrevious()}
      {...props}
    />
  );
};

const SubmitButton = (
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) => {
  const { isLastStep } = useMultiStepForm();
  if (!isLastStep) return null;
  return <Button size="sm" type="button" {...props} />;
};

const ResetButton = (
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) => {
  return <Button size="sm" type="button" variant="ghost" {...props} />;
};

const FormHeader = (props: React.ComponentProps<"div">) => {
  const { currentStepIndex, steps } = useMultiStepForm();
  const t = useScopedI18n('ui.common');
  return (
    <div
      className="flex flex-col items-start justify-center gap-1 pb-4"
      {...props}
    >
      <span>
        {t('stepCounter', { current: String(currentStepIndex), total: String(steps.length) })}
      </span>
      <Progress value={(currentStepIndex / steps.length) * 100} />
    </div>
  );
};
const FormFooter = (props: React.ComponentProps<"div">) => {
  return (
    <div
      className="w-full pt-3 flex items-center justify-end gap-3"
      {...props}
    />
  );
};

const StepFields = (props: React.ComponentProps<"div"> & MotionProps) => {
  const { currentStepIndex, steps } = useMultiStepForm();
  const currentFormStep = steps[currentStepIndex - 1];
  if (
    !currentFormStep ||
    currentStepIndex < 1 ||
    currentStepIndex > steps.length
  ) {
    return null;
  }
  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20, position: "absolute", top: 0, width: "100%" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          {...props}
        >
          {currentFormStep.component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

function MultiStepFormContent(props: React.ComponentProps<"div">) {
  return <div className="flex flex-col gap-2 pt-3" {...props} />;
}

export {
  MultiStepFormContent,
  FormHeader,
  FormFooter,
  StepFields,
  NextButton,
  PreviousButton,
  SubmitButton,
  ResetButton,
};
