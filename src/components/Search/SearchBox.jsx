import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { debounce as debounceUtil } from "@/handlers/searchHandlers";
import "./SearchBox.scss";

export default function SearchBox({
    placeholder = "Search",
    onSearch,
    onChangeValue,
    debounceMs = 300,
    innerClassName = "search-inner",
    inputClassName = "search-input",
    wrapperClassName = "search-box",
}) {
    const [value, setValue] = useState("");
    const debouncedRef = useRef(() => {});

    useEffect(() => {
        debouncedRef.current = debounceUtil((v) => {
            if (typeof onSearch === "function") onSearch(v);
        }, debounceMs);
    }, [onSearch, debounceMs]);

    const handleChange = (e) => {
        const v = e.target.value;
        setValue(v);
        if (typeof onChangeValue === "function") onChangeValue(v);
        debouncedRef.current(v);
    };

    return (
        <div className={wrapperClassName}>
            <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                <div className={innerClassName}>
                    <div className="sidebar-search">
                        <SearchIcon className="search-icon" />
                        <input
                            className={inputClassName}
                            type="search"
                            placeholder={placeholder}
                            value={value}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
