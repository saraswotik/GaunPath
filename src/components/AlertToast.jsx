/*
 * AlertToast.jsx — Animated alert/toast notification component
 *
 * Adapted from 21st.dev for GaunPath:
 *   - Converted from TypeScript to plain JavaScript
 *   - Replaced shadcn tokens with GaunPath dark-theme colours
 *   - Kept cva, framer-motion, lucide-react
 *
 * PROPS:
 *   - variant     : "success" | "warning" | "info" | "error"
 *   - styleVariant: "default" (outlined) | "filled" (solid bg)
 *   - title       : string — bold heading
 *   - description : string — detail text
 *   - onClose     : function — dismiss handler
 */

import React, { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XOctagon, X } from "lucide-react";
import { cn } from "../lib/utils";

/*
 * cva (class-variance-authority) — defines a base class string
 * plus variant-specific class combos. Works in plain JS.
 * Two axes: variant (colour) × styleVariant (default/filled).
 */
const alertToastVariants = cva(
  "relative w-full max-w-sm overflow-hidden rounded-2xl shadow-lg flex items-start p-4 space-x-4",
  {
    variants: {
      variant: { success: "", warning: "", info: "", error: "" },
      styleVariant: {
        default: "bg-gaun-card border",
        filled: "",
      },
    },
    compoundVariants: [
      /* Default: dark card bg + coloured border */
      { variant: "success", styleVariant: "default", className: "text-gaun-teal border-gaun-teal/30" },
      { variant: "warning", styleVariant: "default", className: "text-amber-400 border-amber-400/30" },
      { variant: "info", styleVariant: "default", className: "text-blue-400 border-blue-400/30" },
      { variant: "error", styleVariant: "default", className: "text-gaun-error border-gaun-error/30" },
      /* Filled: solid coloured background */
      { variant: "success", styleVariant: "filled", className: "bg-emerald-600 text-white" },
      { variant: "warning", styleVariant: "filled", className: "bg-amber-500 text-amber-950" },
      { variant: "info", styleVariant: "filled", className: "bg-blue-600 text-white" },
      { variant: "error", styleVariant: "filled", className: "bg-red-600 text-white" },
    ],
    defaultVariants: { variant: "info", styleVariant: "default" },
  }
);

/* Icon map — each variant gets a lucide-react icon */
const iconMap = { success: CheckCircle2, warning: AlertTriangle, info: Info, error: XOctagon };

/* Icon colours — differ for default (outlined) vs filled styles */
const iconColorClasses = {
  default: { success: "text-gaun-teal", warning: "text-amber-400", info: "text-blue-400", error: "text-gaun-error" },
  filled: { success: "text-white", warning: "text-amber-950", info: "text-white", error: "text-white" },
};

/*
 * AlertToast — animated, dismissible alert card.
 * Uses framer-motion for spring enter/exit animations.
 * Parent must wrap in <AnimatePresence> for exit animations.
 */
const AlertToast = forwardRef(function AlertToast(
  { variant = "info", styleVariant = "default", title, description, onClose, className, ...props },
  ref
) {
  const Icon = iconMap[variant];

  return (
    <motion.div
      ref={ref}
      role="alert"
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(alertToastVariants({ variant, styleVariant }), className)}
      {...props}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <Icon className={cn("h-6 w-6", iconColorClasses[styleVariant][variant])} aria-hidden="true" />
      </div>

      {/* Content — title + description */}
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm opacity-90">{description}</p>
      </div>

      {/* Close button — calls onClose from parent */}
      <div className="flex-shrink-0">
        <button
          onClick={onClose}
          aria-label="Close"
          className={cn(
            "p-1 rounded-full opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 transition-opacity",
            styleVariant === "default"
              ? "text-gaun-text/70 hover:bg-gaun-border"
              : "hover:bg-black/20"
          )}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
});

export { AlertToast, alertToastVariants };
