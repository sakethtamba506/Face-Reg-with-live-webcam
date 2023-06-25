const fs = require('fs');
const path=require('path')

exports.updateMetadata=(filename)=> {
  const metadataPath = path.join(__dirname,'..','data','metadata.json');
  

  try {
    const metadataData = fs.readFileSync(metadataPath, 'utf8');
    const metadata = JSON.parse(metadataData);

    metadata.push(filename);

    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    console.log('Metadata updated successfully');

  } catch (error) {
    console.error('Error updating metadata:', error);
  }
  }
exports.upphotos = ()=>{
  const metadataPath = path.join(__dirname, '../data/metadata.json',);
  let metadata = [];

  try {
    const data2 = fs.readFileSync(metadataPath, 'utf8');
    return metadata = JSON.parse(data2);
  } catch (err) {
    console.error('Error reading metadata.json:', err);
    return res.status(500).send('Error reading metadata');
  }
}
