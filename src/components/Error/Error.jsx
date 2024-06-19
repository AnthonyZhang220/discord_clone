import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Snackbar, AlertTitle } from '@mui/material'
import { setError } from '../../redux/features/errorSlice';

function Error() {
    const dispatch = useDispatch();
    const { error } = useSelector(state => state.error)
    const handleClose = () => {
        dispatch(setError(null))
    }

    if (error) {
        return (
            <Snackbar open={error !== null} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    <AlertTitle>{error.type}</AlertTitle>
                    {error.reason}
                </Alert>
            </Snackbar>
        )
    } else {
        return null;
    }
}

export default Error