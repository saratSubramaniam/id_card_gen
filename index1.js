var html_to_pdf = require('html-pdf-node');
var fs = require("fs");
const cors = require('cors');

var express = require('express');
var router = express.Router();

// var app = express();
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb' }));

// var server = app.listen(8081, function () {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log("Example app listening at http://%s:%s", host, port);
// });

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.post('/send', cors(), function (req, res) {
    let content = fs.readFileSync("template.html", "utf8");
    // console.log(req.body);

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
    fs.writeFileSync("employee.html", newContent);

    let options = { format: 'A4', path: './output.pdf' };
    // Example of options with args //
    // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

    let file = { content: fs.readFileSync("employee.html", "utf8") };

    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
        // console.log("PDF Buffer:-", pdfBuffer);
        res.send(pdfBuffer);
    });
});

module.exports = router;