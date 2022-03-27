import styled from "styled-components";
import Header from "../components/Header";
import { useEffect, useState, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { user } from "src/recoil/atom";
import Api, { User } from "src/utils/api";

interface HomeProps {
  publicList?: boolean;
}

function Home({ publicList }: HomeProps) {
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
