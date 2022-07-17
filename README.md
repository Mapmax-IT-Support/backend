
## Getting Started 

1. First make sure Constants.js has the correct assignments for local or development environments 

Development (Hosted)
```
ORIGIN:  'https://rfm7991.github.io',
```

Local 
```
ORIGIN:  'http://localhost:3000',
```

2. Run `npm install`

3. Run `npm start`

## Connecting to AWS Server 

In the same director as the landmark-ec2.pem file run the following to start a remote session with ssh

```bash
ssh -i "landmark-ec2.pem" ec2-user@ec2-54-159-108-33.compute-1.amazonaws.com
``` 

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all dependencies into node_modules folder

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

