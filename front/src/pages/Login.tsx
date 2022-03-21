import styled from 'styled-components';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import { useCallback } from 'react';

interface LoginProps {}

function Login(props: LoginProps) {
    const onSubmit = useCallback((e) => {
        e.preventDefault();
    }, [])

    return <StyledLogin>
        <Modal>
            <Logo noRedirect />
            <Form onSubmit={onSubmit}>
                <Input placeholder='username'/>
                <Input placeholder='password' type={'password'} />
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