import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export const userService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

function getAll(
  spHttpClient: SPHttpClient,
  siteUrl: string,
  listName: string
): Promise<SPHttpClientResponse> {
  return spHttpClient.get(
    `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items?select=Title`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=nometadata",
        "odata-version": "",
      },
    }
  );
}

function getById(
  spHttpClient: SPHttpClient,
  siteUrl: string,
  listName: string,
  itemId: number
): Promise<SPHttpClientResponse> {
  return spHttpClient.get(
    `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})?select=Title`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=nometadata",
        "odata-version": "",
      },
    }
  );
}

function create(
  spHttpClient: SPHttpClient,
  siteUrl: string,
  listName: string,
  body: string
): Promise<SPHttpClientResponse> {
  return spHttpClient.post(
    `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=nometadata",
        "odata-version": "",
      },
      body: body,
    }
  );
}

function update(
  spHttpClient: SPHttpClient,
  siteUrl: string,
  listName: string,
  itemId: number,
  body: string
): Promise<SPHttpClientResponse> {
  return spHttpClient.post(
    `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=nometadata",
        "odata-version": "",
        "IF-MATCH": "*",
        "X-HTTP-Method": "MERGE",
      },
      body: body,
    }
  );
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(
  spHttpClient: SPHttpClient,
  siteUrl: string,
  listName: string,
  itemId: number
): Promise<SPHttpClientResponse> {
  return spHttpClient.post(
    `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=nometadata",
        "odata-version": "",
        "IF-MATCH": "*",
        "X-HTTP-Method": "DELETE",
      },
    }
  );
}
