import styled from 'styled-components';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { user } from '../recoil/atom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginProps {}

function Login(props: LoginProps) {
    const setAuth = useSetRecoilState(user);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const onSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((e) => {
        e.preventDefault();

        if (username.length > 20 || username.length < 6 || password.length > 20 || password.length < 6) {
            toast.error("Your username and your password length should be contained between 6 and 20 characters");
            return;
        }
        setAuth({
            username: username,
            id: username,
        })
    }, [username, password, setAuth])

    return <StyledLogin>
        <Modal>
            <Logo noRedirect />
            <Form onSubmit={onSubmit}>
                <Input placeholder='username' name={'username'} onChange={(e) => setUsername(e.target.value)} />
                <Input placeholder='password' type={'password'} name={'password'} onChange={(e) => setPassword(e.target.value)} />
                <Button type='submit'>Login</Button>
            </Form>
            <Link to={'/register'}>Don't have an account? Register.</Link>
        </Modal>
    </StyledLogin>;
}

const StyledLogin = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

const Modal = styled.div`
    width: 50%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const Input = styled.input`
    padding: 10px 20px;
    margin-bottom: 10px;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px 0;
`

const Button = styled.button`
    padding: 10px 30px;
    background-color: #FC58AA;
    border: none;
    color: white;
    align-self: flex-end;
    cursor: pointer;
`

export default Login;