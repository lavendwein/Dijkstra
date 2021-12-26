let fs = require('fs');
let arg = process.argv;
let out = "";
let out2 = "";
let symbols = new Array();
let stack1 = new Array(); //символы

fs.readFile(arg[2], (err, data) => {
	if (err){
		console.error(err);
		return;
	}
	let inputData = data.toString();
	let str = inputData.split(' ');
	for (let i = 0; i < inputData.length; i++)
		inputData = inputData.replace("^", "**");
	let outStr = eval(inputData);

	const symbols = {
		"(": 0,
		")" : 0,
		"+": 1,
		"-": 1,
		"*": 2,
		"/": 2,
		"^": 3
	};
	
	const operators = {
		'+': (a, b) => parseFloat(a) + parseFloat(b),
		'-': (a, b) => parseFloat(a) - parseFloat(b),
		'*': (a, b) => parseFloat(a) * parseFloat(b),
		'/': (a, b) => parseFloat(a) / parseFloat(b),
		'^': (a, b) => Math.pow(parseFloat(a), parseFloat(b))
	};
	
	
	for (let i = 0; i < str.length; i++){
		if (str[i] == "("){
			stack1.push(str[i]);
		}
		else if (!(str[i] in symbols)){
			if (str[i - 1] == "-" && ((str[i - 2] == "(") && str[i + 1] == ")")){
				out += (-1) * str[i] + " ";
				out2 += str[i] + " " + stack1.pop() + " ";
			}else if (str[i] == 0 && str[i - 1] == "/"){
				console.log("На ноль делить нельзя!");
				return;
			}else {
				out += str[i] + " ";
				out2 += str[i] + " ";
			}	
		}else if (str[i] == ")"){
			while (stack1[stack1.length - 1] != "("){
				out += [stack1[stack1.length - 1]] + " ";
				out2 += [stack1[stack1.length - 1]] + " ";
				stack1.pop();
			}	
			stack1.pop();
		}else if (stack1.length == 0 || symbols[str[i]] > symbols[stack1[stack1.length - 1]]){
			stack1.push(str[i]);
		}else{
			while (stack1.length && stack1[stack1.length - 1] != "(") {		
				out += [stack1[stack1.length - 1]] + " ";
				out2 += [stack1[stack1.length - 1]] + " ";
				stack1.pop();
			}
			stack1.push(str[i]);
		}
	}

	if (stack1.length){
		while (stack1.length){
			out += [stack1[stack1.length - 1]] + " ";
			out2 += [stack1[stack1.length - 1]] + " ";
			stack1.pop();
		}
	}
	console.log(out2);
	
	let evaluate = (out) => {
		let stack = [];
		out.split(' ').forEach((token) => {
			if (token in operators){
				let [b, a] = [stack.pop(), stack.pop()];
				stack.push(operators[token](a, b));
			}else{
				stack.push(parseFloat(token));
			}
		});
		stack.pop();
		return stack.pop();
	};
	
	let check = "";
	if (outStr == evaluate(out))
		check = true;
	else check = false;
	console.log("Совпадение ответов:", check);
});	