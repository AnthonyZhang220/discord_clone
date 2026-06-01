import React, { useEffect, useState, forwardRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

export const tooltipClasses = {
    tooltip: "mui-tooltip",
    arrow: "mui-tooltip-arrow",
    popper: "mui-tooltip-popper",
};

const badgePositionClass = (anchorOrigin) => {
    const vertical = anchorOrigin?.vertical || "bottom";
    const horizontal = anchorOrigin?.horizontal || "right";
    return `radix-badge-indicator--${vertical}-${horizontal}`;
};

const AvatarInner = forwardRef(function AvatarInner(
    { className = "", src, alt = "", imgProps = {}, fallback, style, ...props },
    ref
) {
    const hasInitial = alt && alt.trim().length > 0;
    const content = fallback || (hasInitial ? alt.trim()[0].toUpperCase() : "");

    return (
        <AvatarPrimitive.Root
            ref={ref}
            className={`radix-avatar ${className}`.trim()}
            style={style}
            {...props}
        >
            {src ? (
                <AvatarPrimitive.Image
                    className="radix-avatar-image"
                    src={src}
                    alt={alt}
                    onError={(event) => {
                        event.currentTarget.style.display = "none";
                    }}
                    {...imgProps}
                />
            ) : null}
            <AvatarPrimitive.Fallback className="radix-avatar-fallback" delayMs={0}>
                {content}
            </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
    );
});

export const Avatar = React.memo(AvatarInner);
Avatar.displayName = "Avatar";

export const Badge = forwardRef(
    (
        {
            className = "",
            badgeContent,
            // eslint-disable-next-line no-unused-vars
            _overlap = "circular",
            anchorOrigin = { vertical: "bottom", horizontal: "right" },
            children,
            ...props
        },
        ref
    ) => (
        <span ref={ref} className={`radix-badge ${className}`.trim()} {...props}>
            {children}
            {badgeContent != null ? (
                <span
                    className={`radix-badge-indicator ${badgePositionClass(anchorOrigin)}`.trim()}
                >
                    {badgeContent}
                </span>
            ) : null}
        </span>
    )
);
Badge.displayName = "Badge";

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
    // eslint-disable-next-line no-unused-vars
    _anchorReference,
    anchorOrigin = { vertical: "", horizontal: "" },
    transformOrigin = { vertical: "top", horizontal: "left" },
    position: externalPosition,
    PaperProps = {},
    className = "",
    ...props
}) {
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!externalPosition && open && anchorEl) {
            const el = typeof anchorEl === "function" ? anchorEl() : anchorEl;
            if (el?.getBoundingClientRect) {
                const rect = el.getBoundingClientRect();
                const anchorPos = anchorOriginOffset(rect, anchorOrigin);
                setPosition({ top: anchorPos.y, left: anchorPos.x });
            }
        }
    }, [open, anchorEl, anchorOrigin, externalPosition]);

    const transform = transformOriginOffset(transformOrigin);
    const finalPosition = externalPosition || position;
    const contentClassName = `compat-popover ${className} ${PaperProps?.className || ""}`.trim();
    const contentStyle = {
        position: "fixed",
        top: finalPosition.top,
        left: finalPosition.left,
        transform: `translate(${transform.x}, ${transform.y})`,
        zIndex: 1300,
        minWidth: 260,
        background: "var(--menu-bg)",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
        ...PaperProps?.style,
    };

    return (
        <PopoverPrimitive.Root open={open} onOpenChange={(value) => !value && onClose?.()}>
            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                    className={contentClassName}
                    style={contentStyle}
                    {...props}
                >
                    {children}
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}

export function HoverCard({
    children,
    content,
    side = "right",
    align = "center",
    sideOffset = 8,
    className = "",
    open: controlledOpen,
    onOpenChange,
    ...props
}) {
    const [open, setOpen] = useState(false);
    const openState = controlledOpen !== undefined ? controlledOpen : open;

    const setOpenState = (value) => {
        if (onOpenChange) onOpenChange(value);
        if (controlledOpen === undefined) {
            setOpen(value);
        }
    };

    const trigger = React.isValidElement(children)
        ? React.cloneElement(children, {
              onMouseEnter: (event) => {
                  children.props.onMouseEnter?.(event);
                  setOpenState(true);
              },
              onMouseLeave: (event) => {
                  children.props.onMouseLeave?.(event);
                  setOpenState(false);
              },
              onFocus: (event) => {
                  children.props.onFocus?.(event);
                  setOpenState(true);
              },
              onBlur: (event) => {
                  children.props.onBlur?.(event);
                  setOpenState(false);
              },
          })
        : children;

    return (
        <PopoverPrimitive.Root open={openState} onOpenChange={setOpenState}>
            <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                    side={side}
                    align={align}
                    sideOffset={sideOffset}
                    className={`compat-hovercard ${className}`}
                    {...props}
                >
                    {content}
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}

export function Dialog({
    children,
    open = false,
    onClose,
    onOpenChange,
    className = "",
    PaperProps = {},
    ...props
}) {
    const handleOpenChange = (isOpen) => {
        if (onOpenChange) {
            onOpenChange(isOpen);
        }
        if (!isOpen && onClose) {
            onClose();
        }
    };

    return (
        <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
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
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: "min(680px, calc(100vw - 40px))",
                        width: "100%",
                        zIndex: 1400,
                        maxHeight: "calc(100vh - 40px)",
                        overflow: "auto",
                        ...PaperProps?.style,
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
