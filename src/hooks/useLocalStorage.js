import { useEffect } from 'react'

function useLocalStorage(uid) {
    useEffect(() => {
        //if user not in the storage, add to the local storage
        if (!localStorage.getItem(`${uid}`)) {
            localStorage.setItem(`${uid}`, JSON.stringify({ defaultServer: "", defaultServerName: "", userDefault: [] }));
        } else {
            const localStorage = JSON.parse(localStorage.getItem(`${uid}`))
        }
    }, [uid])


    return { localStorage }
}

export default useLocalStorage