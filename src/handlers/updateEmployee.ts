import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Employee } from "../types/employee";

const tableName = "employees";
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const employeeId = event.pathParameters?.employeeId;

    if (!employeeId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing employee ID" }),
      };
    }

    const getRes = await dynamo.send(
      new GetCommand({ TableName: tableName, Key: { employeeId } }),
    );

    const employee = getRes.Item as Employee | undefined;

    if (!employee) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Employee not found" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "jobTitle",
      "department",
    ];
    const updateData: Record<string, string> = {};

    const employleeChanges = JSON.parse(event.body);
    for (const field of allowedFields) {
      if (employleeChanges[field] !== undefined) {
        updateData[field] = employleeChanges[field];
      }
    }
    updateData.updatedAt = new Date().toISOString();

    let updateExpression = "SET ";
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, string> = {};

    Object.keys(updateData).forEach((key, index) => {
      const attributeName = `#attr${index + 1}`;
      const attributeValue = `:val${index + 1}`;

      updateExpression += `${attributeName} = ${attributeValue}, `;
      expressionAttributeNames[attributeName] = key;
      expressionAttributeValues[attributeValue] = updateData[key];
    });

    updateExpression = updateExpression.slice(0, -2);

    await dynamo.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { employeeId },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      }),
    );

    const updatedRes = await dynamo.send(
      new GetCommand({ TableName: tableName, Key: { employeeId } }),
    );

    const updatedEmployee = updatedRes.Item as Employee;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Employee details updated",
        data: updatedEmployee,
      }),
    };
  } catch (err) {
    console.error("Error: ", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Something went wrong.." }),
    };
  }
};
