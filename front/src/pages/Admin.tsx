import styled from "styled-components";
import Header from "../components/Header";
import { useEffect, useState, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { user } from "src/recoil/atom";
import Api, { User, Role, AdminChangeRoleRequest } from "src/utils/api";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

interface IsAdminProps {
  id: string;
  isAdmin: Role;
  setUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>;
  username: string;
}

function IsAdminView({ id, isAdmin, setUsers, username }: IsAdminProps) {
  return <select onChange={async (e) => {
    try {
      const next = e.target.value as Role;
      await Api.adminChangeUserRole(id, {role: next});

      setUsers((old) => old?.map((e) => {
        if (e.id !== id) {
          return e;
        }
        e.role = next;
        return e;
      }));

      toast.success(`@${username} is now ${next}`)
    } catch (e) {
      // @ts-ignore
      toast.error(e.message);
    }
  }}>
    {["ADMIN", "USER"].sort((a) => a === isAdmin ? -1 : 1).map((r) => <option key={r} value={r}>{r.toLowerCase()}</option>)}
  </select>
}

function Home() {
  const auth = useRecoilValue(user);
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const getList = async () => {
      try {
        const currentUser = await Api.adminGetUsers();

        setUsers(currentUser);
      } catch (e) {
        navigate('/');
      }
    };

    if (auth) {
      getList();
    }
  }, [auth, navigate]);

  const onClick = useCallback(async (id) => {
    const deleteTask = async () => {
      try {
        await Api.adminDeleteUser(id);

        setUsers((old) => old?.filter((e) => e.id !== id));
      } catch (e) {
        // @ts-ignore
        toast.error(e.message);
      }
    };

    deleteTask();
  }, []);

  return (
    <StyledHome>
      <Header />
      <Interface>
        <AdminTitle>Admin Zone</AdminTitle>
        {auth && (
          <List>
            {users?.map((element, i) => (
              <UserView style={{ backgroundColor: i % 2 === 0 ? '#fafafa' : 'white' }}>
                <ListName>{element.username}</ListName>
                <UserActions>
                  <IsAdminView
                    id={element.id}
                    isAdmin={element.role}
                    setUsers={setUsers}
                    username={element.username}
                  />
                  <div style={{ width: '20px' }} />
                  <Button onClick={() => onClick(element.id)}>Delete user</Button>
                </UserActions>
              </UserView>
            ))}{" "}
          </List>
        )}
      </Interface>
    </StyledHome>
  );
}

const StyledHome = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Interface = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 30px;
`;

const List = styled.div`
  padding: 20px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const ListName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const Button = styled.button`
  padding: 10px 30px;
  background-color: #fc58aa;
  border: none;
  color: white;
  align-self: center;
  cursor: pointer;
`;

const AdminTitle = styled.h1`
`

const UserView = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
`

const UserActions = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`

export default Home;
