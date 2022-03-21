import styled from 'styled-components';
import { TodoList } from "src/network/apiTypes";
import { useCallback } from "react";
import { ArrowForwardOutline } from "react-ionicons";
import { v4 as uuid } from 'uuid';

interface SidebarProps {
    onChange: (todo: TodoList) => void;
    lists: TodoList[] | undefined;
    setLists:  React.Dispatch<React.SetStateAction<TodoList[] | undefined>>;
}

function ListView({ onChange, ...infos }: TodoList & SidebarProps) {
    return <StyledListView onClick={() => onChange(infos)}>
        <ListName>
            {infos.name}
        </ListName>
        <ArrowForwardOutline width="10px" height="10px" />
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
                const task = {id: uuid(), name, description, tasks: []};

                setLists((old) => [task, ...(old || [])]);
            }
        }
    }, [setLists])

    return <StyledSidebar>
        {!lists ? (
            <div>loading...</div>
        ) : (
            <>
                <AddButton onClick={addList}>New list +</AddButton>
                <List>
                    {lists.length === 0 ? (
                        <div>No lists</div>
                    ) : (
                        lists.map((list) => <ListView {...list} onChange={onChange} lists={lists} setLists={setLists} />)
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
  width: 155.6px;
  padding: 30px 10px;
  box-sizing: border-box;
  border-right: 1px solid #e3e3e3;
`

const List = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
`

const AddButton = styled.div`
  padding: 5px 10px;
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  border: 1px solid #31902c;
  user-select: none;
  cursor: pointer;
  color: #31902c;
  border-radius: 5px;
  margin-bottom: 10px;
`

export default Sidebar;