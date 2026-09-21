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

// src/handlers/createEmployee.ts
var createEmployee_exports = {};
__export(createEmployee_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(createEmployee_exports);
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
var import_crypto = require("crypto");
var tableName = "employees";
var client = new import_client_dynamodb.DynamoDBClient({});
var dynamo = import_lib_dynamodb.DynamoDBDocumentClient.from(client);
var handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing request body" })
      };
    }
    const { firstName, lastName, email, jobTitle, department } = JSON.parse(
      event.body
    );
    if (!firstName || !lastName || !email || !jobTitle || !department) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "All input fields are required, please provide the necessary details"
        })
      };
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const id = `emp-${(0, import_crypto.randomUUID)()}`;
    const employee = {
      employeeId: id,
      firstName,
      lastName,
      email,
      jobTitle,
      department,
      createdAt: now,
      updatedAt: now
    };
    await dynamo.send(new import_lib_dynamodb.PutCommand({ TableName: tableName, Item: employee }));
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "New employee created", data: employee })
    };
  } catch (err) {
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
//# sourceMappingURL=createEmployee.js.map
