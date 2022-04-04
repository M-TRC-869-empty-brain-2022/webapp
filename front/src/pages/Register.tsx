import styled from 'styled-components';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import {useCallback, useState} from 'react';
import {toast} from "react-toastify";
import Api from "src/utils/api";

interface RegisterProps {}

function Register(props: RegisterProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordC, setPasswordC] = useState('');

    const onSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (username.length > 20 || username.length < 6 || password.length > 32 || password.length < 8) {
            toast.error("Your username and your password length should be contained between 8 and 32 characters");
            return;
        }

        if (password !== passwordC) {
            toast.error("The password and the confirmation doesn't match");
            return;
        }

        const noMatch = (regex: string, message: string) => {
            if (!password.match(regex)) {
                return `You must include at least one ${message}`;
            }
            return undefined;
        }

        const verifications = [
            noMatch('[0-9]+', 'digit'),
            noMatch('[a-z]+', 'lowercase char'),
            noMatch('[A-Z]+', 'uppercase char'),
            noMatch('[*.!@$%^&(){}[\\]:;<>,.?/~_+\\-=|]+', 'special char (*.!@$%^&(){}[\\]:;<>,.?/~_+\\-=|)')
        ];

        const failed = verifications.reduce((acc, v) => (acc || v), undefined);

        if (failed) {
            toast.error(failed);
            return;
        }

        try {
            await Api.register({username, password});
        } catch (e) {
            // @ts-ignore
            toast.error(e.message);
            return;
        }

        toast.success("All good!");

    }, [username, password, passwordC])

    return <StyledRegister>
        <Modal>
            <Logo noRedirect />
            <Form onSubmit={onSubmit}>
                <Input placeholder='username' name={'username'} onChange={(e) => setUsername(e.target.value)} />
                <Input placeholder='password' type={'password'} name={'password'} onChange={(e) => setPassword(e.target.value)} />
                <Input placeholder='confirm password' type={'password'} name={'password'} onChange={(e) => setPasswordC(e.target.value)} />
                <Button type='submit'>Register</Button>
            </Form>
            <Link to={'/login'}>Already have an account? Login.</Link>
        </Modal>
    </StyledRegister>;
}

const StyledRegister = styled.div`
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

export default Register;