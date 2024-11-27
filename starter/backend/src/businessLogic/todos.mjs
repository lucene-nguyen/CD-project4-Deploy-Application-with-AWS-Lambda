import todosAccessInstance from '../dataLayer/todosAccess.mjs'
import * as uuid from 'uuid'

class BusinessLogicTodos{
  async create(userId, todoInput){
    return todosAccessInstance.create({
      userId,
      todoId: uuid.v4(),
      createdAt: new Date().toISOString(),
      ...todoInput,
    })
  }

  async get(userId){
    return todosAccessInstance.get(userId)
  }

  async update(userId, todoId, updateData){
    return todosAccessInstance.update(userId, todoId, updateData)
  }

  async delete(userId, todoId){
    return todosAccessInstance.delete(userId, todoId)
  }

  async getByTodoId(userId, todoId){
    return todosAccessInstance.getByTodoId(userId, todoId)
  }
}

const businessLogicTodosInstance = new BusinessLogicTodos();
export default businessLogicTodosInstance;
