import {useCallback, useState} from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Body from '../components/Body';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import { user } from '../recoil/atom';
import Api from "src/utils/api";
import {toast} from "react-toastify";
import ProfilePicture from "src/components/ProfilePicture";

function Logout() {
    const navigate = useNavigate();
    const setAuth = useSetRecoilState(user);

    const onLogout = useCallback(() => {
        setAuth(null);
        Api.logout();
        navigate('/login');
    }, [navigate, setAuth]);
    
    return <StyledLogout onClick={onLogout}>
        Log-out
    </StyledLogout>
}

const StyledLogout = styled.div`
    cursor: pointer;
    padding: 10px 30px;
    border: 1px solid red;
    display: inline-block;
    border-radius: 5px;
    background-color: white;
    color: red;
`

function ChangePassword() {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordC, setNewPasswordC] = useState('');

    const onSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (![password, newPassword, newPasswordC].reduce((acc, p) => acc && p.length >= 6 && p.length <= 20, true)) {
            toast.error("Invalid password length");
            return;
        }

        if (newPassword !== newPasswordC) {
            toast.error("Password does not match");
            return;
        }

        if (newPassword === password) {
            toast.error("Old password is the same as old password");
            return;
        }

        try {
            await Api.changePassword({ oldPassword: password, newPassword: newPassword });

            e.target.reset();
            toast.success("Password changed!");
        } catch (e) {
            // @ts-ignore
            toast.error(e.message);
        }
    }, [password, newPassword, newPasswordC]);

    return <ChangePasswordSection onSubmit={onSubmit}>
        <h3 style={{ margin: 0, marginBottom: '10px' }}>Change your password</h3>
        <PasswordInput name={"oldPassword"} type={"password"} placeholder={'old password'} onChange={(e) => setPassword(e.target.value)} />
        <PasswordInput name={"newPassword"} type={"password"} placeholder={'new password'} onChange={(e) => setNewPassword(e.target.value)} />
        <PasswordInput name={"newPasswordC"} type={"password"} placeholder={'new password confirmation'} onChange={(e) => setNewPasswordC(e.target.value)} />
        <PasswordSubmit type={"submit"}>Submit</PasswordSubmit>
    </ChangePasswordSection>
}

function Role() {
    const auth = useRecoilValue(user);

    return <StyledRole style={{ backgroundColor: auth?.role === 'ADMIN' ? '#fc0331' : '#45fc03' }}>
        { auth?.role.toLocaleLowerCase() }
    </StyledRole>
}

const StyledRole = styled.div`
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
`

function User() {
    const { username } = useParams();

    return <StyledUser>
        <Header />
        <Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: '1', alignItems: 'center' }}>
            <ProfilePicture />
            <Sep style={{ height: '40px' }} />
            <Username>@{username}</Username>
            <Sep />
            <Role />
            <Sep style={{ height: '40px' }} />
            <ChangePassword />
            <Sep style={{ height: '40px' }} />
            <Logout />
        </Body>
    </StyledUser>
}

const StyledUser = styled.div`
display: flex;
flex-direction: column;
  height: 100%;
`

const Username = styled.div`
font-weight: bold;
`

const ChangePasswordSection = styled.form`
    display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30%;
  padding: 30px 0;
  border-top: 1px solid #fc58aa;
  border-bottom: 1px solid #fc58aa;
`

const PasswordInput = styled.input`
margin: 10px 0;
  padding: 10px;
`

const PasswordSubmit = styled.button`
  margin: 10px 0;
  padding: 10px;
  background-color: #fc58aa;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
`

const Sep = styled.div`
height: 10px;
`

export default User;