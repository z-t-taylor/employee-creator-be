import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Employee } from "../types/employee";

const tableName = "employees";
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const { firstName, lastName, email, jobTitle, department } = JSON.parse(
      event.body,
    );

    if (!firstName || !lastName || !email || !jobTitle || !department) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "All input fields are required, please provide the necessary details",
        }),
      };
    }

    const now = new Date().toISOString();
    const id = `emp-${randomUUID()}`;
    const employee: Employee = {
      employeeId: id,
      firstName,
      lastName,
      email,
      jobTitle,
      department,
      createdAt: now,
      updatedAt: now,
    };

    await dynamo.send(new PutCommand({ TableName: tableName, Item: employee }));

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "New employee created", data: employee }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Something went wrong..", err }),
    };
  }
};
