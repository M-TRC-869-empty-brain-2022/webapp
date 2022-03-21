import styled from "styled-components";
import {useCallback, useEffect, useState} from "react";
import {Progress, Task} from 'src/network/apiTypes';
import {ShareSocialOutline, TrashOutline} from 'react-ionicons'
import { v4 as uuid } from 'uuid';

function ProgressView({ progress }: { progress: Progress }) {
    return <StyledProgress style={{ backgroundColor: ['#03c2fc', '#e8cd33', '#336ce8'][progress] }}>{['todo', 'doing', 'done'][progress]}</StyledProgress>
}

const StyledProgress = styled.div`
  padding: 3px 10px;
  color: white;
  border-radius: 15px;
  display: flex;
  align-items: center;
`

function TaskView({ id, name, progress }: Task) {
    return <StyledTask>
        <TaskTitle>{name}</TaskTitle>
        <ProgressView progress={progress} />
        <TrashOutline
            color={'#00000'}
            height="25px"
            width="25px"
        />
    </StyledTask>
}

const StyledTask = styled.div`
  padding: 10px 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #e3e3e3;
  
  > *:not(:last-child) {
    margin-right: 15px;
  }
`

const TaskTitle = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`

interface TodoProps {
    name: string;
    id: string;
    description: string;
}

function getProgressPercent(tasks: Task[] | undefined) {
    if (!tasks || tasks.length === 0) {
        return 0;
    }
    return Math.floor((tasks.reduce((acc, c) => acc + (c.progress === Progress.DONE ? 1 : 0), 0) / tasks.length) * 100)
}

function Todo({ id, name, description }: TodoProps) {
    const [tasks, setTasks] = useState<Task[] | undefined>(undefined);

    useEffect(() => {
        const defaultTask = () => ({ id: uuid(), name: 'this is a todo task', progress: Progress.TODO });

        setTasks([
            defaultTask(),
            {...defaultTask(), progress: Progress.DOING},
            {...defaultTask(), progress: Progress.DOING},
            {...defaultTask(), progress: Progress.DOING},
            {...defaultTask(), progress: Progress.DONE},
            {...defaultTask(), progress: Progress.DONE},
        ])
    }, [id]);

    const addTask = useCallback(() => {
        const taskName = prompt('Task name:');

        if (taskName) {
            const task = {id: uuid(), name: taskName, progress: Progress.TODO};

            setTasks((old) => [task, ...(old || [])]);
        }
    }, [])

    return <StyledTodo>
        <TodoHeader>
            <TodoMeta>
                <TodoTitle>{name}</TodoTitle>
                <TodoDescription>{description}</TodoDescription>
                {tasks && tasks.length !== 0 &&
                    <TodoInfos>
                        <TodoProgress>{ getProgressPercent(tasks) }% done { getProgressPercent(tasks) === 100 ? '🎉' : '' }</TodoProgress>
                    </TodoInfos>
                }
            </TodoMeta>
            <TodoAction>
                <TrashOutline
                    color={'#00000'}
                    height="25px"
                    width="25px"
                />
                <ShareSocialOutline
                    color={'#00000'}
                    height="25px"
                    width="25px"
                    style={{ marginLeft: '10px' }}
                />
            </TodoAction>
        </TodoHeader>
        <AddButtonContainer>
            <AddButton onClick={addTask}>
                New task +
            </AddButton>
        </AddButtonContainer>
        {!tasks ? (
            <div>Loading...</div>
        ) : (
            tasks.length === 0 ? (
                <div>No tasks!</div>
            ) : (
                tasks.map((task, i) => <TaskView key={i} {...task} />)
            )
        )}
    </StyledTodo>
}

const StyledTodo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 30px;
`

const TodoTitle = styled.h1`
    margin-top: 0;
`

const TodoDescription = styled.p`
`

const TodoHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`
const TodoMeta = styled.div``
const TodoAction = styled.div``

const AddButtonContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: start;
`

const AddButton = styled.div`
  padding: 5px 10px;
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  background-color: #31902c;
  user-select: none;
  cursor: pointer;
  color: white;
  border-radius: 5px;
`

const TodoInfos = styled.div`
`

const TodoProgress = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
`

export default Todo;