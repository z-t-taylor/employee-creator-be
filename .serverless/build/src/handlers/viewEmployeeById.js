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

// src/handlers/viewEmployeeById.ts
var viewEmployeeById_exports = {};
__export(viewEmployeeById_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(viewEmployeeById_exports);
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
    const employee = getRes.Item ?? void 0;
    if (employee === void 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Employee not found" })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Employee found", data: employee })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Something went wrong..", err })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=viewEmployeeById.js.map
