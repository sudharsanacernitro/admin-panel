var k=[];
var a=0;
const archiver = require('archiver');
const express = require('express')
const path = require('path');
const directoryPath = './pic';
const fs = require('fs');
let database=[];

const sqlite3 = require('sqlite3').verbose();
const { spawn } = require('child_process');
// Replace 'your_database.db' with the path to your SQLite database file
const db = new sqlite3.Database('your_database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the database');
    }
});
function data(){
db.serialize(() => {
    db.all('SELECT * FROM user_data', (er, row) => {
    database=row;
    console.log("database is called");
    });
});
}
  
    
const webserver = express()
 .use((req, res) =>
   res.sendFile('index.html', { root: __dirname })
 )
 .listen(300, () => console.log(`Listening on ${300}`))
const { WebSocketServer } = require('ws')
const sockserver = new WebSocketServer({ port: 443 })
sockserver.on('connection', ws => {
 console.log('New client connected!')
   data();
 ws.on('close', () => console.log('Client has disconnected!'))
fs.readdir(directoryPath, (err, files) => {
  files.forEach((file) => {
   sockserver.clients.forEach(client => {
     
     k.push(file);

  
var m="./pic/"+file;
console.log(file);
     database.forEach((content)=>{
if(file===content["emailId"]){
fs.readdir(m, (err1, files1) => {
  files1.forEach((file1) => {
  
  var a1=file1.split(".");
  console.log(a1[1]);
  if(a1[1]==="png"){
   fs.readFile(m+"/"+file1, (err2, dat) => {
      console.log("send");
            content["bin"]=dat;
            
   
    // Convert the object to a JSON string and send it as a single message
    client.send(JSON.stringify(content));
            
             })
                   console.log("match found-"+file);
                   }
                   });
                   });
             }
             });
   })
   
})
h();
 })

 function h(){
 

  fs.readdir(directoryPath, (err, files) => {
     files.forEach((file) => {

     var foundElement = k.indexOf(file);

     if (foundElement === -1) {
var m="./pic/"+file;
          database.forEach((content)=>{
          if(file===content["emailId"]){
           fs.readdir(m, (err1, files1) => {
  files1.forEach((file1) => {
  
  var a1=file1.split(".");
  console.log(a1[1]);
  if(a1[1]==="png"){
   fs.readFile(m+"/"+file1, (err2, dat) => {
      console.log("send");
            content["bin"]=dat;
            
      sockserver.clients.forEach(client => {
    // Convert the object to a JSON string and send it as a single message
    client.send(JSON.stringify(content));
    });
            
             })
                   console.log("match found-"+file);
                   }
                   });
                   });
          }
          });
          k.push(file);
     }
     else{console.log("c");}
     })
   
})
  setTimeout(h, 5000);
}
  
  
  
ws.on('message', data => {
   sockserver.clients.forEach(client => {
     //console.log(`distributing message: ${data}`)
         const gh=JSON.parse(`${data}`);
         if(gh.key1=="download"){
     
     var folderPath = './pic/'+gh.key2;
     var zipFilePath = './archive/'+gh.key2+'.zip';
// Create a write stream to the zip file
const output = fs.createWriteStream(zipFilePath);

// Create an archiver instance
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Pipe the archive to the output file
archive.pipe(output);

// Add the entire folder and its contents to the archive
archive.directory(folderPath, false);

// Finalize the archive
archive.finalize();

// Listen for the 'close' event to know when the archive has been created
output.on('close', () => {
  console.log('Archive created successfully.');
  v(gh.key2);
});

// Listen for any errors during the archiving process
archive.on('error', (err) => {
  throw err;
});
     
     
     
   function v(data){
     var i;
    var path='./archive/'+data+'.zip';
 fs.readFile(path, (err2, datas) => {
 if (err2) {
        console.error('Error reading file:', err2);
        return;
    }
   i= datas;
    var cont={
    name:'download',
    emailId:`${data}`,
    bin:i};
    console.log(i.length);
 ws.send(JSON.stringify(cont));
        

 });

  } 


     client.send(`${data}`)
     }
     else if(gh.key1=="upload")
     {
     const fs = require('fs');
     //console.log(gh.key3);
// Replace 'your-base64-string' with your actual Base64-encoded image string
const base64String = gh.key2;

// Output file path and name
// Specify the path of the folder containing images
const folderPath = './gallery/'+gh.key3;
var file_count=0;
// Define an array of allowed image file extensions
const allowedImageExtensions = ['.png'];

// Function to filter files by extension
function isImageFile(file) {
  const extension = path.extname(file).toLowerCase();
  return allowedImageExtensions.includes(extension);
}

// Read the contents of the folder
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading folder contents:', err);
    return;
  }

  // Filter the files to get only images
  const imageFiles = files.filter(isImageFile);
   console.log(imageFiles.length+1);
  // Log the number of images
  file_count=imageFiles.length;
const outputPath = './gallery/'+gh.key3+'/'+(file_count+1)+'.png';
console.log(outputPath);
// Convert Base64 to Buffer
const buffer = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64');

// Save the Buffer to a file
fs.writeFileSync(outputPath, buffer);

console.log('Image saved successfully:', outputPath);
//To save the image path in DB
const pythonScript = 'gallery.py';
const pythonProcess = spawn('python3', [pythonScript,gh.key3,outputPath]);

pythonProcess.stdout.on('data', (data) => {
  console.log(`Python stdout: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`Python stderr: ${data}`);
});

pythonProcess.on('close', (code) => {
  console.log(`Python process exited with code ${code}`);
});

//
});





     
     //console.log(gh[1]);
     }
     else if(gh.key1=='new-category')
     {
     
     console.log(gh);
     
     const folderPath = './gallery/'+gh.key2;
     fs.stat(folderPath, (err, stats) => {
     if (err) {
    if (err.code === 'ENOENT') {
    
      console.log('Folder does not exist.');
       fs.mkdir(folderPath, { recursive: true }, (err) => {
             if (err) {
             console.error('Error creating folder:', err);
             } else {
             console.log('Folder created successfully.');
             }
             });
     
      
      
    } else {
      console.error('Error checking folder existence:', err);
    }
  } else {
     

      if (stats.isDirectory()) {
      console.log('Folder exists.');
    }
 
          }
                    });
      
      }
      
      
     else
     {
     var d1="./pic/"+gh.key2;
     fs.rmdir(d1, { recursive: true }, (err) => {
    if (err) {
        console.error(`Error removing directory: ${err}`);
    } else {
        console.log(`Directory '${directoryPath}' removed successfully.`);
    }
});
     }
   })
 })
 
 
 ws.onerror = function () {
   console.log('websocket error')
 }
 
})


function zip(data)
{
var folderPath = './pic/'+data;
     var zipFilePath = './archive/'+data+'.zip';
// Create a write stream to the zip file
const output = fs.createWriteStream(zipFilePath);

// Create an archiver instance
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Pipe the archive to the output file
archive.pipe(output);

// Add the entire folder and its contents to the archive
archive.directory(folderPath, false);

// Finalize the archive
archive.finalize();

// Listen for the 'close' event to know when the archive has been created
output.on('close', () => {
  console.log('Archive created successfully.');
});

// Listen for any errors during the archiving process
archive.on('error', (err) => {
  throw err;
});

} 


