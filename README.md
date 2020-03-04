# NPM Script Webhook
Tiny web app for executing a npm task after a successful token authentication request.

The request need to be sent via POST in the following format:
```json
{
  "secret": "51999777-c86a-41c0-b69f-2e3f9ccc0f3b"
}
```

## Configuration
The following ENV vars are used to configure the app:
- NSW_TOKEN: (required) the token used to authenticate a request
- NSW_WORK_DIR: the working dir with the npm script, defaults to `/var/www/html`
- NSW_SCRIPT_NAME: the name of the task, defaults to `build`
- NSW_TIMEOUT: the maximum time to wait (in ms) for the task to complete, defaults to 30 seconds