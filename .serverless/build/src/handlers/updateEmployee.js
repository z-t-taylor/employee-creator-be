"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/handlers/updateEmployee.ts
var updateEmployee_exports = {};
__export(updateEmployee_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(updateEmployee_exports);
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
var tableName = "employees";
var client = new import_client_dynamodb.DynamoDBClient({});
var dynamo = import_lib_dynamodb.DynamoDBDocumentClient.from(client);
var handler = async (event) => {
  try {
    const employeeId = event.pathParameters?.employeeId;
    if (!employeeId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing employee ID" })
      };
    }
    const getRes = await dynamo.send(
      new import_lib_dynamodb.GetCommand({ TableName: tableName, Key: { employeeId } })
    );
    const employee = getRes.Item;
    if (!employee) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Employee not found" })
      };
    }
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing request body" })
      };
    }
    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "jobTitle",
      "department"
    ];
    const updateData = {};
    const employleeChanges = JSON.parse(event.body);
    for (const field of allowedFields) {
      if (employleeChanges[field] !== void 0) {
        updateData[field] = employleeChanges[field];
      }
    }
    updateData.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    let updateExpression = "SET ";
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    Object.keys(updateData).forEach((key, index) => {
      const attributeName = `#attr${index + 1}`;
      const attributeValue = `:val${index + 1}`;
      updateExpression += `${attributeName} = ${attributeValue}, `;
      expressionAttributeNames[attributeName] = key;
      expressionAttributeValues[attributeValue] = updateData[key];
    });
    updateExpression = updateExpression.slice(0, -2);
    await dynamo.send(
      new import_lib_dynamodb.UpdateCommand({
        TableName: tableName,
        Key: { employeeId },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      })
    );
    const updatedRes = await dynamo.send(
      new import_lib_dynamodb.GetCommand({ TableName: tableName, Key: { employeeId } })
    );
    const updatedEmployee = updatedRes.Item;
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Employee details updated",
        data: updatedEmployee
      })
    };
  } catch (err) {
    console.error("Error: ", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Something went wrong.." })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=updateEmployee.js.map
