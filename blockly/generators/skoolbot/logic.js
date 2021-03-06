/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2016 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Skoolbot for logic blocks.
 * @author rodrigoq@google.com (Rodrigo Queiro)
 */
'use strict';

goog.provide('Blockly.Skoolbot.logic');

goog.require('Blockly.Skoolbot');


Blockly.Skoolbot['controls_if'] = function(block) {
  // If/elseif/else condition.
 /* var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.Skoolbot.valueToCode(block, 'IF' + n,
      Blockly.Skoolbot.ORDER_NONE) || 'false';
    branchCode = Blockly.Skoolbot.statementToCode(block, 'DO' + n);
    code += (n > 0 ? 'else' : '') +
        'if ' + conditionCode + ' then\n' + branchCode;

    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.Skoolbot.statementToCode(block, 'ELSE');
    code += 'else\n' + branchCode;
  }
  return code + 'end\n';*/

  var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.Skoolbot.valueToCode(block, 'IF' + n,
    Blockly.Skoolbot.ORDER_NONE) || 'false';
    branchCode = Blockly.Skoolbot.statementToCode(block, 'DO' + n);
    code += (n > 0 ? 'else { ' : '') +
        '{\n' + 
	  'if\n ' + 
	  'cond: ' + conditionCode + '\n' + 
	  'then\n' + branchCode;
    
    ++n;
   } while (block.getInput('IF' + n));
	
   if (block.getInput('ELSE')) {
     branchCode = Blockly.Skoolbot.statementToCode(block, 'ELSE');
     code += 'else\n' + branchCode;
   }


  return code + 'end\n}\n'; 

};

Blockly.Skoolbot['controls_ifelse'] = Blockly.Skoolbot['controls_if'];

Blockly.Skoolbot['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '~=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var argument0 = Blockly.Skoolbot.valueToCode(block, 'A',
      Blockly.Skoolbot.ORDER_RELATIONAL) || '0';
  var argument1 = Blockly.Skoolbot.valueToCode(block, 'B',
      Blockly.Skoolbot.ORDER_RELATIONAL) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, Blockly.Skoolbot.ORDER_RELATIONAL];
};

Blockly.Skoolbot['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? 'and' : 'or';
  var order = (operator == 'and') ? Blockly.Skoolbot.ORDER_AND :
      Blockly.Skoolbot.ORDER_OR;
  var argument0 = Blockly.Skoolbot.valueToCode(block, 'A', order);
  var argument1 = Blockly.Skoolbot.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == 'and') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Skoolbot['logic_negate'] = function(block) {
  // Negation.
  var argument0 = Blockly.Skoolbot.valueToCode(block, 'BOOL',
      Blockly.Skoolbot.ORDER_UNARY) || 'true';
  var code = 'not ' + argument0;
  return [code, Blockly.Skoolbot.ORDER_UNARY];
};

Blockly.Skoolbot['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Skoolbot.ORDER_ATOMIC];
};

Blockly.Skoolbot['logic_null'] = function(block) {
  // Null data type.
  return ['nil', Blockly.Skoolbot.ORDER_ATOMIC];
};

Blockly.Skoolbot['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.Skoolbot.valueToCode(block, 'IF',
      Blockly.Skoolbot.ORDER_AND) || 'false';
  var value_then = Blockly.Skoolbot.valueToCode(block, 'THEN',
      Blockly.Skoolbot.ORDER_AND) || 'nil';
  var value_else = Blockly.Skoolbot.valueToCode(block, 'ELSE',
      Blockly.Skoolbot.ORDER_OR) || 'nil';
  var code = value_if + ' and ' + value_then + ' or ' + value_else;
  return [code, Blockly.Skoolbot.ORDER_OR];
};
