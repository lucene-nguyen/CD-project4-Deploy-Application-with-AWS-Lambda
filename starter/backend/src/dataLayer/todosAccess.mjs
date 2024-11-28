import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import awsXray from 'aws-xray-sdk-core'

const todosTable = process.env.TODOS_TABLE

class TodosAccess {
  constructor(){
    this.dynamodbXRay = awsXray.captureAWSv3Client(new DynamoDB())
    this.dynamoDbClient = DynamoDBDocument.from(this.dynamodbXRay)
  }

  async create(todoInput){
    const result = await this.dynamoDbClient
      .put({
        TableName: todosTable,
        Item: todoInput
      })
    return todoInput;
  }

  async get(userId){
    const result = await this.dynamoDbClient.query({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
      }
    })

    return result.Items
  }
  
  async update(userId, todoId, updateData){
    const result = await this.dynamoDbClient
      .update({
        TableName: todosTable,
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
    const result = await this.dynamoDbClient
    .delete({
      TableName: todosTable,
      Key: { userId, todoId }
    })
  }

  async getByTodoId(userId, todoId) {
    const result = await this.dynamoDbClient.query({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':todoId': todoId
      }
    })
    return result.Items
  }  

}

const todosAccessInstance = new TodosAccess();
export default todosAccessInstance;