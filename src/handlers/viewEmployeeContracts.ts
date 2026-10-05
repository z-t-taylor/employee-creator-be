import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Contract } from "../types/contracts";
import { Employee } from "../types/employee";

const employeeTable = "employees";
const contractTable = "contracts";
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

    const getEmployee = await dynamo.send(
      new GetCommand({ TableName: employeeTable, Key: { employeeId } }),
    );

    const employee = getEmployee.Item as Employee | undefined;

    if (!employee) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Employee not found" }),
      };
    }

    const queryRes = await dynamo.send(
      new QueryCommand({
        TableName: contractTable,
        KeyConditionExpression: "employeeId = :employeeId",
        ExpressionAttributeValues: {
          ":employeeId": employeeId,
        },
      }),
    );

    const contracts: Contract[] = (queryRes.Items as Contract[]) ?? [];

    return {
      statusCode: 200,
      body: JSON.stringify({ data: contracts }),
    };
  } catch (err) {
    console.error("Error: ", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Something went wrong.." }),
    };
  }
};
