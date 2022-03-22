import styled from "styled-components";
import {useCallback, useEffect, useState} from "react";
import {ShareSocialOutline, TrashOutline} from 'react-ionicons'
import Api, {TaskType, Progress} from "src/utils/api";
import {toast} from "react-toastify";

function ProgressView({ progress }: { progress: Progress }) {
    return <StyledProgress style={{ backgroundColor: {TODO: '#03c2fc', IN_PROGRESS: '#e8cd33', DONE: '#336ce8'}[progress] }}>{{TODO:'todo', IN_PROGRESS: 'doing', DONE: 'done'}[progress]}</StyledProgress>
}

const StyledProgress = styled.div`
  padding: 3px 10px;
  color: white;
  border-radius: 15px;
  display: flex;
  align-items: center;
`

interface TaskViewProps {
    task: TaskType;
    setTasks: React.Dispatch<React.SetStateAction<TaskType[] | undefined>>;
}

function TaskView({ task: { id, name, progress }, setTasks }: TaskViewProps) {
    const onClick = useCallback(() => {
        const deleteTask = async () => {
            try {
                await Api.deleteTask(id);

                setTasks((old) => old?.filter((t) => t.id !== id));
            } catch (e) {
                // @ts-ignore
                toast.error(e.message);
            }
        }

        deleteTask();
    }, [id, setTasks]);

    return <StyledTask>
        <TaskTitle>{name}</TaskTitle>
        <ProgressView progress={progress} />
        <TrashOutline
            color={'#00000'}
            height="25px"
            width="25px"
            onClick={onClick}
            style={{ cursor: 'pointer' }}
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

function getProgressPercent(tasks: TaskType[] | undefined) {
    if (!tasks || tasks.length === 0) {
        return 0;
    }
    return Math.floor((tasks.reduce((acc, c) => acc + (c.progress === 'DONE' ? 1 : 0), 0) / tasks.length) * 100)
}

function Todo({ id, name, description }: TodoProps) {
    const [tasks, setTasks] = useState<TaskType[] | undefined>(undefined);

    useEffect(() => {
        const fetchTasks = async () => {
            const list = await Api.getTodoListById(id);

            try {
                setTasks(list.tasks.reverse());
            } catch (e) {
                // @ts-ignore
                toast.error(e.message);
            }
        }

        fetchTasks();
    }, [id]);

    const addTask = useCallback(() => {
        const name = prompt('Task name:');

        if (name) {
            const createTask = async () => {
                try {
                    const task = await Api.createTask(id, {name});

                    setTasks((old) => [task, ...(old || [])])
                } catch (e) {
                    // @ts-ignore
                    toast.error(e.message);
                }
            }

            createTask();
        }
    }, [id])

    return <StyledTodo>
        <TodoHeader>
            <TodoMeta>
                <TodoTitle>{name}</TodoTitle>
                <TodoDescription>{description}</TodoDescription>
                <TodoInfos>
                    <TodoProgress>
                        { !tasks ?
                            ( 'Loading...' ) :
                            ( tasks.length === 0 ? (
                                    'No tasks'
                                ) : (
                                    `${getProgressPercent(tasks)}% done ${ getProgressPercent(tasks) === 100 ? '🎉' : ''}`
                                )
                            )
                        }
                    </TodoProgress>
                </TodoInfos>
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
        {tasks && tasks.length !== 0 && tasks.map((task) => <TaskView key={task.id} task={task} setTasks={setTasks} />)}
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