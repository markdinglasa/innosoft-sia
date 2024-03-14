import { TextField } from '@mui/material';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

const LOGIN_URL = '/auth';

export const Login = () => {
    const { setAuth }: any = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        //userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await window.api.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            /*if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();*/
        }
    }

    function handleChange(_event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        throw new Error('Function not implemented.');
    }

    return (
        <>
        <section className=''>
            <div className="flex items-center justify-center h-full" style={{width:'400px', height:'400px'}}>
                <div className="w-full max-w-xl p-6 bg-white rounded-md shadow-md">
                    <h1 className="text-3xl font-semibold text-center text-gray-600 ">Sign In</h1>
                    <div className="border-gray-100 px-2 py-2"> 
                        {errMsg !== '' && (
                            <>
                                <span ref={errMsg} className="text-xs label-text text-error display-none">
                                {errMsg}
                                </span>
                                <br />
                            </>
                        )}
                    </div>
                        <form className="space-y-2" onSubmit={handleSubmit}>
                            <div className="px-2 ">
                                <TextField
                                    label="Username"
                                    defaultValue=""
                                    placeholder="Enter username..."
                                    name="username"
                                    size="small"
                                    type="text"
                                    onChange={(e) => setUser(e.target.value)}
                                    value={user}
                                    className="w-full input input-primary"
                                    id="username"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            <div className="px-2 ">
                                <TextField
                                    label="Password"
                                    defaultValue=""
                                    placeholder="Enter password..."
                                    name="password"
                                    size="small"
                                    type="text"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    className="w-full input input-primary"
                                    id="password"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            <div className="w-full px-2">
                                <button className="shadow-md btn rounded-md mr-3 btn-primary w-full"> Sign In  </button>
                            </div>
                        </form>
                </div>
            </div>
        </section>
        </>
    )
}
