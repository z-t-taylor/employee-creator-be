import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Employee } from "../types/employee";
import { corsHeaders } from "../utils/headers";

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
        headers: corsHeaders,
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
        headers: corsHeaders,
        body: JSON.stringify({ message: "Employee not found" }),
      };
    }

    await dynamo.send(
      new DeleteCommand({ TableName: tableName, Key: { employeeId } }),
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Employee deleted" }),
    };
  } catch (err) {
    console.error("Error: ", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Something went wrong.." }),
    };
  }
};
