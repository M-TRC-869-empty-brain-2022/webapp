import { useRecoilState } from "recoil";
import {user} from "src/recoil/atom";
import styled from "styled-components";
import Avatar from "src/components/Profile/Avatar";
import {useCallback} from "react";
import {toast} from "react-toastify";
import Api from "src/utils/api";

function ProfilePicture() {
    const [auth, setAuth] = useRecoilState(user);

    const onClick = useCallback(() => {
        const input = document.createElement('input');

        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = false;

        input.onchange = (e) => {
            if (!input.files) return;
            const file = input.files[0];

            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const res = reader.result;

                    if (!res) {
                        toast.error('File is null');
                        return;
                    }

                    const base64str = res.toString();

                    if (base64str.length > 1398104) {
                        toast.error('File is too big');
                        return;
                    }

                    try {
                        await Api.changeProfilePicture({ profilePictureBase64: base64str });

                        setAuth((old) => (old ? {...old, profilePicture: res.toString()} : undefined));
                    } catch (e) {
                        // @ts-ignore
                        toast.error(e.message);
                    }
                };
                reader.onerror = (error) => {
                    toast.error(error);
                };
            }
        }

        input.click();
    }, [])

    return <StyledProfilePictureContainer onClick={onClick}>
        {auth?.profilePicture ?  <StyledProfilePicture src={auth?.profilePicture} /> : <Avatar />}
    </StyledProfilePictureContainer>
}

const StyledProfilePictureContainer = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
`

const StyledProfilePicture = styled.img`
  width: 100%;
  height: 100%;
`

export default ProfilePicture;