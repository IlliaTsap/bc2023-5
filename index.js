const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({"extended": true}));
fs.writeFileSync("data.json", "[]");

app.get("/", function(req, res)
{
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end("Hello World!");
});
app.get("/UploadForm.html", function(req, res)
{
	res.writeHead(200, {"Content-Type": "text/html"})
	res.end(fs.readFileSync("static/UploadForm.html"));
});
app.get("/notes", function(req, res)
{
	res.writeHead(200, {"Content-Type": "application/json"});
	res.end(fs.readFileSync("data.json"));
});
app.get("/notes/:note_name", function(req, res)
{
	var noteArray = JSON.parse(fs.readFileSync("data.json"));
	for(let index = 0; index < noteArray.length; index++)
		if(noteArray[index].note_name === req.params.note_name)
		{
			res.writeHead(200, {"Content-Type": "application/json"});
			res.end(JSON.stringify(noteArray[index].note));
			return;
		}
	res.writeHead(404, {"Content-Type": "text/plain"});
	res.end("Note is not found");
});

app.post("/upload", function(req, res)
{
	var noteArray = JSON.parse(fs.readFileSync("data.json"));
	for(let index = 0; index < noteArray.length; index++)
		if(noteArray[index].note_name === req.body.note_name)
		{
			res.writeHead(400, {"Content-Type": "text/plain"});
			res.end(`Note with name ${req.body.note_name} is exist`);
			return;
		}
	var newNoteArray = new Array(noteArray.length + 1);
	for(let index = 0; index < noteArray.length; index++)
		newNoteArray[index] = noteArray[index];
	newNoteArray[noteArray.length] = {"note_name": req.body.note_name, "note": req.body.note};
	fs.writeFileSync("data.json", JSON.stringify(newNoteArray));
	res.writeHead(201, {"Content-Type": "text/plain"});
	res.end("Done");
});

app.put("/notes/:note_name", function(req, res)
{
	var noteArray = JSON.parse(fs.readFileSync("data.json"));
	for(let index = 0; index < noteArray.length; index++)
		if(noteArray[index].note_name === req.params.note_name)
		{
			noteArray[index].note = req.body;
			fs.writeFileSync("data.json", JSON.stringify(noteArray));
			res.writeHead(200, {"Content-Type": "text/plain"});
			res.end("Done");
			return;
		}
	res.writeHead(404, {"Content-Type": "text/plain"});
	res.end("Note is not found");
});

app.delete("/notes/:note_name", function(req, res)
{
	var noteArray = JSON.parse(fs.readFileSync("data.json"));
	let noteIndex = 0;
	for(let index = 0; index < noteArray.length; index++)
		if(noteArray[index].note_name === req.params.note_name)
		{
			noteIndex = index;
			break;
		}

	if(noteIndex === noteArray.length)
	{
		res.writeHead(404, {"Content-Type": "text/plain"});
		res.end("Note is not found");
		return;
	}
	var newNoteArray = new Array(noteArray.length - 1);
	for(let index = 0; index < noteIndex; index++)
		newNoteArray[index] = noteArray[index];
	for(let index = noteIndex + 1; index < noteArray.length; index++)
		newNoteArray[index] = noteArray[index];
	fs.writeFileSync("data.json", JSON.stringify(newNoteArray));
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end("Done");
});
app.delete("/notes", function(req, res)
{
	fs.writeFileSync("data.json", "[]");
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end("Done");
});

app.listen(8000, () => console.log("Server is running. Url: http://localhost:8000"));

