var readline = require('readline');
var _ = require('lodash');
var _CONST = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var _ID = ['a', 'b', 'c'];
var _OPERATORS = [
    {
        key: '=',
        operation: 'assign',
        placement: 'in',
        req_vars: 2
    },
    {
        key: '+',
        operation: 'add',
        placement: 'pre',
        req_vars: 2
    },
    {
        key: '-',
        operation: 'subt',
        placement: 'pre',
        req_vars: 2
    },
    {
        key: '*',
        operation: 'multi',
        placement: 'pre',
        req_vars: 2
    },
    {
        key: '/',
        operation: 'divi',
        placement: 'pre',
        req_vars: 2
    },
    {
        key: '!',
        operation: 'print',
        placement: 'pre',
        req_vars: 1
    },
];
var _TYPES = [];
var _stack = [];
var _symbols = {};
function readln() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('>> ', function (answer) {
        try {
            rl.close();
            if (!lineToStack(answer)) {
                processStack(_stack);
            }
            else {
                // there was some kind of error
                logError(1);
            }
            if (answer.length === 1) {
                if (_ID.find(function (id) { return id === answer; })) {
                    console.log(getId(answer));
                }
            }
            clearStack();
            // console.log(_symbols);
            readln();
        }
        catch (e) {
            logError(2);
        }
    });
}
function clearStack() {
    _stack = [];
    // _symbols = {}
}
function lineToStack(line) {
    var newSection = [];
    if (line.length === 0)
        return;
    console.log(line);
    var error = false;
    line.split('').forEach(function (arg, i) {
        // console.log(arg)
        if (arg === ';') {
            // end of string section
            _stack.push(newSection);
            newSection = [];
            // return lineToStack(line.substring(++i));
            return newSection;
            // console.log(newSection)
        }
        else if (arg === '.') {
            // end of string
            _stack.push(newSection);
            if (i != line.length - 1) {
                // there is something behind the '.'
                error = true;
            }
            // return console.log(_stack);
        }
        else {
            // continue stream
            var type;
            if (_CONST.find(function (x) { return x === arg; })) {
                type = 'const';
            }
            else if (_ID.find(function (x) { return x === arg; })) {
                type = 'id';
            }
            else if (_OPERATORS.find(function (x) { return x.key === arg; })) {
                type = 'operator';
            }
            else {
                error = true;
            }
            newSection.push({
                symbol: arg,
                type: type
            });
        }
    });
    return error;
}
function processStack(stack) {
    stack.forEach(function (sect) {
        // this is for each section. we will now process the part of the stack
        // each section will always have an operator
        // sect: the section of the stack we are looking at (whis was separated using the ';' operator)
        var op = sect.find(function (symbol) { return symbol.type === 'operator'; });
        // console.log(op);
        if (op.symbol === '=' && sect.indexOf(op) === 1) {
            // this is an assignment operater
            // console.log(sect[0]);
            if (sect[0].type === 'id') {
                // if the first item in the substack is an id
                _symbols[sect[0].symbol] = {
                    value: evaluateExpr(_.slice(sect, 2))
                };
            }
        }
        else if (op.symbol === '!' && sect.indexOf(op) === 0) {
            console.log(_symbols[sect[1].symbol].value);
        }
    });
}
function evaluateExpr(expr) {
    // console.log(expr)
    if (expr.length === 1 || expr[0].type != 'operator') {
        if (expr[0].type === 'const') {
            return Number(expr[0].symbol);
        }
        else if (expr[0].type === 'id') {
            // console.log(_symbols[expr[0].symbol].value);
            return _symbols[expr[0].symbol].value;
        }
    }
    else if (expr.length > 1) {
        // not a simple assignment
        if (expr[0].type === 'operator') {
            var expr1 = 0, expr2 = 0;
            var operatorChack = function (_expr) {
                if (_.slice(_expr, 1)[0].type === 'operator') {
                    expr1 = evaluateExpr(_.slice(_expr, 1));
                    expr2 = evaluateExpr(_.slice(_expr, 2 + _OPERATORS.find(function (operator) { return operator.key === _.slice(_expr, 1)[0].symbol; }).req_vars));
                }
                else if (_.slice(_expr, 2)[0].type === 'operator') {
                    expr1 = evaluateExpr(_.slice(_expr, 1));
                    expr2 = evaluateExpr(_.slice(_expr, 2));
                }
                else {
                    expr1 = evaluateExpr(_.slice(_expr, 1));
                    expr2 = evaluateExpr(_.slice(_expr, 2));
                }
            };
            if (expr[0].symbol === '-') {
                // expr1 = evaluateExpr(_.slice(expr, 1));
                // expr2 = evaluateExpr(_.slice(expr, 2));
                operatorChack(expr);
                return expr1 - expr2;
            }
            else if (expr[0].symbol === '+') {
                operatorChack(expr);
                console.log(expr1 + " + " + expr2);
                return expr1 + expr2;
            }
            else if (expr[0].symbol === '*') {
                operatorChack(expr);
                console.log(expr1 + " * " + expr2);
                return expr1 * expr2;
            }
            else if (expr[0].symbol === '/') {
                operatorChack(expr);
                return expr1 / expr2;
            }
        }
    }
}
function getId(id) {
    return _symbols[id].value;
}
function checkMath() {
}
function logError(type) {
    switch (type) {
        case 1:
            // syntax
            console.error("Syntax Error");
            break;
        case 2:
            // exception of some kind
            console.error("Exception");
            break;
    }
}
readln();
