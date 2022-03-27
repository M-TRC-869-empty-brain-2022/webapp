import styled from "styled-components";
import Header from "../components/Header";
import { useEffect, useState, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { user } from "src/recoil/atom";
import Api, { User, Role, AdminChangeRoleRequest } from "src/utils/api";

const isAdminColor = {
  ADMIN: {
    name: "admin",
    color: "#45fc03",
  },
  USER: {
    name: "user",
    color: "#fc0331",
  },
};

interface IsAdminProps {
  id: string;
  isAdmin: Role;
  setUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>;
}

function IsAdminView({ id, isAdmin, setUsers }: IsAdminProps) {
  return (
    <StyledProgress
      style={{
        backgroundColor: isAdminColor[isAdmin].color,
        cursor: "pointer",
      }}
      onClick={async () => {
        let next: Role;

        switch (isAdmin) {
          case "ADMIN":
            next = Role.USER;
            break;
          case "USER":
            next = Role.ADMIN;
            break;
          default:
            next = Role.USER;
            break;
        }

        //        let nextRole: AdminChangeRoleRequest & { role: Role };
        //          ne;
        await Api.adminChangeUserRole(id, { role: next });

        const currentUser = await Api.adminGetUsers();
        setUsers(currentUser);
      }}
    >
      {isAdminColor[isAdmin].name}
    </StyledProgress>
  );
}

const StyledProgress = styled.div`
  padding: 10px 30px;
  color: white;
  border-radius: 15px;
  align-items: center;
  align-self: center;
  user-select: none;
`;
/*
const Button = styled.button`
  padding: 10px 30px;
  background-color: #fc58aa;
  border: none;
  color: white;
  align-self: center;
  cursor: pointer;
`;*/
function Home() {
  const auth = useRecoilValue(user);
  const [users, setUsers] = useState<User[] | undefined>(undefined);

  useEffect(() => {
    const getList = async () => {
      try {
        const currentUser = await Api.adminGetUsers();

        setUsers(currentUser);
      } catch (e) {
        // @ts-ignore
        toast.error(e.message);
      }
    };

    if (auth) {
      getList();
    }
  }, [auth]);

  const onClick = useCallback(async (id) => {
    const deleteTask = async () => {
      try {
        await Api.adminDeleteUser(id);

        const currentUser = await Api.adminGetUsers();
        setUsers(currentUser);
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
        {auth && (
          <List>
            {" "}
            {users?.map((element) => (
              <>
                <ListName>{element.username}</ListName>
                <IsAdminView
                  id={element.id}
                  isAdmin={element.role}
                  setUsers={setUsers}
                ></IsAdminView>
                <Button onClick={() => onClick(element.id)}>Delete</Button>
              </>
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
  flex-direction: row;
  flex: 1;
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

export default Home;
