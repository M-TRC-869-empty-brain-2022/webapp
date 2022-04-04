import styled from 'styled-components';
import { useCallback } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import Api, {TodolistType} from "src/utils/api";
import {MdOutlineAddBox} from 'react-icons/md';

interface SidebarProps {
    onChange: (todo: TodolistType) => void;
    lists: TodolistType[] | undefined;
    setLists:  React.Dispatch<React.SetStateAction<TodolistType[] | undefined>>;
}

function ListView({ onChange, ...infos }: TodolistType & SidebarProps) {
    return <StyledListView onClick={() => onChange(infos)}>
        <ListName>
            {infos.name}
        </ListName>
        <MdOutlineArrowForwardIos width="10px" height="10px" />
    </StyledListView>
}

const StyledListView = styled.div`
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  white-space: nowrap;
  align-items: center;
`

const ListName = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`

function Sidebar({onChange, lists, setLists}: SidebarProps) {
    const addList = useCallback(() => {
        const name = prompt('List name:');

        if (name) {
            const description = prompt(`${name}'s description`);

            if (description) {
                const createList = async () => {
                    const list = await Api.createTodoList({ name, description });

                    setLists((old) => [list, ...(old || [])])
                }

                createList();
            }
        }
    }, [setLists])

    return <StyledSidebar>
        {!lists ? (
            <div>loading...</div>
        ) : (
            <>
                <AddButton onClick={addList}><MdOutlineAddBox /><div style={{ width: '5px' }} />New list</AddButton>
                <List>
                    {lists.length === 0 ? (
                        <div>No lists</div>
                    ) : (
                        lists.map((list) => <ListView key={list.id} {...list} onChange={onChange} lists={lists} setLists={setLists} />)
                    )}
                </List>
            </>
        )}
    </StyledSidebar>
}

const StyledSidebar = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 145.6px;
  box-sizing: border-box;
  border-right: 1px solid #e3e3e3;
`

const List = styled.div`
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`

const AddButton = styled.div`
  padding: 10px;
  border-radius: 5px;
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  //border: 1px solid #31902c;
  user-select: none;
  cursor: pointer;
  //color: #31902c;
  //border-radius: 5px;
  
  //display: inline-block;

  background-color: #3d3d3d;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 15px;
  margin: 10px;
`

export default Sidebar;