const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json());
const help=require('./helper')
app.use('/data', express.static(path.join(__dirname, '..', 'data')));
app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use(fileUpload());
app.use("/", (req, res, next) => {
  console.log("Request received at: ", new Date());
  console.log("...with request url: ", req.originalUrl);
  console.log("...with request body: ", req.body);
  next();
});
app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'../public/index.html'))
})
app.post('/addstudent', (req, res) => {
  const name = req.body.name; 
  const file = req.files.file;


  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const extension = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return res.status(400).send('Only JPEG and PNG photos are allowed');
  }
  const filename = `${name.replace(/\s+/g, '-')}${extension}`;

  file.mv(path.join(__dirname, '..', 'data', filename), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    
    help.updateMetadata(filename);
    

    res.send('Form data received and photo uploaded successfully');
  });
});


app.get('/view', (req, res) => {
  // Read the metadata.json file
  metadata=help.upphotos()
  // res.send(metadata)
  const photoTags = metadata.map((filename) => `
  <div>
    <img src="/data/${filename}" alt="Photo" width="100" height="100">
    <p>${filename}</p>
  </div>
`);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>View Photos</title>
      </head>
      <body>
        ${photoTags.join('\n')}
      </body>
    </html>
  `;

  // Send the HTML page as the response
  res.send(html);
});
app.get('/resdata',(req,res)=>{
  metadata=help.upphotos()
  res.send( { statusCode: 200, body: metadata })
})
app.use("/", (req, res, next) => {
  //  If rval not set in request, it is assumed that the upstream routes have generated the response already
  if(req.rval)
      res.status(req.rval.statusCode).send(req.rval.body)
  console.log("Response sent at: ", new Date());
});
// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
