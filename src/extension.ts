import { Dirent } from 'fs';
import * as vscode from 'vscode';
let fs = require('fs');
import buildPathObject from './utils/buildPathObject';
import buildSuperTest from './utils/buildSupertest';
import buildPostmanCollection from './utils/buildPostman';

export function activate(context: vscode.ExtensionContext) {
	
	function listDir(dir:string){ // fn to populate dropdown for user to select server directory
		let rdsOptions = {
			withFileTypes:true,
		};

		let contents = fs.readdirSync(dir, rdsOptions); 

		return contents.reduce((a:string[], e:Dirent) => { // returns project subdirectories
			if(e.name === 'node_modules' || e.name[0] === '.'){
				return a;
			} else if(e.isDirectory()){
				a.push(dir + '/' + e.name)
				a = a.concat(listDir(dir + '/' + e.name));
			}	
			return a;
		}, []);	
	};

	function readDir(dir:string){ // fn for use in thenable, recursively read server directory files
		let rdsOptions = {
			withFileTypes:true,
		};

		let contents = fs.readdirSync(dir, rdsOptions); // returns array of server files/subdirectories

		return contents.reduce((a:ReadResult[], e:Dirent) => { // returns array of objects containing each file's name and contents
			if(e.isDirectory()){
				a = a.concat(readDir(dir + '/' + e.name));
			}	else {
				let filepath = dir + '/' + e.name;
				let rfsOptions = {
					encoding:'utf-8',
				};
				let txt = fs.readFileSync(filepath, rfsOptions);
				a.push({name: filepath, text: txt});
			}
			return a;
		}, []);	
	};

	let supertest = vscode.commands.registerCommand('axon.supertest', function () {
		let path = vscode.workspace.workspaceFolders![0].uri.path; // isolate workspace root path
		let fileList = listDir(path); // list all subdirectories in project

		const qpOptions = {
			onDidSelectItem: ((file:string) => { 
				return readDir(file);
			}),
			placeHolder: 'Select Server Directory'
		}

		vscode.window.showQuickPick(fileList, qpOptions)
			.then(server => {
				return qpOptions.onDidSelectItem(server!); // read files within server directory
			})
			.then(serverFiles => {
				console.log(serverFiles)
				return buildPathObject(serverFiles); // build reference object with relevant data
			})
			.then(pathObject => {
				console.log(pathObject)
				return buildSuperTest(pathObject); // build test file
			})
			.then(supertest => {
				let tdOptions = {
					content: supertest,
					language:'javascript'
				};
				return vscode.workspace.openTextDocument(tdOptions).then(document => vscode.window.showTextDocument(document)); // open file build
			})
			.then(undefined, error =>{
				return {error:error};
			});
	});

	let postman = vscode.commands.registerCommand('axon.postman', function () {
		let path = vscode.workspace.workspaceFolders![0].uri.path; // isolate workspace root path
		let fileList = listDir(path); // list all subdirectories in project

		const qpOptions = {
			onDidSelectItem: ((file:string) => {
				return readDir(file);
			}),
			placeHolder: 'Select Server Directory'
		};

		vscode.window.showQuickPick(fileList, qpOptions)
			.then(server => {
				return qpOptions.onDidSelectItem(server!); // read files within server directory
			})
			.then(serverFiles => {
				return buildPathObject(serverFiles); // build reference object with relevant data
			})
			.then(pathObject => {
				return buildPostmanCollection(pathObject); // build collection
			})
			.then(collection => {
				let tdOptions = {
					content: collection,
					language:'json'
				};
				return vscode.workspace.openTextDocument(tdOptions).then(document => vscode.window.showTextDocument(document)); // open collection
			})
			.then(undefined, error =>{
				return {error:error};
			});
	});

	context.subscriptions.push(supertest, postman);
}

export function deactivate() {}
