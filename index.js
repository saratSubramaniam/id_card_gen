var html_to_pdf = require('html-pdf-node');
var fs = require("fs");
const path = require('path');
// const cors = require('cors');

var express = require('express');
var app = express();
// app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

const port = process.env.port || 8080;

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/generate', (req, res) => {
    res.sendFile(path.join(__dirname + '/form.html'))
})

app.post('/send', (req, res) => {
    let content = fs.readFileSync(path.join(__dirname + "/template.html"), "utf8");

    let newContent = content
        .replace("PHOTO_PLACE_HOLDER", req.body.PHOTO)
        .replace("ID_CARD_NUMBER_PLACEHOLDER", req.body.ID_CARD_NUMBER)
        .replace("EMPLOYEE_NAME_PLACEHOLDER", req.body.EMPLOYEE_NAME)
        .replace("ADDRESS_ONE_PLACEHOLDER", req.body.ADDRESS_ONE)
        .replace("ADDRESS_TWO_PLACEHOLDER", req.body.ADDRESS_TWO)
        .replace("CITY_PLACEHOLDER", req.body.CITY)
        .replace("PIN_CODE_PLACEHOLDER", req.body.PIN_CODE)
        .replace("CONTACT_PLACEHOLDER", req.body.CONTACT)
        .replace("BLOOD_GROUP_PLACEHOLDER", req.body.BLOOD_GROUP);
    fs.writeFileSync(path.join(__dirname + "/employee.html"), newContent);

    let options = { format: 'A4', path: path.join(__dirname + '/output.pdf') };
    let file = { content: fs.readFileSync(path.join(__dirname + "/employee.html"), "utf8") };

    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
        res.send(pdfBuffer);
    });

    res.send(req.body);
})