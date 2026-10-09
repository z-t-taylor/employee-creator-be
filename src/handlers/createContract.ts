import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { randomUUID } from "crypto";
import { Contract } from "../types/contracts";
import { corsHeaders } from "../utils/headers";

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
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing employee ID" }),
      };
    }

    const getEmployee = await dynamo.send(
      new GetCommand({ TableName: employeeTable, Key: { employeeId } }),
    );

    if (!getEmployee) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Employee not found" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const { type, status, startDate, endDate, salary, hoursPerWeek } =
      JSON.parse(event.body);

    if (
      !type ||
      !status ||
      !startDate ||
      salary === undefined ||
      hoursPerWeek === undefined
    ) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          message:
            "type, status, startDate, salary, and hoursPerWeek are required",
        }),
      };
    }

    const now = new Date().toISOString();
    const contract: Contract = {
      employeeId,
      contractId: `contract-${randomUUID()}`,
      type,
      status,
      startDate,
      endDate: endDate ?? null,
      salary,
      hoursPerWeek,
      createdAt: now,
      updatedAt: now,
    };

    await dynamo.send(
      new PutCommand({ TableName: contractTable, Item: contract }),
    );

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ message: "New contract added", data: contract }),
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
