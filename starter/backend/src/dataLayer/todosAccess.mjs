import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE 

class TodosAccess {

  async create(todoInput){
    const result = await dynamoDbClient
      .put({
        TableName: todosTable,
        Item: todoInput
      })
    return todoInput;
  }

  async get(userId){
    const result = await dynamoDbClient.query({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
      }
    })

    return result.Items
  }
  
  async update(userId, todoId, updateData){
    const result = await dynamoDbClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        ConditionExpression: 'attribute_exists(todoId)',
        UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: {
          ':n': updateData.name,
          ':due': updateData.dueDate,
          ':dn': updateData.done
        }
      })
  }

  async delete(userId, todoId){
    const result = await dynamoDbClient
    .delete({
      TableName: this.todosTable,
      Key: { userId, todoId }
    })
  }
}

const todosAccessInstance = new TodosAccess();
export default todosAccessInstance;