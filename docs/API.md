# API Documentation
Base URL: `https://apitable.skygeario.com/api/tables?id=...`

Behavior | Request Method | Token must be Writable?
------------- | ------------- | -------------
Fetch a table with record(s) | GET | No
Create a new records | POST | Yes
Update an existing record | PUT | Yes
Delete an existing record | DELETE | Yes

Note that you can change the writability on the Get End Point Dialog.

## How to attach Table Access Token?
All API calls require a Table Access Token. A token has access to only one table. You cannot use the token to access another table.

For each request, APITable will first look for the `Authorization` **Header**. If there is no token in the header, APITable will then look for the `token` **Query String Parameter**.

If non-identical tokens are attached in Header and Query String, the token in **Query String Parameter** will be ignored.

## Fetch a table
To fetch a table, you can simply send a GET request to the end point base url. By default, APITable will return up to 50 records sorted by its creation time. To customize this kind of behavior, you can pass configurations through **Query String Parameters**.

Option | Description | Query String Parameter | Required? or Default Value
----- | ----- | ----- | ------
Table ID | ID of the table. | id | Required
Record ID | You can specify the record id, if you only want a particular record. | record | Optional
Record Limit | Maximun number of records to return | limit | 50
Offset | Number of records to skip. It will be useful for pagination. | offset | 0
Sorting | All records will be sorted by its creation time. You can specify the order `asc` or `desc`. | sort | asc
### Example
Limit to 10 records, Skip 20 records, Sort in decreasing order. (behave like page 3 of records)

`GET <<Base URL>>&limit=10&offset=20&sort=desc`

Fetch only one record with id 1234

`GET <<Base URL>>&record=1234`

## Create a new records

**Writable Token Required**

To create records, you can send a POST request to the end point base url. In the request body, attach all content with type `application/json`.

### Example
Consider the following table schema.

Data Name | Data Type | Required?
------- | ------- | -------
name | String | Yes
age | Number | Yes

`POST <<Base URL>>` with the following body.
```javascript
{
  name: "John",
  age: 22
}
```
This request is valid, and will get a response like this.
```javascript
{
    "ok": true,
    "table": {
        "name": "..........",
        "records": [
            {
                "id": "..........",
                "age": 22,
                "name": "John"
            }
        ],
        "updatedAt": ".........."
    }
}
```
Data Validation is also available on API. Consider the following request body.
```javascript
{
  name: "John",
  age: "22"
}
```
Since age is of type Number, this request is invalid, and will get an error response.
```javascript
{
    "ok": false,
    "error": {
        "name": "ErrorCode(422)",
        "code": 422,
        "message": "Input data of 'age' key is invalid!"
    }
}
```

## Update an existing record

**Writable Token Required**

To update a record, you can send a PUT request to `<<Base URL>>&record=<<Record ID>>`. In the request body, attach changes with type `application/json`.

### Example
Consider the following record.

id | name | age
------ | ------ | ------
1234 | John | 22

Send `PUT <<Base URL>>&record=1234` with the following request body.

```javascript
{
  age: 23
}
```
APITable will merge changes to the record, and return the updated record.
```javascript
{
    "ok": true,
    "message": "Record 1234 has been updated successfully.",
    "table": {
        "name": ".......",
        "records": [
            {
                "id": "1234",
                "name": "John",
                "age": 23
            }
        ],
        "updatedAt": "......."
    }
}
```

## Delete an existing record

**Writable Token Required**

To delete a record, you can send a DELETE request to `<<Base URL>>&record=<<Record ID>>`. It returns `200 OK` if the request is successful.

## Usage Examples (in JavaScript ES6)
The following examples demostrate how we can use [`fetch`](https://github.com/github/fetch) to make requests to APITable.
#### Fetching table with records
```javascript
fetch('https://apitable.skygeario.com/api/tables?id=......&token=......')
  .then((res) => res.json()) // Parse the response to JSON
  .then((json) => console.log(json)) // Table's data in JSON format
  .catch((err) => console.log(err));
```
#### Create a new record
```javascript
fetch('https://apitable.skygeario.com/api/tables?id=......', {
  method: 'POST',
  headers: {
    Authorization: '......' // Attach token to header
  },
  body: JSON.stringify({ // Attach contents to request body
    name: 'Test',
    age: 22
  })
})
.then((res) => res.json())
.then((json) => console.log(json)) // New reocrd's data in JSON format
.catch((err) => console.log(err));
```
#### Update an existing record
```javascript
fetch('https://apitable.skygeario.com/api/tables?id=......&record=......', {
  method: 'PUT',
  headers: {
    Authorization: '......' // Attach token to header
  },
  body: JSON.stringify({ // Attach changes to request body
    age: 23
  })
})
.then((res) => res.json())
.then((json) => console.log(json));
```
#### Delete an existing record
```javascript
fetch('https://apitable.skygeario.com/api/tables?id=......&record=......', {
  method: 'DELETE',
  headers: {
    Authorization: '......' // Attach token to header
  }
})
.then((res) => res.json())
.then((json) => console.log(json))
.catch((err) => console.log(err));
```


## Errors
Name | Status Code | Cause
--- | --- | ---
TokenInvalidError | 401 | The token is empty or not for that table.
TokenNotWritableError | 401 | The token provided is not writable, but the request requires a writable token.
TableNotFoundError | 404 | The table with the id specified in `id` **Query String Parameters** is not found.
RecordNotFoundError | 404 | The record with the id specified in `record` **Query String Parameters** is not found.
ErrorCode(422) | 422 | The request body is not a valid JSON, or there're missing / invalid values.