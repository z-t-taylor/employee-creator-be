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

// src/handlers/createContract.ts
var createContract_exports = {};
__export(createContract_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(createContract_exports);
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
var import_crypto = require("crypto");
var employeeTable = "employees";
var contractTable = "contracts";
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
    const getEmployee = await dynamo.send(
      new import_lib_dynamodb.GetCommand({ TableName: employeeTable, Key: { employeeId } })
    );
    if (!getEmployee) {
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
    const { type, status, startDate, endDate, salary, hoursPerWeek } = JSON.parse(event.body);
    if (!type || !status || !startDate || salary === void 0 || hoursPerWeek === void 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "type, status, startDate, salary, and hoursPerWeek are required"
        })
      };
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const contract = {
      employeeId,
      contractId: `contract-${(0, import_crypto.randomUUID)()}`,
      type,
      status,
      startDate,
      endDate: endDate ?? null,
      salary,
      hoursPerWeek,
      createdAt: now,
      updatedAt: now
    };
    await dynamo.send(
      new import_lib_dynamodb.PutCommand({ TableName: contractTable, Item: contract })
    );
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "New contract added", data: contract })
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
//# sourceMappingURL=createContract.js.map
