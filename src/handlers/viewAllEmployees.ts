import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Employee } from "../types/employee";

const tableName = "employees";
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const getRes = await dynamo.send(new ScanCommand({ TableName: tableName }));

    const employees: Employee[] = (getRes.Items as Employee[]) ?? [];

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Employees retrieved", data: employees }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Something went wrong.." }),
    };
  }
};
