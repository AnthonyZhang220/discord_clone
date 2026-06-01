import React from "react";
import { Avatar, Badge } from "@/components/compat/RadixCompat";
import StatusList from "@/components/StatusList";
import "./AvatarWithStatus.scss";

const AvatarWithStatus = React.forwardRef(function AvatarWithStatus(
    {
        alt,
        src,
        status,
        containerClassName = "",
        avatarClassName = "",
        fallback,
        imgProps,
        size,
        badgeProps = {},
        avatarProps = {},
        ...rest
    },
    ref
) {
    const badgeContent = status ? <StatusList status={status} /> : null;

    const wrapperClass = [containerClassName, "avatar-with-status"].filter(Boolean).join(" ");
    const avatarStyle = size ? { width: size, height: size } : undefined;

    return (
        <div className={wrapperClass}>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={badgeContent}
                {...badgeProps}
            >
                <Avatar
                    ref={ref}
                    alt={alt}
                    src={src}
                    fallback={fallback}
                    imgProps={imgProps}
                    className={avatarClassName}
                    style={avatarStyle}
                    {...avatarProps}
                    {...rest}
                />
            </Badge>
        </div>
    );
});

export default AvatarWithStatus;
