import React, { useEffect, useState } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const tooltipClasses = {
    tooltip: "mui-tooltip",
    arrow: "mui-tooltip-arrow",
    popper: "mui-tooltip-popper",
};

const getSide = (placement) => {
    if (!placement) return "top";
    if (placement.startsWith("top")) return "top";
    if (placement.startsWith("bottom")) return "bottom";
    if (placement.startsWith("left")) return "left";
    if (placement.startsWith("right")) return "right";
    return "top";
};

const getAlign = (placement) => {
    if (!placement) return "center";
    if (placement.endsWith("start")) return "start";
    if (placement.endsWith("end")) return "end";
    return "center";
};

export function Tooltip({
    children,
    title,
    classes = {},
    componentsProps = {},
    arrow = false,
    placement = "top",
    open,
    onOpenChange,
    ...rest
}) {
    const popperClass =
        classes.popper ||
        (componentsProps && componentsProps.tooltip && componentsProps.tooltip.className) ||
        "";
    const content = typeof title === "string" ? <span>{title}</span> : title;

    return (
        <TooltipPrimitive.Provider delayDuration={200}>
            <TooltipPrimitive.Root open={open} onOpenChange={onOpenChange}>
                <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
                {title ? (
                    <TooltipPrimitive.Content
                        side={getSide(placement)}
                        align={getAlign(placement)}
                        sideOffset={6}
                        className={`${tooltipClasses.popper} ${popperClass}`}
                        {...rest}
                    >
                        <div className={tooltipClasses.tooltip}>{content}</div>
                        {arrow ? <TooltipPrimitive.Arrow className={tooltipClasses.arrow} /> : null}
                    </TooltipPrimitive.Content>
                ) : null}
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}

const anchorOriginOffset = (rect, anchorOrigin) => {
    const x =
        anchorOrigin?.horizontal === "center"
            ? rect.left + rect.width / 2
            : anchorOrigin?.horizontal === "right"
              ? rect.right
              : rect.left;
    const y =
        anchorOrigin?.vertical === "center"
            ? rect.top + rect.height / 2
            : anchorOrigin?.vertical === "bottom"
              ? rect.bottom
              : rect.top;
    return { x, y };
};

const transformOriginOffset = (transformOrigin) => {
    const x =
        transformOrigin?.horizontal === "center"
            ? "-50%"
            : transformOrigin?.horizontal === "right"
              ? "-100%"
              : "0%";
    const y =
        transformOrigin?.vertical === "center"
            ? "-50%"
            : transformOrigin?.vertical === "bottom"
              ? "-100%"
              : "0%";
    return { x, y };
};

export function Popover({
    children,
    open,
    onClose,
    anchorEl,
    anchorOrigin = { vertical: "bottom", horizontal: "left" },
    transformOrigin = { vertical: "top", horizontal: "left" },
    PaperProps = {},
    className = "",
    ...props
}) {
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (open && anchorEl) {
            const el = typeof anchorEl === "function" ? anchorEl() : anchorEl;
            if (el?.getBoundingClientRect) {
                const rect = el.getBoundingClientRect();
                const anchorPos = anchorOriginOffset(rect, anchorOrigin);
                setPosition({ top: anchorPos.y, left: anchorPos.x });
            }
        }
    }, [open, anchorEl, anchorOrigin]);

    const transform = transformOriginOffset(transformOrigin);

    return (
        <PopoverPrimitive.Root open={open} onOpenChange={(value) => !value && onClose?.()}>
            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                    className={`compat-popover ${className}`}
                    style={{
                        position: "fixed",
                        top: position.top,
                        left: position.left,
                        transform: `translate(${transform.x}, ${transform.y})`,
                        zIndex: 1300,
                        minWidth: 260,
                        background: "var(--menu-bg)",
                        borderRadius: "16px",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
                    }}
                    {...props}
                >
                    <div
                        className={PaperProps?.className || ""}
                        style={{
                            width: "100%",
                            minWidth: 260,
                        }}
                    >
                        {children}
                    </div>
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}

export function Dialog({
    children,
    open = false,
    onClose,
    className = "",
    PaperProps = {},
    ...props
}) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className="compat-dialog-overlay"
                    style={{
                        background: "rgba(0, 0, 0, 0.65)",
                        inset: 0,
                        position: "fixed",
                        zIndex: 1300,
                    }}
                />
                <DialogPrimitive.Content
                    className={`${className} ${PaperProps?.className || ""}`}
                    style={{
                        background: "var(--menu-bg)",
                        color: "var(--body-color)",
                        borderRadius: "16px",
                        boxShadow: "0 22px 68px rgba(0, 0, 0, 0.45)",
                        padding: "20px",
                        position: "fixed",
                        left: "50%",
                        transform: "translateX(-50%)",
                        maxWidth: "min(680px, calc(100vw - 40px))",
                        width: "100%",
                        zIndex: 1400,
                    }}
                    {...props}
                >
                    {children}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

export function DialogTitle({ children, className = "", ...props }) {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
}

export function DialogContent({ children, className = "", ...props }) {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
}

export function DialogActions({ children, className = "", ...props }) {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
}

export function DialogContentText({ children, className = "", ...props }) {
    return (
        <p className={className} {...props}>
            {children}
        </p>
    );
}

export function Menu({ children, ...props }) {
    return <div {...props}>{children}</div>;
}

export function Select({ children, ...props }) {
    return <select {...props}>{children}</select>;
}

export default {
    Tooltip,
    Popover,
    Dialog,
    Menu,
    Select,
};
