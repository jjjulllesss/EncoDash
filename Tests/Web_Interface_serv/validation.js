var inputs = document.querySelectorAll('input');
//var labels = document.querySelectorAll('label');
var form = document.querySelector('form');

var formItems = [];

var errorField = document.querySelector('.errors');
var errorList = document.querySelector('.errors ul');

for(var i = 0; i < inputs.length-1; i++) {
  var obj = {};
  //obj.label = labels[i];
  obj.input = inputs[i];
  formItems.push(obj);
}

errorField.style.left = '-100%';

form.onsubmit = validate;

function validate(e) {
  errorList.innerHTML = '';
  for(var i = 0; i < formItems.length; i++) {
    var testItem = formItems[i];
    if(testItem.input.value === '') {
      errorField.style.left = '360px';
      createLink(testItem);
    }
  }

  if(errorList.innerHTML !== '') {
    e.preventDefault();
  }
}

function createLink(testItem) {
  var listItem = document.createElement('li');
  var anchor = document.createElement('a');
  anchor.textContent = testItem.input.name + ' field is empty: fill in your ' + testItem.input.name + '.';
  anchor.href = '#' + testItem.input.name;
  anchor.onclick = function() {
    testItem.input.focus();
  };
  listItem.appendChild(anchor);
  errorList.appendChild(listItem);
}